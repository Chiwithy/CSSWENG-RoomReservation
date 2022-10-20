$(document).ready (() => {
    let usernameField = $('#username')[0]; //Assign the value of the text fields
    let passwordField1 = $('#password1')[0];
    let passwordField2 = $('#password2')[0];
    let registerButton = $('#registerBtn')[0];
    let invalidUsername = false;
    let invalidPassword = false;

    usernameField.onkeyup = checkCredentials;

    passwordField1.onkeyup = checkCredentials;
    passwordField2.onkeyup = checkCredentials;

    registerButton.onclick = registerUser;

    console.log ("register js load successful");

    function checkCredentials () {
        checkUsername ();
        confirmPassword ();
    }

    function checkUsername () {
        if (usernameField.value != "") {
            $.get ('/checkUsername', {username: usernameField.value}, (invalid) => {
                if (invalid.symbol) {
                    $('#errorMessage')[0].innerHTML = "Username contains invalid symbols.";
                    $('#errorMessage')[0].style.visibility = "visible";
                    invalidUsername = true;
                    registerButton.disabled = true;
                }
                else if (invalid.taken) {
                    $('#errorMessage')[0].innerHTML = "User already exists with that username.";
                    $('#errorMessage')[0].style.visibility = "visible";
                    invalidUsername = true;
                    registerButton.disabled = true;
                }
                else {
                    if (!invalidPassword) {
                        $('#errorMessage')[0].innerHTML = "";
                        $('#errorMessage')[0].style.visibility = "hidden";

                        if (passwordField1.value != "" && passwordField2.value != "")
                            registerButton.disabled = false;
                    }
                    invalidUsername = false;
                }
            });
        }
        else registerButton.disabled = false
    };

    function confirmPassword () {
        if (passwordField1.value == passwordField2.value) {
            if (!invalidUsername) {
                $('#errorMessage')[0].innerHTML = "";
                $('#errorMessage')[0].style.visibility = "hidden";

                if (usernameField.value != "")
                    registerButton.disabled = false;
            }
            invalidPassword = false;
        }
        else {
            $('#errorMessage')[0].innerHTML = "Passwords do not match";
            $('#errorMessage')[0].style.visibility = "visible";
            invalidPassword = true;
            registerButton.disabled = true;
        }

        return;
    }

    function registerUser () {
        if (!invalidUsername && !invalidPassword && usernameField.value != "" && passwordField1.value != "" && passwordField2.value != "")
            $('#registerForm')[0].submit ();
    }
});