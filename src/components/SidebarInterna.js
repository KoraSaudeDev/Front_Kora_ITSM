import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRefresh } from '../context/RefreshContext';
import axios from 'axios';
import '../styles/SideInterna.css';

const SidebarInterna = ({ menuItems }) => {
    const { user, token } = useAuth();
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
                                'Authorization': `Bearer ${token}`,
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
                                'Authorization': `Bearer ${token}`,
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
    }, [user, refreshKey, token]);

    return (
        <div className="sidebar-interna">
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active-interna' : ''}`}
                        >
                            {item.label}
                            {item.hasCount && (
                                <span className="count-badge">
                                    {item.label === 'Meus Atendimentos' && meusAtendimentosCount > 0 ? meusAtendimentosCount : ''}
                                    {item.label === 'Minha Equipe' && minhaEquipeCount > 0 ? minhaEquipeCount : ''}
                                </span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SidebarInterna;
