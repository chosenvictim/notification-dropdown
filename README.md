# noti
Random notification generator using pull mechanism

Clone this repo and Follow these steps:-
1. npm install
2. npm start

Once the server is running, it will generate random strings at random interval of time and save it to the mysql db.
Hit this address http://localhost:4000/noti to fetch the json data from the tables.

Table structure:-

+--------+-----------------------------------------+--------+
| notiId | notiData                                | unread |
+--------+-----------------------------------------+--------+
|      1 | 2016-02-27 17:21:10.125                 |      1 |
|      2 | 2016-02-27 17:21:18.136                 |      1 |
|      3 | 2016-02-27 17:21:25.130                 |      0 |
+-----------------------------------------------------------+