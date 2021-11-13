const express = require('express');
const app = express();

require('./routes/default_routes.js')(app);
require('./swagger')(app);

app.listen(8080, function () {
    console.log("Mobileasey backend exposed on port 8080");
})