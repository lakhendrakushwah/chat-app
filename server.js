var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static(__dirname));

var dbUrl = 'mongodb+srv://lakha:lakha@cluster0.sap3o.mongodb.net/test';


mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
})
io.on('connection', (socket) => {
    console.log('a user is connected')
})

var Message = mongoose.model('Message', { name: String, message: String })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})


app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);

    })
})

server.listen(3000, () => {
    console.log('listening on *:3000');
  });

    //mongodb+srv://lakha:<password>@cluster0.sap3o.mongodb.net/test
    //mongodb+srv://lakha:<password>@cluster0.sap3o.mongodb.net/test
    // mongodb+srv://lakha:Lakha%4012@cluster0.sap3o.mongodb.net/myFirstDatabase?authSource=admin&replicaSet=atlas-j49yys-shard-0&w=majority%2Fyoutube&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true

