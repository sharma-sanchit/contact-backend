const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the user name"],
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: [true, "Email address already taken"],
    },
    password: {
        type: String,
        required: [true, "Please add the password"],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);