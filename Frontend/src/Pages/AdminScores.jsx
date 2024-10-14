import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button, Form, Row, Col } from 'react-bootstrap';
import Bar from '../Components/Bar';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminScores = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTraining, setSelectedTraining] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getScore`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvaluations(response.data);
      } catch (error) {
        console.error('Error fetching evaluation data:', error);
        toast.error('Failed to fetch evaluation data.');
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getEmployees`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast.error('Failed to fetch employee data.');
      }
    };

    const fetchTrainings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/trainingDetails`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrainings(response.data);
      } catch (error) {
        console.error('Error fetching training data:', error);
        toast.error('Failed to fetch training data.');
      }
    };

    fetchEvaluations();
    fetchEmployees();
    fetchTrainings();
  }, [token]);

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesEmployee = selectedEmployee ? evaluation.employee.id === parseInt(selectedEmployee) : true;
    const matchesTraining = selectedTraining ? evaluation.training.id === parseInt(selectedTraining) : true;
    return matchesEmployee && matchesTraining;
  });

  return (
      <><Bar /><h3 style={{marginLeft:'45%'}}>Training Scores</h3><Row className="mb-4">
      <Col md={6}>
        <Form.Group controlId="employeeSelect" style={{marginLeft:'30px'}}>
          <Form.Label>Select Employee</Form.Label>
          <Form.Control as="select" onChange={e => setSelectedEmployee(e.target.value)} value={selectedEmployee}>
            <option value="">All Employees</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="trainingSelect" >
          <Form.Label>Select Training</Form.Label>
          <Form.Control as="select" onChange={e => setSelectedTraining(e.target.value)} value={selectedTraining}>
            <option value="">All Trainings</option>
            {trainings.map(training => (
              <option key={training.id} value={training.id}>{training.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Col>
    </Row><div>
        <Table striped bordered hover style={{marginLeft:'30px'}}>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Training Name</th>
              <th>Hackerrank Score (10)</th>
              <th>Punctuality (10)</th>
              <th>Discipline (10)</th>
              <th>Standards Followed (10)</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvaluations.length > 0 ? (
              filteredEvaluations.map(evaluation => (
                <tr key={evaluation.id}>
                  <td>{evaluation.employee.name}</td>
                  <td>{evaluation.training.name}</td>
                  <td>{evaluation.score}</td>
                  <td>{evaluation.punctuality}</td>
                  <td>{evaluation.discipline}</td>
                  <td>{evaluation.standards}</td>
                  <td>{evaluation.remarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No evaluations found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div><div className="text-center mt-4">
        <Link to="/home">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div><ToastContainer /></>
  );
};

export default AdminScores;
