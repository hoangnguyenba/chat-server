/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
import { ManagerModel } from "../models/manager";
import { auth, getToken } from "../middlewares/auth";

import * as jwt from "jsonwebtoken";

var router = express.Router();

router.post("/search", auth, function(req: express.Request, res: express.Response) {

    var params = {
        key: req.body.key
    };

    var userModel = new ManagerModel();

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

    var userModel = new ManagerModel();

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

    var userModel = new ManagerModel();

    userModel.setOptions(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send({status: false, error: error});
        }
        return res.send({status: true});
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

    var userModel = new ManagerModel();

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
            "name",
            "status"
        ]
    };

    var managerModel = new ManagerModel();

    managerModel.findAll(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.send(result);
    });
});

module.exports = router;