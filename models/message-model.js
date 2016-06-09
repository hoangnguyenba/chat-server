var db = require("../app").db;
 
var TABLE_NAME = "Messages";
function MessageModel() { };
 
MessageModel.create = function(data, callback) {
    var params = {
        TableName: TABLE_NAME,
        Item: {
            "thread_id":  'user1:user2',
            "created_at":  new Date().getTime(),
            "author"   :  'user1',
            "text"   :  data.message.text
        }
    };

    db.put(params, function(err, data_dynamo) {
       if(err) {
           console.error("Unable to add message", data.message.text, ". Error JSON:", JSON.stringify(err, null, 2));
           return callback(err, null);
       }
       console.log("PutItem succeeded:", data.message.text);
       callback(null, data_dynamo);
    });
}


MessageModel.getAll = function(thread_id, callback) {
    
    var params = {
        TableName : TABLE_NAME,
        KeyConditionExpression: "thread_id = :thread_id",
        ExpressionAttributeValues: {
            ":thread_id": thread_id
        }
    };

    db.query(params, function(err, data_dynamo) {
        if(err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            return callback(err, null);
        }
        console.log("Query succeeded." + JSON.stringify(data_dynamo, null, 2));
        data_dynamo.Items.forEach(function(item) {
            console.log(" -", item.text);
        });
        callback(null, data_dynamo);
    });


};
 
module.exports = MessageModel;