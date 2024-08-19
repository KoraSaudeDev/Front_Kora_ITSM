import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import { FaChartPie, FaChartBar, FaPlus, FaHome, FaHeadset, FaChevronDown } from 'react-icons/fa'; 
import logokora from '../assets/images/logokora.png';
import SemFoto from '../assets/images/Sem_foto.png';

const Sidebar = () => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(SemFoto);

  useEffect(() => {
    const savedFoto = localStorage.getItem('fotoPerfil');
    if (savedFoto) {
      setFotoPerfil(savedFoto);
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
    setActiveDropdown((prevState) => (prevState === id ? '' : id));
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
  };

  const handleTicketRedirect = () => {
    if (window.confirm("Certifique-se de estar conectado em uma Rede Kora")) {
      window.location.href = "http://10.27.254.161:8088/superset/dashboard/p/nZk8vLL2gQ1/";
    }
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
          <li className={`item-navegacao ${activeDropdown === 'dropdownAtendimentos' ? 'active' : ''}`}>
            <a href="#" className={`link-navegacao ${location.pathname.includes('/atendimentos') ? 'active' : ''}`} onClick={() => alternarDropdown('dropdownAtendimentos')}>
              <FaHeadset className="icon" />
              <span>ITSM</span>
              <FaChevronDown className={`seta ${activeDropdown === 'dropdownAtendimentos' ? 'rotacionar' : ''}`} />
            </a>
            <ul id="dropdownAtendimentos" className={`conteudo-dropdown ${activeDropdown === 'dropdownAtendimentos' ? 'mostrar' : ''}`}>
              <li className={location.pathname === '/atendimentos/novo-ticket' ? 'active' : ''}>
                <Link to="/atendimentos/novo-ticket" className={location.pathname === '/atendimentos/novo-ticket' ? 'active' : ''}>

                  <span>Novo Ticket</span>
                </Link>
              </li>
              <li className={location.pathname === '/atendimentos/meus-atendimentos' ? 'active' : ''}>
                <Link to="/atendimentos/meus-atendimentos" className={location.pathname === '/atendimentos/meus-atendimentos' ? 'active' : ''}>Meus Atendimentos</Link>
              </li>
              <li className={location.pathname === '/atendimentos/minha-equipe' ? 'active' : ''}>
                <Link to="/atendimentos/minha-equipe" className={location.pathname === '/atendimentos/minha-equipe' ? 'active' : ''}>Minha Equipe</Link>
              </li>
            </ul>
          </li>
          <li className={`item-navegacao ${activeDropdown === 'dropdownDashboard' ? 'active' : ''}`}>
            <a href="#" className={`link-navegacao ${location.pathname.includes('/dashboard') ? 'active' : ''}`} onClick={() => alternarDropdown('dropdownDashboard')}>
              <FaChartPie className="icon" />
              <span>Dashboard</span>
              <FaChevronDown className={`seta ${activeDropdown === 'dropdownDashboard' ? 'rotacionar' : ''}`} />
            </a>
            <ul id="dropdownDashboard" className={`conteudo-dropdown ${activeDropdown === 'dropdownDashboard' ? 'mostrar' : ''}`}>
              <li className={location.pathname === '/dashboard/tickets' ? 'active' : ''}>
                <a href="#" onClick={handleTicketRedirect}>
                  <FaChartBar className="icon" />
                  <span>Tickets</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
