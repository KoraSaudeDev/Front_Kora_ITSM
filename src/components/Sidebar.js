import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';
import { FaChartPie, FaChartBar, FaPlus, FaHome, FaHeadset, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import logokora from '../assets/images/logokora.png';
import SemFoto from '../assets/images/Sem_foto.png';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState('dropdownAtendimentos');
  const { user, logout } = useAuth();
  const [meusAtendimentosCount] = useState(0);
  const [minhaEquipeCount, setMinhaEquipeCount] = useState(0);

  useEffect(() => {
    if (user && user.cargo) { 
      const fetchMinhaEquipeCount = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/tickets/minha-equipe?page=1&per_page=1`,
            { grupos: user.cargo },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          setMinhaEquipeCount(response.data.total_items);
          console.log(response.data.total_items);
        } catch (error) {
          console.error("Erro ao buscar contagem de Minha Equipe", error);
        }
      };

      fetchMinhaEquipeCount();
    }
  }, [user]); 

  useEffect(() => {
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

  const resetDropdowns = () => {
    setActiveDropdown('');
  };

  const handleTicketRedirect = () => {
    if (window.confirm("Certifique-se de estar conectado em uma Rede Kora")) {
      window.location.href = "http://10.27.254.161:8088/superset/dashboard/p/nZk8vLL2gQ1/";
    }
  };

  const handleLogout = () => {
    logout();
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
            <div className="foto-perfil">
              <img
                id="fotoPerfil"
                border="none"
                src={user?.picture || SemFoto}
                alt="Foto de Perfil"
              />
            </div>
          </div>
          <div className="informacoes-usuario">
            <p id="usuario">{user?.name || 'Nome do Usuário'}</p>
            {user?.cargo?.length > 0 ? (
              user.cargo.map((item, index) => (
                <p key={index} id="cargo">
                  {item}
                </p>
              ))
            ) : (
              <p id="cargo">Sem grupo</p>
            )}
          </div>
        </div>
        {/* <div className="titulo-botoes">Menu</div> */}
        <ul className="botoes-navegacao">
          {/* <li className={`item-navegacao ${location.pathname === '/' ? 'active' : ''}`}>
            <Link to="/" className={`link-navegacao ${location.pathname === '/' ? 'active' : ''}`} onClick={resetDropdowns}>
              <FaHome className="icon" />
              <span>Home</span>
            </Link>
          </li> */}
          <li className={`item-navegacao ${activeDropdown === 'dropdownAtendimentos' ? 'active' : ''}`}>
            <a href="#" className={`link-navegacao ${location.pathname.includes('/atendimentos') ? 'active' : ''}`} onClick={() => alternarDropdown('dropdownAtendimentos')}>
              <FaHeadset className="icon" />
              <span>ITSM</span>
              <FaChevronDown className={`seta ${activeDropdown === 'dropdownAtendimentos' ? 'rotacionar' : ''}`} />
            </a>
            <ul id="dropdownAtendimentos" className={`conteudo-dropdown ${activeDropdown === 'dropdownAtendimentos' ? 'mostrar' : ''}`}>
              <li className={location.pathname === '/atendimentos/meus-atendimentos' ? 'active' : ''}>
                <Link to="/atendimentos/meus-atendimentos" className={location.pathname === '/atendimentos/meus-atendimentos' ? 'active' : ''}>
                  Meus Atendimentos
                  <span className="badge">{meusAtendimentosCount}</span>
                </Link>
              </li>
              <li className={location.pathname === '/atendimentos/minha-equipe' ? 'active' : ''}>
                <Link to="/atendimentos/minha-equipe" className={location.pathname === '/atendimentos/minha-equipe' ? 'active' : ''}>
                  Minha Equipe
                  {minhaEquipeCount > 0 && (
                    <span className="badge">{minhaEquipeCount}</span>
                  )}
                </Link>
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
          <li className="item-navegacao logout">
            <a href="#" className="link-navegacao" onClick={handleLogout}>
              <FaSignOutAlt className="icon" />
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
