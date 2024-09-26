import React from 'react';
import AtendimentosTable from '../../components/ITSM/AtendimentosTable';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ITSM/MeusAtendimentos.css';

const MinhaEquipe = () => {
    const { user } = useAuth();

    return (
        <AtendimentosTable
            apiUrl={`${process.env.REACT_APP_API_BASE_URL}/tickets/minha-equipe?`}
            filtrosExtras={{ filas: user.filas_id }}
            tipoTela='minha_equipe'
            filtro='filtro-me'
        />
    );
};


export default MinhaEquipe;
