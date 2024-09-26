import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';
import axios from 'axios';
import { faL } from '../../node_modules/@fortawesome/free-solid-svg-icons/index';

const logoKoraUrl = "https://i.postimg.cc/8k9pdsZV/unnamed.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // const from = location.state?.from?.pathname || '/suporte/meus-atendimentos';
  const from = location.state?.from?.pathname || '/suportePRD/meus-atendimentos'; 
  const [userData, setUserData] = useState(null);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(process.env.REACT_APP_CACHE_USER);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      login(user);
      navigate(from);
    }
  }, [login, navigate]);

  const showLoadingOverlay = () => {
    document.getElementById('loading-overlay').style.display = 'flex';
  };

  const hideLoadingOverlay = () => {
    document.getElementById('loading-overlay').style.display = 'none';
  };

  const onSuccess = async (res) => {
    try {
      showLoadingOverlay();
      const token = res?.credential;
      const user = jwtDecode(token);

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_BASE_URL}/access/minhas-filas?email=${user.email}`,
        headers: {}
      };

      const response = await axios.request(config);
      
      if (Array.isArray(response.data.filas_id) && response.data.filas_id.length > 0) {
        user.bl_analista = true;
      } else {
        user.bl_analista = false;
      }

      if (response.data.gestor) {
        const uniqueIds = new Set();

        for (const filaId in response.data.gestor) {
          if (response.data.gestor.hasOwnProperty(filaId)) {
            const fila = response.data.gestor[filaId];

            uniqueIds.add(filaId);

            fila.usuarios.forEach(userId => uniqueIds.add(userId));
          }
        }

        user.filas_id = Array.from(uniqueIds);

        if (response.data.filas) user.filas = response.data.filas;
        if (response.data.id_user) user.id_user = response.data.id_user;
      }
      else {
        if (response.data.filas) user.filas = response.data.filas;
        if (response.data.filas_id) user.filas_id = response.data.filas_id;
        if (response.data.id_user) user.id_user = response.data.id_user;
        if (response.data.id_user) user.id_user = response.data.id_user;
      }

      setUserData(user);
      login(user);
      hideLoadingOverlay();
      navigate(from);
      
    } catch (error) {
      console.error(error);
      hideLoadingOverlay();
    }
  };

  const onFailure = (res) => {
    console.log("LOGIN FAILED: ", res);
  };

  const toggleStayLoggedIn = () => {
    setStayLoggedIn(!stayLoggedIn);
  };

  return (
    <div className="custom-login-background">
      <div id="loading-overlay" className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
      <div className="custom-login-container">
        <div className="custom-login-box">
          <img
            src={userData?.picture || logoKoraUrl}
            alt="Profile"
            className="custom-login-logo"
            style={{
              borderRadius: userData?.picture ? '50%' : '0',
              width: userData?.picture ? '100px' : '120px',
              height: userData?.picture ? '100px' : 'auto',
            }}
          />
          <h2 className="custom-login-title">{userData ? `Welcome back, ${userData.name}` : "Bem-vindo ao ITSM"}</h2>
          <p className="custom-login-subtitle">Entre na sua conta para continuar</p>
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onFailure}
            useOneTap
            className="custom-google-login-button"
            theme="outline"
            scope="profile email"
          />
          <div className="custom-remember-me-container">
            <div className={`custom-toggle-container ${stayLoggedIn ? 'on' : 'off'}`} onClick={toggleStayLoggedIn}>
              <div className={`custom-toggle-switch ${stayLoggedIn ? 'on' : 'off'}`}>
                {stayLoggedIn ? '😊' : '😐'}
              </div>
            </div>
            <label htmlFor="custom-remember-me" className="custom-remember-me-label">
              Mantenha-me conectado
            </label>
          </div>
          <div className="sidebar-footer">
            <p>Version 1.017</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
