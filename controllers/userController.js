import bcrypt from "bcrypt";
import User from "../models/UserModel.js";

const userController = {
    checkUsername: async (req, res) => {
        if (req.query.username) {
            let username = (req.query.username).toUpperCase ();
            let foundUser = await User.findone ({username: username});
            let values = {
                symbol: false,  //true if username contains invalid symbols
                taken: false    //true if username is taken
            };


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
    getSuccess: (req, res) => {
        res.render ("tempLand");
    },

    getRegister: (req, res) => {
        res.render ("register");
    },


    // getRegister: function (req, res) { //test of database 
       
    //     {var username = "Me";
    //         var password = "Moi";
    //         var newUser = {
    //             username: username,
    //             password: password
    //         }
    //         User.create(newUser, err => {
    //             if (err) {
    //                 console.log(err);
    //                 return;
    //             }
    //         console.log("postRegister: Successfully added to DB");
    //         })
    //         //res.redirect('/login');}
                
    //     res.render("register");
    //     }

    //     //real code: res.render("register"); 
    // }

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
                username: username,
                password: password
            }
            User.create(newUser, err => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("postRegister: Successfully added to DB");
            })
            res.redirect('/successReg');
        }
        catch {
            console.log (req.body);
            res.redirect('/register?err=fail');
            console.log("postRegister: Unsuccessful");  
        }
    }

}; 

export default userController;

