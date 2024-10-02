import React from 'react'; 
import { NavLink } from 'react-router-dom';
import '../styles/SideInterna.css';

const SidebarInterna = () => {
    return (
        <div className="sidebar-interna">
            <ul>
                <li>
                    <NavLink
                        to="/suporte/novo-ticket-futuro"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active-interna' : ''}`}
                    >
                        Novo Ticket
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/suporte/meus-atendimentos"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active-interna' : ''}`}
                    >
                        Meus Atendimentos
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/suporte/minha-equipe"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active-interna' : ''}`}
                    >
                        Minha Equipe
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="http://10.27.254.161:8088/superset/dashboard/KoraHelper/"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active-interna' : ''}`}
                    >
                        Dashboard
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default SidebarInterna;
