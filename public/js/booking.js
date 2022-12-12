//Parallel arrays || {rooms} array is parallel to {meetings} array || rooms[0] = "Integrity" => meetings[0][n] = meetings in Integrity
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const rooms =  ["Integrity", "Innovation", "Teamwork"];

let meetings = [];  //meetings array used when retrieving meeting data
let tempMeetings = [];  //temp meetings array used when manipulating the meetings array (without affecting meetings)
let tempMeeting = [];
let accountType;
const startTime = "8:00 AM";    //first open start time string
const endTime = "06:00 PM";     //last open end time string
const interval = 30;            //interval per slot (in minutes)


$(document).ready (() => {
    for (let i = 0; i < rooms.length; i++)
        meetings.push ([]);
    
    $.get('/getAccountType', (accType) => {
        accountType = accType;
    });

    $('#logout').click (() => {
        $.post ('/logout', () => {
            location.href = '/';
        })
    });
    
	getMeetings();

    //disable book button until all required fields are filled (specifically room)
    $('#submitBtn')[0].disabled = true;

    if ($('#submitBtn')[0].classList.contains("book")){
        //$('#cancelBtn').css("visibility", "hidden");
        $('#cancelBtn').css("display", "none");
    }

    //disable time dropdowns until a room is selected
    $("#startTime")[0].disabled = true;
    $("#endTime")[0].disabled = true;

    $("#cancelBtn").on("click", () => {
        window.location.reload ();
    }); 

    //merged update and book meeting
    $("#submitBtn").on ('click', function () {
        let option = $("#submitBtn")[0].classList[0];
        let meetingID = $("#submitBtn").parent ()[0].classList[1];
        var startTime = formatTimeToDate ($("#startTime").val ()); 
        var endTime = formatTimeToDate ($("#endTime").val ());
        var meetingRoom = $("#room").val ();
        var marketingRequest = $("#marketingReqs").val(); 
        var attendeeList = $('#attendees').val(); 

        //checks the database if the planned time slot is available for that room
        $.get ("/checkTimeSlot", {startTime: startTime, endTime: endTime, meetingRoom: meetingRoom}, (avail) => {
            //avail -> meetingID from of the conflicting meeting (from the database) if there is one
            //proceed with book if avail returns -1 (no conflict) || proceed with update if -1 or if conflict is itself
            console.log (typeof avail);
            console.log (avail);
            console.log (typeof meetingID);
            console.log (meetingID);
            console.log (avail + ' vs ' + meetingID + " = " + (parseInt (avail) == parseInt (meetingID)));
            if (parseInt (avail) == -1 || parseInt (avail) == parseInt (meetingID)) {
                //post url changes based on option ("book" or "update")
                $.post ("/" + option + "Meeting?" + new URLSearchParams ({
                    meetingID: meetingID,
                    startTime: startTime,
                    endTime: endTime,
                    meetingRoom: meetingRoom,
                    marketingRequest: marketingRequest,
                    attendeeList: attendeeList
                }));
                window.location.reload ();
            }
            else
                console.log ("Slot taken");
        });
    })

    //have start and end change depending on click of 
    $("#room").on('change', function(){
        $("#submitBtn")[0].disabled = true;
        $("#submitBtn").css ("cursor", "default");

        editTimeOptions ("start", $("#room").val ());
        editTimeOptions ("end", $("#room").val ());
    });

    //onclick of start time -- allow only end times after it that are consecutive (no gaps) in dropdown options for endtime 
    $("#startTime").on('change', function(){
        if ($("#endTime").val () != null)
            adjustTimeOptions ("start");
        else
            $("#endTime")[0].disabled = false;
    })

    //onclick of end time -- allow only start times after it that are consecutive (no gaps) in dropdown options for startTime 
    $("#endTime").on('change', function(){
        adjustTimeOptions ("end");
        $("#submitBtn")[0].disabled = false;
        $("#submitBtn").css ("cursor", "pointer");
    })

    //gets all possible meetings for that day -- the ones booked already 
    function getMeetings () {
        const params = new URLSearchParams (window.location.search);
        let year = parseInt (params.get ("year"));
        let month = parseInt (params.get ("month"));
        let date = parseInt (params.get ("date"));
        meetings = [];

        for (let i = 0; i < rooms.length; i++)
            meetings.push ([]);

        $.get ("/getMeetings", {year: year, month: month, date: date}, (meetingInfos) => {
            let i;

            for (i = 0; i < meetingInfos.length; i++) {
                meetingInfos[i].startTime = new Date (meetingInfos[i].startTime);
                meetingInfos[i].endTime = new Date (meetingInfos[i].endTime);
                meetings[rooms.indexOf (meetingInfos[i].meetingRoom)].push (meetingInfos[i]);

                if (i == 0)
                    if (!checkIfBeyondToday (meetingInfos[i].startTime))
                        $("#editModalBtn").remove ();
            }

			renderMeetings ();
            copyTemp ();
        });
    }

    //renders the meetings that are already taken 
    function renderMeetings () {
        const params = new URLSearchParams (window.location.search);
        let year = parseInt (params.get ("year"));
        let month = parseInt (params.get ("month"));
        let date = parseInt (params.get ("date"));
        
        $.get ("/renderMeetingRows", {meetings: meetings, year: year, month: month, date: date}, (html) => {
            $("#schedDetails")[0].innerHTML = html;
            colorBookedSlots ();
            addSlotControls ()
            clickableSlots ();
        });
    }

    //colors the slots, own meetings have a diff color
    function colorBookedSlots () { 
        let slots = $('.takenSlot');

        for (let i = 0; i < slots.length; i++) {
            if (slots[i].classList.contains ("own"))
                slots[i].style.backgroundColor = "#3159BC";    
            else
                slots[i].style.backgroundColor = "#808080";
        }
    }

    //adds the edit/delete buttons on the table
    function addSlotControls () {
        const now = new Date ();
        let slots = $('.takenSlot');

        for (let i = 0; i < slots.length; i++) {
            meeting = getMeetingFromClassList (slots[i].classList);
            if (slots[i].classList.contains ("own") || accountType == "H") {    //put controls if its your own meeting or if you're HR
                if (checkIfBeyondToday (meeting.startTime))
                    slots[i].innerHTML = '<i class="fa-solid fa-pen-to-square editMeeting" style="font-size:12px;"></i>'
                else
                    slots[i].innerHTML = "";
                slots[i].innerHTML += '<div class="px-1 inline"></div><div class="px-1 inline"></div><div class="px-1 inline"></div>'
                slots[i].innerHTML += '<i class="fa-solid fa-x cancelMeeting" style="font-size:12px;"></i><br>'
            }
            slots[i].innerHTML += '<b>Booked</b>';
        }

        $(".cancelMeeting").click (cancelModal);
        $(".editMeeting").click (prepareEditMeeting);
    }

    //allow slots to be clickable for their details
    function clickableSlots () {
        for (let i = 0; i < rooms.length; i++) {
            for (let j = 0; j < meetings[i].length; j++) {
                if (meetings[i][j].username != "" || accountType != "R") {
                    $("td." + rooms[i] + "_" + j).click (clickRoom);
                    $("td." + rooms[i] + "_" + j).css ('cursor', "pointer");
                }
            }
        }
    }

    //show the modal of the meeting details
    function clickRoom () {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const bookingID = getMeetingIDFromClassList ($(this)[0].classList);     //gets the meetings array ID from its class
        const splitID = bookingID.split ("_");
        const roomInd = rooms.indexOf (splitID[0]);
        const ind = parseInt (splitID[1]);
        const meeting = meetings[roomInd][ind];
        let meetingParent = $("#meetingDetails").parent (); //parent element of the meeting details element || to store meetings array ID
        //full date string
        let fullDate = meeting.startTime.getDate () + " " + months[meeting.startTime.getMonth ()] + " " + meeting.startTime.getFullYear () + ", " + days[meeting.startTime.getDay ()];


        //remove previously viewed meetings array ID from the class list of the parent
        meetingParent.removeClass (meetingParent[0].classList[meetingParent[0].classList.length - 1]);
        meetingParent.addClass (bookingID); //add meetings array ID of meeting being viewed currently
        $("#dateModal")[0].innerHTML = fullDate;
        $("#startTimeModal")[0].innerHTML = formatTimeToString (meeting.startTime);
        $("#endTimeModal")[0].innerHTML = formatTimeToString (meeting.endTime);
        $("#roomModal")[0].innerHTML = meeting.meetingRoom;
        $("#requestsModal")[0].innerHTML = meeting.marketingRequest;

        if (meeting.username == "") {
            //If it isn't your meeting remove attendeesList and username details
            $("#attendeesModalRow").remove ();
            $("#usernameModalRow").remove ();
        }
        else {
            if ($("#usernameModalRow").length > 0)  //If the username modal row exists (not removed by above), just insert
                $("#usernameModal")[0].innerHTML = meeting.username;
            else    //If it was deleted, create it again
                createModalRow ("username", "date", "Booked by:", meeting.username);

            if ($("#attendeesModalRow").length > 0) //Same as above but for attendeeList
                $("#attendeesModal")[0].innerHTML = meeting.attendeeList;
            else
                createModalRow ("attendees", "room", "Attendees:", meeting.attendeeList);
        }

        //If it's your own meeting or you're HR, show buttons for editing of deleting
        if ($(this)[0].classList.contains ("own") || accountType == "H")
            $("#details-buttons").css ('display', 'flex');
        else
            $("#details-buttons").css ('display', 'none');

        $("#modal").css ('display', 'block');
    }

    //Displays cancel confirmation box
    function cancelModal () {
        let meeting, meetingID, i = 0;
        let curParent = $(this)[0].parentNode;
        let slots = $(".takenSlot");
        
        while (!meeting && curParent.tagName.toUpperCase () != "BODY" && i < 15) {
            try {
                meeting = getMeetingFromClassList (curParent.classList);
                i = 15;
            } catch (err) {
                i++;
                curParent = curParent.parentNode;
            }
        }

        $("#confirmation").css ("display", "block");

        $("#confirmCancel").on ("click", () => {
            $("#confirmation").css ("display", "none");
            $("#modal").css ("display", "none");
            cancelMeeting (meeting);
        });

        $("#confirmClose").off().on("click", () => {
            $("#confirmation").css ("display", "none");
            $("#modal").css ("display", "none");

            if ($("#bookingDetails")[0].classList.contains (meetingID))
                $("td." + meetingID).css ("background-color", "#1c73ed");
            else if ($("td." + meetingID)[0].classList.contains("own"))
			    $("td." + meetingID).css ("background-color", "#3159BC");    
		    else
			    $("td." + meetingID).css ("background-color", "#808080");
        }); 

        //colorBookedSlots(); 

        meetingID = getMeetingIDFromClassList (curParent.classList);
        $("td." + meetingID).css ("background-color", "#B62303");

        event.stopPropagation ();
    }

    //cancels the meeting
    function cancelMeeting (meeting) {
        $.post ("/cancelMeeting?" + new URLSearchParams({meetingID: meeting.meetingID, username: meeting.username}), (success) => {
            if (success) {
                getMeetings ();
                copyTemp ();
                if ($("#room").val () != null) {
                    editTimeOptions ("start", $("#room").val ());
                    editTimeOptions ("end", $("#room").val ());
                }
            }
            else
                console.log ("Cancel unsuccessful");
        });
    }

    //prepares to edit the meeting
    function prepareEditMeeting () {
        let meeting, meetingID, i = 0;
        let curParent = $(this)[0].parentNode;
        let submitParent = $("#submitBtn").parent ().parent();
        let roomIndex, meetingIndex;

        $('#cancelBtn').css("display", "block"); 
        
        while (!meeting && curParent.tagName.toUpperCase () != "BODY" && i < 15) {
            try {
                meetingID = getMeetingIDFromClassList (curParent.classList);
                meeting = getMeetingFromMeetingID (meetingID);
                submitParent.removeClass (submitParent[0].classList[1]);
                submitParent.addClass (meetingID);
                i = 15;
            } catch (err) {
                i++;
                curParent = curParent.parentNode;
            }
        }

        colorBookedSlots ();

        if(tempMeeting.length != 0){
            tempMeetings[tempMeeting[0]].splice(tempMeeting[1], 0, tempMeeting[2]); 
            tempMeeting.splice(0, tempMeeting.length); 
        }

        changeFormButton ("update");
        document.querySelector('#submitBtn').disabled = true;
        $("td." + meetingID).css ("background-color", "#1c73ed");   //changes the color of meeting being edited atm

        roomIndex = rooms.indexOf(meeting.meetingRoom); 
        meetingIndex = meetings[roomIndex].indexOf(meeting);

        //saves a temporary version of the meeting currently being edited 
        tempMeeting[0] = roomIndex;
        tempMeeting[1] = meetingIndex; 
        tempMeeting[2] = meeting; 

        //removes currently-being-edited meeting from tempMeetings array
        tempMeetings[roomIndex].splice(meetingIndex, 1);

        $("#room").val(meeting.meetingRoom).attr("selected", "selected"); 
        $('#room').trigger("change");

        $("#startTime").val (formatTimeToString (meeting.startTime)).attr ("selected", "selected");
        $("#startTime").trigger ("change");

        $("#endTime").val (formatTimeToString (meeting.endTime)).attr ("selected", "selected");
        $("#endTime").trigger ("change");
        
        $("#attendees").val(meeting.attendeeList); //autofills attendees  
        $("#marketingReqs").val(meeting.marketingRequest); //autofulls marketing requests

        $("#modal").css ("display", "none");    //closes modal incase edit came from modal buttons

        event.stopPropagation ();
    }

    //changes the button from submit <-> book (same id but different class [functionality is based on class])
    function changeFormButton (changeTo) {
        $("#submitBtn").removeClass ($("#submitBtn")[0].classList[0]);
        $("#submitBtn").addClass (changeTo);
        $("#submitBtn")[0].innerHTML = changeTo.toUpperCase ();
    }

    //creates a modal row for the details modal
    function createModalRow (elementToCreate, elementAfter, titleText, elementData) {
        let newModalRow = document.createElement ("tr");
        let newTitle = document.createElement ("td");
        let newModal = document.createElement ("td");

        newTitle.innerHTML = titleText;
        newModal.innerHTML = elementData;
        newModal.setAttribute ("id", elementToCreate + "Modal");
        newModalRow.appendChild (newTitle);
        newModalRow.appendChild (newModal);
        newModalRow.setAttribute ("id", elementToCreate + "ModalRow");
        $("#" + elementAfter + "ModalRow")[0].parentNode.insertBefore (newModalRow, $("#" + elementAfter + "ModalRow")[0].nextSibling);
    }

    //formats a Date object to time string format (e.g., "08:00 AM")
    function formatTimeToString (time) {
        let hours = time.getHours ();
        let minutes = time.getMinutes ();
        let ampm = hours >= 12 ? "PM" : "AM";
        let timeString;

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes == 0 ? "00" : minutes;

        if (hours == 12)
            ampm = "NN";

        hours = hours < 10 ? "0" + hours : hours;
        timeString = hours + ":" + minutes + " " + ampm;

        return timeString;
    }

    //Formats a time string (e.g., "08:00 AM", "12:00 NN", "02:30 PM")
    //returns a date object set to selected date and time (of time string)
    function formatTimeToDate (timeString) {
        const timeSplit = timeString.split (" ");
        const params = new URLSearchParams (window.location.search);

        let year = parseInt (params.get ("year"));
        let month = parseInt (params.get ("month"));
        let date = parseInt (params.get ("date"));
        let ampm = timeSplit[1];
        let hour = parseInt (timeSplit[0].split (":")[0]);
        let minute = parseInt (timeSplit[0].split (":")[1]);

        if (hour == 12 && ampm == "AM")
            hour = 0;
        else
            hour = ampm == "PM" ? hour + 12 : hour;

        return new Date (year, month, date, hour, minute, 0);
    }

    //Edits the start/end time options of the room
    //option : "start" -> startTime || "end" -> end
    function editTimeOptions (option, room) {
        let openTimes = getOpenTimes (option, room);

        $("#" + option + "Time").empty();
        $("#" + option + "Time")[0].disabled = (option == "start") ? false : ($("#startTime").val () == null);
        $("#" + option + "Time").append("<option value='' disabled selected class='select'>Select a " + option + " start time</option>");
        addTimeOptions (openTimes, option);
    }

    //Gets the open start/end time options of the room
    //Returns string array of open time slots (in format like "08:00 AM")
    function getOpenTimes (option, room) {
        const isStart = (option == "start");

        //If editing startTimes (option == "start"), interval is positive (it'll count up)
        //If editing endTimes (option == "end"), interval is negative (it'll count down)
        const intervalCrement = isStart ? interval : interval * -1;
        let openTimes = [];
        let roomInd = rooms.indexOf (room);
        let roomMeetings = tempMeetings[roomInd];
        let curOpenTime = isStart ? formatTimeToDate (startTime) : formatTimeToDate (endTime);      //startTimes -> begin from first start time, endTimes -> begin from last end time
        let lastOpenTime = isStart ? formatTimeToDate (endTime) : formatTimeToDate (startTime);     //startTimes -> end at last end time, endTimes -> end at first start time
        let currentTime = new Date ();
        let i, takenSlots = 0;  //takenSlots -> number of time slots to skip (cus it is [still] taken -> no point in checking)
        //if startTimes able to pick a startTime of even now
        //if endTimes not able to pick endTime that is now (cant pick a 2:30 end time if it is alrdy 2:30 [or anywhere from 2:00 - 2:30])
        isStart ? currentTime : currentTime.setMinutes (currentTime.getMinutes () + interval);

        //while current time slot being checked isnt the last
        while (curOpenTime.getTime () != lastOpenTime.getTime ()) {
            //current time slot being checked is past current time && current time slot is not taken
            if (curOpenTime.getTime () >= currentTime.getTime () && takenSlots == 0) {
                //go through the meetings for that room
                for (i = 0; i < roomMeetings.length; i++) {
                    let timeToCompare = isStart ? roomMeetings[i].startTime : roomMeetings[i].endTime;
                    
                    //check if the timeslot is already taken
                    if (curOpenTime.getTime () == timeToCompare.getTime ())
                        takenSlots = getIntervalSlots (roomMeetings[i].startTime, roomMeetings[i].endTime);
                    else if (curOpenTime.getTime () >= roomMeetings[i].startTime.getTime () && curOpenTime.getTime () < roomMeetings[i].endTime.getTime ())
                        takenSlots = 1;
                }

                if (takenSlots != 0)    //slot is not open
                    takenSlots --;
                else    //slot is open
                    openTimes.push (formatTimeToString (curOpenTime));
            }
            else if (takenSlots != 0)
                takenSlots--;   //decrement number of slots taken by the meeting

            curOpenTime.setMinutes (curOpenTime.getMinutes () + intervalCrement);   //in/decrement the current open time based on interval
        }

        //endTimes get stored backwards (cus it counts down) so we do a lil reversing
        if (!isStart) openTimes.reverse ();

        return openTimes;
    }

    //Adds the open times to the start/endTime dropdowns
    function addTimeOptions (openTimes, option) {
        for (let i = 0; i < openTimes.length; i++) {
            let newOption = document.createElement ("option");
            let timeString = openTimes[i];
            newOption.innerHTML = timeString;
            newOption.value = timeString;

            $("#" + option + "Time")[0].appendChild (newOption);
        }
    }

    //Gets the number of slots a meeting takes
    function getIntervalSlots (startTime, endTime) {
        let timeDiffInMinutes = Math.abs (endTime - startTime) / 60000;     //get their difference in minutes
        let slots = timeDiffInMinutes / interval;       //divide difference by interval

        return slots;
    }

    //Checks if current selected start and end time is feasible (not conflicting with other meetings [in meeting array])
    //returns boolean based on its availability
    function checkIfTimeAvailable (room, startTime, endTime) {
        let roomInd = rooms.indexOf (room);
        let roomMeetings = tempMeetings [roomInd];

        if (typeof (startTime) == "string") {   //if passed parameters are in string format, convert to date
            startTime = formatTimeToDate (startTime);
            endTime = formatTimeToDate (endTime);
        }

        if (startTime.getTime () >= endTime.getTime ())     //if startTime is past endTime || if endTime is before startTime
            return false;
        
        for (let i = 0; i < roomMeetings.length; i++)   //Checks for meetings that may be inside current picked time slot
            if (startTime.getTime () <= roomMeetings[i].startTime.getTime () && endTime.getTime () >= roomMeetings[i].endTime.getTime ())
                return false;

        return true;
    }

    //adjust time dropdown to nearest available time (reduces meeting too occupy one slot, if time is unavailable)
    //option: timeSlot recently changed ("start" or "end")
    function adjustTimeOptions (option) {
        let mult = (option == "start") ? 1 : -1;    //interval multiplier (startTime : interval will increment, endTime : interval will decrement)
        let optionToEdit = (option == "start") ? "end" : "start";   //start: edit endTime, end: edit startTime
        let avail = checkIfTimeAvailable ($("#room").val (), $("#startTime").val (), $("#endTime").val ());

        if (!avail) {
            let newTime = formatTimeToDate ($("#" + option + "Time").val ());   //gets time as date of current time option
            let strNewTime;
            newTime.setMinutes (newTime.getMinutes () + (interval * mult));     //in/decrements picked time
            strNewTime = formatTimeToString (newTime);  //converts the in/decremented time to string format

            $("#" + optionToEdit + "Time")[0].value = strNewTime;   //assigns to the other time slot
        }
    }

    //gets meetings array ID from classList
    function getMeetingIDFromClassList (classList) {
        for (let i = 0; i < classList.length; i++)
            if (classList[i].indexOf ("_") != -1)   //meetings array ID has an underscore
                return classList[i];

        return "noMeeting";
    }

    //gets meeting object from meetings array ID
    function getMeetingFromMeetingID (meetingID) {
        const splitID = meetingID.split ("_");
        const roomInd = rooms.indexOf (splitID[0]);
        const meetingInd = parseInt (splitID[1]);

        return meetings[roomInd][meetingInd];
    }

    //gets meeting object from classList
    function getMeetingFromClassList (classList) {
        return getMeetingFromMeetingID (getMeetingIDFromClassList (classList));
    }

    function checkIfBeyondToday (date) {
        let today = new Date ();
        today.setHours (23, 59, 59, 999);
        return (date.getTime () > today.getTime ());
    }

    //copy meetings to tempMeetings
    function copyTemp () {
        tempMeetings = [];
        
        for (let i = 0; i < meetings.length; i++) {
            tempMeetings.push ([]);
            for (let j = 0; j < meetings[i].length; j++)
                tempMeetings[i].push (meetings[i][j]);
        }
    }
});