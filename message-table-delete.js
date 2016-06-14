var config = require('./config/config');
var AWS = require("aws-sdk");
AWS.config.update(config.dynamodb);

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Message"
};

dynamodb.deleteTable(params, function(err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});