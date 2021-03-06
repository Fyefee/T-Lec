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
    },
    following: {
        type: Array, 
    },
    follower: {
        type: Array, 
    },
    post: {
        type: Array, 
    },
    recentView: {
        type: Array, 
    },
    notification : {
        type: Array, 
    }
})

module.exports = mongoose.model("User", UserSchema);