import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';
import { FaHeadset, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import logokora from '../assets/images/logokora.png';
import SemFoto from '../assets/images/Sem_foto.png';
import { useAuth } from '../context/AuthContext';
import { useRefresh } from '../context/RefreshContext';
import axios from 'axios';

const Sidebar = () => {
  const authToken = localStorage.getItem(process.env.REACT_APP_TOKEN_USER);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState('dropdownAtendimentos');
  const { user, logout } = useAuth();
  const { refreshKey } = useRefresh();
  const [meusAtendimentosCount, setMeusAtendimentosCount] = useState(0);
  const [minhaEquipeCount, setMinhaEquipeCount] = useState(0);

  useEffect(() => {
    if (user && user.filas && user.id_user) {
      const fetchMinhaEquipeCount = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/tickets/minha-equipe?page=1&per_page=1`,
            { filas: user.filas_id },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'X-User-Email': user.email,
              },
            }
          );
          setMinhaEquipeCount(response.data.total_items);
        } catch (error) {
          console.error("Erro ao buscar contagem de Minha Equipe", error);
        }
      };

      const fetchMeusAtendimentosCount = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/tickets/meus-atendimentos?user_id=${user.id_user}&page=1&per_page=1`,
            { filtros: {} },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'X-User-Email': user.email,
              },
            }
          );
          setMeusAtendimentosCount(response.data.total_items);
        } catch (error) {
          console.error("Erro ao buscar contagem de Meus Atendimentos", error);
        }
      };

      fetchMeusAtendimentosCount();
      fetchMinhaEquipeCount();
    }
  }, [user, refreshKey]);

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
            {user?.filas?.length > 0 ? (
              user.filas.map((item, index) => (
                <p key={index} id="cargo">
                  {item}
                </p>
              ))
            ) : (
              <p id="cargo">Sem fila de atendimento</p>
            )}
          </div>
        </div>
        <ul className="botoes-navegacao">

          <li className={`item-navegacao ${activeDropdown === 'dropdownAtendimentos' ? 'active' : ''}`}>

            <a href="#" className={`link-navegacao ${location.pathname.includes('/suporte') ? 'active' : ''}`} onClick={() => alternarDropdown('dropdownAtendimentos')}>
              <FaHeadset className="icon" />
              <span>ITSM</span>
              <FaChevronDown className={`seta ${activeDropdown === 'dropdownAtendimentos' ? 'rotacionar' : ''}`} />
            </a>
            <ul id="dropdownAtendimentos" className={`conteudo-dropdown ${activeDropdown === 'dropdownAtendimentos' ? 'mostrar' : ''}`}>
              <li className={location.pathname === '/suporte/novo-ticket' ? 'active' : ''}>
                <a
                  href="https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&page=form&row=&table=SL_novo_ticket&view=Novo+Ticket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={location.pathname === '/suporte/novo-ticket' ? 'active' : ''}
                >
                  Novo Ticket
                </a>
              </li>
              {/* <li className={location.pathname === '/suporte/novo-ticket-futuro' ? 'active' : ''}>
                <Link to="/suporte/novo-ticket-futuro" className={location.pathname === '/suporte/novo-ticket-futuro' ? 'active' : ''}>
                  Novo Ticket Futuro
                </Link>
              </li> */}
              <li className={location.pathname === '/suporte/meus-atendimentos' ? 'active' : ''}>
                <Link to="/suporte/meus-atendimentos" className={location.pathname === '/suporte/meus-atendimentos' ? 'active' : ''}>
                  Meus Atendimentos
                  {meusAtendimentosCount > 0 && (
                    <span className="badge">{meusAtendimentosCount}</span>
                  )}
                </Link>
              </li>
              <li className={location.pathname === '/suporte/minha-equipe' ? 'active' : ''}>
                <Link to="/suporte/minha-equipe" className={location.pathname === '/suporte/minha-equipe' ? 'active' : ''}>
                  Minha Equipe
                  {minhaEquipeCount > 0 && (
                    <span className="badge">{minhaEquipeCount}</span>
                  )}
                </Link>
              </li>
              <li className={location.pathname === '/suporte/dashboard' ? 'active' : ''}>
                <a href="http://10.27.254.161:8088/superset/dashboard/p/pV5rmOZ7zgW/" target="_blank" rel="noopener noreferrer" className={location.pathname === '/atendimentos/dashboard' ? 'active' : ''}>
                  Dashboard
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
      <div className="sidebar-footer">
        <p>Version 1.027</p>
      </div>
    </nav>
  );
};

export default Sidebar;
