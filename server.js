var express = require("express");
var app     = express();
var mysql   = require("mysql");
var http    = require("http").Server(app);
var socket  = require("socket.io")(http);
var config  = require("./config/config.js");

var connection = mysql.createConnection({
    host    : config.get("HOST"),
    user    : config.get("DB_USER"), //name of your mysql db
    password: config.get("DB_PASSWD"), //password of your mysql db
    database: config.get("DB_NAME") //name of the database for that user
});

var notiId = 2;

connection.connect(function(err) {
    if(!err) {
        console.log("Database is connected...");

        socket.on('connection', function(sock) {
            console.log("Socket connected..");
            (function loop() {
                var rand = Math.round(Math.random() * 10000) + 5000; //Generate random number between 5 sec to 10 sec
                setTimeout(function() {
                    insertIntoDb(new Date());
                    loop();
                }, rand);
            }());
        });
    } else {
        console.log("Error connecting to database: ", err);
    }
});

var insertIntoDb = function(notiData) {
    var post = { notiId: notiId++, notiData: notiData };
    connection.query('INSERT INTO noti SET ?', post, function(err, result) {
        if(!err) {
            console.log(new Date() + " : Row inserted");
            socket.emit('newNotificationAdded', post);
        } else {
            console.log("Error inserting data to table: ", err);
        }
    });
}

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get("/getNotifications", function(req, res) {
    console.log("/getNotifications");
    connection.query('SELECT * from noti', function(err, rows) {
        if(!err) {
            console.log('Output of query: ', rows);
            res.json(rows);
        } else {
            console.log(err);
            res.json({"code" : err.code, "status": err.status});
            return;
        }
    });
});

app.get("/updateNotificationCount", function(req, res) {
    console.log("/updateNotificationCount");
    connection.query('UPDATE noti SET unread = 0 where notiId = ?', req.notiId, function(err, row) {
        if(!err) {
            console.log('Updated table..');
        } else {
            console.log(err);
            res.json({"code" : err.code, "status": err.status});
            return;
        }
    });
});

http.listen(config.get('PORT'), function() {
    console.log("Server is running at: http://localhost:4000");
});

