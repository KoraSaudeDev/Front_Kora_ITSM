import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';
import Modal from './ModalTicket';
import caixaVazia from '../../assets/images/caixa-vazia.png';


import axios from 'axios';

const AtendimentosTable = ({ titulo, apiUrl, filtrosExtras = {}, selectedTicket, onResetTicket, tipoTela }) => {
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
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedColumnFilter, setSelectedColumnFilter] = useState('');

    const prevPageRef = useRef(currentPage);
    const prevItemsPerPageRef = useRef(itemsPerPage);
    const prevStatusFilterRef = useRef(filtroStatus);
    const prevSLAFilterPageRef = useRef(filtroSLA);

    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState(null);

    const statusOptions = {
        "Em Andamento": "#20C997",        
        "Em Atendimento": "#43A825",     
        "Aguardando Retorno Fornecedor": "#E87C86", 
        "Aguardando Retorno": "#F50057",  
        "Em Aberto": "#3B7DDD",          
        "Agendada": "#D500F9",          
        "Criação de Usuário": "#FF3D00", 
        "Finalizado": "#434343",         
        "Cancelado": "#D50000"            
    };

    const slaOptions = {
        "Em Atraso": "#dc3545",
        "No Prazo": "#28a745"
    };

    const cacheKey = `${tipoTela}_page_${currentPage}_items_${itemsPerPage}`;

    useEffect(() => {
        const fetchAtendimentos = async () => {
            try {
                if (prevPageRef.current !== currentPage || prevItemsPerPageRef.current !== itemsPerPage ||
                    prevStatusFilterRef.current !== filtroStatus || prevSLAFilterPageRef.current !== filtroSLA) 
                {
                    showLoadingOverlay();
                }
                setLoading(true);

                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    const { tickets, totalItems } = JSON.parse(cachedData);
                    setAtendimentos(tickets);
                    setTotalPages(Math.ceil(totalItems / itemsPerPage));
                }

                let url = `${apiUrl}page=${currentPage}&per_page=${itemsPerPage}`;
                
                if (sortColumn && sortDirection) {
                    url += `&sort_by=${sortColumn}&sort_order=${sortDirection}`;
                }

                if (filtroStatus) {
                    url += `&status=${filtroStatus}`;
                }

                if (filtroSLA) {
                    url += `&st_sla=${filtroSLA}`;
                }

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: filtrosExtras
                };

                const response = await axios.request(config);
                const fetchedAtendimentos = response.data.tickets;
                const totalItems = response.data.total_items;

                const slaData = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/sla`);

                const atendimentosWithSla = fetchedAtendimentos.map(atendimento => {
                    const slaInfo = slaData?.data.find(sla => sla.prioridade === atendimento.ds_nivel);
                    return {
                        ...atendimento,
                        slaDescricao: slaInfo ? `${slaInfo.prioridade} - ${slaInfo.descricao}` : atendimento.ds_nivel
                    };
                });

                hideLoadingOverlay();

                setAtendimentos(atendimentosWithSla);
                setTotalPages(Math.ceil(totalItems / itemsPerPage));
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({ tickets: atendimentosWithSla, totalItems })
                );

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

        prevPageRef.current = currentPage;
        prevItemsPerPageRef.current = itemsPerPage;
        prevStatusFilterRef.current = filtroStatus;
        prevSLAFilterPageRef.current = filtroSLA;

        return () => clearTimeout(timer);
    }, [currentPage, itemsPerPage, sortColumn, sortDirection, filtroStatus, filtroSLA]);

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
        setCurrentPage(1);
    };

    const handleSLAClick = (sla) => {
        setFiltroSLA(filtroSLA === sla ? '' : sla);
        setCurrentPage(1);
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

    const handleSort = (column) => {
        if (sortColumn === column) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortDirection(null);
                setSortColumn('');
            } else {
                setSortDirection('asc');
            }
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const atendimentosFiltrados = atendimentos;

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

    const columnOptions = [
        'abertura', 'status', 'st_sla', 'categoria', 'subcategoria',
        'assunto', 'data_limite', 'grupo', 'nome', 'area_negocio', 'hub', 'unidade'
    ];

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

                <div className="filter-icon-container">
                    <FaFilter 
                        className="filter-icon" 
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)} 
                    />
                    {showFilterDropdown && (
                        <div className="filter-dropdown">
                            <h4>Selecione a Coluna para Filtrar</h4>
                            <select
                                value={selectedColumnFilter}
                                onChange={(e) => setSelectedColumnFilter(e.target.value)}
                                className="filter-column-select"
                            >
                                <option value="">Selecione uma Coluna</option>
                                {columnOptions.map((col) => (
                                    <option key={col} value={col}>
                                        {col.charAt(0).toUpperCase() + col.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <button className="save-filter-button" onClick={() => setShowFilterDropdown(false)}>
                                Salvar
                            </button>
                        </div>
                    )}
                </div>

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

            {loading && atendimentos.length === 0 ? (
                <p>Buscando dados...</p>
            ) : atendimentosFiltrados.length === 0 && showNoDataMessage ? (
                <div className="no-data-container">
                    <img src={caixaVazia} alt="Sem atendimentos" className="no-data-image" />
                    <p id="sematendimento">Sem atendimentos no momento.</p>
                </div>
            ) : (
                <div className="tabela-container">
                    <table className="tabela-atendimentos">
                        <thead>
                            <tr>
                                <th
                                    id='ticket'
                                    onClick={() => handleSort('cod_fluxo')}
                                    className={
                                        sortColumn === 'cod_fluxo'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Ticket
                                </th>
                                <th
                                    onClick={() => handleSort('abertura')}
                                    className={
                                        sortColumn === 'abertura'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Abertura
                                </th>
                                <th
                                    onClick={() => handleSort('status')}
                                    className={
                                        sortColumn === 'status'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Status
                                </th>
                                <th
                                    onClick={() => handleSort('st_sla')}
                                    className={
                                        sortColumn === 'st_sla'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    SLA
                                </th>
                                <th
                                    onClick={() => handleSort('ds_nivel')}
                                    className={
                                        sortColumn === 'ds_nivel'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Prioridade
                                </th>
                                <th
                                    onClick={() => handleSort('categoria')}
                                    className={
                                        sortColumn === 'categoria'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Categoria
                                </th>
                                <th
                                    onClick={() => handleSort('subcategoria')}
                                    className={
                                        sortColumn === 'subcategoria'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Subcategoria
                                </th>
                                <th
                                    onClick={() => handleSort('assunto')}
                                    className={
                                        sortColumn === 'assunto'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Assunto
                                </th>
                                <th
                                    onClick={() => handleSort('data_limite')}
                                    className={
                                        sortColumn === 'data_limite'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Data Limite
                                </th>
                                <th
                                    onClick={() => handleSort('grupo')}
                                    className={
                                        sortColumn === 'grupo'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Analista Atual
                                </th>
                                <th
                                    onClick={() => handleSort('nome')}
                                    className={
                                        sortColumn === 'nome'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Nome
                                </th>
                                <th
                                    onClick={() => handleSort('area_negocio')}
                                    className={
                                        sortColumn === 'area_negocio'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Área de Negócio
                                </th>
                                <th
                                    onClick={() => handleSort('hub')}
                                    className={
                                        sortColumn === 'hub'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    HUB
                                </th>
                                <th
                                    onClick={() => handleSort('unidade')}
                                    className={
                                        sortColumn === 'unidade'
                                            ? sortDirection === 'asc'
                                                ? 'sorted-asc'
                                                : 'sorted-desc'
                                            : ''
                                    }
                                >
                                    Unidade de Negócio
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {atendimentosFiltrados.map((atendimento, index) => (
                                <tr key={atendimento.cod_fluxo} onClick={() => handleClick(atendimento)} style={{ '--stagger': index + 1 }}>
                                    <td id='cont-tabela'>{atendimento.cod_fluxo}</td>
                                    <td id='cont-tabela'>{new Date(atendimento.abertura).toLocaleString().replace(',', '')}</td>
                                    <td id='cont-tabela'>
                                        <span
                                            className="status"
                                            style={{
                                                backgroundColor: statusOptions[atendimento.status] || '#000',
                                                color: 'white',
                                                width: '150px',
                                                height: '30px',
                                                lineHeight: '30px',
                                                textAlign: 'center',
                                                borderRadius: '6px',
                                                display: 'inline-block',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {atendimento.status}
                                        </span>
                                    </td>
                                    <td id='cont-tabela'>
                                        <span
                                            className="sla"
                                            style={{
                                                backgroundColor: slaOptions[atendimento.sla_util] || '#000',
                                                color: 'white',
                                                width: '100px',
                                                height: '30px',
                                                lineHeight: '30px',
                                                textAlign: 'center',
                                                borderRadius: '6px',
                                                display: 'inline-block',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {atendimento.sla_util}
                                        </span>
                                    </td>
                                    <td id='cont-tabela'>{atendimento.slaDescricao}</td>
                                    <td id='cont-tabela'>{atendimento.categoria}</td>
                                    <td id='cont-tabela'>{atendimento.subcategoria}</td>
                                    <td id='cont-tabela'>{atendimento.assunto}</td>
                                    <td id='cont-tabela'>{new Date(atendimento.data_limite).toLocaleString().replace(',', '')}</td>
                                    <td id='cont-tabela'>{atendimento.grupo}</td>
                                    <td id='cont-tabela'>{atendimento.nome}</td>
                                    <td id='cont-tabela'>{atendimento.area_negocio}</td>
                                    <td id='cont-tabela'>{atendimento.hub}</td>
                                    <td id='cont-tabela'>{atendimento.unidade}</td>
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
