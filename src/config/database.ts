/// <reference path="../_all.d.ts" />
"use strict";

import { config } from "./config";
import * as AWS from "aws-sdk";

AWS.config.update(config.database);

export var database = new AWS.DynamoDB.DocumentClient();