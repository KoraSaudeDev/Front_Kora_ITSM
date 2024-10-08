import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Header = ({ pendentes = [] }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <header>
      <div className="conteudo-cabecalho">
        <div className="toggle-menu" onClick={alternarMenu} data-tooltip="Menu">
          &#9776;
        </div>
        {user && user.bl_analista && (
          <div className="barra-busca">
            <SearchBar />
          </div>
        )}
        <div className="cabecalho2">
          <div className="conteudo-cabecalho2">
            <div
              className={`icone notification ${isSwinging ? 'swinging' : ''}`}
              onClick={handleToggleNotifications}
              data-tooltip="Notificação"
            >
              <FaBell />
              {pendentes.length > 0 && (
                <div className="notification-dot pulsating"></div>
              )}
            </div>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
