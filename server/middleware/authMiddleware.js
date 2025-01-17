const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {   
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    try {

        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified successfully. Decoded user:', user);
        
        req.user = user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token: ' + err.message });
    }
};

module.exports = authenticateToken;