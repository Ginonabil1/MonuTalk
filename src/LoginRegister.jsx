import React, { useState } from 'react';
import { Container, Nav, Tab, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import  Navbar  from './Nav__bar'

const LoginRegister = () => {
  const [key, setKey] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Check credentials
    if (username === 'admin@gmail.com' && password === 'admin') {
      // Redirect to admin page
      navigate('/Admin');
    } else if (username === 'georgino@gmail.com' && password === 'georgino') {
      navigate('/user')
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className='bg'>
      <Navbar />
    <section className='log_bod'>
      <Container className="p-4 w-50 my-5 d-flex flex-column align-items-center custom-container">
        <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
          <Nav variant="pills" className="justify-content-center mb-4 custom-nav">
            <Nav.Item>
              <Nav.Link eventKey="login" className="custom-nav-link">Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="register" className="custom-nav-link">Register</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="w-50">
            <Tab.Pane eventKey="login" className="fade-in">
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="loginEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    className="custom-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="loginPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    className="custom-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                {error && <p className="text-danger">{error}</p>}
                <Button variant="primary" type="submit" className="w-100 mt-3 custom-button">
                  Sign in
                </Button>
                <p className="text-center mt-3">
                  Not a member? <a href="#!" onClick={() => setKey('register')} className="custom-link">Register</a>
                </p>
              </Form>
            </Tab.Pane>
            <Tab.Pane eventKey="register" className="fade-in">
              <Form>
                <Form.Group controlId="registerName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter name" className="custom-input" />
                </Form.Group>
                <Form.Group controlId="registerUsername" className="mt-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Enter username" className="custom-input" />
                </Form.Group>
                <Form.Group controlId="registerEmail" className="mt-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" className="custom-input" />
                </Form.Group>
                <Form.Group controlId="registerPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" className="custom-input" />
                </Form.Group>
                <Form.Group className="d-flex justify-content-center mt-3">
                  <Form.Check type="checkbox" label="I have read and agree to the terms" className="custom-checkbox" />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3 custom-button">
                  Sign up
                </Button>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </section>
    </div>
  );
};

export default LoginRegister;
