var fs = require('fs');

var db = require('./dynamodb.js');

module.exports = function(callback) {
    console.log("Importing messages into DynamoDB. Please wait.");

    var allMessages = JSON.parse(fs.readFileSync('./scripts/message-data.json', 'utf8'));
    allMessages.forEach(function(message) {
        var params = {
            TableName: "Message",
            Item: {
                "thread_id":  message.thread_id,
                "created_at":  new Date().getTime(),
                "author"   :  message.author,
                "text"   :  message.text
            }
        };

        console.log(JSON.stringify(params));

        db.docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add message", message.text, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", message.text);
        }
        });
    });
}