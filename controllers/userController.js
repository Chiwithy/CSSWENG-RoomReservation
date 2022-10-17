// TODO import models
import bcrypt from "bcrypt";

// exports.createUser = (req, res) => {
//     // TODO add code to create user account from HTML form
// }

const userController = {
    
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
                console.log(">>>   postRegister: Successfully added to DB");
            })
            //res.redirect('/login');
        }
        catch {
            //res.redirect('/register');
            console.log(">>>   postRegister: Unsuccessful");  
        }
    }
    
}

export default userController;