import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import axios from 'axios';
import Select from 'react-select';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const Admin = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const token = localStorage.getItem('token');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getScore', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    const getDetails = async () => {
      try {
        const details = await axios.get('http://localhost:5000/getEmployees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(details.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTrainings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/trainingDetails', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainings(response.data);
      } catch (error) {
        console.error('Error fetching trainings:', error);
      }
    };

    const fetchTrainers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getTrainers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainers(response.data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    Promise.all([getDetails(), fetchMetrics(), fetchTrainings(), fetchTrainers()])
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const employeeOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const trainingOptions = trainings.map((training) => ({
    value: training.id,
    label: training.name,
  }));

  const filteredMetrics = metrics.filter((metric) => {
    const matchesEmployee = selectedEmployee ? metric.employee.id === selectedEmployee.value : true;
    const matchesTraining = selectedTraining ? metric.training.id === selectedTraining.value : true;
    return matchesEmployee && matchesTraining;
  });

  const groupByTraining = filteredMetrics.reduce((result, metric) => {
    const trainingName = metric.training.name;
    if (!result[trainingName]) {
      result[trainingName] = [];
    }
    result[trainingName].push(metric);
    return result;
  }, {});

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="text-center mb-4">Employee Performance Dashboard</h2>

          {/* Cards for Total Employees, Total Trainings, and Total Trainers */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <Card.Title>Total Employees</Card.Title>
                  <Card.Text>{users.length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <Card.Title>Total Trainers</Card.Title>
                  <Card.Text>{trainers.length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <Card.Title>Total Trainings</Card.Title>
                  <Card.Text>{trainings.length}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="p-3 mb-4 shadow-sm">
            <Select
              options={employeeOptions}
              placeholder="Select an employee"
              isClearable
              onChange={setSelectedEmployee}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#ced4da',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#7754f7',
                  },
                }),
              }}
            />
          </Card>

          <Card className="p-3 mb-4 shadow-sm">
            <Select
              options={trainingOptions}
              placeholder="Select a training"
              isClearable
              onChange={setSelectedTraining}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#ced4da',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#7754f7',
                  },
                }),
              }}
            />
          </Card>

          {/* Display the charts for filtered metrics */}
          {Object.keys(groupByTraining).length === 0 ? (
            <p className="text-center">No data available for the selected employee or training.</p>
          ) : (
            Object.keys(groupByTraining).map((training) => {
              const metricsForTraining = groupByTraining[training];

              const employeeNames = metricsForTraining.map((m) => m.employee.name);
              const scores = metricsForTraining.map((m) => m.score || 0);
              const punctuality = metricsForTraining.map((m) => m.punctuality || 0);
              const discipline = metricsForTraining.map((m) => m.discipline || 0);
              const standards = metricsForTraining.map((m) => m.standards || 0);

              return (
                <Card key={training} className="mb-4 shadow-sm">
                  <Card.Body>
                    <h5 className="card-title text-center">{training} Scores</h5>
                    <ApexCharts
                      options={{
                        chart: {
                          type: 'bar',
                          stacked: false,
                        },
                        xaxis: {
                          categories: employeeNames,
                        },
                        yaxis: {
                          title: { text: 'Scores' },
                        },
                        plotOptions: {
                          bar: {
                            horizontal: false,
                            dataLabels: {
                              position: 'top',
                            },
                            columnWidth: '20%',
                          },
                        },
                        dataLabels: {
                          enabled: true,
                          offsetY: -20,
                          style: {
                            fontSize: '12px',
                            colors: ['#304758'],
                          },
                        },
                        legend: {
                          position: 'top',
                          horizontalAlign: 'right',
                        },
                      }}
                      series={[
                        { name: 'Hackerrank Score', data: scores },
                        { name: 'Punctuality', data: punctuality },
                        { name: 'Discipline', data: discipline },
                        { name: 'Standards Followed', data: standards },
                      ]}
                      type="bar"
                      height={300}
                    />
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
