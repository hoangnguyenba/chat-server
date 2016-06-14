var MessageModel = require("./models/message-model");
var UserModel = require("./models/user-model");
 
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

    // =====================================
    // LOGIN ===============================
    // =====================================
    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.json({ status: false, info: info }); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                res.json({ status: true, user: req.user });
            });
        })(req, res, next);
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.json({ status: true });
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/user/me', isLoggedIn, function(req, res) {
        res.json({ status: true, user: req.user });
    });
 
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.json({ status: false, info: "Not logging yet" });
}
 
module.exports = appRouter;