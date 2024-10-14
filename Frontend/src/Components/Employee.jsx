import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import Select from 'react-select';
import ApexCharts from 'react-apexcharts';
import '../App.css';
import { useParams } from 'react-router-dom';

const Employee = () => {
  const [trainings, setTrainings] = useState([]);
  const [scores, setScores] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const token = localStorage.getItem('token');
  const empId = useParams();
  const employeeId = parseInt(empId);
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/trainingDetails', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrainings(response.data);
      } catch (error) {
        console.error('Error fetching trainings:', error);
      }
    };

    const fetchScores = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getScoreEmp`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setScores(response.data);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchTrainings();
    fetchScores(); 
  }, [token, employeeId]);

  const handleTrainingChange = (option) => {
    setSelectedTraining(option);
  };

  const filteredScores = selectedTraining
    ? scores.filter(score => score.trainingId === selectedTraining.value)
    : scores;

  return (
    <div>
      <h2 style={{ margin: '20px 0', textAlign: 'center' }}>Training Scores</h2>
      <Select
        options={trainings.map(training => ({
          value: training.id,
          label: training.name,
        }))}
        onChange={handleTrainingChange}
        placeholder="Select a Training"
        isClearable
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
      
      {filteredScores.length > 0 && (
        <Card className="mt-4">
          <Card.Body>
            <h5 className="text-center">Scores for {selectedTraining ? selectedTraining.label : 'All Trainings'}</h5>
            <ApexCharts
              options={{
                chart: {
                  type: 'bar',
                  stacked: false,
                },
                xaxis: {
                  categories: filteredScores.map(score => `Employee ${score.E_id}`),
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
                { name: 'Score', data: filteredScores.map(score => score.score || 0) },
                { name: 'Punctuality', data: filteredScores.map(score => score.punctuality || 0) },
                { name: 'Discipline', data: filteredScores.map(score => score.discipline || 0) },
                { name: 'Standards Followed', data: filteredScores.map(score => score.standards || 0) },
              ]}
              type="bar"
              height={300}
            />
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default Employee;
