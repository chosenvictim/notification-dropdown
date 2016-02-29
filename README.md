# Facebook like Notification Dropdown
A Facebook like notification dropdown which gets random notifications from the server by **Push Mechanism** over Websocket.
I have used [socket.io](https://github.com/socketio/socket.io) library on the server side for sending push notifications to the client.

It has the following functionalities:-
```
- The backend keeps generating new notifications at random intervals in the database. 
- The server pushes the newly generated notification over websocket and the frontend receives it on the browser side. 
- The notification bell shows the number of new notifications available(unread by user) with a fadeIn effect. 
- Clicking on the bell displays the notification tab with a sliding motion. 
- Clicking on a notification marks it as read and the state is saved on the server side as well. 
- Needless to say, on page refresh, all the available notifications at the backend are repopulated with correct state (read or unread). 
```
I have used nodejs [mysql](https://github.com/felixge/node-mysql) to connect to the database and run queries. Lets first setup the Mysql database for this application:
```
1. Assuming you have mysql installed, lets login with root: mysql -u root -p
2. Create a database that we will use for this project: CREATE DATABASE <database_name>;
3. Use newly created database: USE <database_name>;
4. Create a table called 'noti': CREATE TABLE noti (notiId int, notiData varchar(255), unread int);
Table Structure:-
+--------+-----------------------------------------+--------+
| notiId | notiData                                | unread |
+--------+-----------------------------------------+--------+
|      1 | 2016-02-27 17:21:10.125                 |      1 |
|      2 | 2016-02-27 17:21:18.136                 |      1 |
|      3 | 2016-02-27 17:21:25.130                 |      0 |
+-----------------------------------------------------------+
```
You are all set to use this database.
Now Clone this repo and Follow these steps:-
```
1. npm install
2. change config/config.json accordingly
3. npm start
```
The server will start running at port specified in config.json and it does the following:-
```
1. It will generate random strings at random interval of time (between 5 to 10 secs)
2. It creates a random notification with that string and saves it to database.
3. It emits the 'notification' over websocket which is then received by the client and displayed(unread by default).
```
Now hit [http://localhost:4000](http://localhost:4000) and you should be good to go.
