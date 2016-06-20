/// <reference path="../_all.d.ts" />
"use strict";

var config = require('../../config/config');
import * as AWS from "aws-sdk";

AWS.config.update(config.database);

export class Model {
    client: AWS.DynamoDB.DocumentClient;
    TABLE_NAME: string;

    constructor() {
        this.client = new AWS.DynamoDB.DocumentClient();
    }
}