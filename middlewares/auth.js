const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = decoded; // Attach the decoded payload to the request
        console.log('Decoded JWT:', decoded); // Log the decoded JWT
        next();
    });
};

module.exports = { authenticateJWT };
