import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Form, Container, Modal } from 'react-bootstrap';
import Bar from '../Components/Bar';
import { Link, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewScore = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({});
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const trainId = parseInt(id, 10);

  useEffect(() => {
    const fetchEmployeesAndEvaluations = async () => {
      try {
        const employeeResponse = await axios.get('http://localhost:5000/getEmployees', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const employeesData = employeeResponse.data;

        const evaluationResponse = await axios.get(`http://localhost:5000/getScore/${trainId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const evaluationsData = evaluationResponse.data;

        const mergedData = employeesData.map(employee => {
          const employeeEvaluation = evaluationsData.find(evaluation => evaluation.E_id === employee.id) || {
            E_id: employee.id,
            score: '',
            punctuality: '',
            discipline: '',
            standards: '',
            remarks: ''
          };
          return { ...employee, ...employeeEvaluation };
        });

        setEmployees(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching employee or evaluation data!');
      }
    };

    fetchEmployeesAndEvaluations();
  }, [token, trainId]);

  const handleEditClick = (employee) => {
    setCurrentEmployee(employee);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post('http://localhost:5000/addScore', { 
        data: { 
          E_id: currentEmployee.id,
          score: parseInt(currentEmployee.score) || 0,
          punctuality: parseInt(currentEmployee.punctuality) || 0,
          discipline: parseInt(currentEmployee.discipline) || 0,
          standards: parseInt(currentEmployee.standards) || 0,
          remarks: currentEmployee.remarks || '',
          T_id: trainId
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response);
    
      setEmployees(prevEmployees => prevEmployees.map(emp => 
        emp.id === currentEmployee.id ? currentEmployee : emp
      ));
    
      setShowModal(false);
      toast.success('Scores updated successfully!');
    } catch (error) {
      console.error('Error updating scores:', error);
      toast.error('Error updating scores!');
    }
  };

  return (
    <div>
      <Bar />
      <ToastContainer />
      <h2 id='head' className="text-center">Employee Evaluations</h2>
      <Container>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Employee Name</th>
                <th>Hackerrank Score (10)</th>
                <th>Punctuality (10)</th>
                <th>Discipline (10)</th>
                <th>Standards Followed (10)</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee, index) => (
                  <tr key={employee.id}>
                    <td>{index + 1}</td>
                    <td>{employee.name}</td>
                    <td>{employee.score}</td>
                    <td>{employee.punctuality}</td>
                    <td>{employee.discipline}</td>
                    <td>{employee.standards}</td>
                    <td>{employee.remarks}</td>
                    <td>
                      <Button variant="secondary" size="sm" onClick={() => handleEditClick(employee)}>Edit</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No employees found</td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between mt-4">
            <Link to={`/viewTraining`} className="btn btn-secondary">Back</Link>
          </div>
        </div>
      </Container>

      {/* Edit Score Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Scores for {currentEmployee.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formScore">
              <Form.Label>Hackerrank Score</Form.Label>
              <Form.Control
                type="number"
                max="10"
                min="0"
                value={currentEmployee.score || ''}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, score: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPunctuality">
              <Form.Label>Punctuality</Form.Label>
              <Form.Control
                type="number"
                max="10"
                min="0"
                value={currentEmployee.punctuality || ''}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, punctuality: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDiscipline">
              <Form.Label>Discipline</Form.Label>
              <Form.Control
                type="number"
                max="10"
                min="0"
                value={currentEmployee.discipline || ''}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, discipline: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formStandards">
              <Form.Label>Standards Followed</Form.Label>
              <Form.Control
                type="number"
                max="10"
                min="0"
                value={currentEmployee.standards || ''}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, standards: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                value={currentEmployee.remarks || ''}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, remarks: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewScore;
