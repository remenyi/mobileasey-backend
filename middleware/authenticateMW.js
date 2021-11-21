const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config()

let refreshTokens = []

module.exports = async function(email, password){
    const user = await User.findOne({email: email, password: password});
    if(!user)
        return false;
    const accessToken = jwt.sign({sub: user._id.toString(), admin: user.is_admin}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10h" });
    const refreshToken = jwt.sign(user._id.toString(), process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken)
    return accessToken;
};