// from s1-us1-vincent

import mongoose from "mongoose";


var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model ('User', UserSchema);
