import Meeting from "../models/Meeting.js";

const bookviewController = {
    getBookview: (req, res) => {
        res.render("booking", {date: req.query.date, month: req.query.month, year: req.query.year, username: req.user.username});
    },

    getMeetings: async (req, res) => {
        let year = parseInt (req.query.year);
        let month = parseInt (req.query.month);
        let date = parseInt (req.query.date);
        let start = new Date (year, month, date);
        let end = new Date (year, month, date + 1); 
        let accountType = req.user.accountType;
        let meetings = [];
        let i;
        
        if (accountType == "R") {
            meetings = await Meeting.find ({startTime: {$gte: start, $lt: end}}, {_id: 0, username: 1, meetingID: 1, startTime: 1, endTime: 1, meetingRoom: 1});

            for (let i = 0; i< meetings.length; i++)
                if (meetings[i].username != req.user.username)
                    meetings[i].username = "";
        }
            
        else if (accountType == "H")
            meetings = await Meeting.find ({startTime: {$gte: start, $lt: end}}, {_id: 0})
        else if (accountType == "M")
            meetings = await Meeting.find ({startTime: {$gte: start, $lt: end}}, {_id: 0, username: 0, attendeeList: 0});

        res.send (meetings);
    },

    /////////////////////////////////////////////////
    getSeeBookedMeetings: (req, res) =>{
        //using req.query date month and year, make a new date 
        //use these days to make an array of start and end times all under the same date 
        console.log("HERE"); 
    }


};

export default bookviewController;