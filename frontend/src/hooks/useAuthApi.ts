
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignupDto, LoginDto } from 'todolist-model';
import { AUTH_API } from '../helper/constant';

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

export const useAuthApi = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (loginDto: LoginDto) => {
    try {
      setError(null);
      setSuccess(null);
      const data = await loginUser(loginDto);
      setSuccess('Login successful!');
      login(data.accessToken);
      navigate('/main');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = async (signupDto: SignupDto) => {
    try {
      setError(null);
      setSuccess(null);
      if (signupDto.password !== signupDto.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      const data = await signupUser(signupDto);
      setSuccess('Signup successful! You can now log in.');
      login(data.accessToken);
      navigate('/main');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { error, success, handleLogin, handleSignup, setError };
};
