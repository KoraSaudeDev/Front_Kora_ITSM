import React from 'react';
import AtendimentosTable from '../../components/ITSM/AtendimentosTable';
import { useAuth } from '../../context/AuthContext';
import SidebarInterna from '../../components/SidebarInterna';
import '../../styles/ITSM/MeusAtendimentos.css';

const MeusAtendimentos = () => {
    const { user } = useAuth();

    
    const menuSuporte = [
        { label: 'Novo Ticket', path: '/suporte/novo-ticket-futuro' },
        { label: 'Meus Atendimentos', path: '/suporte/meus-atendimentos' },
        { label: 'Minha Equipe', path: '/suporte/minha-equipe' },
        { label: 'Dashboard', path: 'http://10.27.254.161:8088/superset/dashboard/KoraHelper/' },
    ];

    return (
        <div className="layout-geral">
        
            <SidebarInterna menuItems={menuSuporte} />
            <div className="container-meus-atendimento">
                <div className="conteudo-principal">
                    <AtendimentosTable
                        apiUrl={`${process.env.REACT_APP_API_BASE_URL}/tickets/meus-atendimentos?user_id=${user.id_user}&`}
                        tipoTela="meus_atendimentos"
                        filtro="filtro-ma"
                    />
                </div>
            </div>
        </div>
    );
};

export default MeusAtendimentos;
