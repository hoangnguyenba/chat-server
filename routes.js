var MessageModel = require("./models/message-model");
var UserModel = require("./models/user-model");
// var cors = require('cors');
 
var appRouter = function(app, passport) {
 
    app.get("/fetch", function(req, res) {
        MessageModel.getAll(req.query.thread_id,function(error, result) {
            if(error) {
                return res.status(400).send(error);
            }
            return res.send(result);
        });
    });

    app.get("/get/user/:id", function(req, res) {

        var params = {
            id: req.params.id,
            AttributesToGet: [ 
                'id',
                'name'
            ]
        };

        UserModel.get(params,function(error, result) {
            if(error) {
                return res.status(400).send(error);
            }
            return res.send(result);
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local'), function (req, res) {
        res.json({ status: true, user: req.user });
    });
 
};

 
module.exports = appRouter;