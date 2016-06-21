/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";

import * as bcrypt from "bcrypt-nodejs";
import * as jwt from "jsonwebtoken";
import * as jwtCheck from "express-jwt";
import { config } from "../config/config";

import { UserModel } from "../models/user";

var router = express.Router();

router.use("/messages", require("./messages"));
router.use("/users", require("./users"));

router.get("/", function(req: express.Request, res: express.Response) {
  res.json("index");
});

// =====================================
// LOGIN ===============================
// =====================================
router.post("/login", function(req: express.Request, res: express.Response) {

    var id = req.body.username;
    var password = req.body.password;

    var params = {
        id: id,
    };

    var userModel = new UserModel();

    userModel.find(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send(error);
        }
        var user: any = result.Item;

        // Check password
        bcrypt.compare(password, user.password, function(err: any, result: any) {
            if (result) {
                res.json({
                    status: true,
                    id_token: createToken(user),
                    user: user
                });
            } else {
                res.json({
                    status: false
                });
            }
        });
    });


});

function createToken(user: any) {
  delete user.password;
  return jwt.sign(user, config.jwt_secret, { expiresIn: config.session_time });
}

module.exports = router;