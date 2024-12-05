const { getNextCaseNumber } = require('../redisController.js');
const {client} = require('../ElasticSearchController/esController');
const Case = require('../../model/schema/case')
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const dbPool = mysql.createPool({
    host: 'database-pro.c528yk2kagd9.us-east-1.rds.amazonaws.com',
    user: "admin",
    password: "Esk374014",
    database: "classicmodels"
});

const index = async (req, res) => {
    console.log("Received Query Params:", req.query);
    let query = req.query;
    query.deleted = false;
    //console.log("Query after adding deleted condition:", query);

    if (query.createBy) {
        query.createBy = new mongoose.Types.ObjectId(query.createBy);
        //console.log("Converted createBy to ObjectId:", query.createBy);
    }

    try {        
        let result = await Case.aggregate([
            { $match: query },
            { $project: { users: 0, contact: 0, Lead: 0 } },
        ]);

        //console.log("Aggregation Result:", result);
        res.send(result);
    } catch (error) {
        console.error("Error in aggregation:", error);
        res.status(500).send("Internal Server Error");
    }
}

const add = async (req, res) => {
    try {
        const { subject,category, casecategory, casesubcatogory, notes, description, backgroundColor, borderColor, textColor, display, url, createBy, assignmentTo, assignmentToLead,deleted } = req.body;
        // Check if assignmentTo is a valid ObjectId if provided and not empty
        if (assignmentTo && !mongoose.Types.ObjectId.isValid(assignmentTo)) {
            res.status(400).json({ error: 'Invalid assignmentTo value' });
        }
        if (assignmentToLead && !mongoose.Types.ObjectId.isValid(assignmentToLead)) {
            res.status(400).json({ error: 'Invalid assignmentToLead value' });
        }
        const caseData = { subject, category,casecategory, casesubcatogory, notes, description, backgroundColor, borderColor, textColor, display, url, createBy };

        if (assignmentTo) {
            caseData.assignmentTo = assignmentTo;
        }
        if (assignmentToLead) {
            caseData.assignmentToLead = assignmentToLead;
        }
        caseData.CaseNumber = await getNextCaseNumber();
        const result = new Case(caseData);
        await result.save();
        const esData = {
            subject: caseData.subject,
            category: caseData.category,
            casecategory: caseData.casecategory,
            casesubcategory: caseData.casesubcategory,
            notes: caseData.notes,
            description: caseData.description,
            backgroundColor: caseData.backgroundColor,
            borderColor: caseData.borderColor,
            textColor: caseData.textColor,
            display: caseData.display,
            url: caseData.url,
            createBy: caseData.createBy.toString(),
            assignmentTo: caseData.assignmentTo?.toString() || null,
            assignmentToLead: caseData.assignmentToLead?.toString() || null,
            CaseNumber: caseData.CaseNumber,
            createdAt: caseData.createdAt,
            updatedAt: caseData.updatedAt,
        };
        try{
            await client.index({
                index: 'cases_information',
                id: caseData.CaseNumber.toString(),
                body: esData,
                refresh: true,  // Refresh the index after the document is indexed
            });
        }   
        catch(err)
        {
            console.error('Error indexing data in Elasticsearch:', err);
            res.status(400).json({ error: 'Failed to create case : ', err });
        }
        const mysqlValues = [
            caseData.CaseNumber,
            caseData.subject || null,
            caseData.category || null,
            caseData.casecategory || null,
            caseData.casesubcategory || null,
            caseData.notes || null,
            caseData.description || null,
            caseData.backgroundColor || null,
            caseData.borderColor || null,
            caseData.textColor || null,
            caseData.display || null,
            caseData.url || null,
            caseData.assignmentTo || null,
            caseData.studentName || null
        ];
        try {
            const [mysqlResult] = await dbPool.execute(
                `INSERT INTO cases (
                    CaseNumber, subject, category, subcategory, notes, description,
                    backgroundColor, borderColor, textColor, display, url, assignmentTo,studentName
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                mysqlValues
            );
        } catch (err) {
            console.error('Error inserting data into MySQL:', err);
            return res.status(500).json({ error: 'Failed to save case to MySQL', err });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to create case:', err);
        res.status(400).json({ error: 'Failed to create case : ', err });
    }
}

const edit = async (req, res) => {
    try {
        const { subject, category, subcatogory, notes, description, backgroundColor, borderColor, textColor, display, url, createBy, assignmentTo, assignmentToLead,deleted } = req.body;

        if (assignmentTo && !mongoose.Types.ObjectId.isValid(assignmentTo)) {
            res.status(400).json({ error: 'Invalid assignmentTo value' });
        }
        const caseData = { subject, category, subcatogory, notes, description, backgroundColor, borderColor, textColor, display, url, createBy };

        if (assignmentTo) {
            caseData.assignmentTo = assignmentTo;
        }
        let result = await Case.updateOne(
            { _id: req.params.id },
            { $set: caseData }
        );

        // const result = new Task(taskData);
        // await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to update case:', err);
        res.status(400).json({ error: 'Failed to update case : ', err });
    }
}

const view = async (req, res) => {
    try {
        let response;
        if (req.params.id.startsWith('CASE')) {
            response = await Case.findOne({ CaseNumber: req.params.id });
        } else {
            // Search by _id otherwise
            response = await Case.findOne({ _id: req.params.id });
        }

        if (!response) return res.status(404).json({ message: "no Data Found." })
        let result = await Case.aggregate([
            { $match: { _id: response._id } },
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
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$Lead', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    assignmentToName: {
                        $cond: {
                            if: '$contact',
                            then: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                            else: { $concat: ['$Lead.leadName'] }
                        }
                    },
                    createByName: '$users.username',
                }
            },
            { $project: { contact: 0, users: 0, Lead: 0 } },
        ])
        res.status(200).json(result[0]);

    } catch (err) {
        console.log('Error:', err);
        res.status(400).json({ Error: err });
    }
}

const deleteData = async (req, res) => {
    try {
        const result = await Case.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", result })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { index, add, edit, view, deleteData }