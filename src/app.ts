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
        console.log("a user connected");

        socket.on("mark_thread_as_read", (thread: any, user: any) => {

            var messageModel = new MessageModel();
            messageModel.markThreadAsRead(thread, user, (error: any, result: any) => {
                if (error) {
                    console.log(JSON.stringify(error));
                } else {
                    console.log(result);
                }
            });
        });

        socket.on("chat_message", (msg: any) => {

            var messageModel = new MessageModel();
            messageModel.save(msg, (error: any, result: any) => {
                if (error) {
                    console.log(JSON.stringify(error));
                } else {
                    this.io.emit(msg.thread.id, messageModel.createMessageFromClientData(msg));
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

var server = Server.bootstrap();
// export = server.app;

