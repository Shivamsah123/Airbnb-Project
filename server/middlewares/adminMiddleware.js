const result = require('../utils/result')

function adminMiddleware(req, res, next) {
    if (req.role === 'admin') {
        next()
    } else {
        res.status(403).send(result.createErrorResult('Forbidden: Admins only'))
    }
}

module.exports = adminMiddleware
