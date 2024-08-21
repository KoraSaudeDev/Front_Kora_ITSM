import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import axios from 'axios';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      login(user);
      navigate('/atendimentos/minha-equipe');
    }

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

  const onSuccess = async (res) => {
    try {
      const token = res?.credential;
      const user = jwtDecode(token);

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_BASE_URL}/access/meus-grupos?email=${user.email}`,
        headers: {}
      };

      const response = await axios.request(config);

      const roles = response.data.map(item => item.papel);
      user.cargo = roles;

      login(user);
      navigate('/atendimentos/minha-equipe');
    } catch (error) {
      console.error(error);
    }
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