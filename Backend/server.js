const express = require('express');
const cors = require('cors');
const { authenticate } = require('./Middleware/Auth');
const { login, get_emp, emp_det, create_emp, get_trainers, get_employees, get_emp_train, update_emp } = require('./Controllers/User');
const { all_train, add_train, update_train, del_train, train_details } = require('./Controllers/Training');
const { add_score, get_score, get_scores, get_score_emp } = require('./Controllers/Score');

const app = express();
app.use(express.json());
app.use(cors());

// User login
app.post('/login', login);

// Get employee details
app.post('/emp', get_emp);

// Add new employee
app.post('/createEmployee', authenticate, create_emp);

// Updating employee details
app.post('/updateEmp/:id', authenticate, update_emp);

// Getting all Trainer available
app.get('/getTrainers', authenticate, get_trainers);

// Getting all employees available
app.get('/getEmployees', authenticate, get_employees);

app.get('/all', authenticate, emp_det);

//Fetching training details for a particular trainer
app.get('/trainings', authenticate,  all_train);

// Getting emp details for particular training
app.get('/empTrain/:id', authenticate, get_emp_train);

//Fetching details of all available courses
app.get('/trainingDetails', authenticate, train_details);

//Creating new Trainings
app.post('/addTraining', authenticate, add_train);

//Updating Training Details
app.post('/updateTraining/:id', authenticate, update_train);

//Delete Training
app.delete('/deleteTraining/:id', authenticate, del_train);

// Adding Score
app.post('/addScore', authenticate, add_score);

//Get Score for Training
app.get('/getScore/:id', authenticate, get_score);
app.get('/getScore', authenticate, get_scores);
//Get scores for each employee
app.get('/getScoreEmp', authenticate, get_score_emp);


app.listen(5000, () => console.log('Server running on port 5000'));