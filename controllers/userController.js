const User = require ('../models/UserModel.js');

const userController = {
    checkUsername: async (req, res) => {
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
};

module.exports = userController;