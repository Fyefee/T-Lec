const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        trim: true
    },
    description: {
        type: String, 
        trim: true
    },
    contact: {
        type: String, 
        trim: true
    },
    tag: {
        type: Array, 
    },
    privacy: {
        type: String, 
        required: true,
        trim: true
    },
    userPermission: {
        type: Array, 
    },
    owner: {
        type: String, 
        required: true,
        trim: true
    },
    downloadFromUser: {
        type: Array, 
    },
    rating: {
        type: Array, 
    },
    ratingAvg: {
        type: Number, 
    },
    fileName: {
        type: String, 
        trim: true
    },
    fileUrl: {
        type: String, 
        trim: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: Array, 
    }
})

module.exports = mongoose.model("Lecture", LectureSchema);