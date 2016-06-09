var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing messages into DynamoDB. Please wait.");

var allMessages = JSON.parse(fs.readFileSync('message-data.json', 'utf8'));
allMessages.forEach(function(message) {
    var params = {
        TableName: "Messages",
        Item: {
            "thread_id":  message.thread_id,
            // "number":  message.number,
            "created_at":  new Date().getTime(),
            "author"   :  message.author,
            "text"   :  message.text
        }
    };

    console.log(JSON.stringify(params));

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add message", message.text, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", message.text);
       }
    });
});