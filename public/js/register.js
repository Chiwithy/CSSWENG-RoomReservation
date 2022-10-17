$(document).ready (() => {
    let usernameTextField; //Assign the value of the text fields

    usernameTextField = checkUsername;


    function checkUsername () {
        $.get ('/checkUsername', {newUsername: usernameTextField.value}, (invalid) => {
            if (invalid.symbol) {
                //Code if username contains invalid characters
            }
            else if (invalid.taken) {
                //Code if username is taken (i.e., user[name] already exists)
            }
        })
    }
});