/// <reference path="../_all.d.ts" />
"use strict";

import { Model } from "./model";

import { database } from "../config/database";

export class MessageModel extends Model {
    TABLE_NAME = "Message";
    KEY = "thread_id";
    SORT = "created_at";

    constructor() {
        super();
    }

    markThreadAsRead(thread: any, user: any, callback: Function) {
        // get all messages that have not been read by this user
        var params = {
            TableName: "Message",
            KeyConditionExpression: "thread_id = :value", // a string representing a constraint on the attribute
            FilterExpression: "not contains(is_read, :val)", // a string representing a constraint on the attribute
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
            ":value": thread.id,
            ":val": user.id
            }
        };

        database.query(params, (err: any, data: any) => {
            if (err) {
                callback(err, null);
            } else {
                console.log(data);

                // With every message
                data.Items.forEach(item => {
                    // save this message is read by this user

                    var isRead = [];
                    if (!("is_read" in item)) {
                        isRead.push(user.id);
                    } else {
                        isRead = item.is_read;
                        isRead.push(user.id);
                    }

                    var params2 = {
                        TableName: "Message",
                        Key: { // The primary key of the item (a map of attribute name to AttributeValue)
                            thread_id: item.thread_id,
                            created_at: item.created_at
                        },
                        UpdateExpression: "SET is_read = :value", // String representation of the update to an attribute
                        ExpressionAttributeValues: { // a map of substitutions for all attribute values
                            ":value": isRead
                        }
                    };

                    database.update(params2, function(err: any, data: any) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data);
                        } // successful response
                    });
                });

            } // successful response
        });
    }
}