const pool = require('../config/db');

const addTransaction = async (req, res) => {
    // 1. Extract data from the request body
    const { amount, description, date } = req.body;
    
    // 2. Extract the user ID from the JWT token (added by our middleware!)
    const userId = req.user.id;

    // 3. Guard Clause: Validation
    if (!amount || !date) {
        return res.status(400).json({ error: 'Amount and date are required' });
    }

    try {
        // 4. Insert the transaction into the database
        const newTransaction = await pool.query(
            'INSERT INTO transactions (user_id, amount, description, date) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, amount, description, date]
        );

        // 5. Return success
        return res.status(201).json({
            message: 'Transaction added successfully',
            transaction: newTransaction.rows[0]
        });

    } catch (error) {
        console.error('Transaction Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




const getTransactions = async (req, res) => {
    // 1. Get the user ID from the VIP wristband
    const userId = req.user.id;

    try {
        // 2. Fetch ONLY this user's transactions from the database
        const transactions = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
            [userId]
        );

        // 3. Return the array of transactions
        return res.status(200).json({
            success: true,
            count: transactions.rows.length,
            data: transactions.rows
        });

    } catch (error) {
        console.error('Get Transactions Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




const updateTransaction = async (req, res) => {
    const { id } = req.params; // The ID from the URL (e.g., /api/transactions/5)
    const { amount, description, date } = req.body;
    const userId = req.user.id;

    try {
        const updatedTransaction = await pool.query(
            'UPDATE transactions SET amount = $1, description = $2, date = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [amount, description, date, id, userId]
        );

        if (updatedTransaction.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found or unauthorized' });
        }

        return res.status(200).json({
            message: 'Transaction updated successfully',
            transaction: updatedTransaction.rows[0]
        });
    } catch (error) {
        console.error('Update Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// --- DELETE TRANSACTION ---
const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const deletedTransaction = await pool.query(
            'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (deletedTransaction.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found or unauthorized' });
        }

        return res.status(200).json({
            message: 'Transaction deleted successfully',
            transaction: deletedTransaction.rows[0]
        });
    } catch (error) {
        console.error('Delete Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




// --- GET ANALYTICS ---
const getAnalytics = async (req, res) => {
    const userId = req.user.id;

    try {
        // We use SQL aggregate functions (SUM, MAX, COUNT) to do the math for us
        const analytics = await pool.query(`
            SELECT 
                COUNT(id) AS total_transactions,
                COALESCE(SUM(amount), 0) AS total_spent,
                COALESCE(MAX(amount), 0) AS highest_expense
            FROM transactions 
            WHERE user_id = $1
        `, [userId]);

        // The database returns these as strings sometimes, so we convert them to numbers
        const stats = analytics.rows[0];

        return res.status(200).json({
            success: true,
            data: {
                totalTransactions: parseInt(stats.total_transactions),
                totalSpent: parseFloat(stats.total_spent),
                highestExpense: parseFloat(stats.highest_expense)
            }
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



// Export ALL FOUR functions now!
module.exports = { addTransaction, getTransactions, updateTransaction, deleteTransaction, getAnalytics };



