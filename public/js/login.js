$(document).ready (() => {
    let errorMessage = $('#errorMessage')[0];
    
    if (window.location.search != "") {
        if (window.location.search.split ('?')[1] == "invalid")
            errorMessage.innerHTML = "Incorrect username or password.";
    };
});