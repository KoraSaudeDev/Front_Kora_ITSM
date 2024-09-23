import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Helper/Header-Helper.css';
import logoKora from '../../assets/images/logokora.png';

function HeaderHelper() {
    const navigate = useNavigate();

    const aoClicarLogo = () => {
        // navigate('/helper');
        navigate('/helperPRD');
    };

    return (
        <header className="cabecalho-helper">
            <img 
                src={logoKora} 
                alt="Kora Helper" 
                className="logo-helper" 
                onClick={aoClicarLogo} 
            />
        </header>
    );
}

export default HeaderHelper;
