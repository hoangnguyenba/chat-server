/// <reference path="../_all.d.ts" />
"use strict";

import { database } from "../config/database";

export class Model {
    TABLE_NAME: string;

    find(params: any, callback: Function) {

        var paramsDynamo = {
            TableName: this.TABLE_NAME,
            Key: {
                id: params.id
            }
        };

        if (typeof(params.AttributesToGet) !== "undefined") {
            params.AttributesToGet = params.AttributesToGet;
        }

        database.get(paramsDynamo, function(err: any, dataDynamo: any) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                return callback(err, null);
            }
            callback(null, dataDynamo);
        });
    }

    findAll(params: any, callback: Function) {

        var paramsDynamo = {
            TableName : this.TABLE_NAME
        };

        if (typeof(params.AttributesToGet) !== "undefined") {
            params.AttributesToGet = params.AttributesToGet;
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