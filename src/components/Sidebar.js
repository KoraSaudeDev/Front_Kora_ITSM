import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';
import * as Icons from 'react-icons/fa';
import logokora from '../assets/images/logokora.png';
import SemFoto from '../assets/images/Sem_foto.png';
import { useAuth } from '../context/AuthContext';
import { useRefresh } from '../context/RefreshContext';
import axios from 'axios';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout } = useAuth();
  const { refreshKey } = useRefresh();
  const [menuCounts, setMenuCounts] = useState({});
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = () => {
      const storedMenu = localStorage.getItem(process.env.REACT_APP_CACHE_MENU);
      if (storedMenu) {
        const menus = JSON.parse(storedMenu);
        setMenus(menus);

        const firstParent = menus.find(menu => menu.parent_id === null);
        if (firstParent) {
          setActiveDropdown(`dropdown${firstParent.id}`);
        }
      } else {
        setMenus([]);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    const fetchMenuCounts = async () => {
      const counts = {};
      const fetchCount = async (menu) => {
        try {
          const menuConfigString = menu.apiCounterConfig.replace(/<<(\w+)>>/g, (match, key) => {
            const value = user[key];

            if (Array.isArray(value)) {
              return JSON.stringify(value);
            }

            return value !== undefined ? value : match;
          });

          const menuConfig = JSON.parse(menuConfigString);

          const axiosConfig = {
            method: menuConfig.method,
            url: `${process.env.REACT_APP_API_BASE_URL}${menuConfig.url}`,
            ...(menuConfig.headers && { headers: menuConfig.headers }),
            ...(menuConfig.data && { data: menuConfig.data }),
            ...(menuConfig.maxBodyLength && { maxBodyLength: menuConfig.maxBodyLength }),
          };

          const response = await axios(axiosConfig);
          
          counts[menu.id] = response.data.total_items || 0;
        } catch (error) {
          console.error(`Erro ao buscar contagem de ${menu.label}`, error);
          counts[menu.id] = 0;
        }
      };

      const menusWithCounter = menus.filter(menu => menu.apiCounterConfig);
      await Promise.all(menusWithCounter.map(fetchCount));

      setMenuCounts(prevCounts => ({
        ...prevCounts,
        ...counts,
      }));
    };

    if (menus.length > 0) {
      fetchMenuCounts();
    }
  }, [menus, refreshKey]);

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

  const alternarDropdown = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const isMenuActive = (menu) => {
    return location.pathname.includes(menu.route) || menus.some(sub => sub.parent_id === menu.id && location.pathname.includes(sub.route));
  };

  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="icon" /> : null;
  };

  const renderMenuItems = (menus, parentId = null) => {
    return menus
      .filter(menu => menu.parent_id === parentId)
      .map(menu => {
        const hasSubMenu = menus.some(sub => sub.parent_id === menu.id);
        const count = menuCounts[menu.id] || null;

        return (
          <li key={menu.id} className={`item-navegacao ${isMenuActive(menu) ? 'active' : ''}`}>
            <Link to={menu.route || '#'}
              className={`link-navegacao ${isMenuActive(menu) ? 'active' : ''}`}
              onClick={() => hasSubMenu && alternarDropdown(`dropdown${menu.id}`)}
            >
              {getIcon(menu.icon)}
              <span>{menu.label}</span>
              {count > 0 && <span className="badge">{count}</span>}
              {hasSubMenu && <Icons.FaChevronDown className={`seta ${activeDropdown === `dropdown${menu.id}` ? 'rotacionar' : ''}`} />}
            </Link>

            {hasSubMenu && (
              <ul
                id={`dropdown${menu.id}`}
                className={`conteudo-dropdown ${activeDropdown === `dropdown${menu.id}` ? 'mostrar' : ''}`}
              >
                {renderMenuItems(menus, menu.id)}
              </ul>
            )}
          </li>
        );
      });
  };

  return (
    <nav className="menu-lateral">
      <div className="cabecalho-menu-lateral">
        <div className="logo" onClick={() => navigate('/helper')}>
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
            <p id="usuarioo">{user?.name || 'Nome do Usuário'}</p>
            {user?.filas?.length > 0 ? (
              user.filas.map((item, index) => (
                <p key={index} id="cargo">
                  {item}
                </p>
              ))
            ) : (
              <p id="cargoo">Cargo não informado</p>
            )}
          </div>
        </div>
        <ul className="botoes-navegacao">
          {renderMenuItems(menus)}
        </ul>
      </div>
      <div className="sidebar-footer">
        <p>Version 2.000</p>
      </div>
    </nav>
  );
};

export default Sidebar;