/// <reference path="../_all.d.ts" />
"use strict";

import { Model } from "./model";

export class UserModel extends Model {
    TABLE_NAME = "User";

    constructor() {
        super();
    }
}