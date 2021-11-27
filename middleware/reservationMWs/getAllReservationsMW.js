const Reservation = require("../../models/reservation");
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = async function(req, res, next) {
    console.log(req.user)
    if (req.user.admin)
        Reservation.aggregate([{$lookup: {from: "users", localField: "_user", foreignField: "_id", as: "users"}},
                                {$lookup: {from: "devices", localField: "_device", foreignField: "_id", as: "devices"}}], (err, reservations) => {
            if (err) return res.sendStatus(404);
            reservationsDTO = reservations.map(r => {
                return {equipment: {name: r.devices[0].name, equipmentId: r.devices[0]._id, equipmentType: r.devices[0].type}, user: {id: r.users[0]._id, email: r.users[0].email}, from: r.start, to: r.end, reservationID: r._id, reservationCode: r.reservation_code}})
            res.send(reservationsDTO);
            next();
        });
    else
        Reservation.aggregate([{$lookup: {from: "users", localField: "_user", foreignField: "_id", as: "users"}},
                                {$lookup: {from: "devices", localField: "_device", foreignField: "_id", as: "devices"}},
                                {$match: {_user: new ObjectId(req.user.sub)}}], (err, reservations) => {
            if (err) return res.sendStatus(404);
            reservationsDTO = reservations.map(r => {
                return {equipment: {name: r.devices[0].name, equipmentId: r.devices[0]._id, equipmentType: r.devices[0].type}, user: {id: r.users[0]._id, email: r.users[0].email}, from: r.start, to: r.end, reservationID: r._id, reservationCode: r.reservation_code}})
            res.send(reservationsDTO);
            next();
        });
}