import bcrypt from "bcrypt";
import User from "../models/UserModel.js";

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

    // getSuccess: (req, res) => {
    //     res.render ("tempLand");
    // },

    getRegister: (req, res) => {
        res.render ("register");
    },

    getLogin: (req, res) => {
        res.render ("login");
    },

    //for logout -- checks if user is logged in first 
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    },

    //for logout -- logs out user 
    getLogout: function (req, res) {
        req.logout(function (err) {
            if (err) return next(err);
            res.redirect('/');
        });
    },

    //------------------------KYLA CODE---------------------------
    // Adds a username to the datbase given a username and password
    //  - does not implememt passowrd confirmation 
    //  - does not check if username already exists
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