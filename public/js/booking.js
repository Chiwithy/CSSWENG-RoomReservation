function bookedSlot(id) {
	document.getElementById(id).style.backgroundColor = '#3159BC';
	document.getElementById(id).innerHTML =		'<i class="fa-solid fa-pen-to-square" style="font-size:12px;"></i>'
	document.getElementById(id).innerHTML +=	'<div class="px-1 inline"></div><div class="px-1 inline"></div><div class="px-1 inline"></div>'
	document.getElementById(id).innerHTML +=	'<i class="fa-solid fa-x" style="font-size:12px;"></i><br>'
	document.getElementById(id).innerHTML += 	'<b>Booked</b>';
}