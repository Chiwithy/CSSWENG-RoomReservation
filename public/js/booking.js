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

    //STEP 1: DISABLE BOOK BUTTON UNTIL ALL REQUIRED FIELDS ARE FILLED 
    //document.querySelector('#book').disabled = true; //disable book button until all fields (sans last 2) are filled
    //the enable will be inside the --ON CLICK OF ROOM--
    //UNFINISHED  

    //STEP 2: get year,month,day, start and end times and turn them into DATE objects 
    var currDate = $("#date").text();
    var splitDate = currDate.split(" "); 
    var year = splitDate[2]; 
    var month = months.indexOf(splitDate[1]); 
    var date = splitDate[0]; 
    
    //STEP 3: have everything react beginning from onclick of the room dropdown  
    $("#room").on('change', function(){
        var currRoom = $("#room").val(); //value of room
        var currRoomCap = currRoom.toUpperCase().charAt(0) + currRoom.slice(1);  
        var indexOfRoom = rooms.indexOf(currRoomCap); 
        var numOfMeetingsInDB = meetings[indexOfRoom].length; //meeting ID depends on how many meetings are in the array per room
 

        //STEP 4: get all the values from the form 
        var meetingID = currRoomCap + "_" + numOfMeetingsInDB; 
        console.log(meetingID); 
        // var username = $("#username").innerText; 
        // var startTime <-- basta this is a date 
        // var endTime <-- basta this is a date 
        // var meetingRoom = currRoom; 
        // var marketingRequest = $('#marketingReqs').val(); 
        // var marketingStatus = false; 
        // var meetingStatus = "S"; 
        // var attendeeList = $('#attendees').val(); 


        //STEP 5: ADD MEETINGS TO DB 
        // fetch("/addBookedMeeting?" + new URLSearchParams({
        //     meetingID: meetingID,
        //     meetingDate: meetingDate, 
        //     username: username,
        //     startTime: startTime,
        //     endTime: endTime,
        //     meetingRoom: meetingRoom, 
        //     marketingRequest: marketingReqs, 
        //     marketingStatus: marketingStatus, 
        //     meetingStatus: meetingStatus, 
        //     attendeeList: attendeeList,
        // }), {method: 'POST',})

        



        
        
        

        //2: lists all times that arent taken -- makes sure that only available meeting times is open 
        // let times = [ "08:00 AM", "08:30 AM", "09:00 AM",
        //               "09:30 AM", "10:00 AM", "10:30 AM",
        //               "11:00 AM", "11:30 AM", "12:00 NN",
        //               "12:30 PM", "01:00 PM", "01:30 PM",
        //               "02:00 PM", "02:30 PM", "03:00 PM",
        //               "03:30 PM", "04:00 PM", "04:30 PM",
        //               "05:00 PM", "05:30 PM", "06:00 PM" ];
        // get room, iterate through meetinsg using room, get startTime and cross out anything that 
        // exists in meetings (getMeetings) array  


        //1: makes a new option -- dynamic time 
        // if($("#room").val() == "integrity"){
        //     var test = document.createElement("option"); 
        //     test.innerHTML = "1"; 
        //     test.value = "1"; 
        //     document.getElementById("startTime").appendChild(test);  
        // }
        // else{
        //     var selected = document.getElementById("startTime"); 
        //     selected.innerHTML = "<option value='' disabled selected>Select</option>" 
        // }


        

         
    });
    
    //3: make sure that end tims are always after start time
    //   and that start times are always before end time 
    // $("#startTime").on('change', function(){
    //     console.log($("#startTime").val()); 
    // }) 


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