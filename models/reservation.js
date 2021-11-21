var Schema = require('mongoose').Schema;
var db = require("../config/db");

var Reservation = db.model('Reservation', {
    start: Date,
    end: Date,
    reservation_code: Number,
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    _device: {
        type: Schema.Types.ObjectId,
        ref: 'Device',
    },
})

module.exports = Reservation;