const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET /api/inventory — get adjustment history
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT i.*, p.product_name
             FROM Inventory i
             LEFT JOIN Products p ON i.product_id = p.product_id
             ORDER BY i.date DESC LIMIT 100`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/inventory — log an adjustment
router.post('/', async (req, res) => {
    const { product_id, adjustment, reason } = req.body;
    try {
        await db.query(
            `INSERT INTO Inventory (product_id, adjustment, reason)
             VALUES (?, ?, ?)`,
            [product_id, adjustment, reason]
        );
        res.json({ message: 'Adjustment logged.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;