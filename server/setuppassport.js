let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let UserModel = require('../models/user');

module.exports = function(){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        UserModel.findById(id, function(err, user){
            if(err){
                throw err;
            }

            done(null, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        'usernameField':'email',
        'passwordField':'password',
        'passReqToCallback': true
    }, function(req, email, password, done){
        UserModel.findOne({'email':email}, function(err, user){
            if(err){
                return done(null, err);
            }

            if(!user){
                req.flash('loginError', 'Username or password incorrect');
                return done(null, false);
            }

            if(!user.checkPassword(password)){
                req.flash('loginError', 'Username or password Incorrect')
                return done(null, false);
            }

            return done(null, user)

        });
    }));
}