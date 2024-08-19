import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwtDecode(token);
      login(user);
      navigate('/atendimentos/minha-equipe');
    }

    // Custom styles for the Google button
    const button = document.querySelector('.nsm7Bb-HzV7m-LgbsSe');
    if (button) {
      button.style.backgroundColor = '#4285f4';
      button.style.color = '#fff';
      button.style.borderRadius = '12px';
      button.style.padding = '12px 20px';
      button.style.fontWeight = 'bold';
      button.style.fontSize = '16px';
      button.style.transition = 'background-color 0.3s ease, transform 0.3s ease';
    }

  }, [login, navigate]);

  const onSuccess = (res) => {
    const token = res?.credential;
    const user = jwtDecode(token);
    localStorage.setItem('token', token);
    login(user);
    navigate('/atendimentos/minha-equipe');
  };

  const onFailure = (res) => {
    console.log("LOGIN FAILED: ", res);
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <img src="https://i.postimg.cc/8k9pdsZV/unnamed.png" alt="Kora Logo" className="login-logo" />


        <h2>Kora System</h2>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onFailure}
          useOneTap
          className="google-login-button"
          theme="outline"
        />
      </div>
    </div>
  );
};

export default Login;
