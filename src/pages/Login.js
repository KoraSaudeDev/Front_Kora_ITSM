import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSuccess = (res) => {
    const user = jwtDecode(res?.credential);
    login(user);
    navigate('/');
  };

  const onFailure = (res) => {
    console.log("LOGIN FAILED: ", res);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onFailure}
      />
    </div>
  );
};

export default Login;