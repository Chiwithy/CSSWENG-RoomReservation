$(document).ready (() => {
    let passwordTextField1; //Assign the value of the text fields
    let passwordTextField2;

    passwordTextField1.onkeyup = comparePassword;
    passwordTextField1.onkeydown = comparePassword;

    passwordTextField2.onkeyup = comparePassword;
    passwordTextField2.onkeydown = comparePassword;

    function comparePassword () {
        if (passwordTextField1.value == passwordTextField2.value) {
            //Code when passwords are identical
        }
        else {
            //Code when passwords are different
        }
    }

});