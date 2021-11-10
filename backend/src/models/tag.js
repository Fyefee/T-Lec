const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    tagName: {
        type: String, 
        required: true,
        trim: true
    },
    count: {
        type: Number, 
    },
})

module.exports = mongoose.model("Tag", TagSchema);