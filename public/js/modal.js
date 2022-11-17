var display = document.getElementById("btn");			// Gets the button for opens the modal box
var modal = document.getElementById("modal");			// Gets the modal box
var hide = document.getElementsByClassName("close")[0];	// Gets the button for closing the modal box

// Opens Modal when button is pressed
display.onclick = function() {
	modal.style.display = "block";
}

// Closes Modal when x is pressed
hide.onclick = function() {
	modal.style.display = "none";
}