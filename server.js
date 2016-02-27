var express = require("express");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'shekWork',
    password: 'passwd',
    database: 'notification_db'
});

var app = express();
var notiId = 2;

connection.connect(function(err) {
    if(!err) {
        console.log("Database is connected...");
        (function loop() {
            var rand = Math.round(Math.random() * 6000) + 1000; //Generate random number between 6 sec to 1 sec
            setTimeout(function() {
                insertIntoDb(new Date());
                loop();
            }, rand);
        }());
    } else {
        console.log("Error connecting to database: ", err);
    }
});

var insertIntoDb = function(notiData) {
    var post = { notiId: notiId++, notiData: notiData };
    connection.query('INSERT INTO noti SET ?', post, function(err, result) {
        if(!err) {
            console.log(new Date() + " : Row inserted");
        } else {
            console.log("Error inserting data to table: ", err);
        }
    });
}

app.get("/noti", function(req, res) {
    connection.query('SELECT * from noti', function(err, rows, fields) {
        if(!err) {
            console.log('Output of query: ', rows);
            res.json(rows);
        } else {
            console.log("Error in connecting database: ", err);
            res.json({"code" : 500, "status": "Error in connecting database"});
            return;
        }
    });
});

app.listen(4000);
console.log("Server is running at: http://localhost:4000");