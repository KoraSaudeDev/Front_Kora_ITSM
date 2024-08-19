import React from 'react';
import SearchBar from './SearchBar';
import '../styles/Header.css';
import { FaCog, FaBell } from 'react-icons/fa';

const Header = () => {
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

  return (
    <header>
      <div className="conteudo-cabecalho">
        <div className="toggle-menu" onClick={alternarMenu} data-tooltip="Menu">
          &#9776;
        </div>
        {/* <div className="barra-busca">
          <SearchBar />
        </div> */}
        <div className="cabecalho2">
          <div className="conteudo-cabecalho2">
            <div className="icone notification" onClick={() => alert('Ver notificações')} data-tooltip="Notificação">
              <FaBell />
              <div className="notification-dot"></div>
            </div>
            <div className="icone" onClick={() => alert('Abrir configurações')} data-tooltip="Configuração">
              <FaCog />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
