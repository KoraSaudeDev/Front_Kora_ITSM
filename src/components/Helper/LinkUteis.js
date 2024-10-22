import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Helper/LinkUteis.css';
import HeaderHelper from '../Helper/Header-Helper';

const links = [
  { nome: 'Resultado de Exames - HMS', url: 'http://177.43.166.20:8080/shift/lis/metropolitano/elis/s01.iu.web.Login.cls' },
  { nome: 'MV SOUL - HMSM e HMV', url: 'http://appsoul.redemeridional.com.br/soul-mv' },
  { nome: 'MVSACR - HMC', url: 'http://192.168.70.238:8040/mvsacr' },
  { nome: 'MV PEP - HMC', url: 'http://pep-meridional/mvpep' },
  { nome: 'MV SACR Gestão - HMC', url: 'http://192.168.70.238:8040/mvgestorfluxo/' },
  { nome: 'MV Portaria - HMC', url: 'http://port-grupomeri:8086/mvportaria/' },
  { nome: 'MV Portal - HMC', url: 'http://ind-meridional/Painel' },
  { nome: 'MV PEP - HMSM e HMV', url: 'http://appsoul.redemeridional.com.br/mvpep' },
  { nome: 'Painel MV', url: 'http://ind-meridional/se' },
  { nome: 'Email Zimbra - HMS', url: 'https://webmail2.metropolitano.org.br/' },
  { nome: 'Busca Ramal', url: 'http://buscaramal:8001/' },
  { nome: 'CME16', url: 'https://acme-grupomeri/open.do?sys=CMO' },
  { nome: 'CREMASCO', url: 'https://cremasco.shiftcloud.com.br/shift/lis/cremasco/elis/s01.iu.web.Login.cls?config=UNICO' },
  { nome: 'Dicom Exames', url: 'http://192.168.103.66:82/digital/' },
  { nome: 'Resultado de Exames Imagem - CADIM', url: 'https://portal.pmedico.com/cadim' }
];

const LinkUteis = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '../assets/images/bghelper.png';
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <div className={`background-branco-links-uteis ${imageLoaded ? 'image-loaded' : 'image-loading'}`}>
      <HeaderHelper />
      <div className="container-link-uteis">
        <div className="cartoes-container-link-uteis">
          {links.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="cartao-link-uteis">
              <div className="cartao-conteudo-link-uteis">
                <span>{link.nome}</span>
                <FontAwesomeIcon icon={faExternalLinkAlt} className="external-link-icon" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkUteis;
