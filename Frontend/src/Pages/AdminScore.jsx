import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button } from 'react-bootstrap';
import Bar from '../Components/Bar';
import { Link, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminScores from './AdminScores';

const AdminScore = () => {
  const [evaluations, setEvaluations] = useState([]);
  const token = localStorage.getItem('token');
  const { id } = useParams(); 
  const trainId = parseInt(id, 10); 

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getScore/${trainId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Set the evaluations state to the fetched data
        setEvaluations(response.data);
      } catch (error) {
        console.error('Error fetching evaluation data:', error);
        toast.error('Failed to fetch evaluation data.');
      }
    };

    fetchEvaluations();
  }, [token, trainId]);

  return (
    <div>
      <Bar />
      <ToastContainer />
      <h2 id='head' className="text-center">Training Evaluations</h2>
      <Container>
        <div className="score-table-container">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Employee Name</th>
                <th>Hackerrank Score (10)</th>
                <th>Punctuality (10)</th>
                <th>Discipline (10)</th>
                <th>Standards Followed (10)</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.length > 0 ? (
                evaluations.map((evaluation, index) => (
                  <tr key={evaluation.E_id}>
                    <td>{index + 1}</td>
                    <td>{evaluation.employee.name}</td>
                    <td>{evaluation.score}</td>
                    <td>{evaluation.punctuality}</td>
                    <td>{evaluation.discipline}</td>
                    <td>{evaluation.standards}</td>
                    <td>{evaluation.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No evaluations found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
      <Button style={{marginLeft:'1000px'}}><Link id='lin' to = {`/allTraining`}>Back</Link></Button>
    </div>
  );
};

export default AdminScore;
