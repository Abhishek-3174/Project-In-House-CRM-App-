import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdvanceSearch = () => {
    const [query, setQuery] = useState('');
    const [tasks, setTasks] = useState([]);
    const [cases, setCases] = useState([]);

    const navigate = useNavigate(); // React Router navigation hook

    const handleSearch = async () => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:5001/api/elasticsearch/getRelatedData/',
                { query },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            setTasks(response.data.tasks || []);
            setCases(response.data.cases || []);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const redirectToTaskView = (taskId) => {
        navigate(`/admin/view/${taskId}`); // Redirects to the task view route
    };
    const redirectToCaseView = (caseId) => {
        console.log(caseId);
        navigate(`/admin/caseView/view/${caseId}`); // Redirects to the task view route
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Advanced Search</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your search query..."
                style={{ padding: '10px', width: '300px', marginRight: '10px' }}
            />
            <button onClick={handleSearch} style={{ padding: '10px 20px' }}>
                Search
            </button>

            {tasks.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Tasks</h3>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Task Number</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subject</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, index) => (
                                <tr key={index} style={{ cursor: 'pointer' }}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            redirectToTaskView(task.TaskNumber);
                                        }}
                                        style={{ color: 'blue', textDecoration: 'underline' }}
                                    >
                                        {task.TaskNumber}
                                    </a>
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {task.Subject || 'N/A'}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {cases.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Cases</h3>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Case Number</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subject</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map((caseItem, index) => (
                                <tr key={index} style={{ cursor: 'pointer' }}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            redirectToCaseView(caseItem.CaseNumber);
                                        }}
                                        style={{ color: 'blue', textDecoration: 'underline' }}
                                    >
                                        {caseItem.CaseNumber}
                                    </a>
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {caseItem.Subject || 'N/A'}
                                </td>
                            </tr>
                            
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdvanceSearch;
