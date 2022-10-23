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
    checkUsername: async (req, res) => {
        if (req.query.username) {
            let username = (req.query.username).toUpperCase ();
            let foundUser = await User.findOne ({username: username});
            let values = {
                symbol: false,  //true if username contains invalid symbols
                taken: false    //true if username is taken
            };
            let i;
            
            //Checks if username is already taken
            if (foundUser != null) {
                values.taken = true;
                res.send (values);
                return;
            }

            //Checks if the username contains invalid symbols
            for (i = 0; i < username.length; i++) {
                let curAscii = username.charCodeAt (i);
                //If statement checks if the current character is an invalid symbol (listed below)
                if (!(  (curAscii >= 48 && curAscii <= 57) ||   //Digits
                        (curAscii >= 65 && curAscii <= 90) ||   //Uppercase
                        (curAscii >= 97 && curAscii <= 122) ||  //Lowercase
                        (curAscii == 95) ))                     //Underscore
                        {
                        values.symbol = true;
                        res.send (values);
                        return;
                    }
            }
            res.send (values);
        }
    },

    getRegister: (req, res) => {
        res.render ("register");
    },

    getLogin: (req, res) => { //make into getLogin for consistency?? also change all my functions to =>
        res.render ("login");
    },

    getLogout: function (req, res) {
        req.logout(function (err) {
            if (err) return next(err);
            res.redirect('/');
        });
    },

    isLoggedIn (req, res, next) {
        if (req.isAuthenticated ()) return next ();
        res.redirect ('/login');
    },

    isLoggedOut (req, res, next) {
        if (!req.isAuthenticated ()) return next ();
        res.redirect ('/calendar');
    },

    postLogin: passport.authenticate ('local', {
        successRedirect: '/',
        failureRedirect: '/login?err=true',
    }),

    postRegister: async function (req, res) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            var username = req.body.username;
            var password = hashedPassword;
            var newUser = {
                username: username.toUpperCase (),
                password: password,
                employeeType: 'R'
            }
            User.create(newUser, err => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("postRegister: Successfully added to DB");
            })
            res.redirect('/login');
        }
        catch {
            res.redirect('/register?err=fail');
            console.log("postRegister: Unsuccessful");  
        }
    }

}; 


export default userController;