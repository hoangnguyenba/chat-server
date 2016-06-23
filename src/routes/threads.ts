/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
import { ThreadModel } from "../models/thread";
import { auth, getToken } from "../middlewares/auth";
import * as jwt from "jsonwebtoken";

var router = express.Router();

router.get("/", auth, function(req: express.Request, res: express.Response) {

    var token = getToken(req);
    var dtoken = jwt.decode(token, { complete: true }) || {};

    var params = {
        AttributesToGet: [
            "thread_id",
            "name"
        ],
        id: dtoken.payloads.id
    };

    var threadModel = new ThreadModel();

    threadModel.getThreadsOfUser(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.send(result);
    });
});


module.exports = router;