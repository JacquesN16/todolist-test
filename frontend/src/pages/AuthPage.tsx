import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import FormControlGroup from '../components/FormControlGroup';
import { useAuthApi } from '../hooks/useAuthApi';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { error, success, handleLogin, handleSignup, setError } = useAuthApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      handleLogin({ email, password });
    } else {
      if (email !== confirmEmail) {
        setError('Emails do not match');
        return;
      }
      handleSignup({ firstName, lastName, email, password, confirmPassword });
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
                    <FormControlGroup
                      controlId="formFirstName"
                      label="First Name"
                      type="text"
                      placeholder="Enter first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <FormControlGroup
                      controlId="formLastName"
                      label="Last Name"
                      type="text"
                      placeholder="Enter last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </>
                )}
                <FormControlGroup
                  controlId="formBasicEmail"
                  label="Email address"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {!isLogin && (
                  <FormControlGroup
                    controlId="formConfirmEmail"
                    label="Confirm Email"
                    type="email"
                    placeholder="Confirm email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    required
                  />
                )}

                <FormControlGroup
                  controlId="formBasicPassword"
                  label="Password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  showPasswordToggle
                  onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
                  isPasswordVisible={showPassword}
                />

                {!isLogin && (
                  <FormControlGroup
                    controlId="formConfirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    showPasswordToggle
                    onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
                    isPasswordVisible={showPassword}
                  />
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
