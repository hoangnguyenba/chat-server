var config  = require('./config/config');
var MessageModel = require("./models/message-model");
var UserModel = require("./models/user-model");
var jwt     = require('jsonwebtoken');
var jwtCheck     = require('express-jwt')({
  secret: config.jwt_secret
});
var bcrypt = require('bcrypt');
 
var appRouter = function(app, passport) {
 
    app.get("/fetch", jwtCheck, function(req, res) {
        MessageModel.getAll(req.query.thread_id,function(error, result) {
            if(error) {
                return res.status(400).send(error);
            }
            return res.send(result);
        });
    });

    app.get("/get/user/:id", jwtCheck, function(req, res) {

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

    // =====================================
    // LOGIN ===============================
    // =====================================
    // app.post('/login', function(req, res, next) {
    //     passport.authenticate('local', function(err, user, info) {
    //         if (err) { return next(err); }
    //         if (!user) { return res.json({ status: false, info: info }); }
    //         req.logIn(user, function(err) {
    //             if (err) { return next(err); }
    //             res.json({ status: true, user: req.user });
    //         });
    //     })(req, res, next);
    // });

    app.post('/login', function(req, res) {

        var id = req.body.username;
        var password = req.body.password;

        var params = {
            id: id,
        };

        UserModel.get(params,function(error, result) {
            if(error) {
                return res.status(400).send(error);
            }
            user = result.Item;

            // Check password
            bcrypt.compare(password, user.password, function(err, result) {
                if(result)
                    res.json({ 
                        status: true, 
                        id_token: createToken(user) 
                    });
                else
                    res.json({ 
                        status: false
                    });
            });
        });

        
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.json({ status: true });
    });

    app.get('/is-auth', jwtCheck, function(req, res) {
        res.json({ status: true });
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/user/me', jwtCheck, function(req, res) {
        res.json({ status: true, user: req.user });
    });
 
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.json({ status: false, info: "Not logged in yet" });
}


function createToken(user) {
  delete user.password;
  return jwt.sign(user, config.jwt_secret, { expiresIn: config.session_time });
}
 
module.exports = appRouter;