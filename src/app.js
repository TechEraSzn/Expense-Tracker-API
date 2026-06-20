const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');



// --- Global Middleware ---
app.use(express.json()); // Parses incoming JSON payloads
app.use(cors());         // Allows cross-origin requests
app.use(helmet());       // Adds security headers
app.use(morgan('dev'));  // Logs HTTP requests to your terminal

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// --- Health Check Route ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Expense Tracker API is alive!' });
});

// Future routes will be imported and used here

module.exports = app;