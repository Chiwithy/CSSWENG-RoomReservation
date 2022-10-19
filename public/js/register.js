$(document).ready (() => {
    let usernameTextField = $('#username')[0]; //Assign the value of the text fields
    let passwordField1 = $('#password1')[0];
    let passwordField2 = $('#password2')[0];
    let invalidUsername = false;
    let invalidPassword = false;

    usernameTextField.onkeyup = checkCredentials;

    passwordField1.onkeyup = checkCredentials;
    passwordField2.onkeyup = checkCredentials;

    console.log ("register js load successful");

    function checkCredentials () {
        checkUsername ();
        confirmPassword ();
    }
    function checkUsername () {
        if (usernameTextField.value != "") {
            $.get ('/checkUsername', {username: usernameTextField.value}, (invalid) => {
                if (invalid.symbol) {
                    $('#errorMessage')[0].innerHTML = "Username contains invalid symbols.";
                    $('#errorMessage')[0].style.visibility = "visible";
                    console.log ("username synbol");
                    console.log (invalid);
                    invalidUsername = true;
                }
                else if (invalid.taken) {
                    $('#errorMessage')[0].innerHTML = "User already exists with that username.";
                    $('#errorMessage')[0].style.visibility = "visible";
                    console.log ("username exists");
                    console.log (invalid);
                    invalidUsername = true;
                }
                else {
                    if (!invalidPassword) {
                        $('#errorMessage')[0].innerHTML = "";
                        $('#errorMessage')[0].style.visibility = "hidden";
                        console.log ("username good");
                        console.log (invalid);
                    }

                    invalidUsername = false;
                }
            });
        }
    };

    function confirmPassword () {
        if (passwordField1.value == passwordField2.value) {
            if (!invalidUsername) {
                $('#errorMessage')[0].innerHTML = "";
                $('#errorMessage')[0].style.visibility = "hidden";
                console.log ("password good");
            }
            invalidPassword = false;
        }
        else {
            $('#errorMessage')[0].innerHTML = "Passwords do not match";
            $('#errorMessage')[0].style.visibility = "visible";
            console.log ("password bad");
            
            invalidPassword = true;
        }
    }
});