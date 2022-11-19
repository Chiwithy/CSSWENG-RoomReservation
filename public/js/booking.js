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
    });

    $('#logout').click (() => {
        $.post ('/logout', () => {
            location.href = '/';
        })
    });
    
	getMeetings ();



    /////////////////////////////////////////KYLA SPACE 

    //[X] ADD TO DATABASE (based on book buttons)
    //[] DYNAMIC START AND END TIMES (based on room selection)
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
        var currRoomArray = meetings[indexOfRoom]; 
        var i,x;

        var startInDBArr = currRoomArray.map(a => a.startTime); //gets an arrya of startTimes (for this room) from DB
        var endInDBArr = currRoomArray.map(a => a.endTime);

        // console.log(startInDBArr[0].getHours()); 

        for(i=0; i<startInDBArr.length; i++){
            for(x=0; x<allStartTimes.length; x++){
                var inDBHour = startInDBArr[i].getHours(); 
                var inDBMin = startInDBArr[i].getMinutes(); 

                var split1 = allStartTimes[x].split(":"); 
                var allStartHour = parseInt(split1[0]); 
                var split2 = split1[1].split(" "); 
                var allStartMin = parseInt(split2[0]);
                
                if(inDBHour == allStartHour && inDBMin == allStartMin){
                    console.log(startInDBArr[i], " ", allStartTimes[x]); 
                }
                //////////////////////////////////
            }
        }

        // for(i=0; i<currRoomArray.length; i++){
        //     for(x=0; x<allStartTimes.length; x++){
        //         var inDBstart = currRoomArray.map(a => a.startTime); //gets attribute from a  
        //         console.log(inDBstart)
        //     }
        // }





        //1: makes a new option -- dynamic time 
        // if($("#room").val() == "integrity"){
        //     var test = document.createElement("option"); 
        //     test.innerHTML = "1"; 
        //     test.value = "1"; 
        //     document.getElementById("startTime").appendChild(test);  
        // }
        // else{
        //     var selected = document.getElementById("startTime"); 
        //     //selected.innerHTML = "<option value='' disabled selected>Select</option>" 
        //     selected.innerHTML = ""; 
        // }


        

         
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
        const bookingID = $(this).attr ("id");
        const roomInd = rooms.indexOf (bookingID.split ("_")[0]);
        const ind = parseInt (bookingID.split ("_")[1]);
        
        console.log (meetings[roomInd][ind]);
    }
});