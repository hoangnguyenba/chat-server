/// <reference path="../_all.d.ts" />
"use strict";

import { Model } from "./model";

export class MessageModel extends Model {
    TABLE_NAME = "Message";
    KEY = "thread_id";
    SORT = "created_at";

    constructor() {
        super();
    }
}