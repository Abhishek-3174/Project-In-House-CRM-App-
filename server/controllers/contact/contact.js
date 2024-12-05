const Contact = require('../../model/schema/contact')
const StudentProgramModal = require('../../model/schema/studentprogram')
const StudentOrdersModal = require('../../model/schema/order')
const TasksModal = require('../../model/schema/task')
const emailHistory = require('../../model/schema/email')
const MeetingHistory = require('../../model/schema/meeting')
const phoneCall = require('../../model/schema/phoneCall')
const Task = require('../../model/schema/task')
const TextMsg = require('../../model/schema/textMsg')
const DocumentSchema = require('../../model/schema/document')
const mysql = require('mysql2/promise');
const dbPool = mysql.createPool({
    host: 'database-pro.c528yk2kagd9.us-east-1.rds.amazonaws.com',
    user: "admin",
    password: "Esk374014",
    database: "classicmodels"
});

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;

    let allData = await Contact.find(query).populate({
        path: 'createBy',
        match: { deleted: false } // Populate only if createBy.deleted is false
    }).exec()

    const result = allData.filter(item => item.createBy !== null);

    try {
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}

const add = async (req, res) => {
    try {
        const user = new Contact(req.body);
        user.studentName = `${user.firstName} ${user.lastName}`.trim();

        const sqlValues = [
            user.firstName || null,
            user.lastName || null,
            user.studentName,
            user.title || null,
            user.email || null,
            user.phoneNumber || null,
            user.mobileNumber || null,
            user.physicalAddress || null,
            user.mailingAddress || null,
            user.preferredContactMethod || null,
            user.leadSource || null,
            user.referralSource || null,
            user.campaignSource || null,
            user.leadStatus || null,
            user.leadRating || null,
            user.leadConversionProbability || null,
            user.notesandComments || null,
            user.tagsOrLabelsForcategorizingcontacts || null,
            user.birthday || null,
            user.anniversary || null,
            user.keyMilestones || null,
            user.dob || null,
            user.gender || null,
            user.occupation || null,
            user.interestsOrHobbies || null,
            user.communicationFrequency || null,
            user.preferences || null,
            user.linkedInProfile || null,
            user.facebookProfile || null,
            user.twitterHandle || null,
            user.otherProfiles || null,
            user.agentOrTeamMember || null,
            user.internalNotesOrComments || null,
            new Date(), // createdAt
            new Date(), // updatedAt
        ];

        // Insert the data into the SQL database
        const [mysqlResult] = await dbPool.execute(
            `INSERT INTO contacts (
                firstName, lastName, studentName, title, email, phoneNumber, mobileNumber,
                physicalAddress, mailingAddress, preferredContactMethod, leadSource, referralSource,
                campaignSource, leadStatus, leadRating, leadConversionProbability, notesandComments,
                tagsOrLabelsForcategorizingcontacts, birthday, anniversary, keyMilestones, dob, gender,
                occupation, interestsOrHobbies, communicationFrequency, preferences, linkedInProfile,
                facebookProfile, twitterHandle, otherProfiles, agentOrTeamMember, internalNotesOrComments,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
            sqlValues
        );

        res.status(200).json({ message: 'Contact created successfully', id: mysqlResult.insertId });
    } catch (err) {
        console.error('Failed to create Contact:', err);
        res.status(400).json({ error: 'Failed to create Contact' });
    }
};


const addPropertyInterest = async (req, res) => {
    try {
        const { id } = req.params
        //await Contact.updateOne({ _id: id }, { $set: { interestProperty: req.body } });
        //res.send(' uploaded successfully.');
    } catch (err) {
        //console.error('Failed to create Contact:', err);
        //res.status(400).json({ error: 'Failed to create Contact' });
    }
}

const edit = async (req, res) => {
    try {
        let result = await Contact.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Contact:', err);
        res.status(400).json({ error: 'Failed to Update Contact' });
    }
}

const view = async (req, res) => {
    try {
        let contact = await Contact.findOne({ _id: req.params.id });
        //let interestProperty = await Contact.findOne({ _id: req.params.id }).populate("interestProperty")

        if (!contact) return res.status(404).json({ message: 'No data found.' })
        let EmailHistory = await emailHistory.aggregate([
            { $match: { createBy: contact._id } },
            {
                $lookup: {
                    from: 'contacts', // Assuming this is the collection name for 'contacts'
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'createByRef'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$createByRef', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$createByrefLead', preserveNullAndEmptyArrays: true } },
            { $match: { 'users.deleted': false } },
            {
                $addFields: {
                    senderName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    deleted: {
                        $cond: [
                            { $eq: ['$createByRef.deleted', false] },
                            '$createByRef.deleted',
                            { $ifNull: ['$createByrefLead.deleted', false] }
                        ]
                    },

                    createByName: {
                        $cond: {
                            if: '$createByRef',
                            then: { $concat: ['$createByRef.title', ' ', '$createByRef.firstName', ' ', '$createByRef.lastName'] },
                            else: { $concat: ['$createByrefLead.leadName'] }
                        }
                    },
                }
            },
            {
                $project: {
                    createByRef: 0,
                    createByrefLead: 0,
                    users: 0,
                }
            },           
        ]);
        let phoneCallHistory = await phoneCall.aggregate([
            { $match: { createBy: contact._id } },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: '$contact' },
            { $match: { 'contact.deleted': false } },
            {
                $addFields: {
                    senderName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    deleted: '$contact.deleted',
                    createByName: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                }
            },
            {
                $project: { contact: 0, users: 0 }
            },
        ]);
        let meetingHistory = await MeetingHistory.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $in: [contact._id, '$attendes'] },
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'attendes',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    attendesArray: '$contact.email',
                    createdByName: '$users.username',
                }
            },
            {
                $project: {
                    contact: 0,
                    users: 0
                }
            }
        ]);
        let textMsg = await TextMsg.aggregate([
            { $match: { createFor: contact._id } },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'createFor',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: '$contact' },
            { $match: { 'contact.deleted': false } },
            {
                $addFields: {
                    sender: '$users.username',
                    deleted: '$contact.deleted',
                    createByName: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                }
            },
            {
                $project: { contact: 0, users: 0 }
            },
        ]);

        let task = await Task.aggregate([
            { $match: { assignmentTo: contact._id } },
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
                    from: 'users',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    assignmentToName: '$contact.email',
                    createByName: '$users.username',
                }
            },
            { $project: { contact: 0, users: 0 } },
        ])

        const Document = await DocumentSchema.aggregate([
            { $unwind: '$file' },
            { $match: { 'file.deleted': false, 'file.linkContact': contact._id } },
            {
                $lookup: {
                    from: 'users', // Replace 'users' with the actual name of your users collection
                    localField: 'createBy',
                    foreignField: '_id', // Assuming the 'createBy' field in DocumentSchema corresponds to '_id' in the 'users' collection
                    as: 'creatorInfo'
                }
            },
            { $unwind: { path: '$creatorInfo', preserveNullAndEmptyArrays: true } },
            { $match: { 'creatorInfo.deleted': false } },
            {
                $group: {
                    _id: '$_id',  // Group by the document _id (folder's _id)
                    folderName: { $first: '$folderName' }, // Get the folderName (assuming it's the same for all files in the folder)
                    createByName: { $first: { $concat: ['$creatorInfo.firstName', ' ', '$creatorInfo.lastName'] } },
                    files: { $push: '$file' }, // Push the matching files back into an array
                }
            },
            { $project: { creatorInfo: 0 } },
        ]);

        res.status(200).json({ contact, EmailHistory, phoneCallHistory, meetingHistory, textMsg, task, Document });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error, err: 'An error occurred.' });
    }
}

const deleteData = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", contact })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const contact = await Contact.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", contact })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const getStudentPrograms = async(req,res) => {
    const { contactId } = req.params;
    const studentProgramsData = await StudentProgramModal.find({ studentId: contactId });
    if (studentProgramsData.length === 0) {
        return res.status(200).json({ message: "No student programs found for this contact" });
    }

    res.status(200).json(studentProgramsData);
}
const getOrders = async(req,res) => {
    const { contactId } = req.params;
    const StudentOrdersData = await StudentOrdersModal.find({ studentId: contactId });
    if (StudentOrdersData.length === 0) {
        return res.status(200).json({ message: "No student order found for this contact" });
    }

    res.status(200).json(StudentOrdersData);
}
const getTasks = async(req,res) => {
    const { contactId } = req.params;
    const TasksData = await TasksModal.find({ assignmentTo: contactId });
    if (TasksData.length === 0) {
        return res.status(200).json({ message: "No tasks found for this contact" });
    }

    res.status(200).json(TasksData);
}
module.exports = { index, add, addPropertyInterest, view, edit, deleteData, deleteMany,getStudentPrograms,getOrders,getTasks }