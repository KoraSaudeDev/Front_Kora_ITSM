import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Helper/HomeHelper.css';
import HeaderHelper from '../Helper/Header-Helper'; // Importando o componente de cabeçalho
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faUsers, faShoppingCart, faDollarSign, faBullseye, faStethoscope, faChartLine } from '@fortawesome/free-solid-svg-icons';

function HomeHelper() {
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();

    const secoes = [
        { nome: 'TI', icone: faLaptopCode },
        { nome: 'RH', icone: faUsers },
        { nome: 'Suprimentos', icone: faShoppingCart },
        { nome: 'Financeiro', icone: faDollarSign },
        { nome: 'Marketing', icone: faBullseye },
        { nome: 'Assistencial', icone: faStethoscope },
        { nome: 'Controladoria & Contabilidade', icone: faChartLine }
    ];

    useEffect(() => {
        const img = new Image();
        img.src = '../assets/images/fundo_site.png';
        img.onload = () => setImageLoaded(true);
    }, []);

    const aoClicarHelper = (indice) => {
        console.log(`${secoes[indice].nome} clicado!`);

        if (secoes[indice].nome === 'TI') {
            navigate('/helper/acessoTI');
        } else if (secoes[indice].nome === 'RH') {
            navigate('/helper/AcessoRH');
        }
    };

    return (
        <div className={`background-branco ${imageLoaded ? 'image-loaded' : 'image-loading'}`}>
            <HeaderHelper /> {/* Usando o cabeçalho reutilizável */}
            <div className="container-helper">
                <div className="cartoes-container-helper">
                    {secoes.map((secao, indice) => (
                        <div 
                            key={indice} 
                            className="cartao-helper" 
                            onClick={() => aoClicarHelper(indice)}
                        >
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
