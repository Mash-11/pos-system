const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Test database connection
db.query('SELECT 1')
    .then(() => console.log('✅ Database connected successfully'))
    .catch(err => console.error('❌ Database connection failed:', err));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'POS server is running!' });
});

// Routes — uncomment as we build them
 app.use('/api/auth', require('./routes/auth.routes'));
 app.use('/api/products', require('./routes/products.routes'));
 app.use('/api/sales', require('./routes/sales.routes'));
 app.use('/api/inventory', require('./routes/inventory.routes'));
 app.use('/api/customers', require('./routes/customers.routes'));
 app.use('/api/reports', require('./routes/reports.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});