var db = require("../app").db;
 
var TABLE_NAME = "User";
function UserModel() { };

UserModel.get = function(id, callback) {
    
    var params = {
        TableName: 'User',
        Key: { 
            id: id
        }
    };

    db.get(params, function(err, data_dynamo) {
        if(err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            return callback(err, null);
        }
        console.log("Query succeeded." + JSON.stringify(data_dynamo, null, 2));
        callback(null, data_dynamo);
    });


};
 
module.exports = UserModel;