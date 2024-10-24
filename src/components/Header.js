import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { FaBell } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faHeadset } from '@fortawesome/free-solid-svg-icons';      
import { useAuth } from '../context/AuthContext';
import logoKora from '../assets/images/logokora.png';
import SemFoto from '../assets/images/Sem_foto.png';

const Header = ({ pendentes = [] }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [itsmOpen, setItsmOpen] = useState(false);
  const [wfpoOpen, setWfpoOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
 
  const isSuportePage = location.pathname.includes('/suporte');
  const showSearchBar = ['/novo-ticket-futuro', '/suporte/meus-atendimentos', '/suporte/minha-equipe']
  .some(path => location.pathname.includes(path));


  useEffect(() => {
    if (isSuportePage && (!user || !user.bl_analista)) {
      const interval = setInterval(() => {
        const menu = document.querySelector('.menu-lateral');
        const conteudoPrincipal = document.querySelector('main');
        const cabecalho = document.querySelector('header');
  
        if (menu && conteudoPrincipal && cabecalho) {
          alternarMenu();
          clearInterval(interval);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [isSuportePage, user]);

  const alternarMenu = () => {
    const menu = document.querySelector('.menu-lateral');
    const conteudoPrincipal = document.querySelector('main');
    const cabecalho = document.querySelector('header');

    menu.classList.toggle('visible');
    conteudoPrincipal.classList.toggle('mover');

    if (menu.classList.contains('visible')) {
      cabecalho.style.marginLeft = '250px';
    } else {
      cabecalho.style.marginLeft = '0';
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (ticket) => {
    setShowNotifications(false);
    navigate('/suporte/meus-atendimentos', { state: { ticket } });
  };

  useEffect(() => {
    if (pendentes.length > 0) {
      const intervalId = setInterval(() => {
        setIsSwinging(true);
        setTimeout(() => setIsSwinging(false), 1000);
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [pendentes.length]);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <div className="conteudo-cabecalho">
        {isSuportePage && user && user.bl_analista ? (
          <div className="toggle-menu" onClick={alternarMenu} data-tooltip="Menu">
            &#9776;
          </div>
        ) : isSuportePage ? (
          <>
            <div
              className="toggle-menu"
              onClick={alternarMenu}
              data-tooltip="Menu"
              style={{ display: 'none' }}
            >
              &#9776;
            </div>
            <img
              src={logoKora}
              alt="Kora Helper"
              className="logo-helper"
              onClick={() => navigate('/helper')}
            />
          </>
        ) : (
          <img
            src={logoKora}
            alt="Kora Helper"
            className="logo-helper"
            onClick={() => navigate('/helper')}
          />
        )}

        {showSearchBar && (
          <div className="barra-busca">
            <SearchBar />
          </div>
        )}

        <div className="cabecalho2">
          <div className="conteudo-cabecalho2">
            {user && <div
              className={`icone notification ${isSwinging ? 'swinging' : ''}`}
              onClick={handleToggleNotifications}
              data-tooltip="Notificação"
            >
              <FaBell />
              {pendentes.length > 0 && (
                <div className="notification-dot pulsating"></div>
              )}
            </div>}
         
            {showNotifications && (
              <div className={`caixa-notificacoes ${showNotifications ? 'ativa' : ''}`}>
                {pendentes.length > 0 ? (
                  pendentes.map((ticket, index) => (
                    <div
                      key={index}
                      className="notificacao-item"
                      onClick={() => handleNotificationClick(ticket)}
                    >
                      <div className="notification-dot"></div>
                      <div className="notificacao-texto">
                        <p><strong>Ticket:</strong> {ticket.numeroTicket}</p>
                        <p><strong>Status:</strong> {ticket.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Não há notificações</p>
                )}
              </div>
            )}
            {user &&  <div
              className={`perfil-usuario ${isDropdownVisible ? 'dropdown-open' : ''}`}
              onClick={toggleDropdown}
            >
              <img
                src={user?.picture || SemFoto}
                alt="Foto de Perfil"
                className="foto-perfil"
              />

              
              {user?.bl_analista && (
                <div className="icone-headset" onClick={(e) => { e.stopPropagation(); navigate('/suporte/meus-atendimentos'); }}>
                  <FontAwesomeIcon icon={faHeadset} title="Suporte" />
                </div>
              )}

              {isDropdownVisible && (
                <div className="dropdown-perfil">
                  <p className="dropdown-username">{user?.name || 'Nome do Usuário'}</p>

                  {user?.filas?.length > 0 && (
                    <>
                      <div
                        className="dropdown-section"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItsmOpen(!itsmOpen);
                        }}
                      >
                        <h4>ITSM</h4>
                      </div>
                      {itsmOpen && (
                        <div className="dropdown-items">
                          {user.filas.map((fila, index) => (
                            <p key={`itsm-${index}`}>{fila}</p>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {user?.wf_po_grupos?.length > 0 && (
                    <>
                      <div
                        className="dropdown-section"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWfpoOpen(!wfpoOpen);
                        }}
                      >
                        <h4>WF-PO</h4>
                      </div>
                      {wfpoOpen && (
                        <div className="dropdown-items">
                          {user.wf_po_grupos.map((grupo, index) => (
                            <p key={`wf-po-${index}`}>{grupo}</p>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <div className="dropdown-separador"></div>
                  <div className="dropdown-logout" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </div>}
           
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
