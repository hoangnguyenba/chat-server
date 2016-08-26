var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var db = require('./dynamodb.js');



module.exports = function(callback) {
    console.log("Importing messages into DynamoDB. Please wait.");

    var allMessages = JSON.parse(fs.readFileSync('./scripts/manager-data.json', 'utf8'));
    allMessages.forEach(function(user) {

        var params = {
            TableName: "Manager",
            Item: user
        };

        bcrypt.hash(user.password, null, null, function(err, hash) {

            params.Item.password = hash;

            // Store hash in your password DB.
            console.log(JSON.stringify(params));

            db.docClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add manager", user.name, ". Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("PutItem succeeded:", user.name);
                }
                callback(err, data);
            });
        });
    });
}