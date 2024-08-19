import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';
import Main from './components/Main';
import Home from './pages/Home';
import MeusAtendimentos from './pages/Atendimentos/MeusAtendimentos';
import MinhaEquipe from './pages/Atendimentos/MinhaEquipe';
import AllTickets from './pages/Atendimentos/AllTickets';
import NovoTicket from './pages/Atendimentos/NovoTicket'; 

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/atendimentos/meus-atendimentos" element={<Main title="Meus Atendimentos" description=" Atendimentos / Meus Atendimentos"><MeusAtendimentos /></Main>} />
          <Route path="/atendimentos/minha-equipe" element={<Main title="Minha Equipe" description=" Atendimentos / Minha Equipe"><MinhaEquipe /></Main>} />
          <Route path="/atendimentos/all-tickets" element={<Main title="All Tickets" description=" Atendimentos / All Tickets"><AllTickets /></Main>} />
          <Route path="/atendimentos/novo-ticket" element={<Main title="Novo Ticket" description=" Atendimentos / Novo Ticket"><NovoTicket /></Main>} /> {/* Nova Rota */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
