$(document).ready (() => {
	var confirmation = document.getElementById("confirmation");	// Gets the modal confirmation box
	var cancel = document.getElementById("confirmClose");	// Gets the button for closing the modal confirmation box (cancel)

	// Closes Modal when cancel is pressed
	cancel.onclick = function() {
		confirmation.style.display = "none";
	}
});