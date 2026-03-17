const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET /api/reports/summary
router.get('/summary', async (req, res) => {
    const days = req.query.days || 30;
    try {
        const [[summary]] = await db.query(
            `SELECT
                COALESCE(SUM(total_amount), 0)   AS total_revenue,
                COUNT(*)                          AS total_sales,
                COALESCE(AVG(total_amount), 0)   AS avg_sale
             FROM Sales
             WHERE date >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
            [days]
        );
        const [[items]] = await db.query(
            `SELECT COALESCE(SUM(si.quantity), 0) AS items_sold
             FROM Sales_Items si
             JOIN Sales s ON si.sale_id = s.sale_id
             WHERE s.date >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
            [days]
        );
        res.json({ ...summary, ...items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/reports/daily
router.get('/daily', async (req, res) => {
    const days = req.query.days || 30;
    try {
        const [rows] = await db.query(
            `SELECT
                DATE_FORMAT(date, '%m/%d') AS day,
                COALESCE(SUM(total_amount), 0) AS revenue
             FROM Sales
             WHERE date >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY DATE(date)
             ORDER BY DATE(date) ASC`,
            [days]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/reports/top-products
router.get('/top-products', async (req, res) => {
    const days = req.query.days || 30;
    try {
        const [rows] = await db.query(
            `SELECT
                p.product_name,
                SUM(si.quantity)              AS total_qty,
                SUM(si.quantity * si.price)   AS total_revenue
             FROM Sales_Items si
             JOIN Products p ON si.product_id = p.product_id
             JOIN Sales s    ON si.sale_id    = s.sale_id
             WHERE s.date >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY si.product_id
             ORDER BY total_qty DESC
             LIMIT 10`,
            [days]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/reports/payments
router.get('/payments', async (req, res) => {
    const days = req.query.days || 30;
    try {
        const [rows] = await db.query(
            `SELECT
                payment_method AS method,
                COUNT(*)        AS count
             FROM Sales
             WHERE date >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY payment_method`,
            [days]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/reports/cashiers
router.get('/cashiers', async (req, res) => {
    const days = req.query.days || 30;
    try {
        const [rows] = await db.query(
            `SELECT
                u.username,
                COUNT(s.sale_id)              AS total_transactions,
                COALESCE(SUM(s.total_amount), 0) AS total_revenue,
                COALESCE(AVG(s.total_amount), 0) AS avg_sale
             FROM Sales s
             JOIN Users u ON s.user_id = u.user_id
             WHERE s.date >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY s.user_id
             ORDER BY total_revenue DESC`,
            [days]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;