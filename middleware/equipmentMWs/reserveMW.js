const Reservation = require("../../models/reservation");
const User = require("../../models/user");
const Device = require("../../models/device");
var ObjectId = require('mongoose').Types.ObjectId;
const db = require("../../config/db");

module.exports = async function(req, res, next) {
    const equipmentID = req.params.equipmentID;
    if (!equipmentID) return res.sendStatus(404);

    const start = new Date(req.body.from);
    const end = new Date(req.body.to);
    if (!(start && end)) return res.sendStatus(404);

    if (start >= end) return res.sendStatus(404);

    const session = await db.startSession();
    await session.withTransaction(async () => {
        /* check if reservation interval overlaps any other reservations
        *     |-----------|
        *  |****|      
        *              |****|
        * |*******************|
        *        |****|
        */
        const resList = await Reservation.find( { _device: new ObjectId(equipmentID), 
            $or: 
            [{start: { $gte: start, $lte: end}}, 
             {end: { $gte: start, $lte: end}},
             {start: { $lte: start}, end: { $gte: end}},
             {start: { $gte: start}, end: { $lte: end}},
            ] 
        });
        if (resList.length > 0) return res.sendStatus(404);
        
        const userID = req.user.sub;
        const r = await Reservation.create({start: start, end: end, reservation_code: null, _user: new ObjectId(userID), _device: new ObjectId(equipmentID)});     
        const u = await User.findOne({_id: new ObjectId(userID)});
        const d = await Device.findOne({_id: new ObjectId(equipmentID)});
        const uDTO = {id: u._id, email: u.email};
        const dDTO = {name: d.name, equipmentId: d._id, equipmentType: d.type};
        const reservationDTO = {equipment: dDTO, user: uDTO, from: r.start, to: r.end, reservationId: r._id, reservationCode: r.reservation_code};
        res.send(reservationDTO);
        next();
    });
    await session.endSession();
}