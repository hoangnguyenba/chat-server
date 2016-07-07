var db = require('./dynamodb.js');


process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

var ARR_TABLE = ["message", "user", "thread"];

var type = "init"; // create, delete, sample, reset, init
var table = "all"; // all, Message, User

if(typeof process.argv[3] !== "undefined")
{
    console.log('####1####');
    type = process.argv[3];
}

if(typeof process.argv[2] !== "undefined")
{
    console.log('####2####');
    table = process.argv[2];
}

var tables = [];
if(table === "all")
{
    tables = ARR_TABLE;
}
else
{
    tables.push(table);
}

tables.forEach((t) => {

    if(type == "init")
    {
        // create table
        createTable(t, function (err, data) {
            if(err == null)
            {
                sampleTable(t, function (err, data) {
                });
            }
        });
    }
    else if(type == "reset")
    {
        // create table
        deleteTable(t, function (err, data) {
            // create table
            createTable(t, function (err, data) {
                sampleTable(t, function (err, data) {
                });
            });
        });
    }
    else if(type == "create")
    {
        createTable(t, function (err, data) {
        });
    }
    else if(type == "delete")
    {
        deleteTable(t, function (err, data) {
        });
    }
    else if(type == "sample")
    {
        sampleTable(t, function (err, data) {
        });
    }
    
});

function deleteTable(table_name, callback) {

    var params = {
        TableName : capitalizeFirstLetter(table_name)
    };

    db.dynamoDB.deleteTable(params, function(err, data) {
        if (err) {
            console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
        }
        callback(err, data);
    });
}

function createTable(table_name, callback) {
    
    var params = require( "./" + table_name + '-table-create.js');

    db.dynamoDB.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
        callback(err, data);
    });
}

function sampleTable(table_name, callback) {
    require( "./" + table_name + '-table-sample.js')(callback);
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

console.log('####end####');