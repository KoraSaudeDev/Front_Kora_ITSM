import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importando Navigate
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Main from './components/Main';
import Home from './pages/Home';
import Login from './pages/Login';

import HomeHelper from './components/Helper/HomeHelper';
import AcessoTI from './components/Helper/AcessoTI';
import AcessoRH from './components/Helper/AcessoRH';

import MeusAtendimentos from './pages/Atendimentos/MeusAtendimentos';
import MinhaEquipe from './pages/Atendimentos/MinhaEquipe';
import AllTickets from './pages/Atendimentos/AllTickets';
import NovoTicket from './pages/Atendimentos/NovoTicket';

const App = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleResetTicket = () => {
    setSelectedTicket(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/helper" element={<HomeHelper />} />
          <Route path="/helper/AcessoTI" element={<AcessoTI />} />
          <Route path="/helper/AcessoRH" element={<AcessoRH />} />
          <Route path="/suporte/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/helper" />} /> {/* Redireciona para /helper */}
          <Route
            path="/*"
            element={
              <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <Header
                  onSelectTicket={handleSelectTicket}
                  onToggleSidebar={toggleSidebar}
                  onResetTicket={handleResetTicket}
                />
                <Sidebar isOpen={isSidebarOpen} />
                <Routes>
                  <Route
                    path="/suporte"
                    element={
                      <ProtectedRoute
                        element={
                          <Main title="Meus Atendimentos" description="Atendimentos / Meus Atendimentos">
                            <MeusAtendimentos selectedTicket={selectedTicket} onResetTicket={handleResetTicket} />
                          </Main>
                        }
                      />
                    }
                  />
                  <Route
                    path="/suporte/meus-atendimentos"
                    element={
                      <ProtectedRoute
                        element={
                          <Main title="Meus Atendimentos" description="Meus Atendimentos">
                            <MeusAtendimentos selectedTicket={selectedTicket} onResetTicket={handleResetTicket} />
                          </Main>
                        }
                      />
                    }
                  />
                  <Route
                    path="/suporte/minha-equipe"
                    element={
                      <ProtectedRoute
                        element={
                          <Main title="Minha Equipe" description="Minha Equipe">
                            <MinhaEquipe selectedTicket={selectedTicket} onResetTicket={handleResetTicket} />
                          </Main>
                        }
                      />
                    }
                  />
                  <Route
                    path="/suporte/all-tickets"
                    element={
                      <ProtectedRoute
                        element={
                          <Main title="All Tickets" description="Atendimentos / All Tickets">
                            <AllTickets selectedTicket={selectedTicket} onResetTicket={handleResetTicket} />
                          </Main>
                        }
                      />
                    }
                  />
                  <Route
                    path="/suporte/novo-ticket-futuro"
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
                </Routes>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
