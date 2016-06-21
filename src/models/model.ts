/// <reference path="../_all.d.ts" />
"use strict";

import { database } from "../config/database";

export class Model {
    TABLE_NAME: string = "";
    KEY: string = "";
    SORT: string = "";

    find(params: any, callback: Function) {

        if (this.SORT === "") {
            var key = [];
            key[this.KEY] = params.id;

            var paramsDynamo: any = {
                TableName: this.TABLE_NAME,
                Key: key
            };

            if (typeof(params.AttributesToGet) !== "undefined") {
                paramsDynamo.AttributesToGet = params.AttributesToGet;
            }

            database.get(paramsDynamo, function(err: any, dataDynamo: any) {
                if (err) {
                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                    return callback(err, null);
                }
                callback(null, dataDynamo);
            });
        } else {
            var paramsDynamo: any = {
                TableName : this.TABLE_NAME,
                KeyConditionExpression: this.KEY + " = :id",
                ExpressionAttributeValues: {
                    ":id": params.id
                }
            };

            database.query(paramsDynamo, function(err: any, dataDynamo: any) {
                if (err) {
                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                    return callback(err, null);
                }
                console.log("Query succeeded." + JSON.stringify(dataDynamo, null, 2));
                dataDynamo.Items.forEach(function(item: any) {
                    console.log(" -", item.text);
                });
                callback(null, dataDynamo);
            });
        }
    }

    findAll(params: any, callback: Function) {

        var paramsDynamo: any = {
            TableName : this.TABLE_NAME
        };

        if (typeof(params.AttributesToGet) !== "undefined") {
            paramsDynamo.AttributesToGet = params.AttributesToGet;
        }

        database.scan(paramsDynamo, function(err: any, dataDynamo: any) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                return callback(err, null);
            }
            callback(null, dataDynamo);
        });
    };
}