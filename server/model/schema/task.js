const mongoose = require('mongoose');

const Task = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    notes: String,
    assignmentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "contact",
    },
    studentName : String,
    assignmentToLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
    },
    reminder: String,
    start: String,
    end: String,
    backgroundColor: String,
    borderColor: String,
    textColor: String,
    display: String,
    url: String,
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    TaskNumber: {
        type: String,
        unique: true,
        required: true
    },
})

module.exports = mongoose.model('task', Task);