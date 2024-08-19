import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwtDecode(token);
      login(user);
      navigate('/');
    }
  }, [login, navigate]);

  const onSuccess = (res) => {
    const token = res?.credential;
    const user = jwtDecode(token);
    localStorage.setItem('token', token);
    login(user);
    navigate('/');
  };

  const onFailure = (res) => {
    console.log("LOGIN FAILED: ", res);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Kora Helper - Login</h2>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onFailure}
      />
    </div>
  );
};

export default Login;