/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
import { UserModel } from "../models/user";
import { auth, getToken } from "../middlewares/auth";

import * as jwt from "jsonwebtoken";

var router = express.Router();

router.get("/online", auth, function(req: express.Request, res: express.Response) {

    var userModel = new UserModel();

    userModel.getListUserOnline(function(error: any, result: any) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.send(result);
    });
});

router.post("/search", auth, function(req: express.Request, res: express.Response) {

    var params = {
        key: req.body.key
    };

    var userModel = new UserModel();

    userModel.search(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.send(result);
    });
});

router.get("/options", auth, function(req: express.Request, res: express.Response) {
    var token = getToken(req);
    var dtoken = jwt.decode(token, { complete: true }) || {};

    var params = {
        id: dtoken.payload.id,
        AttributesToGet: [
            "options"
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

router.post("/options", auth, function(req: express.Request, res: express.Response) {
    var token = getToken(req);
    var dtoken = jwt.decode(token, { complete: true }) || {};

    var params = {
        id: dtoken.payload.id,
        options: {
            is_notification: req.body.is_notification,
            language: req.body.language
        }
    };

    var userModel = new UserModel();

    userModel.setOptions(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send({status: false, error: error});
        }
        return res.send({status: true});
    });
});

router.get("/recent", auth, function(req: express.Request, res: express.Response) {

    var params = {
        TableName: "User",
        ProjectionExpression: "#id, #name, #status, last_message, last_message_time",
        ExpressionAttributeNames: {
                    "#name": "name",
                    "#id": "id",
                    "#status": "status"
                },
        FilterExpression: "attribute_exists (last_message)"
    };

    var userModel = new UserModel();

    userModel.findAll(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.send(result);
    });
});

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

module.exports = router;