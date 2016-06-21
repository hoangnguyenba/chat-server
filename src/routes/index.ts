/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";

import { createToken } from "../middlewares/auth";

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
    userModel.check({
      username: id,
      password: password
    }, (err, user) => {
      if (err) {
        res.json(err);
      } else {
        res.json({
              status: true,
              id_token: createToken(user),
              user: user
          });
      }
    });
});

module.exports = router;