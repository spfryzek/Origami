const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware function is a funciton that has access to req and res objects 
// and next is a callback we have to run once were done so it moves on to the next
// piece of middleware
module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token and if so, return not authorized 401 status
    if(!token) {
        return res.status(401).json({ msg: 'No token. Authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}