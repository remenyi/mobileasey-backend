const Equipment = require("../../models/device");
const Reservation = require("../../models/reservation");
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = async function(req, res, next) {
    const equipmentID = req.params.equipmentID;
    if(!equipmentID) return res.sendStatus(404);
    Equipment.find({_id: equipmentID}, (err, equipments) => {
        if (err) return res.sendStatus(404);
        Reservation.find({ _device: new ObjectId(equipmentID) }, (err, reservations) => {
            if (err) return res.sendStatus(404);
            const reservationsDTO = reservations.map(r => {return {from: r.start, to: r.end}});
            res.send(reservationsDTO);
            next();
        })
    });
}