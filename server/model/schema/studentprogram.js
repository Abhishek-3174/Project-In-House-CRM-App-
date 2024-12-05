const mongoose = require('mongoose');

const studentProgramSchema = new mongoose.Schema({
    studentProgramName: String,
    programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "program",
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "contact",
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    studentName: String,
});
const StudentProgram = mongoose.models.StudentProgram || mongoose.model('StudentProgram', studentProgramSchema);

module.exports = StudentProgram;
