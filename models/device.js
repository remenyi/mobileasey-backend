var Schema = require('mongoose').Schema;
var db = require("../config/db");

var Device = db.model('Device', {
    name: String,
    type: String,
})

module.exports = Device;