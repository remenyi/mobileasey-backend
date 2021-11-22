const Reservation = require("../../models/reservation");
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = async function(req, res, next) {
    const reservationID = req.params.reservationID;
    if (!reservationID) return res.sendStatus(404);
    
    const reservationCode = req.body.reservationCode;
    console.log(req.body);
    if (!reservationCode) return res.sendStatus(404);
    Reservation.findOneAndUpdate({_id: new ObjectId(reservationID)}, {reservation_code: reservationCode}, (err, r) => {
        if (err) return res.sendStatus(404);
        if (!r) return res.sendStatus(404);
    });
}