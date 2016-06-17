var db = require("../app").db;
 
function UserModel() { };
UserModel.TABLE_NAME = "User";

UserModel.get = function(params, callback) {

    var params_dynamo = {
        TableName: this.TABLE_NAME,
        Key: { 
            id: params.id
        }
    };

    if (typeof(params.AttributesToGet) != "undefined")
    {
        params_dynamo.AttributesToGet = params.AttributesToGet;
    }

    db.get(params_dynamo, function(err, data_dynamo) {
        if(err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            return callback(err, null);
        }
        callback(null, data_dynamo);
    });


};


UserModel.getAll = function(callback) {
    
    var params = {
        TableName : this.TABLE_NAME,
        AttributesToGet: [
            'id',
            'name'
        ]
    };

    db.scan(params, function(err, data_dynamo) {
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
 
module.exports = UserModel;