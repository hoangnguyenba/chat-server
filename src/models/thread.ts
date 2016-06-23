/// <reference path="../_all.d.ts" />
"use strict";

import { Model } from "./model";

import { database } from "../config/database";

export class ThreadModel extends Model {
    TABLE_NAME = "Thread";
    KEY = "thread_id";

    constructor() {
        super();
    }

    getThreadsOfUser(params: any, callback: Function) {

        // Get this user 1st
        var paramsDynamo1 = {
            TableName: "User",
            Key: {
                "id": params.id
            }
        };
        database.get(paramsDynamo1, (err: any, data: any) => {
            if (err) {
                callback(err, null);
            } else {
                var keys = [];
                console.log(data);
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

            } // successful response
        });
    }
}