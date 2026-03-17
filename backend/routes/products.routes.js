const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET /api/products — get all products
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM Products ORDER BY product_name ASC'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/products — add new product
router.post('/', async (req, res) => {
    const { product_name, category, price, quantity, barcode } = req.body;
    if (!product_name || !price) {
        return res.status(400).json({ message: 'Name and price are required.' });
    }
    try {
        const [result] = await db.query(
            `INSERT INTO Products (product_name, category, price, quantity, barcode)
             VALUES (?, ?, ?, ?, ?)`,
            [product_name, category, price, quantity || 0, barcode || null]
        );
        res.json({ product_id: result.insertId, message: 'Product added.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PUT /api/products/:id — update product
router.put('/:id', async (req, res) => {
    const { product_name, category, price, quantity, barcode } = req.body;
    try {
        await db.query(
            `UPDATE Products SET product_name=?, category=?, price=?,
             quantity=?, barcode=? WHERE product_id=?`,
            [product_name, category, price, quantity, barcode, req.params.id]
        );
        res.json({ message: 'Product updated.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE /api/products/:id — delete product
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Products WHERE product_id = ?', [req.params.id]);
        res.json({ message: 'Product deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;