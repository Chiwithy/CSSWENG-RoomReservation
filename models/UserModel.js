var mongoose = require ('mongoose');


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

module.exports = mongoose.model ('User', UserSchema);