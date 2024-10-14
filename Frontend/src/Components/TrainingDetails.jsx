import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';
import Bar from './Bar';
import { Link } from 'react-router-dom';
import '../App.css';

const TrainingDetails = () => {
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [trainingFilter, setTrainingFilter] = useState('');
    const [trainerFilter, setTrainerFilter] = useState('');
    const [domainFilter, setDomainFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [uniqueTrainings, setUniqueTrainings] = useState([]);
    const [uniqueDomains, setUniqueDomains] = useState([]);
    const token = localStorage.getItem('token');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const trainingResponse = await axios.get('http://localhost:5000/trainings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrainings(trainingResponse.data);
                
                // Get unique training names
                const trainingNames = [...new Set(trainingResponse.data.map(t => t.name))];
                setUniqueTrainings(trainingNames);
                
                // Get unique domains
                const domainNames = [...new Set(trainingResponse.data.map(t => t.domain))];
                setUniqueDomains(domainNames);
                
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [token]);

    const filteredTrainings = trainings.filter(training => {
        const matchesTraining = trainingFilter ? training.name === trainingFilter : true;
        const matchesDomain = domainFilter ? training.domain === domainFilter : true;
        const matchesStartDate = startDate ? new Date(training.start_date) >= new Date(startDate) : true;

        return matchesTraining &&  matchesDomain && matchesStartDate;
    });

    return (
        <div>
            <Bar />
            <h2 style={{ marginLeft: '30px', marginTop: '20px', justifyContent: 'center', display: 'flex' }}>List of Trainings</h2>
            <Row style={{ marginLeft: '30px', marginBottom: '20px' }}>
                <Col>
                    <Form.Select onChange={(e) => setTrainingFilter(e.target.value)} defaultValue="">
                        <option value="">Select Training</option>
                        {uniqueTrainings.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Select onChange={(e) => setDomainFilter(e.target.value)} defaultValue="">
                        <option value="">Select Domain</option>
                        {uniqueDomains.map((domain, index) => (
                            <option key={index} value={domain}>{domain}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <Table striped bordered hover style={{ marginLeft: '30px', marginRight: '10px' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Domain</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTrainings.length > 0 ? (
                        filteredTrainings.map(training => (
                            <tr key={training.id}>
                                <td>{training.name}</td>
                                <td>{training.domain}</td>
                                <td>{format(new Date(training.start_date), 'dd MMM yyyy')}</td>
                                <td>{format(new Date(training.end_date), 'dd MMM yyyy')}</td>
                                <td>
                                    <Button variant="primary" size="sm">
                                        <Link id='lin' to={`/viewScore/${training.id}`} style={{ color: '#fff', textDecoration: 'none' }}>View Scores</Link>
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No trainings found</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Button style={{ marginLeft: '30px' }}>
                <Link id='lin' to={`/home`}>Back to Home</Link>
            </Button>
            <ToastContainer />
        </div>
    );
}

export default TrainingDetails;
