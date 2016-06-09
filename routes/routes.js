var MessageModel = require("../models/message-model");

var cors = require('cors');
 
var appRouter = function(app) {
 
    app.get("/fetch", cors(), function(req, res) {
        MessageModel.getAll(req.query.thread_id,function(error, result) {
            if(error) {
                return res.status(400).send(error);
            }
            return res.send(result);
        });
    });
 
};
 
module.exports = appRouter;