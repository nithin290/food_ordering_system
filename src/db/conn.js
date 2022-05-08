const mysql = require("mysql");

// creating a database
module.exports = mysql.createConnection({
    host: "localhost",
    user: "lynx",
    password: "Aabb11@@",
    database: "yummy"
});

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connection Successful");
// });