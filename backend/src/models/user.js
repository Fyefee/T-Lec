const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String, 
        required: true,
        trim: true
    },
    lastname: {
        type: String, 
        required: true,
        trim: true
    },
    image: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true,
    }
})

module.exports = mongoose.model("User", UserSchema);