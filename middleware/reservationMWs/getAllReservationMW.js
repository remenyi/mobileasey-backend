const Reservation = require("../../models/reservation");

module.exports = async function(req, res, next) {
    Reservation.find({}, (err, reservations) => {
        if (err) return res.sendStatus(404);
        reservationsDTO = reservations.map(r => {return {deviceID: r._device, bookerID: r._user, from: r.start, to: r.end, reservationID: r._id, reservationCode: r.reservation_code}})
        res.send(reservationsDTO);
        next();
    });
}