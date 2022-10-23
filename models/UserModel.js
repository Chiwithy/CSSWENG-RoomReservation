import mongoose from "mongoose";

var UserSchema = new mongoose.Schema({
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
