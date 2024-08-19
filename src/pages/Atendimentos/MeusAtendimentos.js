import React, { useState, useEffect } from 'react';
import dadosTickets from './dadosTickets';
import 'styles/Atendimentos/MeusAtendimentos.css';
import { FaTimes, FaSearch, FaFileAlt, FaPlus, FaEdit } from 'react-icons/fa';

const MeusAtendimentos = () => {
    const [atendimentos] = useState(dadosTickets.filter(ticket => ticket.nomeCompleto === 'Lucas E'));
    const [ticketSelecionado, setTicketSelecionado] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [dataLimite, setDataLimite] = useState('');
    const [showAtividadesModal, setShowAtividadesModal] = useState(false);
    const [isClosingAtividadesModal, setIsClosingAtividadesModal] = useState(false);
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null); 
    const [isEditMode, setIsEditMode] = useState(false); 
    const [prioridadeSelecionada, setPrioridadeSelecionada] = useState(null);
    const [isEditing, setIsEditing] = useState({
        hub: false,
        unidadeNegocio: false,
        categoria: false,
        subcategoria: false,
        assunto: false
    });

    const options = {
        hub: ['Hub 1', 'Hub 2', 'Hub 3'],
        unidadeNegocio: ['Unidade 1', 'Unidade 2', 'Unidade 3'],
        categoria: ['Categoria 1', 'Categoria 2', 'Categoria 3'],
        subcategoria: ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3'],
        assunto: ['Assunto 1', 'Assunto 2', 'Assunto 3']
    };

    const prioridades = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

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

    const handleAbrirAtividadesModal = () => {
        setAtividadeSelecionada(null); 
        setIsEditMode(true);
        setShowAtividadesModal(true);
    };

    const handleFecharAtividadesModal = () => {
        setIsClosingAtividadesModal(true);
        setTimeout(() => {
            setShowAtividadesModal(false);
            setIsClosingAtividadesModal(false);
        }, 500);
    };

    const handleSalvarAtividade = () => {
        const descricao = document.querySelector('.conteudo-modal-atividades textarea').value.trim();
        const destinatario = document.querySelector('.conteudo-modal-atividades select').value;
        const visibilidade = document.querySelector('input[name="visibilidade"]:checked');
        const anexo = document.querySelector('#anexoAtividade').files[0]?.name || 'Nenhum anexo';

        // Validation: Check if required fields are filled
        if (!descricao || !destinatario || !visibilidade) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const novaAtividade = {
            descricao,
            destinatario,
            visibilidade: visibilidade.value,
            anexo
        };

        setAtividades([...atividades, novaAtividade]);
        handleFecharAtividadesModal();
    };

    const handleRemoverAtividade = (index) => {
        const novasAtividades = atividades.filter((_, i) => i !== index);
        setAtividades(novasAtividades);
    };

    const handleAbrirDetalhesAtividade = (atividade) => {
        setAtividadeSelecionada(atividade);
        setIsEditMode(false); 
        setShowAtividadesModal(true);
    };

    const handleEditClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: true }));
    };

    const handleFieldChange = (field, value) => {
        setTicketSelecionado((prev) => ({ ...prev, [field]: value }));
        setIsEditing((prev) => ({ ...prev, [field]: false }));
    };

    const handlePrioridadeClick = (prioridade) => {
        setPrioridadeSelecionada(prioridade);
    };

    const atendimentosFiltrados = atendimentos
        .filter(atendimento => !filtroStatus || atendimento.status === filtroStatus)
        .filter(atendimento => !searchTerm || atendimento.numeroTicket.includes(searchTerm));

    return (
        <div className="container-meus-atendimentos" onClick={handleClearFiltro}>
            <div className="header-meus-atendimentos">
                <h2>Meus Atendimentos</h2>
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
                            <th>Data Limite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atendimentosFiltrados.map(atendimento => (
                            <tr key={atendimento.numeroTicket} onClick={() => handleClick(atendimento)}>
                                <td>{atendimento.numeroTicket}</td>
                                <td>{atendimento.nomeCompleto}</td>
                                <td className={`status ${atendimento.status ? atendimento.status.replace(/\s/g, '-').toLowerCase() : ''}`}>
                                    {atendimento.status}
                                </td>
                                <td>{atendimento.abertura}</td>
                                <td id="data-limite">{dataLimite}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {ticketSelecionado && (
                <div className="modal-overlay">
                    <div className={`modal ${isClosing ? 'fechar' : ''}`}>
                        <button className="fechar-modal" onClick={handleFechar}>×</button>
                        {ticketSelecionado.status !== 'Concluido' && ticketSelecionado.status !== 'Cancelado' && (
                            <div className="botoes-modal">
                                <button onClick={() => alert('Ticket Cancelado')}>
                                    <FaTimes /> Cancelar
                                </button>
                            </div>
                        )}
                        <div className="conteudo-modal">
                            <div className="conteudo-modal-esquerda">
                                <h3>Detalhes do Ticket #{ticketSelecionado.numeroTicket}</h3>
                                <p><strong>Status:</strong> <span className={`status-inline ${ticketSelecionado.status ? ticketSelecionado.status.replace(/\s/g, '-').toLowerCase() : ''}`}>{ticketSelecionado.status}</span></p>
                                <p><strong>SLA:</strong> 
                                    <span className={`sla-inline`}>
                                        <span className={`status-bolinha ${new Date() < new Date(dataLimite) ? 'verde' : 'vermelha'}`} style={{ marginRight: '5px' }}></span>
                                        {new Date() < new Date(dataLimite) ? 'No Prazo' : 'Atrasado'}
                                    </span>
                                </p>
                                
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
                                    </div>
                                    <button className="botao-atividades" onClick={handleAbrirAtividadesModal}>
                                        <FaPlus style={{ marginRight: '8px' }} /> Atividades
                                    </button>
                                    {atividades.map((atividade, index) => (
                                        <div className="card-atividade" key={index} onClick={() => handleAbrirDetalhesAtividade(atividade)}>
                                            <button className="remover-atividade" onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoverAtividade(index);
                                            }}>×</button>
                                            <p><strong>Descrição:</strong> {atividade.descricao}</p>
                                            <p><strong>Destinatário:</strong> {atividade.destinatario}</p>
                                            <p><strong>Visibilidade:</strong> {atividade.visibilidade}</p>
                                            <p><strong>Anexo:</strong> {atividade.anexo}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showAtividadesModal && (
                <div className="modal-overlay">
                    <div className={`modal atividades-modal ${isClosingAtividadesModal ? 'fechar' : ''}`}>
                        <button className="fechar-modal" onClick={handleFecharAtividadesModal}>×</button>
                        <div className="conteudo-modal-atividades">
                            {atividadeSelecionada ? (
                                <>
                                    <h3>Detalhes da Atividade</h3>
                                    <p><strong>Descrição:</strong> {atividadeSelecionada.descricao}</p>
                                    <p><strong>Destinatário:</strong> {atividadeSelecionada.destinatario}</p>
                                    <p><strong>Visibilidade:</strong> {atividadeSelecionada.visibilidade}</p>
                                    <p><strong>Anexo:</strong> {atividadeSelecionada.anexo}</p>
                                </>
                            ) : (
                                <>
                                    <h3>Atividades do Ticket #{ticketSelecionado.numeroTicket}</h3>
                                    <p><strong>Início:</strong> {ticketSelecionado.abertura}</p>
                                    <p><strong>Status:</strong> {ticketSelecionado.status}</p>
                                    <textarea placeholder="Descrição"></textarea>
                                    <select>
                                        <option value="">Selecionar Destinatário</option>
                                        {[...Array(10).keys()].map(i => (
                                            <option key={i} value={`Opção ${i + 1}`}>Opção {i + 1}</option>
                                        ))}
                                    </select>
                                    <div className="switch-container">
                                        <label>
                                            Pública
                                            <input type="radio" name="visibilidade" value="publica" />
                                        </label>
                                        <label>
                                            Privada
                                            <input type="radio" name="visibilidade" value="privada" />
                                        </label>
                                    </div>
                                    <div className="campo-anexo">
                                        <label htmlFor="anexoAtividade">Anexar Arquivo:</label>
                                        <input type="file" id="anexoAtividade" />
                                    </div>
                                    <button className="botao-salvar" onClick={handleSalvarAtividade}>Salvar</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeusAtendimentos;
