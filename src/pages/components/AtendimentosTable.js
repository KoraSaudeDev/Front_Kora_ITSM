import React, { useState, useEffect } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Modal from './ModalTicket';
import axios from 'axios';

const AtendimentosTable = ({ titulo, apiUrl, filtrosExtras = {}, selectedTicket, onResetTicket }) => {
    const [atendimentos, setAtendimentos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroSLA, setFiltroSLA] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const statusOptions = {
        "Em Andamento": "#ffc107",
        "Em Atendimento": "#A6c620",
        "Aguardando Retorno Fornecedor": "#17a2b8",
        "Aguardando Retorno": "#fd7e90",
        "Em Aberto": "#007bff",
        "Agendada": "#6610f2",
        "Criação de Usuário": "#fd7e14",
        "Finalizado": "#229a00",
        "Cancelado": "#FF0000"
    };

    const slaOptions = {
        "Em Atraso": "#dc3545",
        "No Prazo": "#28a745"
    };

    useEffect(() => {
        const fetchAtendimentos = async () => {
            try {
                showLoadingOverlay();
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${apiUrl}page=${currentPage}&per_page=${itemsPerPage}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: filtrosExtras
                };

                const response = await axios.request(config);
                setAtendimentos(response.data.tickets);
                setTotalPages(Math.ceil(response.data.total_items / itemsPerPage));
                setLoading(false); 
                hideLoadingOverlay();
            } catch (error) {
                console.error('Erro ao buscar atendimentos:', error);
                setLoading(false);
                hideLoadingOverlay();
            }
        };

        fetchAtendimentos();

        const timer = setTimeout(() => {
            setShowNoDataMessage(true); 
        }, 10000);

        return () => clearTimeout(timer);
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        if (selectedTicket) {
            handleClick(selectedTicket);
        }
    }, [selectedTicket]);

    const showLoadingOverlay = () => {
        document.getElementById('loading-overlay').style.display = 'flex';
    };

    const hideLoadingOverlay = () => {
        document.getElementById('loading-overlay').style.display = 'none';
    };

    const handleClick = async (ticket) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/ticket?cod_fluxo=${ticket.cod_fluxo}`);
            setModalData(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("Erro ao buscar informações do ticket:", error);
        }
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

    const handleSearchChange = async (e) => {
        setCurrentPage(1);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${apiUrl}page=${currentPage}&per_page=${itemsPerPage}&cod_fluxo=${e.target.value}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: filtrosExtras
        };

        const response = await axios.request(config);
        setAtendimentos(response.data.tickets);
        setTotalPages(Math.ceil(response.data.total_items / itemsPerPage));
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

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    const atendimentosFiltrados = atendimentos
        .filter(atendimento => !filtroStatus || atendimento.status === filtroStatus)
        .filter(atendimento => !filtroSLA || atendimento.sla_util === filtroSLA);

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
            <div id="loading-overlay" className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
            <div className="header-meus-atendimentos">
                <h2>{titulo}</h2>
                <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="items-per-page-select">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <div className="search-bar-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Pesquisar pelo número do ticket"
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
                                <th>SLA</th>
                                <th>Data Limite</th>
                                <th>Analista Atual</th>
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
                            {atendimentosFiltrados.map((atendimento, index) => (
                                <tr key={atendimento.cod_fluxo} onClick={() => handleClick(atendimento)} style={{ '--stagger': index + 1 }}>
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

            {showModal && <Modal data={modalData} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default AtendimentosTable;
