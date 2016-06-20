/// <reference path="../_all.d.ts" />
"use strict";

// import config = require('../config/config');
import { database } from "../database";

// AWS.config.update({
//     "endpoint": "http://localhost:8000",
//     "region": "us-west-2"   
// });

// var db = new AWS.DynamoDB.DocumentClient();

export class UserModel {
    TABLE_NAME = "User";

    get(params: any, callback: Function) {
        var params_dynamo = {
            TableName: this.TABLE_NAME,
            Key: {
                id: params.id
            }
        };

        if (typeof(params.AttributesToGet) !== "undefined") {
            params.AttributesToGet = params.AttributesToGet;
        }

        database.get(params_dynamo, function(err, data_dynamo) {
            if(err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                return callback(err, null);
            }
            callback(null, data_dynamo);
        });
    };


    getAll(callback) {

        var params = {
            TableName : this.TABLE_NAME,
            AttributesToGet: [
                "id",
                "name"
            ]
        };

        database.scan(params, function(err, data_dynamo) {
            if(err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                return callback(err, null);
            }
            callback(null, data_dynamo);
        });
    };
} 