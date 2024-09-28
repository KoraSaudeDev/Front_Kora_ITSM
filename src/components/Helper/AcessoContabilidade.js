import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHelper from './Header-Helper';

function AcessoContabilidade() {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

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

            <div className="icon-bottom-right" onClick={() => window.open('https://www.appsheet.com/start/894918c5-7548-431d-96c0-5c1f2f0a51a0#view=Meus%20Tickets', '_blank')}>
                <div className="tooltip">Minhas Solicitações</div>
                <img src="https://i.ibb.co/GVgKvfw/image.png" alt="Icon" className="pulsating-image" />
            </div>
        </div>
    );
}

export default AcessoContabilidade;
