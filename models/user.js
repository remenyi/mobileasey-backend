var Schema = require('mongoose').Schema;
var db = require("../config/db");
var crypto = require("crypto");

var User = Schema({
    name: String,
    hash: String,
    salt: String,
    email: String,
    is_admin: Boolean,
})

User.methods.setPassword = function(unencryptedPassword) { 
       this.salt = crypto.randomBytes(16).toString('hex'); 
       this.hash = crypto.pbkdf2Sync(unencryptedPassword, this.salt,  
       1000, 64, `sha512`).toString(`hex`); 
   };

User.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}; 

module.exports = db.model('User', User);