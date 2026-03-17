const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// POST /api/sales — create a new sale
router.post('/', async (req, res) => {
    const { items, total_amount, payment_method,
            discount, amount_paid, change_given, user_id } = req.body;

    if (!items || !items.length) {
        return res.status(400).json({ message: 'No items in sale.' });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Insert sale
        const [saleResult] = await conn.query(
            `INSERT INTO Sales (user_id, total_amount, payment_method)
             VALUES (?, ?, ?)`,
            [user_id, total_amount, payment_method]
        );
        const sale_id = saleResult.insertId;

        // 2. Insert sale items + deduct stock
        for (const item of items) {
            await conn.query(
                `INSERT INTO Sales_Items (sale_id, product_id, quantity, price)
                 VALUES (?, ?, ?, ?)`,
                [sale_id, item.product_id, item.quantity, item.price]
            );
            await conn.query(
                `UPDATE Products SET quantity = quantity - ? WHERE product_id = ?`,
                [item.quantity, item.product_id]
            );
        }

        // 3. Insert payment
        await conn.query(
            `INSERT INTO Payments (sale_id, amount_paid, change_given, method)
             VALUES (?, ?, ?, ?)`,
            [sale_id, amount_paid || total_amount, change_given || 0, payment_method]
        );

        await conn.commit();
        res.json({ sale_id, message: 'Sale completed successfully.' });

    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ message: 'Sale failed.' });
    } finally {
        conn.release();
    }
});

// GET /api/sales — get all sales
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT s.*, u.username FROM Sales s
             LEFT JOIN Users u ON s.user_id = u.user_id
             ORDER BY s.date DESC LIMIT 100`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;