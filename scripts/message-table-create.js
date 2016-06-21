var config = require('./config/config');
var AWS = require("aws-sdk");
AWS.config.update(config.dynamodb);

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Message",
    KeySchema: [       
        { AttributeName: "thread_id", KeyType: "HASH"},  //Partition key
        { AttributeName: "created_at", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "thread_id", AttributeType: "S" },
        { AttributeName: "created_at", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});