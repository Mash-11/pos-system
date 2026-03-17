const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const https   = require('https');

// Verify Paystack payment
function verifyPaystack(reference) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: `/transaction/verify/${reference}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        };

        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });

        req.on('error', reject);
        req.end();
    });
}

// POST /api/sales — create a new sale
router.post('/', async (req, res) => {
    const { items, total_amount, payment_method,
            discount, amount_paid, change_given,
            user_id, paystack_reference } = req.body;

    if (!items || !items.length) {
        return res.status(400).json({ message: 'No items in sale.' });
    }

    // Verify Paystack payment for card/mobile
    if (payment_method !== 'cash' && paystack_reference) {
        try {
            const verification = await verifyPaystack(paystack_reference);
            if (!verification.data || verification.data.status !== 'success') {
                return res.status(400).json({ message: 'Payment verification failed.' });
            }
        } catch (err) {
            return res.status(400).json({ message: 'Could not verify payment.' });
        }
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
                `UPDATE Products SET quantity = quantity - ?
                 WHERE product_id = ?`,
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

// GET /api/sales
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