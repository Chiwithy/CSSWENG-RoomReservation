//Parallel arrays || {rooms} array is parallel to {meetings} array || rooms[0] = "Integrity" => meetings[0][n] = meetings in Integrity
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const rooms = ["Integrity", "Innovation", "Teamwork"];
let meetings = [];  //YAY <-- meeting array that conatins all filled meetings 
let accountType;

$(document).ready (() => {
    for (let i = 0; i < rooms.length; i++)
        meetings.push ([]);
    
    $.get('/getAccountType', (accType) => {
        accountType = accType;
        if (accType == "R") {
            $("#attendeesModalRow").remove ();
            $("#requestsModalRow").remove ();
        }
    });

    $('#logout').click (() => {
        $.post ('/logout', () => {
            location.href = '/';
        })
    });
    
	getMeetings ();



    /////////////////////////////////////////KYLA SPACE 

    //[X] ADD TO DATABASE (based on book buttons)
    //[X] DYNAMIC START AND END TIMES (based on room selection)
    //      [] MAKE SURE THAT start < end and end > start ALWAYS (when showing clickable options)
    //      [] only show the times that are NOT booked 
    //[] add a check to confirm that the booking has been added to the database 
    //[X] disable book button if room is not yet selected 

    //STEP 1: DISABLE BOOK BUTTON UNTIL ALL REQUIRED FIELDS ARE FILLED (specifically room)
    document.querySelector('#book').disabled = true; 

    //STEP 2: get year,month,day, start and end times and turn them into DATE objects 
    var currDate = $("#date").text();
    var splitDate = currDate.split(" "); 
    var year = splitDate[2]; 
    var month = months.indexOf(splitDate[1]); 
    var date = splitDate[0]; 

    //STEP 3: when book is clicked, get info 
    $("#book").on('click', function(){
        //STEP 4: get start and end time from the form 
        var startSelect = document.getElementById("startTime"); //startTime
        var start = startSelect.options[startSelect.selectedIndex].text; 
        var endSelect = document.getElementById("endTime"); //endTime 
        var end = endSelect.options[endSelect.selectedIndex].text; 

        //STEP 5: turn start and end time into dates 
        var startSplit = start.split(":"); 
        var startHour = parseInt(startSplit[0]); 
        var reSplit = startSplit[1].split(" "); 
        var startMin = parseInt(reSplit[0]); 
        var endSplit = end.split(":"); 
        var endHour = parseInt(endSplit[0]); 
        var reSplit1 = endSplit[1].split(" "); 
        var endMin = parseInt(reSplit1[0]); 
        var startTimeDate = new Date(year, month, date, startHour, startMin); 
        var endTimedate = new Date(year, month, date, endHour, endMin); 

        //STEP 6: set up to get all the values from the form 
        var currRoom = document.getElementById("room"); 
        var currRoomText = currRoom.options[currRoom.selectedIndex].text;   
        var indexOfRoom = rooms.indexOf(currRoomText); 
        var numOfMeetingsInDB = meetings[indexOfRoom].length;

        //STEP 7: get all the values from the form 
        var meetingID = numOfMeetingsInDB; 
        var username = $("#username").text();
        var startTime = startTimeDate; 
        var endTime = endTimedate 
        var meetingRoom = currRoomText; //meeting room is capitalized 
        var marketingRequest = $("#marketingReqs").val(); 
        var marketingStatus = false; 
        var meetingStatus = "S"; 
        var attendeeList = $('#attendees').val(); 
 
        //STEP 8: ADD MEETINGS TO DB 
        fetch("/addBookedMeeting?" + new URLSearchParams({
            meetingID: meetingID,
            username: username,
            startTime: startTime,
            endTime: endTime,
            meetingRoom: meetingRoom, 
            marketingRequest: marketingRequest, 
            marketingStatus: marketingStatus, 
            meetingStatus: meetingStatus, 
            attendeeList: attendeeList,
        }), {method: 'POST',})

        window.location.reload(); 

    }); 


    
    //STEP 9: have start and end change depending on click of 
    $("#room").on('change', function(){
        document.querySelector('#book').disabled = false;
        var currRoom = $("#room").val(); //value of room
        var currRoomCap = currRoom.charAt(0).toUpperCase() + currRoom.slice(1); 
        var indexOfRoom = rooms.indexOf(currRoomCap); 
       
        //STEP 10: get a list of all possible start and times 
        let allStartTimes = [ "08:00 AM", "08:30 AM", "09:00 AM",
                              "09:30 AM", "10:00 AM", "10:30 AM",
                              "11:00 AM", "11:30 AM", "12:00 NN",
                              "12:30 PM", "01:00 PM", "01:30 PM",
                              "02:00 PM", "02:30 PM", "03:00 PM",
                              "03:30 PM", "04:00 PM", "04:30 PM",
                              "05:00 PM", "05:30 PM" ];
        let allEndTimes =   [ "08:30 AM", "09:00 AM",
                              "09:30 AM", "10:00 AM", "10:30 AM",
                              "11:00 AM", "11:30 AM", "12:00 NN",
                              "12:30 PM", "01:00 PM", "01:30 PM",
                              "02:00 PM", "02:30 PM", "03:00 PM",
                              "03:30 PM", "04:00 PM", "04:30 PM",
                              "05:00 PM", "05:30 PM", "06:00 PM" ];
        
        //STEP 11: get the meetings array array that corresponds to the room currently selected 
        //         iterate through all existing meetings and compare what slots are already taken 
		//		   take into account any meetings booked that go over 30 mins -- multiple start times/end times inside 
		// basically: GET A LIST OF ALL START/ENDTIMES IN DB (including the ones that hide under big meetings)
        var currRoomArray = meetings[indexOfRoom]; 
        var i,x;

        var toRemoveStart = [];
        var toRemoveEnd = []; 
        var startInDBArr = currRoomArray.map(a => a.startTime); //gets an arrya of startTimes (for this room) from DB
        var endInDBArr = currRoomArray.map(a => a.endTime);
        var arrLength = startInDBArr.length; 

		//(1) in the DB find the meetings that span more than 30 mins 
		//(2) trun them into hour:minute format and check the array for them (.contains) and return the index -- this will be our basis for value

		 
		//NOTE: you can use index somehow to get value -- index of startAllTimes, endAllTimes 
		///////////////////////////////////////////////////////////////////////////////////////////////
        // for(i=0; i<arrLength; i++){ //for start hours 
        //     var startInDBHour = startInDBArr[i].getHours(); 
        //     var startInDBMin = startInDBArr[i].getMinutes(); 

        //     var endInDBHour = endInDBArr[i].getHours(); 
        //     var endInDBMin = endInDBArr[i].getMinutes(); 
        //     var check; 

        //     if((startInDBHour == endInDBHour) && (startInDBMin + 30 == endInDBMin)){
        //         check = true; 
        //     }
        //     else if((startInDBHour + 1 == endInDBHour) && (startInDBMin == endInDBMin + 30)){
        //         check = true; 
        //     }
        //     else{
        //         check = false;
        //     }
            
        //     if(!check){
        //         var tempHour = startInDBHour; 
        //         var tempMin = startInDBMin; 
        //         var tempHour2 = endInDBHour; 
        //         var tempMin2 = endInDBMin; 


		// 		if(tempHour < 10)
		// 		var check = "0" + tempHour + ":" +  
                // while(tempHour < endInDBHour){ //THIS IS NOT CORRECT --does not account for 1pm etc 
                //     if(tempMin == 0){ 
                //         tempMin = tempMin + 30; 
                //         startInDBArr.push(new Date(year,month,date,tempHour,tempMin)); 
                //     }
                //     else if(tempMin == 30){
                //         tempMin = 0; 
                //         tempHour = tempHour + 1; 
                //         startInDBArr.push(new Date(year,month,date,tempHour,tempMin)); 
                //     }
                // }


                // this one just doesnt work 
                // while(tempHour2 > startInDBArr){ 
                //     console.log("___",tempHour2); 
                //     if(tempMin2 == 0){
                //         tempMin2 = tempMin2 + 30; 
                //         tempHour2 = tempHour2 - 1; 
                //         endInDBArr.push(new Date(year,month,date,tempHour2,tempMin2));
                //     }
                //     else if(tempMin == 30){
                //         tempMin2 = 0; 
                //         endInDBArr.push(new Date(year,month,date,tempHour2,tempMin2));
                //     }
                // }


        //     }
        // }
        // startInDBArr.pop(); 
        //endInDBArr.pop(); 
		/////////////////////////////////////////////////////////////////////////////////////////
       
        //STEP 12: compare start/endTimes that already exist in DB and all start/endTimes possible 
        for(i=0; i<startInDBArr.length; i++){   //compares start times in DB vs all start times (and makes array with indexes to remove ie. taken up classes)
            for(x=0; x<allStartTimes.length; x++){
                var inDBHour = startInDBArr[i].getHours(); 
                var inDBMin = startInDBArr[i].getMinutes(); 

                var split1 = allStartTimes[x].split(":"); 
                var allStartHour = parseInt(split1[0]); 
                var split2 = split1[1].split(" "); 
                var allStartMin = parseInt(split2[0]);
                
                if(inDBHour == allStartHour && inDBMin == allStartMin){
                    toRemoveStart.push(x); 
                }
            }
        }
        // for(i=0; i<endInDBArr.length; i++){   //compares end times in DB vs all end times 
        //     for(x=0; x<allEndTimes.length; x++){
        //         var inDBHour = endInDBArr[i].getHours(); 
        //         var inDBMin = endInDBArr[i].getMinutes(); 

        //         var split1 = allEndTimes[x].split(":"); 
        //         var allEndHour = parseInt(split1[0]); 
        //         var split2 = split1[1].split(" "); 
        //         var allEndMin = parseInt(split2[0]);
                
        //         if(inDBHour == allEndHour && inDBMin == allEndMin){
        //             toRemoveEnd.push(x); 
        //         }
        //     }
        // } //to double check 


        //STEP 12: makes new options based on meetings that already exist -- dynamic time 
        for(i=0; i<allStartTimes.length; i++){  //all startTimes minus the ones found in meetings array 
            if(!(toRemoveStart.includes(i))){
                var test = document.createElement("option"); 
                test.innerHTML = allStartTimes[i]; 
                var split = allStartTimes[i].split(":"); 
                var allStartHour = parseInt(split[0]);
                var split1 = split[1].split(" ");  
                var allStartMin = parseInt(split1[0]);
                var allStartVal; 
                if(allStartMin == 30){
                    allStartVal = allStartHour + 0.5; 
                }
                else{ 
                    allStartVal = allStartHour; 
                }
                test.value = allStartVal; 
                document.getElementById("startTime").appendChild(test);
            }
        }
        for(i=0; i<allEndTimes.length; i++){  //all endTimes minus the ones found in meetings array 
            if(!(toRemoveEnd.includes(i))){
                var test = document.createElement("option"); 
                test.innerHTML = allEndTimes[i]; 
                var split = allEndTimes[i].split(":"); 
                var allEndHour = parseInt(split[0]);
                var split1 = split[1].split(" ");  
                var allEndMin = parseInt(split1[0]);
                var allEndVal; 
                if(allEndMin == 30){
                    allEndVal = allEndHour + 0.5; 
                }
                else{ 
                    allEndVal = allEndHour; 
                }
                test.value = allEndVal; 
                document.getElementById("endTime").appendChild(test);
            }
        }

         
    });
    

    //3: make sure that end tims are always after start time
    //   and that start times are always before end time 
    // $("#startTime").on('change', function(){
    //     console.log($("#startTime").val()); 
    // }) 
    

    ///////////////////////////////////////////////////////////////STOP 


    //gets all possible meetings for that day -- the ones booked already 
    function getMeetings () {
        const params = new URLSearchParams (window.location.search);
        let year = parseInt (params.get ("year"));
        let month = parseInt (params.get ("month"));
        let date = parseInt (params.get ("date"));
        $.get ("/getMeetings", {year: year, month: month, date: date}, (meetingInfos) => {
            let i;

            for (i = 0; i < meetingInfos.length; i++) {
                meetingInfos[i].startTime = new Date (meetingInfos[i].startTime);
                meetingInfos[i].endTime = new Date (meetingInfos[i].endTime);
                meetings[rooms.indexOf (meetingInfos[i].meetingRoom)].push (meetingInfos[i]);
            }

			renderMeetings ();
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
            clickableSlots ();
        });
    }

    function colorBookedSlots () {
        let slots = $('.takenSlot');
        let i;

        for (let i = 0; i < slots.length; i++) {
            slots[i].style.backgroundColor = "#3159BC";
            /*slots[i].innerHTML = '<i class="fa-solid fa-pen-to-square" style="font-size:12px;"></i>'
            slots[i].innerHTML += '<div class="px-1 inline"></div><div class="px-1 inline"></div><div class="px-1 inline"></div>'
            slots[i].innerHTML += '<i class="fa-solid fa-x" style="font-size:12px;"></i><br>'//*/
            slots[i].innerHTML += '<b>Booked</b>';
        }
    }

    function clickableSlots () {
        for (let i = 0; i < rooms.length; i++) {
            for (let j = 0; j < meetings[i].length; j++) {
                if (meetings[i][j].username != "") {
                    $('#' + rooms[i] + "_" + j).click (clickRoom);
                    $('#' + rooms[i] + "_" + j).css ('cursor', "pointer");
                }
            }
        }
    }

    function clickRoom () {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const bookingID = $(this).attr ("id");
        const roomInd = rooms.indexOf (bookingID.split ("_")[0]);
        const ind = parseInt (bookingID.split ("_")[1]);
        const meeting = meetings[roomInd][ind];
        let fullDate = meeting.startTime.getDate () + " " + months[meeting.startTime.getMonth ()] + " " + meeting.startTime.getFullYear () + ", " + days[meeting.startTime.getDay ()];

        $("#dateModal")[0].innerHTML = fullDate;
        $("#usernameModal")[0].innerHTML = meeting.username;
        $("#startTimeModal")[0].innerHTML = formatTime (meeting.startTime);
        $("#endTimeModal")[0].innerHTML = formatTime (meeting.endTime);
        $("#roomModal")[0].innerHTML = meeting.meetingRoom;
        
        if (accountType != "R") {
            if (meeting.attendeeList) {
                let attendeeList = meeting.attendeeList.split ("|");
                for (let i = 0; i < attendeeList.length; i++) {
                    if (i) $("#attendeesModal")[0].innerHTML += "<br>" + attendeeList[i];
                    else $("#attendeesModal")[0].innerHTML = attendeeList[i];
                }
            }
            else $("#attendeesModal")[0].innerHTML = "";

            if (meeting.marketingRequest) $("#requestsModal")[0].innerHTML = meeting.marketingRequest;
            else $("#requestsModal")[0].innerHTML = "";
        }


        $("#modal").css ('display', 'block');
    }
});

function formatTime (date) {
    let hours = date.getHours ();
    let minutes = date.getMinutes ();
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