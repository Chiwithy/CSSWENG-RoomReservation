$(document).ready (() => {
	var hide = document.getElementsByClassName("close")[0];	// Gets the button for closing the modal box
	var modal = document.getElementById ("modal");

	// Closes Modal when x is pressed
	hide.onclick = function() {
		modal.style.display = "none";
	}
});