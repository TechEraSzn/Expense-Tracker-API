const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// GET /api/users/profile
// Notice `protect` is injected right before the actual function!
router.get('/profile', protect, (req, res) => {
    
    // If the code reaches here, the middleware passed them through.
    // The middleware also magically attached `req.user` for us!
    res.status(200).json({
        message: 'Welcome to the VIP area!',
        user: req.user 
    });
});

module.exports = router;