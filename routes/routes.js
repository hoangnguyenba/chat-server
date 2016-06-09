var MessageModel = require("../models/message-model");
 
var appRouter = function(app) {
 
    app.get("/fetch", function(req, res) {
        MessageModel.getAll(req.query.thread_id,function(error, result) {
            if(error) {
                return res.status(400).send(error);
            }
            return res.send(result);
        });
    });
 
};
 
module.exports = appRouter;