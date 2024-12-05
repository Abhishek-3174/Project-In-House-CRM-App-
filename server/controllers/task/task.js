const { getNextTaskNumber } = require('../redisController.js');
const {client} = require('../ElasticSearchController/esController.js');
const Task = require('../../model/schema/task')
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const dbPool = mysql.createPool({
    host: 'database-pro.c528yk2kagd9.us-east-1.rds.amazonaws.com',
    user: "admin",
    password: "Esk374014",
    database: "classicmodels"
});

const index = async (req, res) => {
    query = req.query;
    query.deleted = false;
    if (query.createBy) {
        query.createBy = new mongoose.Types.ObjectId(query.createBy);
    }

    try {
        let result = await Task.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'assignmentTo',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'leads', // Assuming this is the collection name for 'leads'
                    localField: 'assignmentToLead',
                    foreignField: '_id',
                    as: 'Lead'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$Lead', preserveNullAndEmptyArrays: true } },
            { $match: { 'users.deleted': false } },
            {
                $addFields: {
                    assignmentToName: {
                        $cond: {
                            if: '$contact',
                            then: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                            else: { $concat: ['$Lead.leadName'] }
                        }
                    },
                }
            },
            { $project: { users: 0, contact: 0, Lead: 0 } },
        ]);

        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}

const add = async (req, res) => {
    try {
        const { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, createBy, assignmentTo, assignmentToLead,studentName } = req.body;
        
        // Validate assignmentTo and assignmentToLead
        if (assignmentTo && !mongoose.Types.ObjectId.isValid(assignmentTo)) {
            return res.status(400).json({ error: 'Invalid assignmentTo value' });
        }
        if (assignmentToLead && !mongoose.Types.ObjectId.isValid(assignmentToLead)) {
            return res.status(400).json({ error: 'Invalid assignmentToLead value' });
        }

        // Prepare task data
        const taskData = { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, createBy,studentName };

        if (assignmentTo) taskData.assignmentTo = assignmentTo;
        if (assignmentToLead) taskData.assignmentToLead = assignmentToLead;
        taskData.TaskNumber = await getNextTaskNumber();

        // Save task to MongoDB
        const result = new Task(taskData);
        await result.save();
        console.log()
        const taskSqlData = [
            taskData.title || null,
            taskData.category || null,
            taskData.description || null,
            taskData.notes || null,
            taskData.assignmentTo || null, // Null if not provided
            taskData.studentName || null,
            taskData.assignmentToLead || null, // Null if not provided
            taskData.reminder || null,
            taskData.start || null,
            taskData.end || null,
            taskData.backgroundColor || null,
            taskData.borderColor || null,
            taskData.textColor || null,
            taskData.display || null,
            taskData.url || null,
            taskData.TaskNumber
        ];

        // SQL query for inserting data
        const query = `
            INSERT INTO tasks (
                title, category, description, notes, assignment_to, student_name, assignment_to_lead,
                reminder, start, end, background_color, border_color, text_color, display, url, task_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Execute query
        console.log(taskSqlData)
        const [mysqlResult] = await dbPool.execute(query, taskSqlData);

        // Prepare data for Elasticsearch
        const esData = {
            title: taskData.title,
            category: taskData.category,
            description: taskData.description,
            notes: taskData.notes,
            reminder: taskData.reminder,
            start: taskData.start,
            end: taskData.end,
            backgroundColor: taskData.backgroundColor,
            borderColor: taskData.borderColor,
            textColor: taskData.textColor,
            display: taskData.display,
            url: taskData.url,
            createBy: taskData.createBy.toString(),
            assignmentTo: taskData.assignmentTo?.toString() || null,
            assignmentToLead: taskData.assignmentToLead?.toString() || null,
            TaskNumber: taskData.TaskNumber,
            createdAt: taskData.createdAt,
            updatedAt: taskData.updatedAt,
            studentName : taskData.studentName,
        };

        // Try to index data into Elasticsearch
        try {
            await client.index({
                index: 'tasks_information',
                id: taskData.TaskNumber.toString(),
                body: esData,
                refresh: true,
            });
        } catch (err) {
            console.error('Error indexing data in Elasticsearch:', err);
            return res.status(400).json({ error: 'Failed to create task: Elasticsearch error', details: err });
        }

        // Send success response after successful task creation
        return res.status(200).json(result);

    } catch (err) {
        console.error('Failed to create task:', err);
        // Avoid calling res multiple times
        if (!res.headersSent) {
            return res.status(400).json({ error: 'Failed to create task', details: err });
        }
    }
};

const edit = async (req, res) => {
    try {
        const { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, createBy, assignmentTo } = req.body;

        if (assignmentTo && !mongoose.Types.ObjectId.isValid(assignmentTo)) {
            res.status(400).json({ error: 'Invalid assignmentTo value' });
        }
        const taskData = { title, category, description, notes, reminder, start, end, backgroundColor, borderColor, textColor, display, url, createBy };

        if (assignmentTo) {
            taskData.assignmentTo = assignmentTo;
        }
        let result = await Task.updateOne(
            { _id: req.params.id },
            { $set: taskData }
        );

        // const result = new Task(taskData);
        // await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create task:', err);
        res.status(400).json({ error: 'Failed to create task : ', err });
    }
}

const view = async (req, res) => {
    try {
        // Determine if the parameter starts with "TASK"
        let response;
        if (req.params.id.startsWith('TASK')) {
            // Search by TaskNumber if the parameter starts with "TASK"
            response = await Task.findOne({ TaskNumber: req.params.id });
        } else {
            // Search by _id otherwise
            response = await Task.findOne({ _id: req.params.id });
        }

        // If no response is found, return a 404 error
        if (!response) return res.status(404).json({ message: "No Data Found." });

        // Perform aggregation with additional lookups
        let result = await Task.aggregate([
            { $match: { _id: response._id } },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'assignmentTo',
                    foreignField: '_id',
                    as: 'contact',
                },
            },
            {
                $lookup: {
                    from: 'leads',
                    localField: 'assignmentToLead',
                    foreignField: '_id',
                    as: 'Lead',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users',
                },
            },
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$Lead', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    assignmentToName: {
                        $cond: {
                            if: '$contact',
                            then: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                            else: { $concat: ['$Lead.leadName'] },
                        },
                    },
                    createByName: '$users.username',
                },
            },
            { $project: { contact: 0, users: 0, Lead: 0 } },
        ]);

        // Return the first result
        res.status(200).json(result[0]);
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ Error: err });
    }
};


const deleteData = async (req, res) => {
    try {
        const result = await Task.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { index, add, edit, view, deleteData }