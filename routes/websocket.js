let express = require('express');
let path = require('path');
//router object
let mongoose = require('mongoose');
let url = 'mongodb://localhost:27017/StudyConDb';
let router = express.Router();

    app = express(),
    http = require('http').Server(app),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 8080
    });

app.use(express.static('public'));

/*router.get('/', function (req, res) {
    console.log('websocket');
    res.render('websocket')
    //res.sendFile(path.join(__dirname, '..', 'websocket.html'));
});*/

router.get('/', function(req, res) {
    res.render('index');
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

wss.on('connection', function(ws) {
    ws.on('message', function(msg) {
        data = JSON.parse(msg);
        if (data.message) wss.broadcast('<strong>' + data.name + '</strong>: ' + data.message);
    });
});

http.listen(3001, function() {
    console.log('listening on *:3001');
});
module.exports = router