/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";

module Route {

  export class Index {

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      //render page
      res.json("Welcome api for chat app");
    }
  }
}

export = Route;