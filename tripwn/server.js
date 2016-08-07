var WebSocketServer = require('ws').Server;
var express = require('express');
var app = express();
var server = app.listen(8);
var wsServer = new WebSocketServer({server: server});

// static files
app.use(express.static(__dirname + '/static'));
wsServer.on('request', function (req, res) {

});
