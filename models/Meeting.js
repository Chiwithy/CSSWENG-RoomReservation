// TODO add Meeting DB schema (Francis)
const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    meetingID: Number,
    userID: Number,
    name: String,
    dateTime: Date,
    meetingRoom: String,
    marketingRequest: String,
    reqAccomplished: Boolean,
    status: String,
    attendeeList: String
});

const Meeting = mongoose.model('Meeting', MeetingSchema);

module.exports = Meeting;