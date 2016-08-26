/// <reference path="../_all.d.ts" />
"use strict";

import { Model } from "./model";

import { database } from "../config/database";

export class ThreadModel extends Model {

    static THREAD_TYPE_ORDINARY = 0;
    static THREAD_TYPE_SERVE = 1;

    static THREAD_SERVE_STATUS_IDLE = 0;
    static THREAD_SERVE_STATUS_INCOMING_CHAT = 1;
    static THREAD_SERVE_STATUS_SERVED = 2;

    TABLE_NAME = "Thread";
    KEY = "thread_id";

    constructor() {
        super();
    }

    getThreadsOfManager(params: any, callback: Function) {

        // Get this user 1st
        var paramsDynamo1 = {
            TableName: "Manager",
            Key: {
                "id": params.id
            }
        };
        database.get(paramsDynamo1, (err: any, data: any) => {
            if (err) {
                callback(err, null);
            } else {
                var keys = [];
                if (data.Item.threads !== undefined) {
                    data.Item.threads.forEach(x => {
                        keys.push({
                            "thread_id": x
                        });
                    });

                    var paramsDynamo2 = {
                        RequestItems: {
                            "Thread": {
                                Keys: keys
                            }
                        }
                    };


                    database.batchGet(paramsDynamo2, (err: any, data: any) => {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data);
                        } // successful response
                    });
                } else {
                    callback(null, {});
                }

            } // successful response
        });
    }

    updateThreadServeStatus(data: any, callback: Function) {

        var params: any = {
            TableName: this.TABLE_NAME,
            Key: {
                thread_id: data.id
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