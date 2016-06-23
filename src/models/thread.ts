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


        var paramsDynamo = {
            RequestItems: {
                "Thread": {
                    Keys: [
                        {
                            "thread_id": "manchester"
                        },
                        {
                            "thread_id": "real"
                        }
                    ]
                }
            }
        };


        database.batchGet(paramsDynamo, function(err: any, data: any) {
            if (err) {
                console.log("err");
                console.log(err);
            } else {
                console.log("data");
            } // successful response
            callback(err, data);
        });
    }
}