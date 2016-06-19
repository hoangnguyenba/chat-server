var db = require("../app").db;
 
var TABLE_NAME = "User";
function UserModel() { };

UserModel.get = function(params, callback) {

    var params_dynamo = {
        TableName: 'User',
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

    var params_dynamo = {
        TableName: 'User'
    };

    db.scan(params_dynamo, function(err, data_dynamo) {
        if(err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            return callback(err, null);
        }
        callback(null, data_dynamo);
    });


};
 
module.exports = UserModel;