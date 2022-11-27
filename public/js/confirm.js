var show = document.getElementById("btn");					// Gets the button for opens the modal confirmation box
var confirmation = document.getElementById("confirmation");	// Gets the modal confirmation box
var remove = document.getElementsByClassName("delete-button")[0];	// Gets the button for closing the modal confirmation box (delete)
var cancel = document.getElementsByClassName("cancel-button")[0];	// Gets the button for closing the modal confirmation box (cancel)

// Opens Modal when button is pressed
show.onclick = function() {
	confirmation.style.display = "block";
}

// Closes Modal when confirm is pressed
remove.onclick = function() {
	confirmation.style.display = "none";
	// Add code to delete meeting from schedule and database
}

// Closes Modal when cancel is pressed
cancel.onclick = function() {
	confirmation.style.display = "none";
}