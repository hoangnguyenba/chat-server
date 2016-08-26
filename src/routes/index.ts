/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
var uuid = require("node-uuid");

import { server } from "../app";
import { config } from "../config/config";

import { createToken } from "../middlewares/auth";

import { ManagerModel } from "../models/manager";
import { UserModel } from "../models/user";
import { ThreadModel } from "../models/thread";
import { MessageModel } from "../models/message";

import { auth, getToken } from "../middlewares/auth";
import * as jwt from "jsonwebtoken";

var router = express.Router();
var os = require("os");
var ifaces = os.networkInterfaces();

router.use("/messages", require("./messages"));
router.use("/threads", require("./threads"));
router.use("/users", require("./users"));
router.use("/managers", require("./managers"));

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

    var managerModel = new ManagerModel();
    managerModel.check({
      username: id,
      password: password
    }, (err, manager) => {
      if (err) {
        res.json(err);
      } else {

        // Update user status online
        var params = {
            id: id,
            status: ManagerModel.MANAGER_STATUS_ONLINE
        };

        var managerModel = new ManagerModel();

        managerModel.setStatus(params, function(error: any, result: any) {
            if (error) {
                return res.status(400).send({status: false, error: error});
            }
            delete result.Attributes.password;
            res.json({
                status: true,
                id_token: createToken(manager),
                user: result.Attributes
            });

            var msg = {
                author: {
                    id: manager.id,
                    name: manager.name
                },
                type: MessageModel.MESSAGE_TYPE_CHANGE_STATUS,
                status: ManagerModel.MANAGER_STATUS_ONLINE
            };
            console.log(msg);
            server.io.emit( params.id, msg);
        });
      }
    });
});

// =====================================
// LOGOUT ===============================
// =====================================
router.post("/logout", auth, function(req: express.Request, res: express.Response) {

    var token = getToken(req);
    var dtoken = jwt.decode(token, { complete: true }) || {};

    // Update user status online
    var params = {
        id: dtoken.payload.id,
        status: ManagerModel.MANAGER_STATUS_OFFLINE
    };

    var managerModel = new ManagerModel();

    managerModel.setStatus(params, function(error: any, result: any) {
        if (error) {
            return res.status(400).send({status: false, error: error});
        }
        res.json({
            status: true
        });

        var msg = {
            author: {
                id: params.id
            },
            type: MessageModel.MESSAGE_TYPE_CHANGE_STATUS,
            status: ManagerModel.MANAGER_STATUS_OFFLINE
        };
        server.io.emit( params.id, msg);
    });
});


// Customer ask a support
// If user is not log in
// Create a new thread, create a new user for customer
// Request
// {
//     id_token:? "id_token"
//     socket_id: socket id ( get this id when connected)
// }
// Else, check if this user is exist in db
// Respond:
// {
//     status: true
//     user: {},
//     thread: {},
//     id_token?: "id_token"
// }
router.post("/start_conversation", function(req: express.Request, res: express.Response) {
    var user = {};
    var visitorInfo = req.body.visitor_info;
    if (req.body.id_token == null) {
        // create a new user
        var userModel = new UserModel();
        var username = uuid.v1();
        var dataUser = {
            id: username,
            name: username,
            socket_id: req.body.socket_id,
            status: UserModel.USER_STATUS_ONLINE
        };
        userModel.save(dataUser, function(err: any, data: any) {
            if (data) {
                var threadModel = new ThreadModel();
                //Create a new thread
                var dataThread = {
                    thread_id: dataUser.id,
                    name: dataUser.name,
                    type: ThreadModel.THREAD_TYPE_SERVE,
                    serve_status: ThreadModel.THREAD_SERVE_STATUS_IDLE,
                };

                threadModel.save(dataThread, function(err: any, data: any) {
                    if (data) {
                        res.json({
                            status: true,
                            id_token: createToken(dataUser),
                            user: dataUser,
                            thread: dataThread,
                            visitor_info: visitorInfo
                        });

                        server.io.emit("serve_request", {
                            user: dataUser,
                            thread: dataThread
                        });
                    }
                });

            }
        });
    } else {
        var token = req.body.id_token;
        var dtoken = jwt.decode(token, { complete: true }) || {};

        var currentTime = new Date().getTime() / 1000;
        if (currentTime > dtoken.payload.exp) {
            res.json({
                status: false,
                message: "Token is expired"
            });
        } else {
            jwt.verify(req.body.id_token, config.jwt.secret, function (err: any, decoded: any) {
                var userModel = new UserModel();
                var dataUser = {
                    id: req.body.user.id,
                    name: req.body.user.name,
                    socket_id: req.body.socket_id,
                    status: UserModel.USER_STATUS_ONLINE,
                    serve_status: ThreadModel.THREAD_SERVE_STATUS_IDLE
                };
                var dataThread = req.body.thread;

                var messageModel = new MessageModel();
                var dataMessages = {};
                messageModel.find({id: req.body.thread.thread_id}, function(error: any, result: any) {
                    if (!error) {
                        dataMessages = result;
                    }
                    // Need update socket id for user
                    userModel.updateSocketID(dataUser, function(err: any, data: any) {
                            if (!err) {
                                res.json({
                                    status: true,
                                    id_token: createToken(dataUser),
                                    user: dataUser,
                                    thread: dataThread,
                                    messages: dataMessages,
                                    visitor_info: visitorInfo
                                });
                                server.io.emit("serve_request", {
                                    user: dataUser,
                                    thread: dataThread
                                });

                                // Update user status
                                var msg = {
                                    author: {
                                        id: dataUser.id,
                                        name: dataUser.name
                                    },
                                    type: MessageModel.MESSAGE_TYPE_CHANGE_STATUS,
                                    status: ManagerModel.MANAGER_STATUS_ONLINE
                                };
                                server.io.emit( dataUser.id, msg);

                            } else {
                                res.json({
                                    status: false,
                                    message: err,
                                });
                            }
                        });
                });

            });
        }
    }
});

module.exports = router;