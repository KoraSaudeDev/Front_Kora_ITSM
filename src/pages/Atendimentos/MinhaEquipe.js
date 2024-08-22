import React from 'react';
import AtendimentosTable from '../components/AtendimentosTable';
import { useAuth } from '../../context/AuthContext';

const MinhaEquipe = ({ selectedTicket, onResetTicket }) => {
    const { user } = useAuth();

    return (
        <AtendimentosTable
            titulo="Minha Equipe"
            apiUrl={`${process.env.REACT_APP_API_BASE_URL}/tickets/minha-equipe`}
            filtrosExtras={{ grupos: user.cargo }}
            selectedTicket={selectedTicket}
            onResetTicket={onResetTicket}
        />
    );
};

export default MinhaEquipe;
