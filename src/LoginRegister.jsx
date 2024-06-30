import React, { useState } from 'react';
import { Container, Nav, Tab, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Nav__bar';

const LoginRegister = () => {
  const [key, setKey] = useState('login');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages
    try {
      const response = await axios.post('https://monu-talk-production.up.railway.app/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response.data);

      if (response.status === 201) {
        const user = response.data;
        if (user.role === 'ADMIN') {
          navigate('/Admin');
        } else {
          navigate('/user');
        }
      } else {
        setError(response.data || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred while logging in');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages
    try {
      const payload = { email, password, firstName, lastName, role: 'CLIENT' };
      console.log('Sending registration request with:', payload);

      const response = await axios.post('https://monu-talk-production.up.railway.app/auth/register', payload);

      console.log('Registration response:', response.data);
      if (response.status === 201) {
        // Automatically log in the user after registration
        setEmail(email);
        setPassword(password);
        await handleLogin(e);
      } else {
        setError(response.data.message || 'Registration failed');
      }

    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred while registering');
    }
  };

  return (
    <div className='bg'>
      <Navbar />
      <section className='log_bod'>
        <Container className="p-4 my-5 d-flex flex-column align-items-center custom-container">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                <Form onSubmit={handleRegister}>
                  <Form.Group controlId="registerFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter First Name"
                      className="custom-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="registerLastName" className="mt-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Last Name"
                      className="custom-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="registerEmail" className="mt-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      className="custom-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="registerPassword" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      className="custom-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
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
