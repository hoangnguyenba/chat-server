/// <reference path="../_all.d.ts" />
"use strict";

import { Model } from "./model";

import * as bcrypt from "bcrypt-nodejs";

export class UserModel extends Model {
    TABLE_NAME = "User";
    KEY = "id";

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
}