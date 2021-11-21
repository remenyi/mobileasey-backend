const jwt = require('jsonwebtoken');
require('dotenv').config()

let refreshTokens = []

module.exports = function(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) return res.sendStatus(401);
    console.log(token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(user);
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });
};