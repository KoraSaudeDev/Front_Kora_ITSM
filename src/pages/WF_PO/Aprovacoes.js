import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SidebarInterna from '../../components/SidebarInterna';
import AtendimentosTable from '../../components/WF_PO/AtendimentosTable';
import '../../styles/WF_PO/Solicitacoes.css';

const Aprovacoes = () => {
    const { user } = useAuth();
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
                <AtendimentosTable
                    url={`${process.env.REACT_APP_API_BASE_URL}/wf-po/aprovacoes?grupos=${user.wf_po_grupos_id.join(',')}&email=${user.email}&`}
                    tipo_tela="wf_po_aprovacoes"
                />
            </div>
        </div>
    );
};

export default Aprovacoes;
