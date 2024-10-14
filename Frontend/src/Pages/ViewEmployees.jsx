import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import Bar from '../Components/Bar';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import '../App.css';

const ViewEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [designationFilter, setDesignationFilter] = useState('');
    const token = localStorage.getItem('token');

    const handleClose = () => {
        setShow(false);
        setSelectedEmployee(null);
    };

    const handleShow = (employee) => {
        setSelectedEmployee(employee);
        setShow(true);
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employee data', error);
                toast.error('Failed to fetch employee data.');
            }
        };

        fetchEmployees();
    }, [token]);

    const handleUpdateEmployee = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        const updatedEmployee = {
            name: e.target.name.value,
            email: e.target.email.value,
            Role: e.target.Role.value,
            Designation: e.target.Designation.value,
            department: e.target.department.value,
            region: e.target.region.value,
            date_of_birth: e.target.date_of_birth.value
        };
        try {
            await axios.post(`http://localhost:5000/updateEmp/${selectedEmployee.id}`, updatedEmployee, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(employees.map(emp => emp.id === selectedEmployee.id ? { ...emp, ...updatedEmployee } : emp));
            toast.success('Employee details updated successfully');
            handleClose();
        } catch (error) {
            console.error('Failed to update Employee details', error);
            toast.error('Failed to update Employee details');
        }
    };

    const handleDeleteEmployee = async (empId) => {
        try {
            await axios.delete(`http://localhost:5000/deleteEmployee/${empId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(employees.filter(emp => emp.id !== empId));
            toast.success('Employee deleted successfully');
        } catch (error) {
            console.error('Failed to delete Employee', error);
            toast.error('Failed to delete Employee');
        }
    };

    const searchEmployees = (e) => {
        setSearch(e.target.value);
    };

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase());
        const matchesDepartment = departmentFilter ? emp.department === departmentFilter : true;
        const matchesDesignation = designationFilter ? emp.Designation === designationFilter : true;

        return matchesSearch && matchesDepartment && matchesDesignation;
    });

    return (
        <div>
            <Bar />
            <h2 style={{ marginLeft: '30px', marginTop: '20px', justifyContent: 'center', display: 'flex' }}>List of Employees</h2>
            <Row style={{ marginLeft: '30px', marginBottom: '20px' }}>
                <Col md={4}>
                    <input
                        type='text'
                        placeholder='Search Employees by name'
                        onChange={searchEmployees}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col md={4}>
                    <Form.Select onChange={(e) => setDepartmentFilter(e.target.value)} defaultValue="">
                        <option value="">Select Department</option>
                        <option value="HR">HR</option>
                        <option value="Sales">Sales</option>
                        <option value="Developer">Developer</option>
                        <option value="Designer">Designer</option>
                        <option value="Analyst">Analyst</option>
                        <option value="Marketing">Marketing</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Select onChange={(e) => setDesignationFilter(e.target.value)} defaultValue="">
                        <option value="">Select Designation</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Senior Software Engineer">Senior Software Engineer</option>
                        <option value="Solutions Enabler">Solutions Enabler</option>
                        <option value="Solutions Consultant">Solutions Consultant</option>
                        <option value="Principal Architect">Principal Architect</option>
                    </Form.Select>
                </Col>
            </Row>
            <Table striped bordered hover style={{ marginLeft: '30px' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Region</th>
                        <th>Date of Birth</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.Role}</td>
                                <td>{emp.department}</td>
                                <td>{emp.Designation}</td>
                                <td>{emp.region}</td>
                                <td>{format(new Date(emp.date_of_birth), 'dd MMM yyyy')}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleShow(emp)}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteEmployee(emp.id)}>Delete</Button>
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
            <Button style={{ marginLeft: '30px' }}>
                <Link id='lin' to={`/home`}>Back</Link>
            </Button>
            <Button style={{ marginLeft: '30px' }}>
                <Link id='lin' to={`/addEmployee`}>Add Employee</Link>
            </Button>
            <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEmployee && (
                        <Form onSubmit={handleUpdateEmployee}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    defaultValue={selectedEmployee.name}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    defaultValue={selectedEmployee.email}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select name='Role'>
                                    <option>{selectedEmployee.Role}</option>
                                    <option value="Employee">Employee</option>
                                    <option value="Trainer">Trainer</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Department</Form.Label>
                                <Form.Select name='department'>
                                    <option>{selectedEmployee.department}</option>
                                    <option value="HR">HR</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Designer">Designer</option>
                                    <option value="Analyst">Analyst</option>
                                    <option value="Marketing">Marketing</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Designation</Form.Label>
                                <Form.Select name='Designation'>
                                    <option>{selectedEmployee.Designation}</option>
                                    <option value="Software Engineer">Software Engineer</option>
                                    <option value="Senior Software Engineer">Senior Software Engineer</option>
                                    <option value="Solutions Enabler">Solutions Enabler</option>
                                    <option value="Solutions Consultant">Solutions Consultant</option>
                                    <option value="Principal Architect">Principal Architect</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Region</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="region"
                                    defaultValue={selectedEmployee.region}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    name='date_of_birth'
                                    defaultValue={format(new Date(selectedEmployee.date_of_birth), 'yyyy-MM-dd')}
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
};

export default ViewEmployees;
