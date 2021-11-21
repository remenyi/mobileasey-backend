var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:33017/mobileasey");

module.exports = mongoose;