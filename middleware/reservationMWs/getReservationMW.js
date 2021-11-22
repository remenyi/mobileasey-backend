const Reservation = require("../../models/reservation");
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = async function(req, res, next) {
    const reservationID = req.params.reservationID;
    if (!reservationID) return res.sendStatus(404);
    Reservation.findOne({_id: new ObjectId(reservationID)}, (err, r) => {
        if (err) return res.sendStatus(404);
        if (!r) return res.sendStatus(404);
        reservationsDTO = {deviceID: r._device, bookerID: r._user, from: r.start, to: r.end, reservationID: r._id, reservationCode: r.reservation_code};
        res.send(reservationsDTO);
        next();
    });
}