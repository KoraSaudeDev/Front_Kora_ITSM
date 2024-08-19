import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Main from './components/Main';
import Home from './pages/Home';
import Login from './pages/Login';

import MeusAtendimentos from './pages/Atendimentos/MeusAtendimentos';
import MinhaEquipe from './pages/Atendimentos/MinhaEquipe';
import AllTickets from './pages/Atendimentos/AllTickets';
import NovoTicket from './pages/Atendimentos/NovoTicket';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <div>
                <Header />
                <Sidebar />
                <Routes>
                  <Route path="/" element={<ProtectedRoute element={<Main title="Minha Equipe" description="Atendimentos / Minha Equipe"><MinhaEquipe /></Main>} />} />
                  <Route path="/atendimentos/meus-atendimentos" element={<ProtectedRoute element={<Main title="Meus Atendimentos" description="Atendimentos / Meus Atendimentos"><MeusAtendimentos /></Main>} />} />
                  <Route path="/atendimentos/minha-equipe" element={<ProtectedRoute element={<Main title="Minha Equipe" description="Atendimentos / Minha Equipe"><MinhaEquipe /></Main>} />} />
                  <Route path="/atendimentos/all-tickets" element={<ProtectedRoute element={<Main title="All Tickets" description="Atendimentos / All Tickets"><AllTickets /></Main>} />} />
                  <Route path="/atendimentos/novo-ticket" element={<ProtectedRoute element={<Main title="Novo Ticket" description="Atendimentos / Novo Ticket"><NovoTicket /></Main>} />} />
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
