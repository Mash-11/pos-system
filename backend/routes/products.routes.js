const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const multer  = require('multer');
const path    = require('path');

// Storage config
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../frontend/uploads/'));
    },
    filename: function(req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: function(req, file, cb) {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext     = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime    = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Images only!'));
    }
});

// GET all products
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

// POST add product with image
router.post('/', upload.single('image'), async (req, res) => {
    const { product_name, category, price, quantity, barcode } = req.body;
    if (!product_name || !price) {
        return res.status(400).json({ message: 'Name and price are required.' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [result] = await db.query(
            `INSERT INTO Products (product_name, category, price, quantity, barcode, image)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [product_name, category, price, quantity || 0, barcode || null, image]
        );
        res.json({ product_id: result.insertId, message: 'Product added.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PUT update product with image
router.put('/:id', upload.single('image'), async (req, res) => {
    const { product_name, category, price, quantity, barcode } = req.body;
    try {
        let query, params;
        if (req.file) {
            const image = `/uploads/${req.file.filename}`;
            query  = `UPDATE Products SET product_name=?, category=?, price=?,
                      quantity=?, barcode=?, image=? WHERE product_id=?`;
            params = [product_name, category, price, quantity, barcode, image, req.params.id];
        } else {
            query  = `UPDATE Products SET product_name=?, category=?, price=?,
                      quantity=?, barcode=? WHERE product_id=?`;
            params = [product_name, category, price, quantity, barcode, req.params.id];
        }
        await db.query(query, params);
        res.json({ message: 'Product updated.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE product
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