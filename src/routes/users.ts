/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
import { UserModel } from "../models/user";
import { auth } from "../middlewares/auth";

var router = express.Router();

router.get("/:id", auth, function(req: express.Request, res: express.Response) {

    var params = {
        id: req.params.id,
        AttributesToGet: [
            "id",
            "name"
        ]
    };

    var userModel = new UserModel();

    userModel.find(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.send(result);
    });
});


router.get("/", auth, function(req: express.Request, res: express.Response) {

    var params = {
        AttributesToGet: [
            "id",
            "name"
        ]
    };

    var userModel = new UserModel();

    userModel.findAll(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.send(result);
    });
});


module.exports = router;