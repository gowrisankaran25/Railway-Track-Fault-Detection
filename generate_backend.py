import os

files = {
    "backend/package.json": """{
  "name": "railway-track-fault-detection-backend",
  "version": "1.0.0",
  "description": "Backend API for Railway Track Fault Detection",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pg": "^8.11.3",
    "multer": "^1.4.5-lts.1",
    "axios": "^1.5.0",
    "form-data": "^4.0.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
""",
    "backend/.env": """PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_NAME=railway_db
DB_PORT=5432
ML_SERVICE_URL=http://localhost:8000
""",
    "backend/src/app.js": """const express = require('express');
const cors = require('cors');
require('dotenv').config();

const imageRoutes = require('./routes/imageRoutes');
const faultRoutes = require('./routes/faultRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/images', imageRoutes);
app.use('/api/faults', faultRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
""",
    "backend/src/models/db.js": """const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
""",
    "backend/src/services/mlServiceClient.js": """const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.detectFaults = async (imagePath) => {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(imagePath));
        
        const response = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error calling ML service:', error.message);
        throw error;
    }
};
""",
    "backend/src/controllers/uploadController.js": """const mlServiceClient = require('../services/mlServiceClient');
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
""",
    "backend/src/routes/imageRoutes.js": """const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const path = require('path');
const fs = require('fs');

// Ensure upload dir exists
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// POST /api/images/upload
router.post('/upload', upload.single('image'), uploadController.uploadImage);

module.exports = router;
""",
    "backend/src/services/notificationService.js": """exports.sendAlert = async (fault) => {
    // In a real app, this would integrate with Twilio or SendGrid
    console.log(`[ALERT] CRITICAL FAULT DETECTED!`);
    console.log(`Fault Type: ${fault.fault_type}`);
    console.log(`Location: Lat ${fault.lat}, Lng ${fault.lng}`);
    console.log(`Segment ID: ${fault.segment_id}`);
    console.log(`Notifying Divisional Control Room immediately...`);
    return true;
};
""",
    "backend/src/routes/faultRoutes.js": """const express = require('express');
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
""",
    "backend/src/routes/dashboardRoutes.js": """const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET /api/dashboard/stats - Summary stats for dashboard
router.get('/stats', async (req, res) => {
    try {
        const totalQuery = await db.query('SELECT COUNT(*) FROM FaultReport');
        const criticalQuery = await db.query("SELECT COUNT(*) FROM FaultReport WHERE severity = 'critical'");
        const pendingQuery = await db.query("SELECT COUNT(*) FROM FaultReport WHERE status = 'pending'");
        
        res.json({
            total_faults: parseInt(totalQuery.rows[0].count),
            critical_faults: parseInt(criticalQuery.rows[0].count),
            pending_verifications: parseInt(pendingQuery.rows[0].count)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
"""
}

for filepath, content in files.items():
    full_path = os.path.join(r"d:\railway-track-fault-detection", filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Backend files generated successfully.")
