/// <reference path="../_all.d.ts" />
"use strict";

import * as jwt from "jsonwebtoken";
import * as jwtCheck from "express-jwt";
import { config } from "../config/config";

export function createToken(user: any) {
  delete user.password;
  return jwt.sign(user, config.jwt.secret, { expiresIn: config.session_time });
}

export var auth = jwtCheck(config.jwt);

export function getToken(req: any) {
  var parts = req.headers.authorization.split(" ");
  if (parts.length === 2) {
    var scheme = parts[0];
    var credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
