const mongoose = require('mongoose');

const Order = new mongoose.Schema({
    studentProgramId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "studentprogram",
    },
    orderId: {
        type: String
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contact',
        required: true
    },
    studentName : String,
    orderedDate: {
        type: Date,
        required: true
    },
    orderValue: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Order', Order);