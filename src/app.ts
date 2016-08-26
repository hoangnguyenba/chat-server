/// <reference path="_all.d.ts" />
"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as cors from "cors";
import * as io from "socket.io";
import * as http from "http";

import { config } from "./config/config";

import * as indexRoute from "./routes/index";
import { MessageModel } from "./models/message";
import { UserModel } from "./models/user";
import { ThreadModel } from "./models/thread";

/**
 * The server.
 *
 * @class Server
 */
class Server {

  public app;
  public io: SocketIO.Server;
  public http: http.Server;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = io(this.http);

    //configure application
    this.config();

    //configure routes
    this.routes();

    //start listen socket
    this.io.on("connection", (socket: any) => {
        console.log("a user connected " + socket.id);

        socket.on("mark_thread_as_read", (thread: any, user: any) => {

            var messageModel = new MessageModel();
            messageModel.markThreadAsRead(thread, user, (error: any, result: any) => {
                if (error) {
                    console.log(JSON.stringify(error));
                } else {

                    // manager mark as read
                    var userid = user.id;
                    if (thread.type === ThreadModel.THREAD_TYPE_SERVE && user.type === 1) {
                        // broadcast to other manager
                        var broadcasMsg = {
                                            author: user, // We pass this user back, 
                                                         //so the manager send this no need to update thread
                                            thread_id: thread.id,
                                            type: MessageModel.MESSAGE_TYPE_MARK_THREAD_AS_READ
                                        };
                        this.io.emit( thread.id, broadcasMsg);
                    }

                    console.log(result);
                }
            });
        });

        socket.on("chat_message", (msg: any) => {
            if (msg.type === undefined || msg.type === MessageModel.MESSAGE_TYPE_TEXT) {
                var messageModel = new MessageModel();
                messageModel.save( messageModel.createMessageFromClientData(msg), (error: any, result: any) => {
                    if (error) {
                        console.log(JSON.stringify(error));
                    } else {
                        this.io.emit(msg.thread.id, messageModel.createMessageFromClientData(msg));
                        if (typeof(msg.author.type) === "undefined") {// message from customer
                            // Save last message and last time message of user
                            var params = {
                                id: msg.author.id,
                                last_message: msg.text,
                                last_message_time: new Date().getTime()
                            };

                            var userModel = new UserModel();
                            userModel.updateLastMessage(params, (error: any, result: any) => {
                                console.log(error);
                            });

                            // If current thead status == THREAD_SERVE_STATUS_IDLE
                            // Change thread status = THREAD_SERVE_STATUS_INCOMING_CHAT
                            if (msg.thread.serve_status === ThreadModel.THREAD_SERVE_STATUS_IDLE) {
                                var params1 = {
                                    id: msg.thread.id,
                                    serve_status: ThreadModel.THREAD_SERVE_STATUS_INCOMING_CHAT
                                };

                                userModel.updateServeStatus(params1, (error: any, result: any) => {
                                    if (!error) {
                                        var broadcasMsg = {
                                            author: msg.author, // Do we need this info ?
                                            thread_id: msg.thread.id,
                                            type: MessageModel.MESSAGE_TYPE_CHANGE_THREAD_STATUS,
                                            status: ThreadModel.THREAD_SERVE_STATUS_INCOMING_CHAT
                                        };
                                        this.io.emit( msg.thread.id, broadcasMsg);
                                    } else {
                                        console.log(error);
                                    }
                                });
                            }
                        } else {
                            if (msg.thread.serve_status === ThreadModel.THREAD_SERVE_STATUS_INCOMING_CHAT) {
                                var params1 = {
                                    id: msg.thread.id,
                                    serve_status: ThreadModel.THREAD_SERVE_STATUS_SERVED
                                };

                                var userModel = new UserModel();
                                userModel.updateServeStatus(params1, (error: any, result: any) => {
                                    if (!error) {
                                        var broadcasMsg = {
                                            author: msg.author, // Do we need this info ?
                                            thread_id: msg.thread.id,
                                            type: MessageModel.MESSAGE_TYPE_CHANGE_THREAD_STATUS,
                                            status: ThreadModel.THREAD_SERVE_STATUS_SERVED
                                        };
                                        this.io.emit( msg.thread.id, broadcasMsg);
                                    } else {
                                        console.log(error);
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                // Update user status
                var params = {
                    id: msg.author.id,
                    status: msg.status,
                    socket_id: socket.id
                };

                var userModel = new UserModel();

                userModel.setStatus(params, (error: any, result: any) => {
                    console.log(error);
                    if (!error) {
                        this.io.emit( msg.author.id, msg);
                    }
                });
            }

        });

        socket.on("user_status_change", (data: any) => {

            // Update user status online
            var params = {
                id: data.id,
                status: data.status,
                socket_id: socket.id
            };

            var userModel = new UserModel();

            userModel.setStatus(params, (error: any, result: any) => {
                if (!error) {
                    this.io.emit("user_status_change", data);
                }
            });


        });

        socket.on("disconnect", () => {

            var params = {
                socket_id: socket.id.substring(2)
            };

            // Find user with this socket id
            var userModel = new UserModel();

            userModel.findUserBySocketID(params, (error: any, user: any) => {
                if (!error) {
                    console.log(user);
                    if (user.Items.length > 0) {
                        // Update user status offline
                        var params = {
                            id: user.Items[0].id,
                            status: UserModel.USER_STATUS_OFFLINE
                        };

                        var userModel = new UserModel();

                        userModel.setStatus(params, (error: any, result: any) => {
                            if (!error) {
                                var m = {
                                    author: {
                                        id: params.id,
                                        name: user.Items[0].name
                                    },
                                    type: MessageModel.MESSAGE_TYPE_CHANGE_STATUS,
                                    status: UserModel.USER_STATUS_OFFLINE
                                };
                                this.io.emit(params.id, m);
                            }
                        });
                    }
                }
            });
        });
    });


    this.http.listen(config.port, () => {
      console.log("listening on *:" + this.http.address().port);
    });
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   * @return void
   */
  private config() {

    //mount logger
    //this.app.use(logger("dev"));

    this.app.use(cors());

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      var error = new Error("Not Found");
      err.status = 404;
      next(err);
    });
  }

  /**
   * Configure routes
   *
   * @class Server
   * @method routes
   * @return void
   */
  private routes() {
    this.app.use(require("./routes"));
  }
}

export var server = Server.bootstrap();

