var PORT = 3131;

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cors = require('cors');
var morgan       = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var config = require('./config/config');
var AWS = require("aws-sdk");
AWS.config.update(config.dynamodb);

module.exports.db = new AWS.DynamoDB.DocumentClient();

// set up our express application
app.use(cors());
app.use(morgan('dev')); // log every request to the console
// app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms



var routes = require("./routes.js")(app);

var MessageModel = require("./models/message-model.js");
io.on("connection", function(socket){   
    console.log('a user connected');
    socket.on("chat_message", function(msg){

        MessageModel.create(msg, function(error, result) {
            if(error) {
                console.log(JSON.stringify(error));
            }
            else {
                io.emit("chat_message", MessageModel.createMessageFromClientData(msg));
            }
        });
    });
});

server.listen(PORT, function(){
  console.log('listening on *:' + server.address().port);
});