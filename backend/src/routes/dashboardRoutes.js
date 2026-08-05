const express = require('express');
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
