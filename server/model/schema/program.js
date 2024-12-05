const mongoose = require('mongoose');

const Program = new mongoose.Schema({
    programname: String,
    programid: String,
    deleted: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('program', Program);