var fs = require('fs');

var db = require('./dynamodb.js');

module.exports = function(callback) {
    console.log("Importing threads into DynamoDB. Please wait.");

    var allMessages = JSON.parse(fs.readFileSync('./scripts/thread-data.json', 'utf8'));
    allMessages.forEach(function(thread) {
        var params = {
            TableName: "Thread",
            Item: thread
        };

        console.log(JSON.stringify(params));

        db.docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add thread", thread.name, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", thread.name);
        }
        });
    });
}