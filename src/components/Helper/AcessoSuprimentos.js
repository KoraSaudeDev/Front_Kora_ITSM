import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Helper/AcessoSuprimentos.css';
import HeaderHelper from '../Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faTruckLoading, faClipboardList, faBoxes, faTasks, faFileContract } from '@fortawesome/free-solid-svg-icons';

function AcessoSuprimentos() {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    const secoesSuprimentos = [
        { nome: 'GED', icone: faFileAlt, link: 'https://ged.docsolucoes.com.br/kora/home/auth/login' },
        { nome: 'Suprimentos Logística', icone: faTruckLoading, link: 'https://www.appsheet.com/start/e2a5613d-5b3d-4ae4-b467-f0480fd35795' },
        { nome: 'Cadastro de Fornecedor', icone: faClipboardList, link: 'https://www.appsheet.com/start/44e01724-465a-42f5-9680-9884977096ad#view=Nova%20Solicita%C3%A7%C3%A3o' },
        { nome: 'Tickets Suprimentos', icone: faBoxes, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Integracao/Suprimentos"}' },
        { nome: 'Satelitti - Assinatura de Contratos', icone: faFileContract, link: 'https://kora-doc.satelitti.com.br/suite-new/auth/login' },
        { nome: 'Planning', icone: faTasks, link: 'https://planning.korasaude.com.br/' },
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
            <div className="container-acesso-suprimentos">
                <div className="cartoes-suprimentos">
                    {secoesSuprimentos.map((secao, indice) => (
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

export default AcessoSuprimentos;
