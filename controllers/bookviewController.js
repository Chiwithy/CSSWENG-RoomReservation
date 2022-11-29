import Meeting from "../models/Meeting.js";
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const times = [ "08:00 AM", "08:30 AM", "09:00 AM",
                "09:30 AM", "10:00 AM", "10:30 AM",
                "11:00 AM", "11:30 AM", "12:00 NN",
                "12:30 PM", "01:00 PM", "01:30 PM",
                "02:00 PM", "02:30 PM", "03:00 PM",
                "03:30 PM", "04:00 PM", "04:30 PM",
                "05:00 PM", "05:30 PM", "06:00 PM" ];
const interval = 30;

const bookviewController = {
    getBookview: (req, res) => {
        res.render ("booking", {date: req.query.date, month: months[req.query.month], year: req.query.year, username: req.user.username});
    },

    getMeetingById: async (req, res) => {
        var foundMeeting = await Meeting.findOne({meetingID:req.query.id}); 
        res.send(foundMeeting); 
    }, 

    getMeetings: async (req, res) => {
        const year = parseInt (req.query.year);
        const month = parseInt (req.query.month);
        const date = parseInt (req.query.date);
        const start = new Date (year, month, date);
        const end = new Date (year, month, date + 1); 
        const accountType = req.user.accountType;
        let meetings = [];
        
        meetings = await Meeting.find ({startTime: {$gte: start, $lt: end}, meetingStatus: {$ne: 'C'}}, {_id: 0});

        if (accountType != "H") {
            for (let i = 0; i < meetings.length; i++) {
                if (meetings[i].username != req.user.username) {
                    meetings[i].username = "";
                    meetings[i].attendeeList = "";

                    if (accountType == "R") {
                        meetings[i].username = "";
                        meetings[i].marketingRequest = "";
                        meetings[i].marketingStatus = "";
                    }
                }
            }
        }

        res.send (meetings);
    },

    renderMeetingRows: async (req, res) => {
        const rooms = ["Integrity", "Innovation", "Teamwork"];
        const year = parseInt (req.query.year);
        const month = parseInt (req.query.month);
        const date = parseInt (req.query.date);
        let meetings = req.query.meetings;
        let meetingRows = [];
        let roomCurrentSlots = [];
        let curTime = new Date (year, month, date, 8, 0, 0);
        let i;

        for (i = 0; i < rooms.length; i++)
            roomCurrentSlots.push (0);

        for (i = 0; i < times.length - 1; i++) {
            let meeting = {
                time: times[i] + " - " + times[i + 1]
            };

            if (meetings != undefined) {
                for (let j = 0; j < rooms.length; j++) {
                    if (roomCurrentSlots[j] == 0) {
                        for (let k = 0; k < meetings.length; k++) {
                            for (let m = 0; m < meetings[k].length; m++) {
                                if (meetings[k][m].meetingRoom == rooms[j]) {
                                    if (meetings[k][m].startTime == curTime) {
                                        let timeDiffInMinutes = Math.abs (new Date (meetings[k][m].endTime) - new Date (meetings[k][m].startTime)) / 60000;
                                        roomCurrentSlots[j] = timeDiffInMinutes / interval;

                                        if (j == 0) {
                                            meeting.integSlots = roomCurrentSlots[j];
                                            meeting.integID = m;
                                            meeting.integSlotTaken = true;
                                        }
                                        else if (j == 1) {
                                            meeting.innovSlots = roomCurrentSlots[j];
                                            meeting.innovID = m;
                                            meeting.innovSlotTaken = true;
                                        }
                                        else if (j == 2) {
                                            meeting.teamSlots = roomCurrentSlots[j];
                                            meeting.teamID = m;
                                            meeting.teamSlotTaken = true;
                                        }

                                        roomCurrentSlots[j] -= 1;
                                    }
                                }
                                else m = meetings[k].length;
                            }
                        }
                    }
                    else {
                        if (j == 0) meeting.integTaken = true;
                        else if (j == 1) meeting.innovTaken = true;
                        else if (j == 2) meeting.teamTaken = true;
                        roomCurrentSlots[j] -= 1;
                    }
                }
            }
            curTime.setMinutes (curTime.getMinutes () + interval);
            meetingRows.push (meeting);
        }

        res.render ('partials/bookview_viewing', {meetingRows: meetingRows}, (err, html) => {
            res.send (html);
        })
    },

    postMeeting: async (req,res) => {
        try {
            var meetingID = (await Meeting.find ({})).length;
            var username = req.user.username;
			var startTime = req.query.startTime;
			var endTime = req.query.endTime;
			var meetingRoom = req.query.meetingRoom; 
			var	marketingRequest = req.query.marketingRequest; 
			var marketingStatus = req.query.marketingStatus; 
			var meetingStatus = req.query.meetingStatus; 
			var	attendeeList = req.query.attendeeList; 

            var newBookedMeeting = {
                meetingID: meetingID, 
                username: username,
				startTime: startTime,
				endTime: endTime,
				meetingRoom: meetingRoom, 
				marketingRequest: marketingRequest, 
				marketingStatus: marketingStatus, 
				meetingStatus: meetingStatus, 
				attendeeList: attendeeList
            }
            Meeting.create(newBookedMeeting, err => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(">>>   postBookedMeetings: Successfully added to DB");
            })
        } catch {}
    },

    postEditMeetingReg: async (req,res) =>{
        try {
            var meetingID = req.query.meetingID;
            var username = req.user.username;
			var startTime = req.query.startTime;
			var endTime = req.query.endTime;
			var meetingRoom = req.query.meetingRoom; 
			var	marketingRequest = req.query.marketingRequest; 
			var marketingStatus = req.query.marketingStatus; 
			var meetingStatus = req.query.meetingStatus; 
			var	attendeeList = req.query.attendeeList; 

            Meeting.updateOne({meetingID: meetingID}, 
                {
                    meetingID: meetingID, 
                    username: username,
                    startTime: startTime,
                    endTime: endTime,
                    meetingRoom: meetingRoom, 
                    marketingRequest: marketingRequest, 
                    marketingStatus: marketingStatus, 
                    meetingStatus: meetingStatus, 
                    attendeeList: attendeeList
                }, err => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(">>>   getEditMeeting: Successfully edited meeting");
            })
        } catch {}
    }, 

    postEditMeetingHR: async (req,res) =>{
        try {
            var meetingID = req.query.meetingID;
			var	attendeeList = req.query.attendeeList; 

            Meeting.updateOne({meetingID: meetingID}, {attendeeList: attendeeList}, err => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(">>>   getEditMeetingHR: Successfully edited meeting");
            })
        } catch {}
    }
};

export default bookviewController;