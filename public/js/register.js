$(document).ready (() => {
    let usernameField = $('#username')[0]; //Assign the value of the text fields
    let passwordField1 = $('#password1')[0];
    let passwordField2 = $('#password2')[0];
    let registerButton = $('#registerBtn')[0];
    let errorMessage = $('#errorMessage')[0];
    let invalidUsername = false;
    let invalidPassword = false;

    $('#username').keyup (delay (checkCredentials, 150));

    //orginally only onkeyup fpr passwordFields 1 and 2 
    passwordField1.onkeyup = checkCredentials;          
    passwordField1.onkeydown = checkCredentials;        
    passwordField2.onkeyup = checkCredentials;          
    passwordField2.onkeydown = checkCredentials;        

    registerButton.onclick = registerUser;

    console.log ("register js load successful");

    function checkCredentials () {
        checkUsername ();
        confirmPassword ();
    }

    function delay (callback, ms) {
        var timer = 0;
        return function() {
            var context = this, args = arguments;
            clearTimeout (timer);
            timer = setTimeout (function () {
            callback.apply (context, args);
            }, ms || 0);
        };
    }

    function checkUsername () {
        if (usernameField.value != "") {
            $.get ('/checkUsername', {username: usernameField.value}, (invalid) => {
                if (invalid.symbol) {
                    errorMessage.innerHTML = "Username contains invalid symbols.";
                    errorMessage.style.visibility = "visible";
                    invalidUsername = true;
                    registerButton.disabled = true;
                }
                else if (invalid.taken) {
                    errorMessage.innerHTML = "User already exists with that username.";
                    errorMessage.style.visibility = "visible";
                    invalidUsername = true;
                    registerButton.disabled = true;
                }
                else {
                    if (!invalidPassword && passwordField1.value != "" && passwordField2.value != "") {
                        errorMessage.innerHTML = "";
                        errorMessage.style.visibility = "hidden";
                        registerButton.disabled = false;
                    }
                    else if (passwordField1.value == "" && passwordField2.value == "") {
                        errorMessage.innerHTML = "";
                        errorMessage.style.visibility = "hidden";
                    }
                    invalidUsername = false;
                }
            });
        }
        else
            registerButton.disabled = true;
    };

    function confirmPassword () {
        if (passwordField1.value != "" && passwordField2.value != "") {
            if (passwordField1.value == passwordField2.value) {
                if (!invalidUsername && usernameField.value != "") {
                    errorMessage.innerHTML = "";
                    errorMessage.style.visibility = "hidden";
                    registerButton.disabled = false;
                }
                invalidPassword = false;
            }
            else {
                errorMessage.innerHTML = "Passwords do not match";
                errorMessage.style.visibility = "visible";
                invalidPassword = true;
                registerButton.disabled = true;
            }
        }
        else 
            registerButton.disabled = true;
    }

    function registerUser () {
        console.log ("reached here");
        console.log (errorMessage.innerHTML);
        if (errorMessage.innerHTML == "")
            $('#registerForm')[0].submit ();
        else
            registerButton.disabled = true;
    }
});