/// <reference path="../_all.d.ts" />
"use strict";

import { Model } from "./model";
import { ThreadModel } from "./thread";
import { UserModel } from "./user";

import { database } from "../config/database";

export class MessageModel extends Model {

    static MESSAGE_TYPE_TEXT = 0;
    static MESSAGE_TYPE_CHANGE_STATUS = 1;
    static MESSAGE_TYPE_CHANGE_THREAD_STATUS = 2;
    static MESSAGE_TYPE_MARK_THREAD_AS_READ = 3;

    TABLE_NAME = "Message";
    KEY = "thread_id";
    SORT = "created_at";

    constructor() {
        super();
    }

    markThreadAsRead(thread: any, user: any, callback: Function) {
        // manager mark as read
        var userid = user.id;
        if (thread.type === ThreadModel.THREAD_TYPE_SERVE && user.type === 1) {
            userid = "admin";
        }
        // get all messages that have not been read by this user
        var params = {
            TableName: this.TABLE_NAME,
            KeyConditionExpression: "thread_id = :value", // a string representing a constraint on the attribute
            FilterExpression: "not contains(is_read, :val)", // a string representing a constraint on the attribute
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
            ":value": thread.id,
            ":val": userid
            }
        };

        database.query(params, (err: any, data: any) => {
            if (err) {
                callback(err, null);
            } else {
                // With every message
                data.Items.forEach(item => {
                    // save this message is read by this user
                    var isRead = [];
                    if (!("is_read" in item)) {
                        isRead.push(userid);
                    } else {
                        isRead = item.is_read;
                        isRead.push(userid);
                    }

                    var params2 = {
                        TableName: this.TABLE_NAME,
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

    createMessageFromClientData(data: any) {

        var userid = data.author.id;
        if (data.thread.type === ThreadModel.THREAD_TYPE_SERVE && data.author.type === 1) {
            userid = "admin";
        }

        var item =  {
                "thread_id":  data.thread.id,
                "created_at":  new Date().getTime(),
                "author"   :  data.author,
                "text"   :  data.text,
                "is_read" : [userid]
            };
        return item;
    }
}