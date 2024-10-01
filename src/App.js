import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { RefreshProvider } from './context/RefreshContext';

import Main from './components/Main';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import HomeHelper from './components/Helper/HomeHelper';
import AcessoTI from './components/Helper/AcessoTI';
import AcessoRH from './components/Helper/AcessoRH';
import AcessoSuprimentos from './components/Helper/AcessoSuprimentos';
import AcessoMarketing from './components/Helper/AcessoMarketing';
import AcessoFinanceiro from './components/Helper/AcessoFinanceiro';
import AcessoAssistencial from './components/Helper/AcessoAssistencial';
import AcessoContabilidade from './components/Helper/AcessoContabilidade';

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = () => {
      const storedMenu = localStorage.getItem(process.env.REACT_APP_CACHE_MENU);
      if (storedMenu) {
        const menus = JSON.parse(storedMenu);
        setMenus(menus);
      } else {
        setMenus([]);
      }
    };
    fetchMenus();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderDynamicRoutes = (menus) => {
    try {
      const supportRoutes = menus.filter((menu) => menu.route && menu.route.startsWith('/suporte'));

      return supportRoutes.map((menu) => {
        if (menu.componentPath) {
          const Component = lazy(() => import(`${menu.componentPath}`));
          return (
            <Route
              key={menu.route}
              path={menu.route.replace('/suporte/', '')}
              element={
                <ProtectedRoute
                  element={
                    <Main title={menu.label} description={menu.label}>
                      <Suspense fallback={<div>Loading...</div>}>
                        <Component />
                      </Suspense>
                    </Main>
                  }
                />
              }
            />
          );
        } else {
          return <Route path="*" element={<NotFound />} />;
        }
      });
    } catch (error) {
      console.error('Erro ao renderizar rotas dinâmicas:', error);
      return <Route path="*" element={<NotFound />} />;
    }
  };

  return (
    <AuthProvider>
      <RefreshProvider>
        <Router>
          <Routes>
            <Route path="/helper" element={<ProtectedRoute element={<HomeHelper />} />} />
            <Route path="/helper/AcessoTI" element={<ProtectedRoute element={<AcessoTI />} />} />
            <Route path="/helper/AcessoRH" element={<ProtectedRoute element={<AcessoRH />} />} />
            <Route path="/helper/AcessoSuprimentos" element={<ProtectedRoute element={<AcessoSuprimentos />} />} />
            <Route path="/helper/AcessoMarketing" element={<ProtectedRoute element={<AcessoMarketing />} />} />
            <Route path="/helper/AcessoFinanceiro" element={<AcessoFinanceiro />} />
            <Route path="/helper/AcessoAssistencial" element={<AcessoAssistencial />} />
            <Route path="/helper/AcessoContabilidade" element={<AcessoContabilidade />} />
            <Route path="/acesso" element={<Navigate to="/helper" />} />
            <Route path="/acesso/*" element={<Navigate to="/helper" />} />

            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Navigate to="/login" />} />

            <Route
              path="/suporte/*"
              element={
                <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                  <Header onToggleSidebar={toggleSidebar} />
                  <Sidebar isOpen={isSidebarOpen} />
                  <Routes>
                    {renderDynamicRoutes(menus)}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              }
            />

            <Route path="/not-found" element={<NotFound />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </RefreshProvider>
    </AuthProvider>
  );
};

export default App;
