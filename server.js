var express = require("express");
var mysql   = require("mysql");
var socket  = require("socket.io")(http);

var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'shekWork', //name of your mysql db
    password: 'passwd', //password of your mysql db
    database: 'notification_db' //name of the database for that user
});

var app = express();
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

app.get("/updateNotificationCount", function(req, res) {
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

app.get("/setNotificationCount", function(req, res) {
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

app.listen(4000);
console.log("Server is running at: http://localhost:4000");
