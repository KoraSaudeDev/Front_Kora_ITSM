import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook useNavigate
import '../styles/AcessoTI.css'; // Importando o arquivo CSS correspondente
import logoKora from '../assets/images/logokora.png'; // Importando o logo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faShoppingCart, faNetworkWired, faServer, faDatabase, faPhone, faCog, faToolbox, faMobile, faShieldAlt, faPrint, faHeadset } from '@fortawesome/free-solid-svg-icons';

function AcessoTI() {
    const navigate = useNavigate(); // Hook para navegação

    const secoesMaiores = [
        { nome: 'MV', icone: faServer },
        { nome: 'Tasy', icone: faDatabase },
        { nome: 'SAP', icone: faCog },
        { nome: 'Rede e E-mail', icone: faEnvelope },
        { nome: 'Compras', icone: faShoppingCart },
        { nome: 'Acesso Rede', icone: faNetworkWired }
    ];

    const secoesMenores = [
        { nome: 'Outros', icone: faToolbox },
        { nome: 'Laboratório LIS', icone: faDatabase },
        { nome: 'RIS/PACS', icone: faDatabase },
        { nome: 'Agenda AOL', icone: faPhone },
        { nome: 'Painéis do BI', icone: faServer },
        { nome: 'Link de Dados', icone: faNetworkWired },
        { nome: 'Telefonia Fixa', icone: faPhone },
        { nome: 'Telefonia Móvel', icone: faMobile },
        { nome: 'Impressoras', icone: faPrint },
        { nome: 'Gestão de Demandas', icone: faCog },
        { nome: 'PMO', icone: faToolbox },
        { nome: 'Aplicativos', icone: faMobile },
        { nome: 'VPN/ZTNA', icone: faShieldAlt },
        { nome: 'Micro Informática', icone: faToolbox },
        { nome: 'Suporte', icone: faHeadset } // Suporte adicionado
    ];

    const aoClicarHelper = (secao) => {
        console.log(`${secao.nome} clicado!`);
        if (secao.nome === 'Suporte') {
            navigate('/suporte/login'); // Redireciona para /suporte/login se Suporte for clicado
        }
    };

    const aoClicarLogo = () => {
        navigate('/helper'); // Redireciona para /helper ao clicar no logo
    };

    return (
        <div className="background-branco-TI">
            <div className="container-acessoti">
                <header className="cabecalho-acessoti">
                    <img 
                        src={logoKora} 
                        alt="Kora AcessoTI" 
                        className="logo-helper" 
                        onClick={aoClicarLogo} // Adicionando o evento de clique
                    />
                </header>

                {/* Cartões Maiores em linha única */}
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

                {/* Cartões Menores em linha */}
                <div className="cartoes-menores-acessoti">
                    {secoesMenores.map((secao, indice) => (
                        <div 
                            key={indice} 
                            className="cartao-menor-acessoti" 
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

export default AcessoTI;
