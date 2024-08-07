import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import { FaDatabase, FaServer, FaNetworkWired, FaChevronDown, FaDesktop, FaHome } from 'react-icons/fa';
import logokora from '../assets/images/logokora.png';
import SemFoto from '../assets/images/Sem_foto.png';

const Sidebar = () => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState('');
  const [activeParentDropdown, setActiveParentDropdown] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(SemFoto);

  useEffect(() => {
    const savedFoto = localStorage.getItem('fotoPerfil');
    if (savedFoto) {
      setFotoPerfil(savedFoto);
    }

    if (location.pathname.includes('/MV')) {
      setActiveDropdown('dropdown1');
      setActiveParentDropdown('parentDropdown');
    } else if (location.pathname.includes('/TASY')) {
      setActiveDropdown('dropdown2');
      setActiveParentDropdown('parentDropdown');
    } else if (location.pathname.includes('/SAP')) {
      setActiveDropdown('dropdown3');
      setActiveParentDropdown('parentDropdown');
    }

    const menu = document.querySelector('.menu-lateral');
    const conteudoPrincipal = document.querySelector('main');
    const cabecalho = document.querySelector('header');

    if (menu) {
      menu.classList.add('visible');
    }
    if (conteudoPrincipal) {
      conteudoPrincipal.classList.add('mover');
    }
    if (cabecalho) {
      cabecalho.style.marginLeft = '250px';
    }
  }, [location.pathname]);

  const alternarMenu = () => {
    const menuLateral = document.querySelector('.menu-lateral');
    const conteudoPrincipal = document.querySelector('main');
    const cabecalho = document.querySelector('header');
    
    if (menuLateral && conteudoPrincipal && cabecalho) {
      menuLateral.classList.toggle('visible');
      conteudoPrincipal.classList.toggle('mover');
      if (menuLateral.classList.contains('visible')) {
        cabecalho.style.marginLeft = '250px';
      } else {
        cabecalho.style.marginLeft = '0';
      }
    }
  };

  const alternarDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? '' : id);
  };

  const alternarParentDropdown = () => {
    setActiveParentDropdown(activeParentDropdown === 'parentDropdown' ? '' : 'parentDropdown');
  };

  const atualizarFotoPerfil = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = function (e) {
        const foto = e.target.result;
        setFotoPerfil(foto);
        localStorage.setItem('fotoPerfil', foto); 
      };
      leitor.readAsDataURL(arquivo);
    }
  };

  const removerFotoPerfil = () => {
    setFotoPerfil(SemFoto);
    localStorage.removeItem('fotoPerfil');
  };

  const resetDropdowns = () => {
    setActiveDropdown('');
    setActiveParentDropdown('');
  };

  return (
    <nav className="menu-lateral">
      <div className="cabecalho-menu-lateral">
        <div className="logo" onClick={alternarMenu}>
          <img id="logo" src={logokora} width="120px" alt="Logo" />
        </div>
      </div>
      <div className="conteudo-menu-lateral">
        <div className="secao-perfil">
          <div className="foto-perfil-container">
            <div className="foto-perfil" onClick={() => document.getElementById('inputArquivo').click()}>
              <img id="fotoPerfil" border="none" src={fotoPerfil} alt="Foto de Perfil" />
              <input type="file" id="inputArquivo" accept="image/*" style={{ display: 'none' }} onChange={atualizarFotoPerfil} />
              {fotoPerfil !== SemFoto && (
                <button className="remover-foto" onClick={removerFotoPerfil}>X</button>
              )}
            </div>
          </div>
          <div className="informacoes-usuario">
            <p id="usuario">Nome do Usuário</p>
            <p id="cargo">Cargo</p>
          </div>
        </div>
        <div className="titulo-botoes">Menu</div>
        <ul className="botoes-navegacao">
          <li className={`item-navegacao ${location.pathname === '/' ? 'active' : ''}`}>
            <Link to="/" className={`link-navegacao ${location.pathname === '/' ? 'active' : ''}`} onClick={resetDropdowns}>
              <FaHome className="icon" />
              <span>Home</span>
            </Link>
          </li>
          <li className={`item-navegacao ${activeParentDropdown === 'parentDropdown' ? 'active' : ''}`}>
            <a href="#" className={`link-navegacao ${location.pathname.includes('/MV') || location.pathname.includes('/TASY') || location.pathname.includes('/SAP') ? 'active' : ''}`} onClick={alternarParentDropdown}>
              <FaDesktop className="icon" />
              <span>Sistemas</span>
              <FaChevronDown className={`seta ${activeParentDropdown === 'parentDropdown' ? 'rotacionar' : ''}`} />
            </a>
            <ul id="parentDropdown" className={`conteudo-dropdown ${activeParentDropdown === 'parentDropdown' ? 'mostrar' : ''}`}>
              <li className={`item-navegacao ${location.pathname.includes('/MV') ? 'active' : ''}`}>
                <a href="#" className={`link-navegacao ${location.pathname.includes('/MV') ? 'active' : ''}`} onClick={() => alternarDropdown('dropdown1')}>
                  <FaDatabase className="icon" />
                  <span>MV</span>
                  <FaChevronDown className={`seta ${activeDropdown === 'dropdown1' ? 'rotacionar' : ''}`} />
                </a>
                <ul id="dropdown1" className={`conteudo-dropdown ${activeDropdown === 'dropdown1' ? 'mostrar' : ''}`}>
                  <li className={location.pathname === '/MV/DadosConsolidadosMV' ? 'active' : ''}>
                    <Link to="/MV/DadosConsolidadosMV" className={location.pathname === '/MV/DadosConsolidadosMV' ? 'active' : ''}>Dados Consolidados</Link></li>
                  <li className={location.pathname === '/MV/ConsumoDiarioMV' ? 'active' : ''}>
                    <Link to="/MV/ConsumoDiarioMV" className={location.pathname === '/MV/ConsumoDiarioMV' ? 'active' : ''}>Consumo Diário</Link></li>
                  <li className={location.pathname === '/MV/EstoqueConsolidadoMV' ? 'active' : ''}>
                    <Link to="/MV/EstoqueConsolidadoMV" className={location.pathname === '/MV/EstoqueConsolidadoMV' ? 'active' : ''}>Estoque Consolidado</Link></li>
                  <li className={location.pathname === '/MV/EstoqueSimplificadoMV' ? 'active' : ''}>
                    <Link to="/MV/EstoqueSimplificadoMV" className={location.pathname === '/MV/EstoqueSimplificadoMV' ? 'active' : ''}>Estoque Simplificado</Link></li>
                  <li className={location.pathname === '/MV/AbcConsumoMV' ? 'active' : ''}>
                    <Link to="/MV/AbcConsumoMV" className={location.pathname === '/MV/AbcConsumoMV' ? 'active' : ''}>ABC de Consumo</Link></li>
                </ul>
              </li>
              <li className={`item-navegacao ${location.pathname.includes('/TASY') ? 'active' : ''}`}>
                <a href="#" className={`link-navegacao ${location.pathname.includes('/TASY') ? 'active' : ''}`} onClick={() => alternarDropdown('dropdown2')}>
                  <FaServer className="icon" />
                  <span>TASY</span>
                  <FaChevronDown className={`seta ${activeDropdown === 'dropdown2' ? 'rotacionar' : ''}`} />
                </a>
                <ul id="dropdown2" className={`conteudo-dropdown ${activeDropdown === 'dropdown2' ? 'mostrar' : ''}`}>
                  <li className={location.pathname === '/TASY/CadastroMateriaisTASY' ? 'active' : ''}>
                    <Link to="/TASY/CadastroMateriaisTASY" className={location.pathname === '/TASY/CadastroMateriaisTASY' ? 'active' : ''}>Cadastro de Materiais</Link></li>
                  <li className={location.pathname === '/TASY/SaldoEstoqueTASY' ? 'active' : ''}>
                    <Link to="/TASY/SaldoEstoqueTASY" className={location.pathname === '/TASY/SaldoEstoqueTASY' ? 'active' : ''}>Saldo de Estoque</Link></li>
                  <li className={location.pathname === '/TASY/MovimentoSinteticoTASY' ? 'active' : ''}>
                    <Link to="/TASY/MovimentoSinteticoTASY" className={location.pathname === '/TASY/MovimentoSinteticoTASY' ? 'active' : ''}>Movimento Sintético Operações</Link></li>
                  <li className={location.pathname === '/TASY/AbcConsumoTASY' ? 'active' : ''}>
                    <Link to="/TASY/AbcConsumoTASY" className={location.pathname === '/TASY/AbcConsumoTASY' ? 'active' : ''}>ABC de Consumo</Link></li>
                  <li className={location.pathname === '/TASY/ConsumoDiarioTASY' ? 'active' : ''}>
                    <Link to="/TASY/ConsumoDiarioTASY" className={location.pathname === '/TASY/ConsumoDiarioTASY' ? 'active' : ''}>Consumo Diário por Material</Link></li>
                  <li className={location.pathname === '/TASY/OrdemCompraTASY' ? 'active' : ''}>
                    <Link to="/TASY/OrdemCompraTASY" className={location.pathname === '/TASY/OrdemCompraTASY' ? 'active' : ''}>Ordem de Compra</Link></li>
                  <li className={location.pathname === '/TASY/SolicComprasNaoAtendidasTASY' ? 'active' : ''}>
                    <Link to="/TASY/SolicComprasNaoAtendidasTASY" className={location.pathname === '/TASY/SolicComprasNaoAtendidasTASY' ? 'active' : ''}>Solicitação de Compras não Atendidas - Sem baixa</Link></li>
                  <li className={location.pathname === '/TASY/DetalheNotaFiscalTASY' ? 'active' : ''}>
                    <Link to="/TASY/DetalheNotaFiscalTASY" className={location.pathname === '/TASY/DetalheNotaFiscalTASY' ? 'active' : ''}>Detalhe Nota Fiscal</Link></li>
                </ul>
              </li>
              <li className={`item-navegacao ${location.pathname.includes('/SAP') ? 'active' : ''}`}>
                <a href="#" className={`link-navegacao ${location.pathname.includes('/SAP') ? 'active' : ''}`} onClick={() => alternarDropdown('dropdown3')}>
                  <FaNetworkWired className="icon" />
                  <span>SAP</span>
                  <FaChevronDown className={`seta ${activeDropdown === 'dropdown3' ? 'rotacionar' : ''}`} />
                </a>
                <ul id="dropdown3" className={`conteudo-dropdown ${activeDropdown === 'dropdown3' ? 'mostrar' : ''}`}>
                  <li className={location.pathname === '/SAP/RequisicaoSAP' ? 'active' : ''}>
                    <Link to="/SAP/RequisicaoSAP" className={location.pathname === '/SAP/RequisicaoSAP' ? 'active' : ''}>Requisições</Link></li>
                  <li className={location.pathname === '/SAP/EstoqueSAP' ? 'active' : ''}>
                    <Link to="/SAP/EstoqueSAP" className={location.pathname === '/SAP/EstoqueSAP' ? 'active' : ''}>Estoques</Link></li>
                  <li className={location.pathname === '/SAP/PedidoSAP' ? 'active' : ''}>
                    <Link to="/SAP/PedidoSAP" className={location.pathname === '/SAP/PedidoSAP' ? 'active' : ''}>Pedidos</Link></li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
