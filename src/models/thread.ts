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

    getThreadOfUser(params: any, callback: Function) {


        var paramsDynamo = {
                    TableName: "Thread",
                    FilterExpression: "contains(#name, :val)", // a string representing a constraint on the attribute
                    ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
                        '#name': 'users'
                    },
                    ExpressionAttributeValues: { 
                        ":val": params.id
                    }
                };
        database.scan(paramsDynamo, function(err, data) {
            if (err) {
                console.log('err');
                console.log(err);
            } // an error occurred
            else {
                console.log('data');
            } // successful response
            callback(err, data);
        });


        // callback(
        //     [
        //         {
        //             "thread_id" : "manchester",
        //             "name"      : "Manchester United",
        //             "author"    : {
        //                 "id"    : "rooney",
        //                 "name"  : "Rooney"
        //             },
        //             "users": ["rooney", "mata", "ronaldo", "pique"]
        //         },
        //         {
        //             "thread_id" : "real",
        //             "name"      : "Real Madrid",
        //             "author"    : {
        //                 "id"    : "ronaldo",
        //                 "name"  : "Ronaldo"
        //             },
        //             "users": ["ronaldo", "ramos"]
        //         }
        //     ]
        // );
    }
}