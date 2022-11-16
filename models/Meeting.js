import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema ({
    meetingID: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    meetingRoom: {
        type: String,
        required: true
    },
    marketingRequest: {
        type: String
    },
    marketingStatus: {
        type: Boolean
    },
    meetingStatus: {
        type: String,
        required: true
    },
    attendeeList: {
        type: String
    }
});

const Meeting = mongoose.model('Meeting', MeetingSchema);
export default Meeting;