/// <reference path="../_all.d.ts" />
"use strict";

import { Model } from "./model";

import * as bcrypt from "bcrypt-nodejs";
import { database } from "../config/database";

export class UserModel extends Model {
    TABLE_NAME = "User";
    KEY = "id";

    static USER_STATUS_OFFLINE = 0;
    static USER_STATUS_ONLINE = 1;
    static USER_STATUS_AWAY = 2;
    static USER_STATUS_BUSY = 3;

    constructor() {
        super();
    }

    check(params: any, callback: Function) {
        var id = params.username;
        var password = params.password;

        var paramsDynamo = {
            id: id,
        };

        this.find(paramsDynamo, function(error: any, result: any) {
            if (Object.keys(result).length === 0) {
                return callback("Wrong username", null);
            }
            var user: any = result.Item;

            // Check password
            bcrypt.compare(password, user.password, function(err: any, result: any) {
                if (result) {
                    callback(null, user);
                } else {
                    callback("Wrong password", user);
                }
            });
        });
    }

    setOptions(params: any, callback: Function): void {

        var paramsDynamo = {
            TableName: "User",
            Key: {
                "id": params.id
            },
            UpdateExpression: "set options = :o",
            ExpressionAttributeValues: {
                ":o": params.options
            }
        };

        database.update(paramsDynamo, function(err: any, data: any) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }
            callback(err, data);
        });
    }


    setStatus(params: any, callback: Function): void {

        var paramsDynamo = {
            TableName: "User",
            Key: {
                "id": params.id
            },
            UpdateExpression: "set #status = :o",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":o": params.status
            }
        };

        if (typeof(params.socket_id) !== "undefined") {
            paramsDynamo.UpdateExpression = paramsDynamo.UpdateExpression + ", socket_id = :s";
            paramsDynamo.ExpressionAttributeValues[":s"] = params.socket_id;
        }
        database.update(paramsDynamo, function(err: any, data: any) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }
            callback(err, data);
        });
    }

    search(params: any, callback: Function) {
        var paramsDynamo = {
            TableName: "User",
            FilterExpression: "contains(#name, :value)",
            ExpressionAttributeValues: {
                ":value": params.key
            },
            ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
                "#name": "name"
            },
        };

        database.scan(paramsDynamo, function(err: any, data: any) {
            callback(err, data);
        });
    }

    findUserBySocketID(params: any, callback: Function) {
        var paramsDynamo = {
            TableName: this.TABLE_NAME,
            FilterExpression: "socket_id = :value",
            ExpressionAttributeValues: {
                ":value": params.socket_id
            }
        };

        database.scan(paramsDynamo, function(err: any, data: any) {
            callback(err, data);
        });
    }

    updateSocketID(data: any, callback: Function) {

        var params: any = {
            TableName: this.TABLE_NAME,
            Key: {
                id: data.id
            },
            UpdateExpression: "SET socket_id = :ski",
            ExpressionAttributeValues: {
                ":ski": data.socket_id
            },
            ConditionExpression: "attribute_exists(id)"
        };

        if (typeof(data.status) !== "undefined") {
            params.UpdateExpression = params.UpdateExpression + ", #status = :s";
            params.ExpressionAttributeValues[":s"] = data.status;
            params.ExpressionAttributeNames = {
                "#status": "status"
            };
        }

        database.update(params, function(err: any, dataDynamo: any) {
            callback(err, dataDynamo);
        });
    }

    updateLastMessage(data: any, callback: Function) {

        var params: any = {
            TableName: this.TABLE_NAME,
            Key: {
                id: data.id
            },
            UpdateExpression: "SET last_message = :msg, last_message_time = :msg_time",
            ExpressionAttributeValues: {
                ":msg": data.last_message,
                ":msg_time": data.last_message_time
            }
        };

        database.update(params, function(err: any, dataDynamo: any) {
            callback(err, dataDynamo);
        });
    }

    getListUserOnline(callback: Function) {
        var paramsDynamo = {
            TableName: this.TABLE_NAME,
            FilterExpression: "#status = :s",
            ExpressionAttributeValues: {
                ":s": UserModel.USER_STATUS_ONLINE
            },
            ExpressionAttributeNames : {
                "#status": "status"
            }
        };

        database.scan(paramsDynamo, function(err: any, data: any) {
            callback(err, data);
        });
    }

    updateServeStatus(data: any, callback: Function) {

        var params: any = {
            TableName: this.TABLE_NAME,
            Key: {
                id: data.id
            },
            UpdateExpression: "SET serve_status = :serve_status",
            ExpressionAttributeValues: {
                ":serve_status": data.serve_status
            }
        };

        database.update(params, function(err: any, dataDynamo: any) {
            callback(err, dataDynamo);
        });
    }
}