const Reservation = require("../../models/reservation");
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = async function(req, res, next) {
    const equipmentID = req.params.equipmentID;
    if (!equipmentID) return res.sendStatus(404);

    const start = new Date(req.body.from);
    const end = new Date(req.body.to);
    if (!(start && end)) return res.sendStatus(404);

    if (start >= end) return res.sendStatus(404);

    /* check if reservation interval overlaps any other reservations
    *     |-----------|
    *  |****|      
    *              |****|
    * |*******************|
    *        |****|
    */
    Reservation.find( { _device: new ObjectId(equipmentID), 
        $or: 
        [{start: { $gte: start, $lte: end}}, 
         {end: { $gte: start, $lte: end}},
         {start: { $lte: start}, end: { $gte: end}},
         {start: { $gte: start}, end: { $lte: end}},
        ] }, 
        (err, reservations) => {
        if (err) return res.sendStatus(404);
        if (reservations.length > 0) return res.sendStatus(404);

        const userID = req.user.sub;
        Reservation.create({start: start, end: end, reservation_code: null, _user: new ObjectId(userID), _device: new ObjectId(equipmentID)},
        (err, r) => {
            if (err) return res.sendStatus(404);
            const reservationDTO = {deviceID: r._device, bookerID: r._user, from: r.start, to: r.end, reservationID: r._id, reservationCode: r.reservation_code};
            res.send(reservationDTO);
            next();
        });
    });


}