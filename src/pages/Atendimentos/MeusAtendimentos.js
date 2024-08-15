import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'styles/Atendimentos/MeusAtendimentos.css';

const MeusAtendimentos = () => {
    const [atendimentos, setAtendimentos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAtendimentos = JSON.parse(localStorage.getItem('meusAtendimentos')) || [];
        setAtendimentos(storedAtendimentos);
    }, []);

    const handleClick = (id) => {
        navigate(`/detalhamento/${id}`);
    };

    return (
        <div className="container-meus-atendimentos">
            <h2>Meus Atendimentos</h2>
            {atendimentos.length === 0 ? (
                <p>Sem atendimentos no momento.</p>
            ) : (
                <table className="tabela-atendimentos">
                    <thead>
                        <tr>
                            <th>Número do Ticket</th>
                            <th>Relator</th>
                            <th>Status</th>
                            <th>Data de Criação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atendimentos.map(atendimento => (
                            <tr key={atendimento.ticketNumber} onClick={() => handleClick(atendimento.ticketNumber)}>
                                <td>{atendimento.ticketNumber}</td>
                                <td>{atendimento.nomeCompleto}</td>
                                <td className={`status ${atendimento.status.replace(/\s/g, '-').toLowerCase()}`}>
                                    {atendimento.status}
                                </td>
                                <td>{atendimento.abertura}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MeusAtendimentos;
