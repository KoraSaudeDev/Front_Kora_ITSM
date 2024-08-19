import React, { useState, useEffect } from 'react';
import dadosTickets from './dadosTickets';
import 'styles/Atendimentos/MeusAtendimentos.css';
import { FaSearch, FaTimes, FaFileAlt, FaEdit } from 'react-icons/fa';

const MinhaEquipe = () => {
    const [atendimentos] = useState(dadosTickets.filter(ticket => ticket.equipe === 'TI'));
    const [ticketSelecionado, setTicketSelecionado] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [isEditing, setIsEditing] = useState({
        hub: false,
        unidadeNegocio: false,
        categoria: false,
        subcategoria: false,
        assunto: false
    });
    const [prioridadeSelecionada, setPrioridadeSelecionada] = useState(null);

    const options = {
        hub: ['Hub 1', 'Hub 2', 'Hub 3'],
        unidadeNegocio: ['Unidade 1', 'Unidade 2', 'Unidade 3'],
        categoria: ['Categoria 1', 'Categoria 2', 'Categoria 3'],
        subcategoria: ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3'],
        assunto: ['Assunto 1', 'Assunto 2', 'Assunto 3']
    };

    const handleClick = (ticket) => {
        setIsClosing(false);
        setTicketSelecionado(ticket);
    };

    const handleFechar = () => {
        setIsClosing(true);
        setTimeout(() => setTicketSelecionado(null), 500);
    };

    const handleCancelar = () => {
        alert('Ticket cancelado');
        handleFechar();
    };

    const handleAnexoChange = (e) => {
        const file = e.target.files[0];
        setTicketSelecionado({
            ...ticketSelecionado,
            anexo: file ? file.name : null,
        });
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

    const handleEditClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: true }));
    };

    const handleFieldChange = (field, value) => {
        setTicketSelecionado((prev) => ({ ...prev, [field]: value }));
        setIsEditing((prev) => ({ ...prev, [field]: false }));
    };

    const prioridades = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

    const handlePrioridadeClick = (prioridade) => {
        setPrioridadeSelecionada(prioridade);
    };

    const atendimentosFiltrados = atendimentos
        .filter(atendimento => !filtroStatus || atendimento.status === filtroStatus)
        .filter(atendimento => !searchTerm || atendimento.numeroTicket.includes(searchTerm));

    return (
        <div className="container-meus-atendimentos" onClick={handleClearFiltro}>
            <div className="header-meus-atendimentos">
                <h2>Minha Equipe</h2>
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
                        {ticketSelecionado.status !== 'Concluido' && ticketSelecionado.status !== 'Cancelado' && (
                            <div className="botoes-modal">
                                <button className="botao-cancelar" onClick={handleCancelar}>
                                    <FaTimes /> Cancelar
                                </button>
                            </div>
                        )}
                        <div className="conteudo-modal">
                            <div className="conteudo-modal-esquerda">
                                <h3>Detalhes do Ticket #{ticketSelecionado.numeroTicket}</h3>
                                <p><strong>Status:</strong> <span className={`status-inline ${ticketSelecionado.status.replace(/\s/g, '-').toLowerCase()}`}>{ticketSelecionado.status}</span></p>
                                
                                {ticketSelecionado.status !== 'Concluido' && ticketSelecionado.status !== 'Cancelado' && (
                                    <>
                                        <p><strong>HUB:</strong> 
                                            {isEditing.hub ? (
                                                <select 
                                                    value={ticketSelecionado.hub} 
                                                    onChange={(e) => handleFieldChange('hub', e.target.value)} 
                                                    onBlur={() => handleFieldChange('hub', ticketSelecionado.hub)}
                                                >
                                                    {options.hub.map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <>
                                                    {ticketSelecionado.hub}
                                                    <FaEdit 
                                                        className="edit-icon" 
                                                        onClick={() => handleEditClick('hub')}
                                                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                    />
                                                </>
                                            )}
                                        </p>

                                        <p><strong>Unidade de Negócio:</strong> 
                                            {isEditing.unidadeNegocio ? (
                                                <select 
                                                    value={ticketSelecionado.unidadeNegocio} 
                                                    onChange={(e) => handleFieldChange('unidadeNegocio', e.target.value)} 
                                                    onBlur={() => handleFieldChange('unidadeNegocio', ticketSelecionado.unidadeNegocio)}
                                                >
                                                    {options.unidadeNegocio.map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <>
                                                    {ticketSelecionado.unidadeNegocio}
                                                    <FaEdit 
                                                        className="edit-icon" 
                                                        onClick={() => handleEditClick('unidadeNegocio')}
                                                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                    />
                                                </>
                                            )}
                                        </p>

                                        <p><strong>Categoria:</strong> 
                                            {isEditing.categoria ? (
                                                <select 
                                                    value={ticketSelecionado.categoria} 
                                                    onChange={(e) => handleFieldChange('categoria', e.target.value)} 
                                                    onBlur={() => handleFieldChange('categoria', ticketSelecionado.categoria)}
                                                >
                                                    {options.categoria.map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <>
                                                    {ticketSelecionado.categoria}
                                                    <FaEdit 
                                                        className="edit-icon" 
                                                        onClick={() => handleEditClick('categoria')}
                                                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                    />
                                                </>
                                            )}
                                        </p>

                                        <p><strong>Subcategoria:</strong> 
                                            {isEditing.subcategoria ? (
                                                <select 
                                                    value={ticketSelecionado.subcategoria} 
                                                    onChange={(e) => handleFieldChange('subcategoria', e.target.value)} 
                                                    onBlur={() => handleFieldChange('subcategoria', ticketSelecionado.subcategoria)}
                                                >
                                                    {options.subcategoria.map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <>
                                                    {ticketSelecionado.subcategoria}
                                                    <FaEdit 
                                                        className="edit-icon" 
                                                        onClick={() => handleEditClick('subcategoria')}
                                                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                    />
                                                </>
                                            )}
                                        </p>

                                        <p><strong>Assunto:</strong> 
                                            {isEditing.assunto ? (
                                                <select 
                                                    value={ticketSelecionado.assunto} 
                                                    onChange={(e) => handleFieldChange('assunto', e.target.value)} 
                                                    onBlur={() => handleFieldChange('assunto', ticketSelecionado.assunto)}
                                                >
                                                    {options.assunto.map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <>
                                                    {ticketSelecionado.assunto}
                                                    <FaEdit 
                                                        className="edit-icon" 
                                                        onClick={() => handleEditClick('assunto')}
                                                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                    />
                                                </>
                                            )}
                                        </p>
                                    </>
                                )}

                                <p><strong>Nome Completo:</strong> {ticketSelecionado.nomeCompleto}</p>
                                <p><strong>Matrícula:</strong> {ticketSelecionado.matricula}</p>
                                <p><strong>Telefone:</strong> {ticketSelecionado.telefone}</p>
                                <p><strong>E-mail Solicitante:</strong> {ticketSelecionado.emailSolicitante}</p>
                                <p><strong>Cargo:</strong> {ticketSelecionado.cargo}</p>
                                <p><strong>Data de Criação:</strong> {ticketSelecionado.abertura}</p>
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
                            {ticketSelecionado.status !== 'Concluido' && ticketSelecionado.status !== 'Cancelado' && (
                                <div className="conteudo-modal-direita">
                                  <div className="campo-prioridades">
                                        <label>Prioridade:</label>
                                        <div className="botoes-prioridades">
                                            {prioridades.map(prioridade => (
                                                <button 
                                                    key={prioridade} 
                                                    className={`botao-prioridade ${prioridadeSelecionada === prioridade ? 'active' : ''}`} 
                                                    onClick={() => handlePrioridadeClick(prioridade)}
                                                >
                                                    {prioridade}
                                                </button>
                                            ))}
                                        </div>
                                    </div>  <div className="campo-anexo">
                                        <label htmlFor="anexo">Anexar Arquivo:</label>
                                        <input
                                            type="file"
                                            id="anexo"
                                            onChange={handleAnexoChange}
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Observações"
                                        onChange={(e) =>
                                            setTicketSelecionado({ ...ticketSelecionado, observacao: e.target.value })
                                        }
                                        style={{ height: '50px' }} 
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MinhaEquipe;
