const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. Look for the wristband in the request headers
    const authHeader = req.header('Authorization');
    
    // Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // 2. Extract the actual token string (removing the "Bearer " part)
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify the token using your secret key from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the decoded payload (user id and username) to the request!
        req.user = decoded;
        
        // 5. Let the user pass to the actual route controller
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = { protect };