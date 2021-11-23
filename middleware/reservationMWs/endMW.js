const Reservation = require("../../models/reservation");
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = async function(req, res, next) {    
    const reservationCode = req.body.reservationCode;
    if (!reservationCode) return res.sendStatus(404);

    Reservation.deleteOne({reservation_code: reservationCode}, (err, ret) => {
        if (err) return res.sendStatus(404);
        if (!ret) return res.sendStatus(404);
        if (ret.deletedCount < 1) return res.sendStatus(404);
    });
}