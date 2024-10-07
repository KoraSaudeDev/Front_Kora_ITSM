import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/Login.css';
import axios from 'axios';

const logoKoraUrl = "https://i.postimg.cc/8k9pdsZV/unnamed.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/helper';
  const [userData, setUserData] = useState(null);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(process.env.REACT_APP_CACHE_USER);
    const storedMenu = localStorage.getItem(process.env.REACT_APP_CACHE_MENU);
    const storedToken = localStorage.getItem(process.env.REACT_APP_TOKEN_USER);
    if (storedUser && storedMenu && storedToken) {
      const user = JSON.parse(storedUser);
      const menu = JSON.parse(storedMenu);
      login(user, menu, storedToken);
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
  
      const backendResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/verify-token`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (backendResponse.status !== 200) {
        throw new Error('Invalid Google token');
      }
  
      localStorage.setItem(process.env.REACT_APP_TOKEN_USER, token);
  
      const accessResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/access/minhas-filas`,
        {
          params: { email: user.email },
          headers: {
            Authorization: `Bearer ${token}`,
            'X-User-Email': user.email,
          },
          maxBodyLength: Infinity,
        }
      );
  
      const accessData = accessResponse.data;
  
      user.bl_analista = Array.isArray(accessData.filas_id) && accessData.filas_id.length > 0;
  
      if (accessData.gestor) {
        user.filas_id = processGestorInfo(accessData.gestor);
      } else {
        user.filas_id = accessData.filas_id || [];
      }
  
      Object.assign(user, {
        filas: accessData.filas,
        id_user: accessData.id_user,
        wf_po_grupos: accessData.wf_po_grupos ?? [],
        wf_po_grupos_id: accessData.wf_po_grupos_id ?? []
      });
  
      const menuResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/menu/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-User-Email': user.email,
          },
        }
      );
  
      login(user, menuResponse.data, token);
      hideLoadingOverlay();
      navigate(from);
    } catch (error) {
      hideLoadingOverlay();
      handleError(error);
    }
  };

  const processGestorInfo = (gestor) => {
    const uniqueIds = new Set();
  
    Object.entries(gestor).forEach(([filaId, fila]) => {
      uniqueIds.add(filaId);
      fila.usuarios.forEach(userId => uniqueIds.add(userId));
    });
  
    return Array.from(uniqueIds);
  };

  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      alert('Acesso negado');
    } else {
      console.error(error.message || error);
      alert('Ocorreu um erro inesperado. Tente novamente mais tarde.');
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


          <p className="custom-no-account-text">
            Ainda não possui uma conta Kora? <Link to="/cadastro" className="custom-link">Clique aqui</Link>
          </p>

          <div className="sidebar-footer">
            <p>Version 2.000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
