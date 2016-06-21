/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
import { MessageModel } from "../models/message";

var router = express.Router();

router.get("/:id", function(req: express.Request, res: express.Response) {

    var params = {
        id: req.params.id
    };

    var messageModel = new MessageModel();

    messageModel.find(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send(error);
        }
        return res.send(result);
    });
});

module.exports = router;