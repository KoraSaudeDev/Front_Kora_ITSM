import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

import Main from './components/Main';
import Home from './pages/Home';
import AbcConsumoMV from './pages/MV/AbcConsumoMV';
import ConsumoDiarioMV from './pages/MV/ConsumoDiarioMV';
import DadosConsolidadosMV from './pages/MV/DadosConsolidadosMV';
import EstoqueConsolidadoMV from './pages/MV/EstoqueConsolidadoMV';
import EstoqueSimplificadoMV from './pages/MV/EstoqueSimplificadoMV';
import EstoqueSAP from './pages/SAP/EstoqueSAP';
import PedidoSAP from './pages/SAP/PedidoSAP';
import RequisicaoSAP from './pages/SAP/RequisicaoSAP';
import AbcConsumoTASY from './pages/TASY/AbcConsumoTASY';
import CadastroMateriaisTASY from './pages/TASY/CadastroMateriaisTASY';
import ConsumoDiarioTASY from './pages/TASY/ConsumoDiarioTASY';
import DetalheNotaFiscalTASY from './pages/TASY/DetalheNotaFiscalTASY';
import MovimentoSinteticoTASY from './pages/TASY/MovimentoSinteticoTASY';
import OrdemCompraTASY from './pages/TASY/OrdemCompraTASY';
import SaldoEstoqueTASY from './pages/TASY/SaldoEstoqueTASY';
import SolicComprasNaoAtendidasTASY from './pages/TASY/SolicComprasNaoAtendidasTASY';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Sidebar />
        <Routes>
          <Route path="/"element={<Home />}/>
          <Route path="/MV/AbcConsumoMV" element={<Main title="ABC de Consumo" description=" Sistemas / MV / ABC de Consumo"><AbcConsumoMV /></Main>} />
          <Route path="/MV/ConsumoDiarioMV" element={<Main title="Consumo Diário" description=" Sistemas / MV / Consumo Diário"><ConsumoDiarioMV /></Main>} />
          <Route path="/MV/DadosConsolidadosMV" element={<Main title="Dados Consolidados" description=" Sistemas / MV / Dados Consolidados"><DadosConsolidadosMV /></Main>} />
          <Route path="/MV/EstoqueConsolidadoMV" element={<Main title="Estoque Consolidado" description=" Sistemas / MV / Estoque Consolidado"><EstoqueConsolidadoMV /></Main>} />
          <Route path="/MV/EstoqueSimplificadoMV" element={<Main title="Estoque Simplificado" description=" Sistemas / MV / Estoque Simplificado"><EstoqueSimplificadoMV /></Main>} />
          <Route path="/SAP/EstoqueSAP" element={<Main title="Estoque" description=" Sistemas / SAP / Estoque"><EstoqueSAP /></Main>} />
          <Route path="/SAP/PedidoSAP" element={<Main title="Pedido" description=" Sistemas / SAP / Pedido"><PedidoSAP /></Main>} />
          <Route path="/SAP/RequisicaoSAP" element={<Main title="Requisição" description=" Sistemas / SAP / Requisição"><RequisicaoSAP /></Main>} />
          <Route path="/TASY/AbcConsumoTASY" element={<Main title="ABC de Consumo" description=" Sistemas / TASY / ABC de Consumo"><AbcConsumoTASY /></Main>} />
          <Route path="/TASY/CadastroMateriaisTASY" element={<Main title="Cadastro de Materiais" description=" Sistemas / TASY / Cadastro de Materiais"><CadastroMateriaisTASY /></Main>} />
          <Route path="/TASY/ConsumoDiarioTASY" element={<Main title="Consumo Diário" description=" Sistemas / TASY / Consumo Diário"><ConsumoDiarioTASY /></Main>} />
          <Route path="/TASY/DetalheNotaFiscalTASY" element={<Main title="Detalhe Nota Fiscal" description=" Sistemas / TASY / Detalhe Nota Fiscal"><DetalheNotaFiscalTASY /></Main>} />
          <Route path="/TASY/MovimentoSinteticoTASY" element={<Main title="Movimento Sintético" description=" Sistemas / TASY / Movimento Sintético"><MovimentoSinteticoTASY /></Main>} />
          <Route path="/TASY/OrdemCompraTASY" element={<Main title="Ordem de Compra" description=" Sistemas / TASY / Ordem de Compra"><OrdemCompraTASY /></Main>} />
          <Route path="/TASY/SaldoEstoqueTASY" element={<Main title="Saldo de Estoque" description=" Sistemas / TASY / Saldo de Estoque"><SaldoEstoqueTASY /></Main>} />
          <Route path="/TASY/SolicComprasNaoAtendidasTASY" element={<Main title="Solicitação de Compras Não Atendidas" description=" Sistemas / TASY / Solicitação de Compras Não Atendidas"><SolicComprasNaoAtendidasTASY /></Main>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

