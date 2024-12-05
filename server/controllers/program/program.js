const Program = require('../../model/schema/program')
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
        // Fetch all programs
        const result = await Program.find({}); // Fetch all data without filters

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching programs:", error);
        res.status(500).send("Internal Server Error");
    }
};


const add = async (req, res) => {
    try {
        console.log(req.body)
        const { programname,programid } = req.body;
        // Check if assignmentTo is a valid ObjectId if provided and not empty
        const programData = { programname,programid };

        const result = new Program(programData);
        await result.save();
         // Insert into SQL database
         const sqlValues = [
            programData.programname,
            programData.programid,
            false // Default value for deleted
        ];

        const [mysqlResult] = await dbPool.execute(
            `INSERT INTO programs (
                programname, programid, deleted
            ) VALUES (?, ?, ?)`,
            sqlValues
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create case:', err);
        res.status(400).json({ error: 'Failed to create case : ', err });
    }
}

const edit = async (req, res) => {
    try {
        const { programname,programid } = req.body;

        const programData = { programname,programid };

        let result = await Program.updateOne(
            { _id: req.params.id },
            { $set: programData }
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to update case:', err);
        res.status(400).json({ error: 'Failed to update case : ', err });
    }
}

const view = async (req, res) => {
    try {
        let response = await Program.findOne({ _id: req.params.id })
        if (!response) return res.status(404).json({ message: "no Data Found." })
        let result = await Program.aggregate([
            { $match: { _id: response._id } },
        ])
        res.status(200).json(result[0]);

    } catch (err) {
        console.log('Error:', err);
        res.status(400).json({ Error: err });
    }
}

const deleteData = async (req, res) => {
    try {
        const result = await Program.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { index, add, edit, view, deleteData }