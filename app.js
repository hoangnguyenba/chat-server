var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cors = require('cors');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');

var port     = process.env.PORT || 3131; // set our port


var config = require('./config/config');
var AWS = require("aws-sdk");
AWS.config.update(config.dynamodb);

module.exports.db = new AWS.DynamoDB.DocumentClient();

// set up our express application
app.use(cors());

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



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

server.listen(port, function(){
  console.log('listening on *:' + server.address().port);
});