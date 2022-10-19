$(document).ready (() => {
    let usernameTextField = $('#username')[0]; //Assign the value of the text fields
    let passwordField1 = $('#password1')[0];
    let passwordField2 = $('#password2')[0];

    usernameTextField.onkeyup = checkUsername;
    usernameTextField.onkeydown = checkUsername;

    passwordField1.onkeyup = confirmPassword;
    passwordField1.onkeydown = confirmPassword;
    passwordField2.onkeyup = confirmPassword;
    passwordField2.onkeydown = confirmPassword;

    console.log ("register js load successful");

    function checkUsername () {
        $.get ('/checkUsername', {newUsername: usernameTextField.value}, (invalid) => {
            if (invalid.symbol) {
                console.log ("username has invalid symbols");
            }
            else if (invalid.taken) {
                console.log ("username is already taken ._.");
            }
        })
    };

    function confirmPassword () {
        if (passwordField1.value == passwordField2.value)
            console.log ("Is same");
        else
            console.log ("Not the same");
    }
});