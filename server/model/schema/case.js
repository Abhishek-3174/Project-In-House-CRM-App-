const mongoose = require('mongoose');

const Case = new mongoose.Schema({
    subject: String,
    category: String,
    subcategory: String,
    description: String,
    notes: String,
    status: String,
    assignmentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "contact",
    },
    studentName : String,
    assignmentToLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
    },
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
    CaseNumber: {
        type: String,
        unique: true,
        required: true
    },
})

module.exports = mongoose.model('case', Case);