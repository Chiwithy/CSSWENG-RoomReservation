//Parallel arrays || {rooms} array is parallel to {meetings} array || rooms[0] = "Integrity" => meetings[0][n] = meetings in Integrity
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const rooms =  ["Integrity", "Innovation", "Teamwork"];
let meetings = [];  
let openEndTimes = []; 
let openStartTimes = []; 
let accountType;
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

    //PART  1: DISABLE BOOK BUTTON UNTIL ALL REQUIRED FIELDS ARE FILLED (specifically room)
    document.querySelector('#book').disabled = true; 

    //PART  2: get year,month,day, start and end times and turn them into DATE objects 
    var currDate = $("#date").text();
    var splitDate = currDate.split(" "); 
    var year = splitDate[2]; 
    var month = months.indexOf(splitDate[1]); 
    var date = splitDate[0]; 

    //PART  3: when book is clicked, get info 
    $("#book").on('click', function(){
        //PART  4: get start and end time from the form 
        var startSelect = document.getElementById("startTime"); //startTime
        var start = startSelect.options[startSelect.selectedIndex].text; 
        var endSelect = document.getElementById("endTime"); //endTime 
        var end = endSelect.options[endSelect.selectedIndex].text; 

        //PART  5: turn start and end time into dates 
        var startSplit = start.split(":"); 
        var startHour = parseInt(startSplit[0]); 
        var reSplit = startSplit[1].split(" "); 
        var startMin = parseInt(reSplit[0]); 
        var endSplit = end.split(":"); 
        var endHour = parseInt(endSplit[0]); 
        var reSplit1 = endSplit[1].split(" "); 
        var endMin = parseInt(reSplit1[0]); 

        //PART  5.1: offset the times for PM  
        if(startHour >= 1 && startHour <= 6){
            startHour = startHour + 12; 
        }
        if(endHour >= 1 && endHour <= 6){
            endHour = endHour + 12; 
        }
        
        var startTimeDate = new Date(year, month, date, startHour, startMin); 
        var endTimedate = new Date(year, month, date, endHour, endMin); 

        //PART  6: set up to get all the values from the form 
        var currRoom = document.getElementById("room"); 
        var currRoomText = currRoom.options[currRoom.selectedIndex].text;   
        var indexOfRoom = rooms.indexOf(currRoomText); 
        var numOfMeetingsInDB = meetings[indexOfRoom].length;

        //PART  7: get all the values from the form 
        var meetingID = numOfMeetingsInDB; 
        var username = $("#username").text();
        var startTime = startTimeDate; 
        var endTime = endTimedate 
        var meetingRoom = currRoomText; //meeting room is capitalized 
        var marketingRequest = $("#marketingReqs").val(); 
        var marketingStatus = false; 
        var meetingStatus = "S"; 
        var attendeeList = $('#attendees').val(); 
 
        //PART  8: ADD MEETINGS TO DB 
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

        checkIfSuccessful(startTime, endTime, meetingRoom);

        //window.location.reload(); 

    }); 

    //PART  9: have start and end change depending on click of 
    $("#room").on('change', function(){
        document.querySelector('#book').disabled = false;
        $("#startTime").empty(); 
        $("#endTime").empty(); 
        $("#startTime").append("<option value='' disabled selected class='select'>Select</option>");  
        $("#endTime").append("<option value='' disabled selected class='select'>Select</option>"); 
        var currRoom = $("#room").val(); //value of room
        var currRoomCap = currRoom.charAt(0).toUpperCase() + currRoom.slice(1); 
        var indexOfRoom = rooms.indexOf(currRoomCap); 
       
        //PART  10: get a list of all possible start and times (global variables -- allStartTimes, allEndTimes)
        //PART  11: GET A LIST OF ALL START/ENDTIMES IN DB (including the ones that hide under big meetings)
        var currRoomArray = meetings[indexOfRoom]; 
        var i,x;

        var toRemoveStart = [];
        var toRemoveEnd = []; 
        var startInDBArr = currRoomArray.map(a => a.startTime); //gets an arrya of startTimes (for this room) from DB
        var endInDBArr = currRoomArray.map(a => a.endTime);
        var arrLength = startInDBArr.length; 

		//deals with meetings that last more than 30 mins 
        for(i=0; i<arrLength; i++){ //for start hours 
            var startInDBHour = startInDBArr[i].getHours(); 
            var startInDBMin = startInDBArr[i].getMinutes(); 

            var endInDBHour = endInDBArr[i].getHours(); 
            var endInDBMin = endInDBArr[i].getMinutes(); 
            var check; 

            if((startInDBHour == endInDBHour) && (startInDBMin + 30 == endInDBMin)){
                check = true; 
            }
            else if((startInDBHour + 1 == endInDBHour) && (startInDBMin == endInDBMin + 30)){
                check = true; 
            }
            else{
                check = false;
            }
            
            if(!check){
                var startTempHour = startInDBHour; 
                var startTempMin = startInDBMin; 
                var endTempHour = endInDBHour; 
                var endTempMin = endInDBMin; 

                var startTempHourVal, endInDBHourVal; 
                var endTempHourVal, startInDBHourVal; 

                //offsets time for 1pm - 6pm 
                if(startTempHour >= 1 && startTempHour <= 6){ 
                    startTempHourVal = startTempHour + 12; 
                }
                if(endInDBHour >= 1 && endInDBHour <= 6){ 
                    endInDBHourVal = endInDBHour + 12; 
                }
                else{
                    startTempHourVal = startTempHour; 
                    endInDBHourVal = endInDBHour; 
                }

                //gets all start times in between and pushes it to startInDBArr
                while(startTempHourVal < endInDBHourVal){  
                    if(startTempMin == 0){ 
                        startTempMin = startTempMin + 30; 
                        startInDBArr.push(new Date(year,month,date,startTempHour,startTempMin)); 
                    }
                    else if(startTempMin == 30){
                        startTempMin = 0; 
                        startTempHour = startTempHour + 1; 
                        startInDBArr.push(new Date(year,month,date,startTempHour,startTempMin)); 
                        startTempHourVal = startTempHourVal + 1; 
                    }
                }

                //offsets time for 1pm - 6pm 
                if(endTempHour >= 1 && endTempHour <= 6){ 
                    endTempHourVal = endTempHour + 12; 
                }
                if(startInDBHour >= 1 && startInDBHour <= 6){ 
                    startInDBHourVal = startInDBHour + 12; 
                }
                else{
                    endTempHourVal = endTempHour; 
                    startInDBHourVal = startInDBHour; 
                }

                //gets all start times in between and pushes it to startInDBArr
                while(endTempHourVal > startInDBHourVal){  
                    if(endTempMin == 0){ 
                        endTempMin = endTempMin + 30; 
                        endTempHour = endTempHour - 1; 
                        endTempHourVal = endTempHourVal - 1; 
                        endInDBArr.push(new Date(year,month,date,endTempHour,endTempMin)); 
                    }
                    else if(endTempMin == 30){
                        endTempMin = 0; 
                        endInDBArr.push(new Date(year,month,date,endTempHour,endTempMin)); 
                    }
                }
            }
        }
        endInDBArr.shift(); ////////////
       
        //PART 12: compare start/endTimes that already exist in DB and all start/endTimes possible and makes array the conatins what exists (based on index)
        //         makes sure that times that are booked arent shown 
        // for(i=0; i<startInDBArr.length; i++){   //compares start times in DB vs all start times (and makes array with indexes to remove ie. taken up classes)
        //     for(x=0; x<allStartTimes.length; x++){
        //         var inDBHour = startInDBArr[i].getHours(); 
        //         var inDBMin = startInDBArr[i].getMinutes(); 

        //         if(inDBHour > 12 && inDBHour <= 18){ //offsets for 1pm-6pm 
        //             inDBHour = inDBHour - 12; 
        //         }

        //         var split1 = allStartTimes[x].split(":"); 
        //         var allStartHour = parseInt(split1[0]); 
        //         var split2 = split1[1].split(" "); 
        //         var allStartMin = parseInt(split2[0]);
                
        //         if(inDBHour == allStartHour && inDBMin == allStartMin){
        //             toRemoveStart.push(x); 
        //         }
        //     }
        // }
        // for(i=0; i<endInDBArr.length; i++){   //compares end times in DB vs all end times 
        //     for(x=0; x<allEndTimes.length; x++){
        //         var inDBHour = endInDBArr[i].getHours(); 
        //         var inDBMin = endInDBArr[i].getMinutes(); 

        //         if(inDBHour > 12 && inDBHour <= 18){ //offsets for 1pm-6pm
        //             inDBHour = inDBHour - 12; 
        //         }

        //         var split1 = allEndTimes[x].split(":"); 
        //         var allEndHour = parseInt(split1[0]); 
        //         var split2 = split1[1].split(" "); 
        //         var allEndMin = parseInt(split2[0]);
                
        //         if(inDBHour == allEndHour && inDBMin == allEndMin){
        //             toRemoveEnd.push(x); 
        //         }
        //     }
        // } 

        //PART  12: makes new options based on meetings that already exist -- dynamic time (based on allStartTimes array and toRemoveStart)
        for(i=0; i<allStartTimes.length; i++){  //all startTimes minus the ones found in meetings array 
            if(!(toRemoveStart.includes(i))){
                var test = document.createElement("option"); 
                test.innerHTML = allStartTimes[i]; 
                var split = allStartTimes[i].split(":"); 
                var allStartHour = parseInt(split[0]);
                var split1 = split[1].split(" ");  
                var allStartMin = parseInt(split1[0]);
                var allStartID; 
                if(allStartHour >= 1 && allStartHour <= 6){
                    allStartHour = allStartHour + 12; 
                }
                if(allStartMin == 30){
                    allStartID = allStartHour + 0.5; 
                }
                else{ 
                    allStartID = allStartHour; 
                }
                test.id = allStartID; 
                document.getElementById("startTime").appendChild(test);
                openStartTimes.push(allStartTimes[i]); 
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
                var allEndVID; 
                if(allEndHour >= 1 && allEndHour <= 6){
                    allEndHour = allEndHour + 12; 
                }
                if(allEndMin == 30){
                    allEndVID = allEndHour + 0.5; 
                }
                else{ 
                    allEndVID = allEndHour; 
                }
                test.id = allEndVID; 
                document.getElementById("endTime").appendChild(test);
                openEndTimes.push(allEndTimes[i]); 
            }
        }

    });

    //PART  12: onclick of start time -- allow only end times after it that are consecutive (no gaps) in dropdown options for endtime 
    $("#startTime").on('change', function(){
        //console.log(openEndTimes); 
        finalChangeTimeOptions("endTime", $("#startTime"), openEndTimes); 
    })

    //PART  13: onclick of end time -- allow only start times after it that are consecutive (no gaps) in dropdown options for startTime 
    $("#endTime").on('change', function(){
        finalChangeTimeOptions("startTime", $("#endTime"), openStartTimes); 
    })

    
    //-----------

    function checkIfSuccessful(startTime, endTime, meetingRoom){
        var i; 
        var roomIndex = rooms.indexOf(meetingRoom); 
        var roomMeetings = meetings[roomIndex]; 
        
        for(i=0; i<roomMeetings.length;i++){
            console.log("--------");
            console.log("start: ", roomMeetings[i].startTime, "---", startTime); 
            console.log("end: ", roomMeetings[i].endTime, "---", endTime); 

            
            if(Number(roomMeetings[i].startTime) == Number(startTime) && Number(roomMeetings[i].endTime) == Number(endTime)){
                console.log("[1] exactly the same");  
            }
            if(Number(roomMeetings[i].startTime) == Number(startTime) && Number(roomMeetings[i].endTime) >= Number(endTime)){
                console.log("[2] inside and up");  
            }
            if(Number(roomMeetings[i].startTime) <= Number(startTime) && Number(roomMeetings[i].endTime) == Number(endTime)){
                console.log("[3] inside and below");  
            }
            
            
        }
    }

    function finalChangeTimeOptions(id, origin, openSlots){
        var i,x;
        var selected = $(origin).children(":selected").attr("id"); 
        var toKeep = []; 

        //given one, change the other 
        var previous = selected; 
        for(i=0;i<openSlots.length;i++){
            var arr = openSlots[i].split(":"); 
            var hour = parseInt(arr[0]); 
            var arr2 = arr[1].split(" "); 
            var min = parseInt(arr2[0]);
            var currVal; 

            if(hour >= 1 && hour <= 6)
                hour = hour + 12;
            
            if(min == 30)
                currVal = hour + 0.5
            else
                currVal = hour; 

            if(currVal > previous && id.localeCompare("endTime") == 0){ 
                if(currVal - previous == 0.5){
                    toKeep.push(currVal); 
                    previous = parseFloat(previous) + 0.5; 
                }
            }
            
            if(currVal < previous && id.localeCompare("startTime") == 0){ 
                if(previous - currVal == 0.5){
                    toKeep.push(currVal); 
                    previous = parseFloat(previous) + 0.5; 
                }
            }
        }

        if(id.localeCompare("endTime") == 0)
            $("#" + id).empty();
        
        for(x=0; x<toKeep.length; x++){  //all endTimes minus the ones found in meetings array
            var arr = toKeep[x].toString().split("."); 
            var hour = arr[0]; 
            var min; 

            if(arr[1] == 5){
                min = "30"; 
            }
            else{
                min = "00"; 
            }

            if(hour > 12){
                hour = hour - 12; 
                hour = "0" + hour; 
                min = min + " PM"
            }
            else if (hour == 12){
                min = min + " NN"
            }
            else{
                min = min + " AM"
            }
            var thisHour = hour + ":" + min; 
            
            var newOption = $("<option>").text(thisHour); 
            newOption.attr('id',toKeep[x]); 
            $("#" + id).append(newOption); 
        }
    }

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
            if (meeting.attendeeList) $("#attendeesModal")[0].innerHTML= meeting.attendeeList;
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