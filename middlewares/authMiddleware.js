const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.json({ status: 401, msg: 'Access denied! Token not provided.' })
    }
    try {
        const decoded = jwt.verify(token, process.env.MY_SECRET_KEY)
        req.user = decoded;
        next();
    } catch (error) {
        return res.json({ status: 403, msg: 'Expired or invalid token!' })
    }
}

module.exports = { verifyToken }