import React from 'react';
import AtendimentosTable from '../components/AtendimentosTable';
import { useAuth } from '../../context/AuthContext';

const MeusAtendimentos = ({ selectedTicket, onResetTicket }) => {
    const { user } = useAuth();

    return (
        <AtendimentosTable
            titulo="Meus Atendimentos"
            apiUrl={`${process.env.REACT_APP_API_BASE_URL}/tickets/meus-atendimentos`}
            filtrosExtras={{ nome: user.nome}}
            selectedTicket={selectedTicket}
            onResetTicket={onResetTicket}
        />
    );
};

export default MeusAtendimentos;
