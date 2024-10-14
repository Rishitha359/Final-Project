import React, { useEffect, useState } from 'react'
import Admin from '../Components/Admin'
import Employee from '../Components/Employee'
import Trainer from '../Components/Trainer'
import Bar from '../Components/Bar'
import axios from 'axios';

const Home = () => {
  
  const [user, setUser] = useState({});
  const email = localStorage.getItem('email');
  
  useEffect(()=> {
    const userDetails = async() => {
      try {
        const details = await axios.post('http://localhost:5000/emp',{email: email});
        setUser(details.data);
      } catch (error) {
        console.log(error);
      }
    }
    userDetails();
  },[]);

  return (
    <div>
        <Bar/>
      {user.Role=='Admin'? <Admin/> : user.Role=='Employee'? <Employee/> : <Trainer/>}
    </div>
  )
}

export default Home
