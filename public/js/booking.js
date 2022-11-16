//Parallel arrays || {rooms} array is parallel to {meetings} array || rooms[0] = "Integrity" => meetings[0][n] = meetings in Integrity
const rooms = ["Integrity", "Innovation", "Teamwork"];
let meetings = [];
let accountType;

$(document).ready (() => {
    for (let i = 0; i < rooms.length; i++)
        meetings.push ([]);
    
    $.get('/getAccountType', (accType) => {
        accountType = accType;
    });

	getMeetings ();



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