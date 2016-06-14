// config/passport.js

var bcrypt = require('bcrypt');

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var UserModel = require("../models/user-model");

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {

        var params = {
            id: id,
            AttributesToGet: [ 
                'id',
                'name'
            ]
        };

        UserModel.get(params,function(error, result) {
            if(error) {
                done(error);
            }
            done(error, result.Item);
        });

    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(new LocalStrategy(
    function(id, password, done) { // callback with email and password from our form
        
        var params = {
            id: id
        };

        UserModel.get(params,function(error, result) {

            if(error) {
                return done(error);
            }

            var user = result.Item;

            // if no user is found, return the message
            if (!user)
                return done(null, false); 

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, user.password))
                return done(null, false);

            delete(user.password);

            // all is well, return successful user
            return done(null, user);
        });

    }));

};