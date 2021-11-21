const express = require('express');
const app = express();
app.use(express.json())

require('./routes/routes.js')(app);
require('./swagger')(app);
require('./fill_db');

app.listen(8080, function () {
    console.log("Mobileasey backend exposed on port 8080");
})