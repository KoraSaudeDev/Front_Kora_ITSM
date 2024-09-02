import React from 'react';
import AtendimentosTable from '../components/AtendimentosTable';
import { useAuth } from '../../context/AuthContext';

const MeusAtendimentos = ({ selectedTicket, onResetTicket }) => {
    const { user } = useAuth();

    return (
        <AtendimentosTable
          
            apiUrl={`${process.env.REACT_APP_API_BASE_URL}/tickets/meus-atendimentos?user_id=${user.id_user}&`}
            selectedTicket={selectedTicket}
            onResetTicket={onResetTicket}
            tipoTela='meus_atendimentos'
        />
    );
};

export default MeusAtendimentos;
