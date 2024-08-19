import React, { useState, useEffect } from 'react';
import dadosTickets from './dadosTickets';
import 'styles/Atendimentos/MeusAtendimentos.css';
import { FaSearch, FaTimes, FaFileAlt } from 'react-icons/fa';

const AllTickets = () => {
    const [atendimentos] = useState(dadosTickets);
    const [ticketSelecionado, setTicketSelecionado] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [dataLimite, setDataLimite] = useState('');

    useEffect(() => {
        if (ticketSelecionado) {
            setDataLimite(ticketSelecionado.abertura);
        }
    }, [ticketSelecionado]);

    const handleClick = (ticket) => {
        setIsClosing(false);
        setTicketSelecionado(ticket);
    };

    const handleFechar = () => {
        setIsClosing(true);
        setTimeout(() => setTicketSelecionado(null), 500);
    };

    const handleFiltroClick = (status) => {
        setFiltroStatus(filtroStatus === status ? '' : status);
    };

    const handleClearFiltro = (e) => {
        if (e.target.className === 'container-meus-atendimentos') {
            setFiltroStatus('');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const atendimentosFiltrados = atendimentos
        .filter(atendimento => !filtroStatus || atendimento.status === filtroStatus)
        .filter(atendimento => !searchTerm || atendimento.numeroTicket.includes(searchTerm));

    return (
        <div className="container-meus-atendimentos" onClick={handleClearFiltro}>
            <div className="header-meus-atendimentos">
                <h2>Todos os Tickets</h2>
                <div className="search-bar-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Pesquisar pelo número do ticket"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="filtro-status">
                    <span className={`status-bolinha em-andamento ${filtroStatus === 'Em Andamento' ? 'active' : ''}`} onClick={() => handleFiltroClick('Em Andamento')}></span>
                    <span className={`status-bolinha pendente ${filtroStatus === 'Pendente' ? 'active' : ''}`} onClick={() => handleFiltroClick('Pendente')}></span>
                    <span className={`status-bolinha concluido ${filtroStatus === 'Concluido' ? 'active' : ''}`} onClick={() => handleFiltroClick('Concluido')}></span>
                    <span className={`status-bolinha cancelado ${filtroStatus === 'Cancelado' ? 'active' : ''}`} onClick={() => handleFiltroClick('Cancelado')}></span>
                </div>
            </div>
            {atendimentosFiltrados.length === 0 ? (
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
                        {atendimentosFiltrados.map(atendimento => (
                            <tr key={atendimento.numeroTicket} onClick={() => handleClick(atendimento)}>
                                <td>{atendimento.numeroTicket}</td>
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

            {ticketSelecionado && (
                <div className="modal-overlay">
                    <div className={`modal ${isClosing ? 'fechar' : ''}`}>
                        <button className="fechar-modal" onClick={handleFechar}><FaTimes /></button>
                        <div className="conteudo-modal">
                            <div className="conteudo-modal-esquerda">
                                <h3>Detalhes do Ticket #{ticketSelecionado.numeroTicket}</h3>
                                <p><strong>Status:</strong> <span className={`status-inline ${ticketSelecionado.status.replace(/\s/g, '-').toLowerCase()}`}>{ticketSelecionado.status}</span></p>
                                <p><strong>SLA:</strong> 
                                    <span className="sla-inline">
                                        <span className={`status-bolinha ${new Date() < new Date(dataLimite) ? 'verde' : 'vermelha'}`} style={{ marginRight: '5px' }}></span>
                                        {new Date() < new Date(dataLimite) ? 'No Prazo' : 'Atrasado'}
                                    </span>
                                </p>
                                <p><strong>Nome Completo:</strong> {ticketSelecionado.nomeCompleto}</p>
                                <p><strong>Matrícula:</strong> {ticketSelecionado.matricula}</p>
                                <p><strong>Telefone:</strong> {ticketSelecionado.telefone}</p>
                                <p><strong>E-mail Solicitante:</strong> {ticketSelecionado.emailSolicitante}</p>
                                <p><strong>Cargo:</strong> {ticketSelecionado.cargo}</p>
                                <p><strong>Área de Negócio:</strong> {ticketSelecionado.areaNegocio}</p>
                                <p><strong>HUB:</strong> {ticketSelecionado.hub}</p>
                                <p><strong>Unidade de Negócio:</strong> {ticketSelecionado.unidadeNegocio}</p>
                                <p><strong>Data de Criação:</strong> {ticketSelecionado.abertura}</p>
                                <p><strong>Data Limite:</strong> <span id="data-limite-modal">{dataLimite}</span></p>
                                <p><strong>Categoria:</strong> {ticketSelecionado.categoria}</p>
                                <p><strong>Subcategoria:</strong> {ticketSelecionado.subcategoria}</p>
                                <p><strong>Assunto:</strong> {ticketSelecionado.assunto}</p>
                                <p><strong>Descrição:</strong> {ticketSelecionado.descricao}</p>
                                <p style={{ display: 'flex', alignItems: 'center' }}><strong>Autorização:</strong>&nbsp;
                                    <a href={URL.createObjectURL(new Blob([ticketSelecionado.autorizacao]))} target="_blank" rel="noopener noreferrer" style={{ marginRight: '5px' }}>
                                        Abrir
                                    </a>
                                    <FaFileAlt 
                                        className="icone-anexo" 
                                        style={{ cursor: 'pointer' }} 
                                        onClick={() => window.open(URL.createObjectURL(new Blob([ticketSelecionado.autorizacao])))}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllTickets;
