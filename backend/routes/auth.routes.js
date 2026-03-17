const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM Users WHERE username = ?', [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const user  = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                user_id:  user.user_id,
                username: user.username,
                role:     user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/auth/logout  
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully.' });
});

module.exports = router;