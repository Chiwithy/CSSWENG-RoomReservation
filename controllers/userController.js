import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.serializeUser (function (user, done) {
    done(null, user.id);
});

passport.deserializeUser (function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

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

    postLogin: passport.authenticate ('local', {
        successRedirect: '/',
        failureRedirect: '/login?err=true',
    }),
};

export default userController;