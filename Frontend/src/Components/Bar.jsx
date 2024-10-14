import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import axios from 'axios';

const Bar = () => {
  const [user, setUser] = useState({});
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); // Reload the page after logout
  }

  useEffect(() => {
    const userDetails = async () => {
      try {
        const details = await axios.post('http://localhost:5000/emp', { email: email });
        setUser(details.data);
      } catch (error) {
        console.log(error);
      }
    }
    userDetails();
  }, [email]);

  // Inline styles
  const navbarStyle = {
    backgroundColor: "#7754f7",
    height: "80px",
    fontWeight: 'bold',
    color: 'white'
  };

  const navLinkStyle = {
    color: 'white',
    margin: '0 15px',
    textDecoration: 'none',
    fontWeight: 500
  };

  const navLinkHoverStyle = {
    ...navLinkStyle,
    color: '#ffd700',
    textDecoration: 'underline'
  };

  return (
    <div>
      <Navbar style={navbarStyle} data-bs-theme="dark">
        <Container>
          <Navbar.Brand style={{ color: 'white' }}>
            Welcome {user.name}
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/home" style={navLinkStyle} onMouseEnter={e => e.target.style = navLinkHoverStyle} onMouseLeave={e => e.target.style = navLinkStyle}>
              Home
            </Nav.Link>
            {user.Role === 'Trainer' && (
              <Nav.Link href="/viewTraining" style={navLinkStyle} onMouseEnter={e => e.target.style = navLinkHoverStyle} onMouseLeave={e => e.target.style = navLinkStyle}>
                View Trainings
              </Nav.Link>
            )}
            {user.Role === 'Admin' && (
              <>
                <Nav.Link href="/allTraining" style={navLinkStyle} onMouseEnter={e => e.target.style = navLinkHoverStyle} onMouseLeave={e => e.target.style = navLinkStyle}>
                  View Trainings
                </Nav.Link>
                <Nav.Link href="/viewScore" style={navLinkStyle} onMouseEnter={e => e.target.style = navLinkHoverStyle} onMouseLeave={e => e.target.style = navLinkStyle}>
                  View Scores
                </Nav.Link>
                <Nav.Link href="/viewEmployee" style={navLinkStyle} onMouseEnter={e => e.target.style = navLinkHoverStyle} onMouseLeave={e => e.target.style = navLinkStyle}>
                  View Employees
                </Nav.Link>
              </>
            )}
            <Nav.Link href="/" style={navLinkStyle} onMouseEnter={e => e.target.style = navLinkHoverStyle} onMouseLeave={e => e.target.style = navLinkStyle} onClick={handleLogout}>
              Sign Out
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default Bar;
