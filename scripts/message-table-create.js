module.exports = {
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