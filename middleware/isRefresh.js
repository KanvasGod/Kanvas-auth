const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization-refresh'].split(' ')[1];

    // token check
    const token = authHeader && authHeader.split(' ')[1];

    if (token) return res.sendStatus(401)

    jwt.verify(authHeader, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        req.token = req.headers['authorization-refresh']
        next();
    })
};