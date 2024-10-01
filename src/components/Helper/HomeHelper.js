import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Helper/HomeHelper.css';
import HeaderHelper from '../Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faUsers, faShoppingCart, faDollarSign, faBullseye, faStethoscope, faChartLine } from '@fortawesome/free-solid-svg-icons';

function HomeHelper() {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [alertas, setAlertas] = useState({}); 
    const navigate = useNavigate();

    const secoes = [
        { nome: 'TI', icone: faLaptopCode, bgColor: '#F4E1C9', textColor: '#1c1c1e', habilitado: true },
        { nome: 'RH', icone: faUsers, bgColor: '#A2C9E1', textColor: '#1c1c1e', habilitado: true },
        { nome: 'Suprimentos', icone: faShoppingCart, bgColor: '#1C293E', textColor: '#ffffff', habilitado: true },
        { nome: 'Financeiro', icone: faDollarSign, bgColor: '#A2C9E1', textColor: '#1c1c1e', habilitado: true },
        { nome: 'Marketing', icone: faBullseye, bgColor: '#A2C9E1', textColor: '#1c1c1e', habilitado: true },
        { nome: 'Assistencial', icone: faStethoscope, bgColor: '#F4E1C9', textColor: '#1c1c1e', habilitado: true },
        { nome: 'Controladoria & Contabilidade', icone: faChartLine, bgColor: '#A2C9E1', textColor: '#1c1c1e', habilitado: true }
    ];

    useEffect(() => {
        const img = new Image();
        img.src = '../assets/images/fundo_site.png';
        img.onload = () => setImageLoaded(true);
    }, []);

    const aoClicarHelper = (indice) => {
        const secao = secoes[indice];
        if (!secao.habilitado) {
            setAlertas((prevAlertas) => ({ ...prevAlertas, [indice]: 'Esta seção não possui módulos disponíveis no momento.' }));

            setTimeout(() => {
                setAlertas((prevAlertas) => ({ ...prevAlertas, [indice]: null }));
            }, 3000); 
        } else {
            setAlertas((prevAlertas) => ({ ...prevAlertas, [indice]: null }));
            switch (secao.nome) {
                case 'TI': navigate('/helper/acessoTI'); break;
                case 'RH': navigate('/helper/AcessoRH'); break;
                case 'Suprimentos': navigate('/helper/AcessoSuprimentos'); break;
                case 'Marketing': navigate('/helper/AcessoMarketing'); break;
                case 'Financeiro': navigate('/helper/AcessoFinanceiro'); break;
                case 'Assistencial': navigate('/helper/AcessoAssistencial'); break;
                case 'Controladoria & Contabilidade': navigate('/helper/AcessoContabilidade'); break;
                default: break;
            }
        }
    };

    return (
        <div className={`background-branco-home ${imageLoaded ? 'image-loaded' : 'image-loading'}`}>
            <HeaderHelper />
            <div className="container-helper-home">
                <div className="cartoes-container-helper-home">
                    {secoes.map((secao, indice) => (
                        <div
                            key={indice}
                            className={`cartao-helper-home pos-${indice}`} 
                            onClick={() => aoClicarHelper(indice)}
                            style={{ backgroundColor: secao.bgColor }}
                        >
                            <FontAwesomeIcon icon={secao.icone} className="icone-constante-helper-home" style={{ color: secao.textColor }} />
                            <div className="nome-helper-home" style={{ color: secao.textColor }}>{secao.nome}</div>
                            {alertas[indice] && (
                                <div className="alerta-helper-home">{alertas[indice]}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeHelper;