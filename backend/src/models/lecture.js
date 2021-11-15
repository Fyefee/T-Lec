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
    count: {
        type: Array, 
    },
    count: {
        type: Number, 
    },
})

module.exports = mongoose.model("Lecture", LectureSchema);