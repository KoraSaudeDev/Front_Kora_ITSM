import React from 'react';
import SidebarInterna from '../../components/SidebarInterna'; 
import AtendimentoTable from '../../components/WF_PO/AtendimentosTable';
import '../../styles/WF_PO/Solicitacoes.css';

const Solicitacoes = ({ cartItems = [] }) => {
    const menuRequisicao = [
        { label: 'Nova Requisição', path: '/suporte/nova-requisicao-wf' },
        { label: 'Minhas Solicitações', path: '/suporte/minhas-solicitacoes' },
        { label: 'Aprovações', path: '/suporte/aprovacoes' },
        { label: 'Acompanhar', path: '/suporte/acompanhar' },
    ];

    return (
        <div className="layout-geral">
            <SidebarInterna menuItems={menuRequisicao} /> 
            <div className="container-solicitacoes">
                <AtendimentoTable cartItems={cartItems} />
            </div>
        </div>
    );
};

export default Solicitacoes;