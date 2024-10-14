import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Bar from '../Components/Bar';
import { format } from 'date-fns';
import '../addEmp.css';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [region, setRegion] = useState('');
  const [dept, setDept] = useState('');
  const [dob, setDob] = useState('');
  const nav = useNavigate();

  const token = localStorage.getItem('token');

  const handleAddTraining = async () => {
    if (name === '') {
      toast.error('Enter name of the Employee');
    } else if (id === '') {
      toast.error('Enter id of the Employee');
    } else if (email === '') {
      toast.error('Enter email of the Employee');
    } else if (password === '') {
      toast.error('Enter password of the Employee');
    } else if (role === '') {
      toast.error('Enter role of the Employee');
    } else if (designation === '') {
      toast.error('Enter designation of the Employee');
    } else if (gender === '') {
      toast.error('Enter gender of the Employee');
    } else if (region === '') {
      toast.error('Enter region of the Employee');
    } else if (dept === '') {
      toast.error('Enter department of the Employee');
    } else if (dob === '') {
      toast.error('Enter date of birth of the Employee');
    } else {
      try {
        const data = await axios.post(
          'http://localhost:5000/createEmployee',
          {
            name: name,
            email: email,
            password: password,
            id: parseInt(id),
            Gender: gender,
            Designation: designation,
            Role: role,
            region: region,
            department: dept,
            date_of_birth: format(new Date(dob), 'yyyy-MM-dd'),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data.status === 200) {
          toast.success('Successfully added Employee');
          nav('/viewEmployee');
          window.location.reload();
        }
      } catch (error) {
        toast.error('Error Adding new Employee Try Logging in again');
      }
    }
  };

  return (
    <div>
      <Bar />
      <>
        <br></br><h3 style={{marginLeft:'45%'}}>Add New Employee</h3>
        <div className="center-container">
          <Card className="card">
            <Form className="form">
              <Form.Group>
                <Form.Label>Name of the Employee</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name of the Employee"
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Id of the Employee</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter id of the Employee"
                  onChange={(e) => setId(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email of the Employee</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email of the Employee"
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password of the Employee</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password of the Employee"
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Gender of the Employee</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option>Select the Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Date of Birth of the Employee</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Date of Birth of the Employee"
                  onChange={(e) => setDob(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Region of the Employee</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Region of the Employee"
                  onChange={(e) => setRegion(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Department of the Employee</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => setDept(e.target.value)}
                >
                  <option>Select the Department</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Marketing">Marketing</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Role of the Employee</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>Select the Role</option>
                  <option value="Employee">Employee</option>
                  <option value="Trainer">Trainer</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Designation of the Employee</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => setDesignation(e.target.value)}
                >
                  <option>Select the Designation</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Senior Software Engineer">
                    Senior Software Engineer
                  </option>
                  <option value="Solutions Enabler">Solutions Enabler</option>
                  <option value="Solutions Consultant">
                    Solutions Consultant
                  </option>
                  <option value="Principal Architect">
                    Principal Architect
                  </option>
                </Form.Select>
              </Form.Group>
              <Button
                className="mb-30"
                variant="success"
                onClick={handleAddTraining}
              >
                Add
              </Button>
            </Form>
          </Card>
          <ToastContainer className="toast-container" />
        </div>
      </>
    </div>
  );
};

export default AddEmployee;
