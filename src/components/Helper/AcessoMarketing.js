import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Helper/AcessoMarketing.css';
import HeaderHelper from './Header-Helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

function AcessoMarketing() {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    const secoesMarketing = [
        { nome: 'Marketing e Comunicação', icone: faBullhorn, link: '#' }
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
                            className="cartao-marketing"
                            onClick={() => aoClicarHelper(secao)}
                        >
                            <FontAwesomeIcon icon={secao.icone} className="icone-marketing" />
                            <div className="nome-marketing">{secao.nome}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AcessoMarketing;
