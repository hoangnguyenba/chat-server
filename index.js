var PORT = 3131;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

module.exports.db = new AWS.DynamoDB();


var docClient = new AWS.DynamoDB.DocumentClient();

io.on("connection", function(socket){   
    console.log('a user connected');
    socket.on("chat_message", function(msg){
        console.log('Message: ' + JSON.stringify(msg));

        var params = {
            TableName: "Messages",
            Item: {
                "thread_id":  'user1:user2',
                "created_at":  new Date().getTime(),
                "author"   :  'user1',
                "text"   :  msg.text
            }
        };

        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add message", msg.text, ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("PutItem succeeded:", msg.text);
            }
        });
    });
});

http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});