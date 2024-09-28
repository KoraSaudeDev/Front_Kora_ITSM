import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Helper/AcessoRH.css';
import HeaderHelper from './Header-Helper'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faUsers } from '@fortawesome/free-solid-svg-icons';

function AcessoRH() {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    const secoesRh = [
        { nome: 'Gestão do Ponto - Sênior', icone: faLaptop, link: 'https://painelsenior.redemeridional.com.br/gestaoponto-frontend/login' },
        { nome: 'Painel de Gestão - Sênior', icone: faUsers, link: 'https://platform.senior.com.br/login/?redirectTo=https%3A%2F%2Fplatform.senior.com.br%2Fsenior-x%2F&tenant=korasaude.com.br' },
    ];

    useEffect(() => {
        const img = new Image();
        img.src = '../assets/images/bghelper.png';
        img.onload = () => setImageLoaded(true);
    }, []);

    const aoClicarHelper = (secao) => {
        window.open(secao.link, '_blank');
    };

    return (
        <div className={`background-branco-TI ${imageLoaded ? 'image-loaded' : 'image-loading'}`}>
            <HeaderHelper />
            <div className="container-acesso-rh">
                <div className="cartoes-rh-acesso-rh">
                    {secoesRh.map((secao, indice) => (
                        <div
                            key={indice}
                            className="cartao-maior-acessoti"
                            onClick={() => aoClicarHelper(secao)}
                        >
                            <FontAwesomeIcon icon={secao.icone} className="icone-acessoti" />
                            <div className="nome-acessoti">{secao.nome}</div>
                        </div>
                    ))}

                    <div className="icon-bottom-right" onClick={() => window.open('https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#view=Meus%20Tickets', '_blank')}>
                        <div className="tooltip">Minhas Solicitações</div>
                        <img src="https://i.ibb.co/GVgKvfw/image.png" alt="Icon" className="pulsating-image"/>
                    </div>
    
                </div>
            </div>
        </div>
    );
}

export default AcessoRH;
