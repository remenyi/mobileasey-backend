const jwt = require('jsonwebtoken');
require('dotenv').config()

let refreshTokens = []

module.exports = function(req, res, next){
    if (!req.user.admin) return res.sendStatus(401);
    next();
};