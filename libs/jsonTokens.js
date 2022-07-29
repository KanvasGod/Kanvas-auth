const jwt = require('jsonwebtoken');

createToken = (userId, type, extra={}) => {
    const signType = {
        logIn: process.env.ACCESS_TOKEN_SECRET,
        refresh: process.env.REFRESH_TOKEN_SECRET
    }

    let expiresIn = type === 'refresh' ? '2h' : '1h';
    
    extra.uid = userId
    return `Bearer ${jwt.sign(
        extra, 
        signType[type],
        {
        expiresIn: expiresIn
        }
    )}`
}

module.exports = {
    createToken
}