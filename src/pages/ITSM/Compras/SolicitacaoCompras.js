import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import SidebarInterna from '../../../components/SidebarInterna';
import AtendimentosTable from '../../../components/Compras/AtendimentosTable';
import '../../../styles/WF_PO/Solicitacoes.css';
import '../../../styles/WF_PO/NovaRequisicao.css';

const SolicitacaoCompras = () => {
    const { user } = useAuth();
    const menuRequisicao = [
        { label: 'Nova Requisição', path: '/suporte/novo-ticket-compras' },
        { label: 'Minhas Solicitações', path: '/suporte/nova-solicitacao-compras' },
        { label: 'Validação', path: '/suporte/aprovacoes-compras' },
    ];

    return (
        <div className="layout-geral">
            <SidebarInterna menuItems={menuRequisicao} />
            <div className="container-solicitacoes">
                <AtendimentosTable
                    url={`${process.env.REACT_APP_API_BASE_URL}/wf-po/meus-tickets?email=${user.email}&`}
                    tipo_tela="wf_po_solicitacoes"
                />
            </div>
        </div>
    );
};

export default SolicitacaoCompras;
