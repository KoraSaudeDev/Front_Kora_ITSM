import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Main from './components/Main';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import HomeHelper from './components/Helper/HomeHelper';
import AcessoTI from './components/Helper/AcessoTI';
import AcessoRH from './components/Helper/AcessoRH';
import AcessoSuprimentos from './components/Helper/AcessoSuprimentos';
import AcessoMarketing from './components/Helper/AcessoMarketing';
import AcessoFinanceiro from './components/Helper/AcessoFinanceiro';

import MeusAtendimentos from './pages/Atendimentos/MeusAtendimentos';
import MinhaEquipe from './pages/Atendimentos/MinhaEquipe';
import AllTickets from './pages/Atendimentos/AllTickets';
import NovoTicket from './pages/Atendimentos/NovoTicket';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/helper" element={<HomeHelper />} />
          <Route path="/helper/AcessoTI" element={<AcessoTI />} />
          <Route path="/helper/AcessoRH" element={<AcessoRH />} />
          <Route path="/helper/AcessoSuprimentos" element={<AcessoSuprimentos />} />
          <Route path="/helper/AcessoMarketing" element={<AcessoMarketing />} />
          <Route path="/helper/AcessoFinanceiro" element={<AcessoFinanceiro />} />
          <Route path="/suporte/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/helper" />} />  */}
          <Route path="/helperPRD" element={<HomeHelper />} />
          <Route path="/helperPRD/AcessoTI" element={<AcessoTI />} />
          <Route path="/helperPRD/AcessoRH" element={<AcessoRH />} />
          <Route path="/helperPRD/AcessoSuprimentos" element={<AcessoSuprimentos />} />
          <Route path="/helperPRD/AcessoMarketing" element={<AcessoMarketing />} />
          <Route path="/helperPRD/AcessoFinanceiro" element={<AcessoFinanceiro />} />
          <Route path="/suportePRD/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/not-found" />} /> 
          <Route
            // path="/suporte/*"
            path="/suportePRD/*"
            element={
              <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <Header onToggleSidebar={toggleSidebar} />
                <Sidebar isOpen={isSidebarOpen} />
                <Routes>
                  <Route
                    path="meus-atendimentos"
                    element={
                      <ProtectedRoute
                        element={
                          <Main title="Meus Atendimentos" description="Meus Atendimentos">
                            <MeusAtendimentos />
                          </Main>
                        }
                      />
                    }
                  />
                  <Route
                    path="minha-equipe"
                    element={
                      <ProtectedRoute
                        element={
                          <Main title="Minha Equipe" description="Minha Equipe">
                            <MinhaEquipe />
                          </Main>
                        }
                      />
                    }
                  />
                  <Route
                    path="all-tickets"
                    element={
                      <ProtectedRoute
                        element={
                          <Main title="All Tickets" description="Atendimentos / All Tickets">
                            <AllTickets />
                          </Main>
                        }
                      />
                    }
                  />
                  <Route
                    path="novo-ticket-futuro"
                    element={
                      <ProtectedRoute
                        element={
                          <Main title="Novo Ticket" description="Atendimentos / Novo Ticket">
                            <NovoTicket />
                          </Main>
                        }
                      />
                    }
                  />
  
                  <Route path="*" element={<Navigate to="/not-found" />} />
                </Routes>
              </div>
            }
          />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );  
};

export default App;
