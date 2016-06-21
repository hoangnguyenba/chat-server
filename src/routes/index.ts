/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
// import * as users from "./user"

var router = express.Router();

router.use("/messages", require("./messages"));
router.use("/users", require("./users"));

router.get("/", function(req: express.Request, res: express.Response) {
  res.json("index");
});

module.exports = router;