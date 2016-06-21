/// <reference path="../_all.d.ts" />
"use strict";

import * as jwt from "jsonwebtoken";
import * as jwtCheck from "express-jwt";
import { config } from "../config/config";

export function createToken(user: any) {
  delete user.password;
  return jwt.sign(user, config.jwt_secret, { expiresIn: config.session_time });
}

export var auth = jwtCheck({secret: config.jwt_secret});
