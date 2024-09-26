import React from 'react';
import AtendimentosTable from '../../components/ITSM/AtendimentosTable';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ITSM/MeusAtendimentos.css';

const MeusAtendimentos = () => {
    const { user } = useAuth();

    return (
        <AtendimentosTable
            apiUrl={`${process.env.REACT_APP_API_BASE_URL}/tickets/meus-atendimentos?user_id=${user.id_user}&`}
            tipoTela='meus_atendimentos'
            filtro='filtro-ma'
        />
    );
};

export default MeusAtendimentos;
