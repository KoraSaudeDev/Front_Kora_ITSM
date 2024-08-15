import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'styles/Atendimentos/Detalhamento.css';

const Detalhamento = () => {
    const { id } = useParams();
    const [detalhes, setDetalhes] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAtendimentos = JSON.parse(localStorage.getItem('meusAtendimentos')) || [];
        const ticket = storedAtendimentos.find(ticket => ticket.ticketNumber.toString() === id);
        setDetalhes(ticket);
    }, [id]);

    const handleAprovar = () => {
        alert("Ticket aprovado!");
        navigate('/meus-atendimentos');
    };

    const handleReprovar = () => {
        alert("Ticket reprovado!");
        navigate('/meus-atendimentos');
    };

    if (!detalhes) return <div>Carregando...</div>;

    return (
        <div className="detalhamento-container">
            <h2>Detalhes do Ticket</h2>
            <p><strong>N° Ticket:</strong> {detalhes.ticketNumber}</p>
            <p><strong>Abertura:</strong> {detalhes.abertura}</p>
            <p><strong>Status:</strong> {detalhes.status}</p>
            <p><strong>Nome Completo:</strong> {detalhes.nomeCompleto}</p>
            <p><strong>Descrição:</strong> {detalhes.descricao}</p>
            <p><strong>Anexo:</strong> {detalhes.anexo}</p>
            <p><strong>Observação:</strong> {detalhes.observacao}</p>
            {}
            <div className="acoes">
                <button onClick={handleAprovar} className="botao-aprovar">Aprovar</button>
                <button onClick={handleReprovar} className="botao-reprovar">Reprovar</button>
            </div>
        </div>
    );
};

export default Detalhamento;
