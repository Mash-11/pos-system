const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

async function reset() {
    const adminHash    = await bcrypt.hash('admin123', 10);
    const managerHash  = await bcrypt.hash('manager123', 10);
    const cashierHash  = await bcrypt.hash('cashier123', 10);

    await db.query('UPDATE Users SET password_hash = ? WHERE username = ?', [adminHash, 'admin']);
    await db.query('UPDATE Users SET password_hash = ? WHERE username = ?', [managerHash, 'manager']);
    await db.query('UPDATE Users SET password_hash = ? WHERE username = ?', [cashierHash, 'cashier']);

    console.log('✅ All passwords reset successfully!');
    console.log('admin    → admin123');
    console.log('manager  → manager123');
    console.log('cashier  → cashier123');
    process.exit();
}

reset();