import Meeting from "../models/Meeting.js";
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const timezoneOffset = (new Date ().getTimezoneOffset () / 60);
const firstOpenTime = 8 - timezoneOffset;    //Hour in military time
const lastClosedTime = 18 - timezoneOffset;
const interval = 30;    //interval in minutes

const suppFuncs = {
    getTimeSlots: (start, end) => {
        let startTime = new Date (start);
        let endTime = new Date (end);
        let timeDiffInMinutes = Math.abs (endTime - startTime) / 60000;
        let slots = timeDiffInMinutes / interval;
    
        return slots;
    },

    formatTimeToString: async (time) => {
        let hours = time.getHours () + timezoneOffset;
        let minutes = time.getMinutes ();
        let ampm = hours >= 12 ? "PM" : "AM";
        let timeString;

        console.log (hours);
        console.log (hours - timezoneOffset);
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes == 0 ? "00" : minutes;

        if (hours == 12)
            ampm = "NN";

        hours = hours < 10 ? "0" + hours : hours;
        timeString = hours + ":" + minutes + " " + ampm;

        return timeString;
    }
};

const bookviewController = {
    getBookview: (req, res) => {
        res.render ("booking", {date: req.query.date, month: months[req.query.month], year: req.query.year, username: req.user.username});
    },

    checkTimeSlot: async (req, res) => {
        let start = new Date (req.query.startTime);
        let end = new Date (req.query.endTime);
        let room = req.query.meetingRoom;
        let meetings = [];

        meetings = await Meeting.find ({meetingRoom: room, meetingStatus: {$ne: 'C'},
                                        $or: [{startTime: {$gte: start, $lt: end}}, {endTime: {$gt: start, $lte: end}},
                                        {$and: [{startTime: {$lte: start}}, {endTime: {$gte: end}}]} ]});

        if (meetings.length != 0) {
            res.send (String (meetings[0].meetingID));
            return;
        }

        res.send ("-1");
        return;
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
        let curTime = new Date (year, month, date, firstOpenTime - 8, 0, 0);
        let lastTime = new Date (year, month, date, lastClosedTime - 8, 0, 0);
        let i;

        for (i = 0; i < rooms.length; i++)
            roomCurrentSlots.push (0);

        while (curTime.getTime () != lastTime.getTime ()) {
            let meeting;
            let slotEnd = new Date (year, month, date, curTime.getHours (), curTime.getMinutes () + interval, 0);

            meeting = {
                time: await suppFuncs.formatTimeToString (curTime) + " - " + await suppFuncs.formatTimeToString (slotEnd)
            };

            if (meetings != undefined) {
                for (let j = 0; j < rooms.length; j++) {
                    if (roomCurrentSlots[j] == 0) {
                        for (let k = 0; k < meetings.length; k++) {
                            for (let m = 0; m < meetings[k].length; m++) {
                                if (meetings[k][m].meetingRoom == rooms[j]) {
                                    if (new Date (meetings[k][m].startTime).getTime () == curTime.getTime ()) {
                                        roomCurrentSlots[j] = suppFuncs.getTimeSlots (new Date (meetings[k][m].startTime), new Date (meetings[k][m].endTime))

                                        if (j == 0) {
                                            meeting.integSlots = roomCurrentSlots[j];
                                            meeting.integID = m;
                                            meeting.integSlotTaken = true;
                                            if (meetings[k][m].username == req.user.username)
                                                meeting.integOwn = true;
                                        }
                                        else if (j == 1) {
                                            meeting.innovSlots = roomCurrentSlots[j];
                                            meeting.innovID = m;
                                            meeting.innovSlotTaken = true;
                                            if (meetings[k][m].username == req.user.username)
                                                meeting.innovOwn = true;
                                        }
                                        else if (j == 2) {
                                            meeting.teamSlots = roomCurrentSlots[j];
                                            meeting.teamID = m;
                                            meeting.teamSlotTaken = true;
                                            if (meetings[k][m].username == req.user.username)
                                                meeting.teamOwn = true;
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

    postInsertMeeting: async (req,res) => {
        try {
            var meetingID = (await Meeting.find ({})).length;
            var username = req.user.username;
			var startTime = new Date (req.query.startTime);
			var endTime = new Date (req.query.endTime);
			var meetingRoom = req.query.meetingRoom; 
			var	marketingRequest = req.query.marketingRequest; 
			var marketingStatus = false;
			var meetingStatus = "S";
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

    postCancelMeeting: async (req, res) => {
        if (req.user.username == req.query.username || req.user.accountType == "H")
            await Meeting.updateOne ({meetingID: parseInt (req.query.meetingID)}, {meetingStatus: "C"}, (err, result) => {
                if (err) throw err;
                else res.send (result);
            }).clone ().catch ((err) => { console.log (err)});
    },

    postUpdateMeeting: async (req,res) =>{
        try {
            var meetingID = parseInt (req.query.meetingID);
			var startTime = new Date (req.query.startTime);
			var endTime = new Date (req.query.endTime);
			var meetingRoom = req.query.meetingRoom; 
			var	marketingRequest = req.query.marketingRequest;
			var	attendeeList = req.query.attendeeList; 

            Meeting.updateOne({meetingID: meetingID}, 
                {
                    startTime: startTime,
                    endTime: endTime,
                    meetingRoom: meetingRoom, 
                    marketingRequest: marketingRequest,
                    attendeeList: attendeeList
                }, err => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(">>>   getEditMeeting: Successfully edited meeting");
            })
        } catch {}
    }
};

export default bookviewController;