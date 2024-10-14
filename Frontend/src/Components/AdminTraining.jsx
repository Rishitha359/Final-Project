import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';
import Bar from './Bar';
import { Link } from 'react-router-dom';
import '../App.css';

const AdminTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [show, setShow] = useState(false);
    const [trainingFilter, setTrainingFilter] = useState('');
    const [trainerFilter, setTrainerFilter] = useState('');
    const [domainFilter, setDomainFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [uniqueTrainings, setUniqueTrainings] = useState([]);
    const [uniqueTrainers, setUniqueTrainers] = useState([]);
    const [uniqueDomains, setUniqueDomains] = useState([]);
    const token = localStorage.getItem('token');

    const handleClose = () => {
        setShow(false);
        setSelectedTraining(null);
    };

    const handleShow = (event) => {
        setSelectedTraining(event);
        setShow(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trainingResponse = await axios.get('http://localhost:5000/trainingDetails', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrainings(trainingResponse.data);
                
                // Get unique training names
                const trainingNames = [...new Set(trainingResponse.data.map(t => t.name))];
                setUniqueTrainings(trainingNames);
                
                // Get unique trainers
                const trainerNames = [...new Set(trainingResponse.data.map(t => t.trainer.name))];
                setUniqueTrainers(trainerNames);
                
                // Get unique domains
                const domainNames = [...new Set(trainingResponse.data.map(t => t.domain))];
                setUniqueDomains(domainNames);
                
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [token]);

    const handleUpdateTraining = async (e) => {
        e.preventDefault();
        if (!selectedTraining) return;

        const updatedTraining = {
            name: e.target.name.value,
            domain: e.target.domain.value,
            start_date: new Date(e.target.start_date.value).toISOString(),
            end_date: new Date(e.target.end_date.value).toISOString(),
        };

        try {
            await axios.post(`http://localhost:5000/updateTraining/${selectedTraining.id}`, updatedTraining, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrainings(trainings.map(training => training.id === selectedTraining.id ? { ...training, ...updatedTraining } : training));
            toast.success('Training details updated successfully');
            handleClose();
        } catch (error) {
            console.error('Failed to update Training', error);
            toast.error('Failed to update Training');
        }
    };

    const handleDeleteTraining = async (trainId) => {
        try {
            await axios.delete(`http://localhost:5000/deleteTraining/${trainId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrainings(trainings.filter(training => training.id !== trainId));
            toast.success('Training deleted successfully');
        } catch (error) {
            console.error('Failed to delete Training', error);
            toast.error('Failed to delete Training');
        }
    };

    const filteredTrainings = trainings.filter(training => {
        const matchesTraining = trainingFilter ? training.name === trainingFilter : true;
        const matchesTrainer = trainerFilter ? training.trainer.name === trainerFilter : true;
        const matchesDomain = domainFilter ? training.domain === domainFilter : true;
        const matchesStartDate = startDate ? new Date(training.start_date) >= new Date(startDate) : true;

        return matchesTraining && matchesTrainer && matchesDomain && matchesStartDate;
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
                    <Form.Select onChange={(e) => setTrainerFilter(e.target.value)} defaultValue="">
                        <option value="">Select Trainer</option>
                        {uniqueTrainers.map((name, index) => (
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
                        <th>Trainer</th>
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
                                <td>{training.trainer.name}</td>
                                <td>{format(new Date(training.start_date), 'dd MMM yyyy')}</td>
                                <td>{format(new Date(training.end_date), 'dd MMM yyyy')}</td>
                                <td>
                                    <Button variant="primary" size="sm">
                                        <Link id='lin' to={`/viewScores/${training.id}`} style={{ color: '#fff', textDecoration: 'none' }}>View Scores</Link>
                                    </Button>{' '}
                                    <Button variant="warning" size="sm" onClick={() => handleShow(training)}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteTraining(training.id)}>Delete</Button>
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
                <Link id='lin' to={`/home`}>Back</Link>
            </Button>
            <Button style={{ marginLeft: '30px' }}>
                <Link id='lin' to={`/addTraining`}>Add Training</Link>
            </Button>
            <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Training Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTraining && (
                        <Form onSubmit={handleUpdateTraining}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    defaultValue={selectedTraining.name}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Domain Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="domain"
                                    defaultValue={selectedTraining.domain}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Trainer Name</Form.Label>
                                <Form.Select defaultValue={selectedTraining.trainer.id} name='trainer'>
                                    {uniqueTrainers.length > 0 ? uniqueTrainers.map((trainer, index) => 
                                        <option key={index} value={trainer.id}>{trainer}</option>
                                    ) : <option>Loading...</option>}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="start_date"
                                    defaultValue={format(new Date(selectedTraining.start_date), 'yyyy-MM-dd')}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="end_date"
                                    defaultValue={format(new Date(selectedTraining.end_date), 'yyyy-MM-dd')}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">Save Changes</Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default AdminTraining;
