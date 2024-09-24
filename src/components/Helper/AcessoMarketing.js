import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Helper/AcessoMarketing.css';
import HeaderHelper from '../Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

function AcessoMarketing() {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    const secoesMarketing = [
        { nome: 'Marketing e Comunicação', icone: faBullhorn, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Marketing e Comunicacao"}' }
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
            <div className="container-acesso-marketing">
                <div className="cartoes-marketing">
                    {secoesMarketing.map((secao, indice) => (
                        <div
                            key={indice}
                            className="cartao-maior-acessoti"
                            onClick={() => aoClicarHelper(secao)}
                        >
                            <FontAwesomeIcon icon={secao.icone} className="icone-acessoti" />
                            <div className="nome-acessoti">{secao.nome}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AcessoMarketing;
