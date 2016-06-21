/// <reference path="../_all.d.ts" />
"use strict";

var config = require("./config");
import * as AWS from "aws-sdk";

AWS.config.update(config.database);

export var database = new AWS.DynamoDB.DocumentClient();