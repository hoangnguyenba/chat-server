var PORT = 3131;

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./config');

var AWS = require("aws-sdk");
AWS.config.update(config.dynamodb);

module.exports.db = new AWS.DynamoDB.DocumentClient();

var routes = require("./routes/routes.js")(app);

var MessageModel = require("./models/message-model.js");
io.on("connection", function(socket){   
    console.log('a user connected');
    socket.on("chat_message", function(msg){

        MessageModel.create({message: msg}, function(error, result) {
            if(error) {
                console.log(JSON.stringify(error));
            }
            else {
                // io.emit("chat_message", msg);
            }
        });
    });
});

server.listen(PORT, function(){
  console.log('listening on *:' + server.address().port);
});