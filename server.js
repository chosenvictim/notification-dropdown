var express     = require("express");
var bodyParser  = require("body-parser");
var app         = express();
var mysql       = require("mysql");
var http        = require("http").Server(app);
var socket      = require("socket.io")(http);
var respTime    = require("response-time");
var statsD      = require("node-statsd");
var config      = require("./config/config.js");

var connection = mysql.createConnection({
    host    : config.get("HOST"),
    user    : config.get("DB_USER"), //name of your mysql db
    password: config.get("DB_PASSWD"), //password of your mysql db
    database: config.get("DB_NAME") //name of the database for that user
});

var notiId = 2;

connection.connect(function(err) {
    if(!err) {
        console.log("Database is connected !!");

        socket.on('connection', function(sock) {
            console.log("Client Socket connected !!");
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
    var post = { notiId: notiId++, notiData: notiData, unread: 1 };
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

//configuring body-parser to be used as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var stats = new statsD();
app.use(respTime(function(req, res, time) {
    var stat = (req.method + req.url).toLowerCase().replace(/[:\.]/g, '').replace(/\//g, '_');
    stats.timing(stat, time);
}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get("/getNotifications", function(req, res) {
    connection.query('SELECT * from noti', function(err, rows) {
        if(!err) {
            res.json(rows);
        } else {
            console.log(err);
            res.json({"code" : err.code, "status": err.status});
            return;
        }
    });
});

app.put("/updateNotificationCount", function(req, res) {
    connection.query('UPDATE noti SET unread = 0 where notiId = ?', req.body.notiId, function(err, row) {
        if(!err) {
            console.log('Updated notification count !!');
            res.json({"code": 200, "status": "OK"});
        } else {
            console.log(err);
            res.json({"code" : err.code, "status": err.status});
        }
        return;
    });
});

http.listen(config.get('PORT'), function() {
    console.log("Server is running at: http://" + config.get('HOST') + ":" + config.get('PORT') + " ...");
});

