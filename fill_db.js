var db = require("./config/db");
var Device = require("./models/device");
var Reservation = require("./models/reservation");
var User = require("./models/user");

User.findOne({name: "Példa Béla"}, (err, user) => {
    if(!user){
        user = new User({ name: "Példa Béla",
            password: "cica",
            email: "pbela@pelda.hu",
            is_admin: false,}, err => {
                if (err) console.log(err);
            });
        device = new Device({name: "Lenovo ThinkPad T480", type: "Laptop"}, (err) => {
            if (err) console.log(err);
        });
        Reservation.create({start: new Date("2021-11-17T11:11:18Z"),
            end: new Date("2021-11-18T11:11:18Z"),
            reservation_code: null,
            _user: user._id,
            _device: device._id})
        }
        user.save();
        device.save();
})
