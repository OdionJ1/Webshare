let index = require('../controller/index');
let image = require('../controller/image');
let login = require('../controller/login');
let profile = require('../controller/profile');
let router = require('express').Router();
let passport = require('passport');
let isLogged = require('./isLogged');



module.exports = function(app){

    router.get('/', login.signin);
    router.get('/logged', isLogged, index.home);
    router.get('/image/:image_id', isLogged, image.index);
    router.get('/profile', isLogged, profile.index);
    router.get('/profile/:user_id', profile.retrieve);
    router.get('/chat', isLogged, profile.chatroom);
    router.get('/recover', login.recover);
    router.get('/reset/:email', login.reset);
    router.put('/update/:user_id', profile.update);
    router.get('/useremail/:user_email', profile.getEmail)
    router.get('/logout', login.logout);
    router.post('/upload', image.create);
    router.post('/image/:image_id/like', image.like);   // router for like 
    router.post('/image/:image_id/comment', image.comment);
    router.post('/signup', login.signup);
    router.post('/login', passport.authenticate('local-login' , {
        'successRedirect' : '/logged',
        'failureRedirect': '/',
        'failureFlash':true
    }));
    router.post('/search', login.search);
    router.post('/reset/:email', login.resetpassword);
    router.delete('/image/:image_id', image.remove);    // router for remove
    router.delete('/accountdelete/:user_email', profile.delete);

    app.use(router);
}