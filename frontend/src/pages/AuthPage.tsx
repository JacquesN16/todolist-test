import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignupDto, LoginDto } from 'todolist-model';
import {AUTH_API} from "../helper/constant.ts";

const loginUser = async (data: LoginDto) => {
  const response = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }
  return response.json();
};

const signupUser = async (data: SignupDto) => {
  const response = await fetch(`${AUTH_API}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Signup failed');
  }
  return response.json();
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isLogin) {
      try {
        const data = await loginUser({ email, password });
        setSuccess('Login successful!');
        setError(null);
        console.log('Login successful', data);
        login(data.accessToken);
        navigate('/main');
      } catch (err: any) {
        setError(err.message);
        setSuccess(null);
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (email !== confirmEmail) {
        setError('Emails do not match');
        return;
      }
      try {
        const data = await signupUser({ firstName, lastName, email, password, confirmPassword });
        setSuccess('Signup successful! You can now log in.');
        setError(null);
        console.log('Signup successful', data);
        login(data.accessToken);
        setIsLogin(true); // Switch to login form after successful signup
        navigate('/main');
      } catch (err: any) {
        setError(err.message);
        setSuccess(null);
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center align-items-center">
        <Col>
          <Card>
            <Card.Header as="h3" className="text-center">
              {isLogin ? 'Login' : 'Sign Up'}
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <Form.Group className="mb-3" controlId="formFirstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </>
                )}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                {!isLogin && (
                  <Form.Group className="mb-3" controlId="formConfirmEmail">
                    <Form.Label>Confirm Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Confirm email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputGroup>
                </Form.Group>

                {!isLogin && (
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                )}

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  {isLogin ? 'Login' : 'Sign Up'}
                </Button>
              </Form>
              <div className="text-center mt-3">
                {isLogin ? (
                  <p>
                    Don't have an account? <Button variant="link" onClick={() => setIsLogin(false)}>Sign Up</Button>
                  </p>
                ) : (
                  <p>
                    Already have an account? <Button variant="link" onClick={() => setIsLogin(true)}>Login</Button>
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;
