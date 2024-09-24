import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Helper/AcessoTI.css';
import HeaderHelper from '../Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faShoppingCart,
    faNetworkWired,
    faServer,
    faDatabase,
    faPhone,
    faCog,
    faToolbox,
    faMobile,
    faShieldAlt,
    faPrint,
    faHeadset,
    faVials,
    faUserCircle,
    faChartLine,
    faLink,
    faLaptop,
    faGlobe,
    faClipboardCheck,
    faFlask,
    faCalendar,
    faFileInvoice,
    faLaptopMedical,
    faProjectDiagram
} from '@fortawesome/free-solid-svg-icons';

function AcessoTI() {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showAlert, setShowAlert] = useState(false); 
    const [alertMessage, setAlertMessage] = useState('');

    const secoesMaiores = [
        { nome: 'MV', icone: faServer, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"MV"}' },
        { nome: 'Tasy', icone: faLaptopMedical, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"TASY"}' },
        { nome: 'SAP', icone: faClipboardCheck, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"SAP"}' },
        { nome: 'Rede e E-mail', icone: faEnvelope, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo20Ticket&defaults={"categoria":"Acesso/Rede"}' },
        { nome: 'Compras', icone: faShoppingCart, link: 'https://www.appsheet.com/start/64d80ab4-16d2-4a14-816b-6a007b9b2980#appName=Solicita%C3%A7%C3%A3odeEquipamento-488885362&page=form&row=&table=SL_Adicionar&view=Novo+Ticket' },
        { nome: 'Acesso Rede', icone: faNetworkWired, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo20Ticket&defaults={"categoria":"Acesso/Rede"}' }
    ];

    const secoesMenores = [
        { nome: 'Outros', icone: faToolbox, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&page=form&row=&table=SL_novo_ticket&view=Novo+Ticket' },
        { nome: 'Laboratório LIS', icone: faFlask, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"LIS"}' },
        { nome: 'RIS/PACS', icone: faServer, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"RIS/PACS"}' },
        { nome: 'Agenda AOL', icone: faCalendar, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Agendamento"}' },
        { nome: 'Senior', icone: faUserCircle, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Sênior"}' },
        { nome: 'Painéis do BI', icone: faChartLine, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"BI"}' },
        { nome: 'Link de Dados', icone: faLink, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Link de Dados"}' },
        { nome: 'Telefonia Fixa', icone: faPhone, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Telefonia Fixa"}' },
        { nome: 'Impressoras', icone: faPrint, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Impressoras"}' },
        { nome: 'Telefonia Móvel', icone: faMobile, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Telefonia Movel"}' },
        { nome: 'Banco de Dados', icone: faDatabase, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Banco de Dados"}' },
        { nome: 'Relógio de Ponto', icone: faLaptop, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Relógio de Ponto"}' },
        { nome: 'Change', icone: faCog, link: 'https://www.appsheet.com/start/15c37ba0-bf1c-43ca-a5ef-eb0dc63ffe9d#appName=ITSM-ChangeV3-448944302&group=%5B%7B%22Column%22%3A%22ds_status%22%2C%22Order%22%3A%22Ascending%22%7D%5D&page=fastTable&sort=%5B%7B%22Column%22%3A%22dt_abertura%22%2C%22Order%22%3A%22Descending%22%7D%5D&table=Sl_minhas_solicitacoes&view=Minhas+Solicitações' },
        { nome: 'Gestão de Demandas', icone: faProjectDiagram, link: 'https://www.appsheet.com/start/77407a8b-89e2-418b-8b3c-4ec3053f05b7#view=Novo%20Ticket' },
        { nome: 'PMO', icone: faGlobe, link: 'https://www.appsheet.com/dbs/database/yRZRN9Vusx4VmCVLn22vV0/table/NB0LFPjIa8442iSGIvcNf0' },
        { nome: 'Aplicativos', icone: faMobile, link: 'https://www.appsheet.com/start/2b5f0d42-fa81-4e5c-b998-688347035abd#view=Novo%20Ticket' },
        { nome: 'VPN/ZTNA', icone: faShieldAlt, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Cybersecutiry", "subcategoria": "ZTNA - Conectividade"}' },
        { nome: 'Micro Informática', icone: faLaptop, link: 'https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#appName=TicketsGeral-448944302&view=Novo%20Ticket&defaults={"categoria":"Infraestrutura"}' },
        { nome: 'Suporte', icone: faHeadset, link: '/suportePRD/meus-atendimentos' }
    ];

    useEffect(() => {
        const img = new Image();
        img.src = '../assets/images/bghelper.png';
        img.onload = () => setImageLoaded(true);
    }, []);

    const aoClicarHelper = (secao) => {
        if (['Arsenal', 'Controladoria', 'Financeiro'].includes(secao.nome)) {
            setAlertMessage('Não contém no QAS'); 
            setShowAlert(true); 
            setTimeout(() => setShowAlert(false), 3000); 
        } else {
            window.open(secao.link, '_blank');
        }
    };

    return (
        <div className={`background-branco-TI ${imageLoaded ? 'image-loaded' : 'image-loading'}`}>
            <HeaderHelper />
            <div className="container-acessoti">
                {showAlert && (
                    <div className="alert-bar">
                        {alertMessage}
                    </div>
                )}
                <div className="cartoes-maiores-acessoti">
                    {secoesMaiores.map((secao, indice) => (
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

                <div className="cartoes-menores-acessoti">
                    {secoesMenores.map((secao, indice) => (
                        <div
                            key={indice}
                            className={`cartao-menor-acessoti ${secao.nome === 'Suporte' ? 'suporte-special' : ''}`}
                            onClick={() => aoClicarHelper(secao)}
                            style={secao.nome === 'Suporte' ? { backgroundColor: '#1C293E', color: 'white' } : {}}
                        >
                            <FontAwesomeIcon 
                                icon={secao.icone} 
                                className="icone-acessoti-menor" 
                                style={secao.nome === 'Suporte' ? { color: 'white' } : {}}
                            />
                            <div 
                                className="nome-acessoti-menor" 
                                style={secao.nome === 'Suporte' ? { color: 'white' } : {}}
                            >
                                {secao.nome}
                            </div>
                        </div>
                    ))}
                </div>

                
                <div className="icon-bottom-right" onClick={() => window.open('https://www.appsheet.com/start/3dbf5f58-b6b1-4ee8-bd4d-a14699c5dc31#view=Meus%20Tickets', '_blank')}>
                    <div className="tooltip">Minhas Solicitações</div>
                    <img src="https://i.ibb.co/GVgKvfw/image.png" alt="Icon" className="pulsating-image"/>
                </div>




            </div>
        </div>
    );
}

export default AcessoTI;
