const mlServiceClient = require('../services/mlServiceClient');
const db = require('../models/db');
const path = require('path');

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        
        const segmentId = req.body.segment_id;
        const reportedBy = req.body.reported_by || 'unknown';
        const lat = req.body.lat;
        const lng = req.body.lng;
        
        // 1. Send image to ML service for inference
        const mlResult = await mlServiceClient.detectFaults(req.file.path);
        
        if (mlResult.status !== 'success') {
            return res.status(500).json({ error: 'ML detection failed' });
        }
        
        // 2. Process results and store in DB
        const savedFaults = [];
        
        for (const detection of mlResult.detections) {
            // Insert into FaultReport table
            const insertQuery = `
                INSERT INTO FaultReport 
                (segment_id, image_url, fault_type, severity, confidence_score, lat, lng, location_geom, reported_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($7, $6), 4326), $8)
                RETURNING *;
            `;
            
            // Dummy image URL for now
            const imageUrl = `/uploads/${req.file.filename}`;
            
            const values = [
                segmentId,
                imageUrl,
                detection.fault_type,
                detection.severity,
                detection.confidence,
                lat,
                lng,
                reportedBy
            ];
            
            const result = await db.query(insertQuery, values);
            savedFaults.push(result.rows[0]);
            
            // 3. Trigger alerts if critical
            if (detection.severity === 'critical') {
                const notificationService = require('../services/notificationService');
                await notificationService.sendAlert(result.rows[0]);
            }
        }
        
        res.json({
            message: 'Image processed and faults recorded',
            faults_detected: savedFaults.length,
            data: savedFaults
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
