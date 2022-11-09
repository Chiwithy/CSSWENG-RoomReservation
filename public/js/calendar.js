/*****
* 	The code below is based on the following source:
*	Title:	Coding A Calendar In JavaScript
*	Author:	Walter Guevara
*	Date:	October 25 2021
*	Source: https://www.thatsoftwaredude.com/content/6396/coding-a-calendar-in-javascript
*****/

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var month = (new Date).getMonth ();
var curYear = (new Date).getFullYear ();

function loadCalendarMonths() {
	$.get ('/getAccountType', (accountType) => {
		let i = accountType == 'R' ? 0 : -1;
		for (; i < 4; i++) {
			var doc = document.createElement("div");
			var year = (month + i) > 11 ? curYear + 1 : curYear;
			doc.innerHTML = months[(month + i) % 12] + " " + year;
			doc.classList.add("dropdown-item");
	
			doc.onclick = (function () {
				var selectedMonth = (month + i);
				var year = (selectedMonth + i) > 11 ? curYear + 1 : curYear;
				return function () {
					month = selectedMonth % 12;
					document.getElementById("curMonth").innerHTML = months[month];
					document.getElementById("curYear").innerHTML = year;
					loadCalendarDays(year);
					return month;
				}
			})();
	
			document.getElementById("months").appendChild(doc);
	
		}
	});
}

function loadCalendarDays(year) {
    console.log (month);
    document.getElementById("calendarDays").innerHTML = "";

    var tmpDate = new Date(year, month, 0);
    var num = daysInMonth(month, year);
    var dayofweek = tmpDate.getDay();       // find where to start calendar day of week

    for (var i = 0; i <= dayofweek; i++) {
        var d = document.createElement("div");
        d.classList.add("day");
        d.classList.add("blank");
        document.getElementById("calendarDays").appendChild(d);
    }

    for (var i = 0; i < num; i++) {
        var tmp = i + 1;
        var d = document.createElement("div");
        d.id = "calendarday_" + i;
        d.className = "day";
        d.innerHTML = tmp;
        d.classList.add (new Date (year, month, tmp) < new Date ().setHours (0, 0, 0, 0) ? "availableDate" : "notAvailableDate");

        document.getElementById("calendarDays").appendChild(d);
    }

    var clear = document.createElement("div");
    clear.className = "clear";
    document.getElementById("calendarDays").appendChild(clear);
}

function daysInMonth(month, year)
{
    var d = new Date(year, month+1, 0);
    return d.getDate();
}

window.addEventListener('load', function () {
    var date = new Date();
    var year = date.getFullYear();
    month = date.getMonth();
    document.getElementById("curMonth").innerHTML = months[month];
	document.getElementById("curYear").innerHTML = year;
    loadCalendarMonths();
    loadCalendarDays(year);
});