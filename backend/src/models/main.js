const mongoose = require('mongoose');

const MainSchema = new mongoose.Schema({
    title: {
        type: String, 
        trim: true
    },
    newPost: {
        type: Array,
    },

})

module.exports = mongoose.model("Main", MainSchema);