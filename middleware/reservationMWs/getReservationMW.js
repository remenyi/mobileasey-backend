const Reservation = require("../../models/reservation");
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = async function(req, res, next) {
    const reservationID = req.params.reservationID;
    if (!reservationID) return res.sendStatus(404);
    Reservation.aggregate([{$lookup: {from: "users", localField: "_user", foreignField: "_id", as: "users"}},
    {$lookup: {from: "devices", localField: "_device", foreignField: "_id", as: "devices"}},
    {$match: {_id: new ObjectId(reservationID)}}], (err, r) => {
        console.log(r);
        r = r[0];
        if (err) return res.sendStatus(404);
        if (!r) return res.sendStatus(404);
        const reservationDTO = {equipment: {name: r.devices[0].name, equipmentId: r.devices[0]._id, equipmentType: r.devices[0].type}, user: {id: r.users[0]._id, email: r.users[0].email}, from: r.start, to: r.end, reservationId: r._id, reservationCode: r.reservation_code};
        res.send(reservationDTO);
        next();
    });
}