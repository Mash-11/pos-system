const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

async function reset() {
    const hash = await bcrypt.hash('admin123', 10);
    console.log('New hash:', hash);
    await db.query('UPDATE Users SET password_hash = ? WHERE username = ?', [hash, 'admin']);
    console.log('Password updated successfully!');
    process.exit();
}

reset();