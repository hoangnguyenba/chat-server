var config = require('../des/config/config');
var AWS = require("aws-sdk");
AWS.config.update(config.config.database);

exports.dynamoDB = new AWS.DynamoDB();
exports.docClient = new AWS.DynamoDB.DocumentClient();