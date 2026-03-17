const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET all customers
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM Customers ORDER BY name ASC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST add customer
router.post('/', async (req, res) => {
    const { name, phone, email, address, loyalty_points } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required.' });
    try {
        const [result] = await db.query(
            `INSERT INTO Customers (name, phone, email, address, loyalty_points)
             VALUES (?, ?, ?, ?, ?)`,
            [name, phone, email, address, loyalty_points || 0]
        );
        res.json({ customer_id: result.insertId, message: 'Customer added.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// PUT update customer
router.put('/:id', async (req, res) => {
    const { name, phone, email, address, loyalty_points } = req.body;
    try {
        await db.query(
            `UPDATE Customers SET name=?, phone=?, email=?,
             address=?, loyalty_points=? WHERE customer_id=?`,
            [name, phone, email, address, loyalty_points, req.params.id]
        );
        res.json({ message: 'Customer updated.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM Customers WHERE customer_id = ?',
            [req.params.id]
        );
        res.json({ message: 'Customer deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;