const User = require ('../models/UserModel.js');

const userController = {
    checkLogin: async (req, res) => {
        let userResult = User.findOne ({username: req.body.username, password: req.body.password});

        if (userResult != null)
            res.send (true);    //Credentials are verified
        else
            res.send (false);   //Credentials are incorrect
    }
};

module.exports = userController;