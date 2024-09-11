import React from 'react';
import AtendimentosTable from '../components/AtendimentosTable';
import { useAuth } from '../../context/AuthContext';

const MinhaEquipe = ({ selectedTicket, onResetTicket }) => {
    const { user } = useAuth();

    return (
        <AtendimentosTable
            apiUrl={`${process.env.REACT_APP_API_BASE_URL}/tickets/minha-equipe?`}
            filtrosExtras={{ filas: user.filas_id }}
            selectedTicket={selectedTicket}
            onResetTicket={onResetTicket}
            tipoTela='minha_equipe'
            filtro='filtro-me'
        />
    );
};


export default MinhaEquipe;
