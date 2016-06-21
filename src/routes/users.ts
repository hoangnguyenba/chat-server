/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
import { UserModel } from "../models/user";

var router = express.Router();

router.get("/:id", function(req: express.Request, res: express.Response) {

    var params = {
        id: req.params.id,
        AttributesToGet: [
            "id",
            "name"
        ]
    };

    var userModel = new UserModel();

    userModel.get(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.send(result);
    });
});

module.exports = router;