const User = require ('../models/UserModel.js');
const bcrypt = require ('bcrypt');
const passport = require ('passport');
let LocalStrategy = require ('passport-local').Strategy;


passport.use (new LocalStrategy (function (username, password, done) {
    User.findOne ({username: username}, (err, user) => {
        if (err) return done (err);
        if (!user) return done (null, false, {message: 'We did not find an account that matches those credentials.'});

        bcrypt.compare (password, user.password, (err, res) => {
            if (err) return done (err);
            if (res == false) return done (null, false, {message: 'We did not find an account that matches those credentials.'});

            return done (null, user);
        });
    });
}));

const userController = {
    login: (req, res) => {
        res.redirect ('/calendar');
    },
};

module.exports = userController;