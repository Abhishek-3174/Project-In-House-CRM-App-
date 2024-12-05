const { client } = require('../ElasticSearchController/esController.js');

const search = async (req, res) => {
    try {
        const { query } = req.body;
        console.log('Search Query:', query);

        // Task search
        let taskResults;
        try {
            taskResults = await client.search({
                index: 'tasks_information',
                body: {
                    query: {
                        multi_match: {
                            query,
                            fields: ['title', 'TaskNumber', 'subject', 'description', 'category', 'notes'],
                        },
                    },
                    _source: ['TaskNumber', 'subject'],
                },
            });
            console.log('Task Results Response:', JSON.stringify(taskResults, null, 2));
        } catch (err) {
            console.error('Task search failed:', err);
        }

        // Case search
        let caseResults;
        try {
            caseResults = await client.search({
                index: 'cases_information',
                body: {
                    query: {
                        multi_match: {
                            query,
                            fields: ['subject', 'description', 'category', 'notes'],
                        },
                    },
                    _source: ['CaseNumber', 'subject'],
                },
            });
            console.log('Case Results Response:', JSON.stringify(caseResults, null, 2));
        } catch (err) {
            console.error('Case search failed:', err);
        }

        // Log raw responses
        console.log('Raw Task Response:', taskResults?.hits);
        console.log('Raw Case Response:', caseResults?.hits);

        // Ensure results are defined before accessing hits
        const taskData = taskResults?.hits?.hits?.map(hit => ({
            TaskNumber: hit._source?.TaskNumber || null,
            Subject: hit._source?.subject || null,
        })).filter(data => data.TaskNumber) || [];

        const caseData = caseResults?.hits?.hits?.map(hit => ({
            CaseNumber: hit._source?.CaseNumber || null,
            Subject: hit._source?.subject || null,
        })).filter(data => data.CaseNumber) || [];

        res.status(200).json({ tasks: taskData, cases: caseData });
    } catch (err) {
        console.error('Search failed:', err);
        res.status(500).json({ error: 'Search failed', message: err.message });
    }
};

module.exports = { search };
