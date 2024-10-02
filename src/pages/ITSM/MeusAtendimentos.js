import React from 'react';
import AtendimentosTable from '../../components/ITSM/AtendimentosTable';
import { useAuth } from '../../context/AuthContext';
import SidebarInterna from '../../components/SidebarInterna';
import '../../styles/ITSM/MeusAtendimentos.css';

const MeusAtendimentos = () => {
    const { user } = useAuth();

    return (
        <div className="layout-geral">
            <SidebarInterna />
            <div className="container-meus-atendimento">
                <div className="conteudo-principal">
                    <AtendimentosTable
                        apiUrl={`${process.env.REACT_APP_API_BASE_URL}/tickets/meus-atendimentos?user_id=${user.id_user}&`}
                        tipoTela='meus_atendimentos'
                        filtro='filtro-ma'
                    />
                </div>
            </div>
        </div>
    );
};

export default MeusAtendimentos;
