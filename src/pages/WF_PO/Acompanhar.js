import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SidebarInterna from '../../components/SidebarInterna';
import AtendimentosTable from '../../components/WF_PO/AtendimentosTable';
import '../../styles/WF_PO/Solicitacoes.css';
import '../../styles/WF_PO/NovaRequisicao.css';

const Acompanhar = () => {
    const { user } = useAuth();
    const menuRequisicao = [
        { label: 'Nova Requisição', path: '/suporte/nova-requisicao-wf' },
        { label: 'Minhas Solicitações', path: '/suporte/minhas-solicitacoes' },
        { label: 'Aprovações', path: '/suporte/aprovacoes' },
        // { label: 'Acompanhar', path: '/suporte/acompanhar' },
    ];

    return (
        <div className="layout-geral">
            <SidebarInterna menuItems={menuRequisicao} />
            <div className="container-solicitacoes">
                <AtendimentosTable
                    url={`${process.env.REACT_APP_API_BASE_URL}/wf-po/acompanhar?`}
                    tipo_tela="wf_po_acompanhar"
                />
            </div>
        </div>
    );
};

export default Acompanhar;
