const Equipment = require("../../models/device");

module.exports = async function(req, res, next) {
    Equipment.find({}, (err, equipments) => {
        if (err) return res.sendStatus(404);
        equipmentsDTO = equipments.map(e => {return {name: e.name, equipmentId: e._id, equipmentType: e.type}})
        res.send(equipmentsDTO);
        next();
    });
}