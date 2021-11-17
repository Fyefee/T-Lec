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
    likeFromUser: {
        type: Array, 
    },
    rating: {
        type: Map,
        of: String
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
        type: String, 
        required: true,
        trim: true
    },
})

module.exports = mongoose.model("Lecture", LectureSchema);