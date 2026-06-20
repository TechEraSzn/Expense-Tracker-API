require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

// Test the Database connection before starting the server
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed! ❌', err.stack);
    } else {
        console.log('Connected to PostgreSQL Database. ✅');
        
        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} 🚀`);
        });
    }
});
