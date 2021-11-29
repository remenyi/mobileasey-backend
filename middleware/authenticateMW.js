const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config()

let refreshTokens = []

module.exports = async function(req, res, next){
    User.findOne({email: req.body.email}, (err, user) => {
        if (user === null || err) return res.sendStatus(404);
        if (user.validPassword(req.body.password)){
            const accessToken = jwt.sign({sub: user._id.toString(), admin: user.is_admin}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10h" });
            res.json({accessToken: accessToken});
            next();
        }
        else {
            res.sendStatus(401);
        }
    });
};