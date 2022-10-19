import mongoose from "mongoose";

var UserSchema = new mongoose.Schema({
    userID: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    employeeType: {
        type: String,
        required: true
    }
});

const User =  mongoose.model ('User', UserSchema);
export default User;