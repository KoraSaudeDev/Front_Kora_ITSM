import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Helper/HomeHelper.css';
import HeaderHelper from '../Helper/Header-Helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faUsers, faShoppingCart, faDollarSign, faBullseye, faStethoscope, faChartLine } from '@fortawesome/free-solid-svg-icons';

function HomeHelper() {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showBalloon, setShowBalloon] = useState({});
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
        const secao = secoes[indice].nome;
        if (secao === 'TI') {
            navigate('/helper/acessoTI');
        } else if (secao === 'RH') {
            navigate('/helper/AcessoRH');
        } else if (secao === 'Suprimentos') {
            navigate('/helper/AcessoSuprimentos');
        } else if (secao === 'Marketing') {
            navigate('/helper/AcessoMarketing');
        } else if (secao === 'Financeiro' || secao === 'Assistencial' || secao === 'Controladoria & Contabilidade') {
            setShowBalloon((prevState) => ({
                ...prevState,
                [indice]: true
            }));
            setTimeout(() => {
                setShowBalloon((prevState) => ({
                    ...prevState,
                    [indice]: false
                }));
            }, 3000);
        }
    };

    return (
        <div className={`background-branco ${imageLoaded ? 'image-loaded' : 'image-loading'}`}>
            <HeaderHelper />
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
                            {showBalloon[indice] && (
                                <div className="balloon-inside-card">
                                    Não disponível no QAS
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeHelper;
