const StudentProgram = require('../../model/schema/studentprogram')
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const dbPool = mysql.createPool({
    host: 'database-pro.c528yk2kagd9.us-east-1.rds.amazonaws.com',
    user: "admin",
    password: "Esk374014",
    database: "classicmodels"
});
const index = async (req, res) => {
    try {        
        const query = {};
        let result = await StudentProgram.aggregate([
            { $match: query },
        ]);

        res.send(result);
    } catch (error) {
        console.error("Error in aggregation:", error);
        res.status(500).send("Internal Server Error");
    }
}

const add = async (req, res) => {
    try {
        console.log(req.body)
        const { studentProgramName, programId, studentId,studentName, startDate, endDate, isActive } = req.body;

        const studentProgramData = {
            studentProgramName,
            programId,
            studentId,
            studentName,
            startDate,
            endDate,
            isActive
        };
        const sqlValues = [
            studentProgramData.studentProgramName || null,
            studentProgramData.programId || null,
            studentProgramData.studentId || null,
            studentProgramData.startDate || null,
            studentProgramData.endDate || null,
            studentProgramData.isActive !== undefined ? isActive : true, // Default to true if undefined
            studentProgramData.studentName || null // Use null if studentName is not provided
        ];

        // Insert into student_programs table
        const query = `
            INSERT INTO student_programs (
                student_program_name, program_id, student_id, start_date, end_date, is_active, student_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [mysqlResult] = await dbPool.execute(query, sqlValues);
        const result = new StudentProgram(studentProgramData);
        await result.save();

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create student program:', err);
        res.status(400).json({ error: 'Failed to create student program:', err });
    }
};


const edit = async (req, res) => {
    try {
        const { studentProgramName, studentProgramId, programId, studentId,studentName, startDate, endDate, isActive } = req.body;

        const studentProgramData = {
            studentProgramName,
            studentProgramId,
            programId,
            studentId,
            studentName,
            startDate,
            endDate,
            isActive
        };

        let result = await StudentProgram.updateOne(
            { _id: req.params.id },
            { $set: studentProgramData }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ error: "No matching StudentProgram found to update" });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to update student program:', err);
        res.status(400).json({ error: 'Failed to update student program:', err });
    }
};


const view = async (req, res) => {
    try {
        let response = await StudentProgram.findOne({ _id: req.params.id });
        if (!response) return res.status(404).json({ message: "No data found." });

        let result = await StudentProgram.aggregate([
            { $match: { _id: response._id } },
            {
                $lookup: {
                    from: "programs",
                    localField: "programId",
                    foreignField: "_id",
                    as: "programDetails"
                }
            },
            {
                $lookup: {
                    from: "contacts", // Collection name for Student
                    localField: "studentId",
                    foreignField: "_id",
                    as: "studentDetails"
                }
            },
            { $project: { deleted: 0 } } // Exclude deleted field
        ]);

        res.status(200).json(result[0]);
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ error: err });
    }
};


const deleteData = async (req, res) => {
    try {
        const result = await StudentProgram.findByIdAndUpdate(req.params.id, { deleted: true });
        if (!result) return res.status(404).json({ message: "No data found to delete." });

        res.status(200).json({ message: "Deleted successfully.", result });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ message: "Failed to delete.", error: err });
    }
};


module.exports = { index, add, edit, view, deleteData }