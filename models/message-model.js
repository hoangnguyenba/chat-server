var db = require("../app").db;
 
var TABLE_NAME = "Message";
function MessageModel() { };
 
MessageModel.create = function(data, callback) {
    var params = {
        TableName: TABLE_NAME,
        Item: this.createMessageFromClientData(data),
    };

    db.put(params, function(err, data_dynamo) {
       if(err) {
           console.error("Unable to add message", data.text, ". Error JSON:", JSON.stringify(err, null, 2));
           return callback(err, null);
       }
       console.log("PutItem succeeded:", JSON.stringify(data, null, 2));
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

MessageModel.createMessageFromClientData = function (data) {
    console.log('data from client: ');
    console.log(data);
    var item =  {
            "thread_id":  data.thread.id,
            "created_at":  new Date().getTime(),
            "author"   :  data.author,
            "text"   :  data.text
        }
    return item;
}
 
module.exports = MessageModel;