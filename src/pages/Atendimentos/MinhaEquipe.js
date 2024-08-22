import React, { useState, useEffect } from 'react';
import 'styles/Atendimentos/MeusAtendimentos.css';
import { FaSearch, FaTimes, FaFileAlt, FaPlus, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const MinhaEquipe = ({ selectedTicket, onResetTicket }) => {
    const { user } = useAuth();
    const [atendimentos, setAtendimentos] = useState([]);
    const [ticketSelecionado, setTicketSelecionado] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroSLA, setFiltroSLA] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isClosing, setIsClosing] = useState(false);
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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);

    const itemsPerPage = 8;

    const statusOptions = {
        "Em Andamento": "#ffc107",
        "Aguardando Retorno Fornecedor": "#17a2b8",
        "Aguardando Retorno": "#6c757d",
        "Em Aberto": "#007bff",
        "Agendada": "#6610f2",
        "Criação de Usuário": "#fd7e14"
    };

    const slaOptions = {
        "Em Atraso": "#dc3545",
        "No Prazo": "#28a745"
    };

    const options = {
        hub: ['Hub 1', 'Hub 2', 'Hub 3'],
        unidadeNegocio: ['Unidade 1', 'Unidade 2', 'Unidade 3'],
        categoria: ['Categoria 1', 'Categoria 2', 'Categoria 3'],
        subcategoria: ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3'],
        assunto: ['Assunto 1', 'Assunto 2', 'Assunto 3']
    };

    const prioridades = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

    useEffect(() => {
        const fetchAtendimentos = async () => {
            try {
                let data = JSON.stringify({
                    "grupos": user.cargo
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_API_BASE_URL}/tickets/minha-equipe?page=${currentPage}&per_page=${itemsPerPage}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                const response = await axios.request(config);
                setAtendimentos(response.data.tickets);
                setTotalPages(Math.ceil(response.data.total_items / itemsPerPage));
                setLoading(false); 
            } catch (error) {
                console.error('Erro ao buscar atendimentos:', error);
                setLoading(false); 
            }
        };

        fetchAtendimentos();

        const timer = setTimeout(() => {
            setShowNoDataMessage(true); 
        }, 10000);

        return () => clearTimeout(timer);
    }, [user.cargo, currentPage]);

    useEffect(() => {
        if (selectedTicket) {
            handleClick(selectedTicket);
        }
    }, [selectedTicket]);

    useEffect(() => {
        return () => {
            setTicketSelecionado(null);
            if (onResetTicket) onResetTicket();
        };
    }, []);

    const handleClick = (ticket) => {
        setIsClosing(false);
        setTicketSelecionado(ticket);
    };

    const handleFechar = () => {
        setIsClosing(true);
        setTimeout(() => {
            setTicketSelecionado(null);
            if (onResetTicket) onResetTicket();
        }, 500);
    };

    const handleFiltroClick = (status) => {
        setFiltroStatus(filtroStatus === status ? '' : status);
    };

    const handleSLAClick = (sla) => {
        setFiltroSLA(filtroSLA === sla ? '' : sla);
    };

    const handleClearFiltro = (e) => {
        if (e.target.className === 'container-meus-atendimentos') {
            setFiltroStatus('');
            setFiltroSLA('');
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

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const atendimentosFiltrados = atendimentos
        .filter(atendimento => !filtroStatus || atendimento.status === filtroStatus)
        .filter(atendimento => !filtroSLA || atendimento.sla_util === filtroSLA)
        .filter(atendimento => !searchTerm || atendimento.cod_fluxo.includes(searchTerm));

    const renderPaginationButtons = () => {
        const pageButtons = [];
        const maxPagesToShow = 3;

        let startPage = Math.max(1, currentPage - maxPagesToShow);
        let endPage = Math.min(totalPages, currentPage + maxPagesToShow);

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </button>
            );
        }

        return pageButtons;
    };

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
                <div className="filtro-sla">
                    <span
                        className={`sla-bolinha ${filtroSLA === 'No Prazo' ? 'active' : ''}`}
                        style={{ backgroundColor: slaOptions['No Prazo'] }}
                        onClick={() => handleSLAClick('No Prazo')}
                    ></span>
                    <span
                        className={`sla-bolinha ${filtroSLA === 'Em Atraso' ? 'active' : ''}`}
                        style={{ backgroundColor: slaOptions['Em Atraso'] }}
                        onClick={() => handleSLAClick('Em Atraso')}
                    ></span>
                </div>
                <div className="dropdown-filtro-status">
                    <select
                        value={filtroStatus}
                        onChange={(e) => handleFiltroClick(e.target.value)}
                        className="dropdown-status-select"
                    >
                        <option value="">Todos os Status</option>
                        {Object.keys(statusOptions).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            {loading ? (
                <p>Buscando dados...</p>
            ) : atendimentosFiltrados.length === 0 && showNoDataMessage ? (
                <p>Sem atendimentos no momento.</p>
            ) : (
                <div className="tabela-container">
                    <table className="tabela-atendimentos">
                        <thead>
                            <tr>
                                <th>N° Ticket</th>
                                <th>Abertura</th>
                                <th>Status</th>
                                <th>SLA (Útil)</th>
                                <th>Data Limite</th>
                                <th>Grupo | Destinatário</th>
                                <th>Nome</th>
                                <th>Área de Negócio</th>
                                <th>HUB</th>
                                <th>Unidade de Negócio</th>
                                <th>Categoria</th>
                                <th>Subcategoria</th>
                                <th>Assunto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {atendimentosFiltrados.map(atendimento => (
                                <tr key={atendimento.cod_fluxo} onClick={() => handleClick(atendimento)}>
                                    <td>{atendimento.cod_fluxo}</td>
                                    <td>{new Date(atendimento.abertura).toLocaleString().replace(',', '')}</td>
                                    <td className={`status ${atendimento.status.replace(/\s/g, '-').toLowerCase()}`}>
                                        <span
                                            className="status-bolinha"
                                            style={{ 
                                                backgroundColor: statusOptions[atendimento.status] || '#000',
                                                marginRight: '8px'  
                                            }}
                                        ></span>
                                        {atendimento.status}
                                    </td>
                                    <td className={`sla ${atendimento.sla_util.replace(/\s/g, '-').toLowerCase()}`}>
                                        <span
                                            className="sla-bolinha"
                                            style={{ 
                                                backgroundColor: slaOptions[atendimento.sla_util] || '#000',
                                                marginRight: '8px'
                                            }}
                                        ></span>
                                        {atendimento.sla_util}
                                    </td>
                                    <td>{new Date(atendimento.data_limite).toLocaleString().replace(',', '')}</td>
                                    <td>{atendimento.grupo}</td>
                                    <td>{atendimento.nome}</td>
                                    <td>{atendimento.area_negocio}</td>
                                    <td>{atendimento.hub}</td>
                                    <td>{atendimento.unidade}</td>
                                    <td>{atendimento.categoria}</td>
                                    <td>{atendimento.subcategoria}</td>
                                    <td>{atendimento.assunto}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="pagination-controls">
                <button
                    className="pagination-button"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    <FaChevronLeft />
                </button>
                {renderPaginationButtons()}
                <button
                    className="pagination-button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    <FaChevronRight />
                </button>
            </div>

            {ticketSelecionado && (
                <div className="modal-overlay">
                    <div className={`modal ${isClosing ? 'fechar' : ''}`}>
                        <button className="fechar-modal" onClick={handleFechar}><FaTimes /></button>
                        <div className="conteudo-modal">
                            <div className="conteudo-modal-esquerda">
                                <h3>Detalhes do Ticket #{ticketSelecionado.cod_fluxo}</h3>
                                <p><strong>Status:</strong> 
                                    <span
                                        className="status-bolinha"
                                        style={{ 
                                            backgroundColor: statusOptions[ticketSelecionado.status] || '#000',
                                            marginRight: '8px'  
                                        }}
                                    ></span>
                                    {ticketSelecionado.status}
                                </p>
                                <p><strong>SLA (Útil):</strong> 
                                    <span
                                        className="sla-bolinha"
                                        style={{ 
                                            backgroundColor: slaOptions[ticketSelecionado.sla_util] || '#000',
                                            marginRight: '8px'  
                                        }}
                                    ></span>
                                    {ticketSelecionado.sla_util}
                                </p>

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
                                            <p><strong>Anexo:</strong>
                                                {atividade.anexo}&nbsp;
                                                <FaFileAlt
                                                    className="icone-anexo"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => window.open(URL.createObjectURL(new Blob([atividade.anexo])))}
                                                />
                                            </p>
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
                                    <p><strong>Anexo:</strong>
                                        {atividadeSelecionada.anexo}&nbsp;
                                        <FaFileAlt
                                            className="icone-anexo"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => window.open(URL.createObjectURL(new Blob([atividadeSelecionada.anexo])))}
                                        />
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3>Atividades do Ticket #{ticketSelecionado.cod_fluxo}</h3>
                                    <p><strong>Início:</strong> {ticketSelecionado.abertura}</p>
                                    <p><strong>Status:</strong> 
                                        <span
                                            className="status-bolinha"
                                            style={{ 
                                                backgroundColor: statusOptions[ticketSelecionado.status] || '#000',
                                                marginRight: '8px'  
                                            }}
                                        ></span>
                                        {ticketSelecionado.status}
                                    </p>
                                    <p><strong>SLA (Útil):</strong> 
                                        <span
                                            className="sla-bolinha"
                                            style={{ 
                                                backgroundColor: slaOptions[ticketSelecionado.sla_util] || '#000',
                                                marginRight: '8px'  
                                            }}
                                        ></span>
                                        {ticketSelecionado.sla_util}
                                    </p>
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

export default MinhaEquipe;
