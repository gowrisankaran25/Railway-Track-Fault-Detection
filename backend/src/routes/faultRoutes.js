const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET /api/faults - Get all faults with optional filters
router.get('/', async (req, res) => {
    try {
        const { severity, status } = req.query;
        let query = 'SELECT * FROM FaultReport WHERE 1=1';
        let params = [];
        let paramIndex = 1;
        
        if (severity) {
            query += ` AND severity = $${paramIndex}`;
            params.push(severity);
            paramIndex++;
        }
        
        if (status) {
            query += ` AND status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }
        
        query += ' ORDER BY detected_at DESC';
        
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
