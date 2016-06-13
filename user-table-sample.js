var bcrypt = require('bcrypt');

var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing messages into DynamoDB. Please wait.");

var allMessages = JSON.parse(fs.readFileSync('user-data.json', 'utf8'));
allMessages.forEach(function(user) {

    var params = {
        TableName: "User",
        Item: {
            "id":  user.id,
            "name": user.name
        }
    };

    bcrypt.hash(user.password, 10, function(err, hash) {

        params.Item.password = hash;

        // Store hash in your password DB.
        console.log(JSON.stringify(params));

        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add user", user.name, ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("PutItem succeeded:", user.name);
            }
        });
    });


    
});