const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const db      = require('../config/db');

// GET all users — admin only
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT user_id, username, role, created_at FROM Users ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST add user — admin only
router.post('/', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)',
            [username, hash, role]
        );
        res.json({ user_id: result.insertId, message: 'User created.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username already exists.' });
        }
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE user — admin only
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Users WHERE user_id = ?', [req.params.id]);
        res.json({ message: 'User deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});
// POST change password — any logged in user
router.post('/change-password', async (req, res) => {
    const { user_id, current_password, new_password } = req.body;

    if (!user_id || !current_password || !new_password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM Users WHERE user_id = ?', [user_id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user  = rows[0];
        const match = await bcrypt.compare(current_password, user.password_hash);

        if (!match) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        const newHash = await bcrypt.hash(new_password, 10);
        await db.query(
            'UPDATE Users SET password_hash = ? WHERE user_id = ?',
            [newHash, user_id]
        );

        res.json({ message: 'Password changed successfully.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;