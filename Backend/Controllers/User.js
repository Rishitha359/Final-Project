const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

//Function for user login verifying the password and generating jwt token for authentication
const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await prisma.employee.findUnique({ where: { email } });
    //if (!user || !(await bcrypt.compare(password, user.password))) {
    if (!user || password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ id: user.id}, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
}

// Fetching emp details
const get_emp = async(req, res) => {
    try{
        const { email } = req.body;
        const details = await prisma.employee.findUnique({ where: { email },
        include:{scores:true,
            training:true
        }});
        res.json(details);
    }catch(error){
        res.json("Error in fetching");
    }
}
//Fetch all emp
const emp_det = async(req, res) => {
    const details = await prisma.employee.findMany({ });
    res.json(details);
}

//Adding new employees
const create_emp = async(req, res) => {
    const {id, name, email, password, Role, Designation, region, department, date_of_birth, Gender} = req.body;
    try{
        const details = await prisma.employee.create({
            data: {id, name, email, password, Role, Designation, region, department, date_of_birth: new Date(date_of_birth),Gender },
        });
        res.json(details);
    }catch(error){
        //console.log(error)
        res.json(error)
    }
}

//Modify Employee details
const update_emp = async (req,res) => {
    const { name, email,Role,Designation,department,region,date_of_birth } = req.body;
    const { id } = req.params;
    try{
    const emp = await prisma.employee.update({
      where: { id:parseInt(id) },
      data: { name, email,Role,Designation,department,region,date_of_birth },
    });
    console.log(emp)
    res.json("Employee detail updated successfully");
    }catch(error){
        res.json(error);
    }
}

// Get all Trainers available
const get_trainers = async(req, res) => {
    try{
        const details = await prisma.employee.findMany({
            where: {Role : "Trainer"},
        });
        res.json(details);
    }catch(error){
        res.json(error)
    }
}

// Get all Trainers available
const get_employees = async(req, res) => {
    try{
        const details = await prisma.employee.findMany({
            where: {Role : "Employee"}
        });
        res.json(details);
    }catch(error){
        res.json(error)
    }
}

// Getting emp details for particular training
const get_emp_train = async(req, res) => {
    const T_id = parseInt(req.params.id);
    try{
        const details = await prisma.score.findMany({
            where: { T_id },
            include:{employee:true,
                training: true
            }
        });
        res.json(details);
    }catch(error){
        res.json(error)
    }
}

module.exports = {login, get_emp, emp_det, create_emp, update_emp, get_trainers, get_employees, get_emp_train}