import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook useNavigate
import '../styles/HomeHelper.css'; 
import logoKora from '../assets/images/logokora.png'; // Importando o logo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faUsers, faShoppingCart, faDollarSign, faBullseye, faStethoscope, faChartLine } from '@fortawesome/free-solid-svg-icons';

function HomeHelper() {
    const [clickedCard, setClickedCard] = useState(null); // Armazena o índice do card clicado
    const navigate = useNavigate(); // Hook para navegação

    const secoes = [
        { nome: 'TI', icone: faLaptopCode },
        { nome: 'RH', icone: faUsers },
        { nome: 'Suprimentos', icone: faShoppingCart },
        { nome: 'Financeiro', icone: faDollarSign },
        { nome: 'Marketing', icone: faBullseye },
        { nome: 'Assistencial', icone: faStethoscope },
        { nome: 'Controladoria & Contabilidade', icone: faChartLine }
    ];

    const aoClicarHelper = (indice) => {
        console.log(`${secoes[indice].nome} clicado!`);
        setClickedCard(indice); // Define qual card foi clicado

        if (secoes[indice].nome === 'TI') {
            navigate('/helper/acessoTI'); // Redireciona para /helper/acessoTI se o card de TI for clicado
        }

        // Oculta o balão dentro do card após 3 segundos
        setTimeout(() => {
            setClickedCard(null);
        }, 3000);
    };

    return (
        <div className="background-branco">
            <div className="container-helper">
                <header className="cabecalho-helper">
                    <img 
                        src={logoKora} 
                        alt="Kora Helper" 
                        className="logo-helper" 
                    />
                </header>

                <div className="cartoes-container-helper">
                    {secoes.map((secao, indice) => (
                        <div 
                            key={indice} 
                            className="cartao-helper" 
                            onClick={() => aoClicarHelper(indice)}
                        >
                            {/* Renderiza o balão de notificação apenas se não for o card de TI */}
                            {clickedCard === indice && secao.nome !== 'TI' && (
                                <div className="balloon-inside-card">
                                    Não disponível no QAS
                                </div>
                            )}
                            <FontAwesomeIcon icon={secao.icone} className="icone-helper" />
                            <div className="nome-helper">{secao.nome}</div>
                            <button className="btn-acessar">Acessar</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeHelper;
