import React from 'react'; 
import { NavLink } from 'react-router-dom';
import '../styles/SideInterna.css';

const SidebarInterna = ({ menuItems }) => {
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
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SidebarInterna;
