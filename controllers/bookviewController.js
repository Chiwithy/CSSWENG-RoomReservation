import Meeting from "../models/Meeting.js";

const bookviewController = {
    getBookview: (req, res) => {
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currDate = new Date(req.query.year, req.query.month, req.query.date); 
        let currMonth = month[currDate.getMonth()]; 


        //////////////////////////////////////////////////////////////////////
        //using req.query date month and year, make a new date 
        //use these days to make an array of start and end times all under the same date 

        var i;  
        var startHour, startMinute; 
        var endHour, endMinute; 
        const startTimes = new Array(); 
        const startView = new Array(); 
        const endTimes = new Array();
        
        startHour = 7; 
        endHour = 7; 

        //creates an arry of all possible start times 
        for(i=0; i<20; i++){
            startMinute = 0; 
            if(i%2 == 0){
                startHour++; 
            }
            else{
                startMinute = 30;
            }
            var startTime = new Date(req.query.year, req.query.month, req.query.date, startHour, startMinute); 
            //startTime.setTime(startTime.getTime() - new Date().getTimezoneOffset()*60*1000); //offsets time
            startTimes.push(startTime); 
        }

        for(i=0; i<startTimes.length; i++){
            // endMinute = 30; 
            // if (startTimes[i].getMinutes() == 0){
            //     endTimes.push(new Date(req.query.year, req.query.month, req.query.date, endHour, endMinute));
            // }
            // else{
            //     endMinute = 30; 
            //     endHour++; 
            //     endTimes.push(new Date(req.query.year, req.query.month, req.query.date, endHour, endMinute));
            // }

            endMinute = 0; 
            var endTime = new Date(req.query.year, req.query.month, req.query.date, endHour, endMinute); 
            endTime.setTime(endTime.getTime() - new Date().getTimezoneOffset()*60*1000); //offsets time
            endTimes.push(endTime);
            endHour++; 
            
        }

        //creates an array based on startTimes array (only times -- no dates)
        for(i=0; i<startTimes.length; i++){
            startView.push(startTimes[i].toLocaleTimeString()); 
        }

        for(i=0; i<startTimes.length; i++){
            console.log(startTimes[i]); 
        }

        ///////////////////////////////////////////////////////////////////////////////


        res.render("booking", {month: currMonth, date: req.query.date, year: req.query.year, username: req.user.username, startView:startView});
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
    }

    // /////////////////////////////////////////////////
    // getBookedMeetings: (req, res) =>{
    //     //using req.query date month and year, make a new date 
    //     //use these days to make an array of start and end times all under the same date 

    //     var i;  
    //     var startHour, startMinute; 
    //     const startTimes = new Array(); 
    //     // const endTimes = new Array();
        
    //     startHour = 7; 

    //     //creates an arry of all possible start times 
    //     for(i=0; i<20; i++){
    //         startMinute = 0; 
    //         if(i%2 == 0){
    //             startHour++; 
    //         }
    //         else{
    //             startMinute = 30;
    //         }
    //         startTimes.push(new Date(req.query.year, req.query.month, req.query.date, startHour, startMinute));
    //         let startTime = startTimes[startTimes.length - 1];
    //         startTime.setTime(startTime.getTime() - new Date().getTimezoneOffset()*60*1000); //offsets time  
    //     }

    //     res.render("booking", {startTimes: startTimes}); 
    //     // for(i=0; i<startTimes.length; i++){
    //     //     console.log(startTimes[i]); 
    //     // }
    //
    // }


};

export default bookviewController;