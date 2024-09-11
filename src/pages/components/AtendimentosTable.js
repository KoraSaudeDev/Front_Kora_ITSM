import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaFilter, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Select from 'react-select';
import Modal from './ModalTicket';
import caixaVazia from '../../assets/images/caixa-vazia.png';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AtendimentosTable = ({ titulo, apiUrl, filtrosExtras = {}, selectedTicket, onResetTicket, tipoTela, filtro }) => {
    const { user } = useAuth();
    const [atendimentos, setAtendimentos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [filterOptions, setFilterOptions] = useState({});
    const [filterSelectedOptions, setFilterSelectedOptions] = useState({});
    const [savedFilters, setSavedFilters] = useState(null);
    const [filtersOn, setFiltersOn] = useState(false);
    const [selectedHubs, setSelectedHubs] = useState([]);
    const [sortOrders, setSortOrders] = useState({});
    const [dateFilters, setDateFilters] = useState({
        abertura: { startDate: '', endDate: '' },
        data_limite: { startDate: '', endDate: '' }
    });
    const [dateErrors, setDateErrors] = useState({
        abertura: '',
        data_limite: ''
    });
    const [errorTimeouts, setErrorTimeouts] = useState({});

    const columnOptions = [
        'abertura', 'status', 'st_sla', 'categoria', 'ds_nivel',
        'data_limite', 'grupo', 'area_negocio', 'hub', 'unidade'
    ];
    const columnDescriptions = {
        abertura: 'Abertura',
        status: 'Status',
        st_sla: 'SLA',
        categoria: 'Categoria',
        ds_nivel: 'Prioridade',
        data_limite: 'Data limite',
        grupo: 'Analista Atual',
        area_negocio: 'Área de negócio',
        hub: 'HUB',
        unidade: 'Unidade de negócio'
    };
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#007aff' : state.isFocused ? '#e0f7fa' : 'white', // Cor de fundo
            color: state.isSelected ? 'white' : '#3E4676', // Cor do texto
            padding: 10,
        }),
        control: (provided) => ({
            ...provided,
            borderColor: '#007aff', // Cor da borda do select
            boxShadow: 'none',
            width: '250px',
            '&:hover': {
                borderColor: '#007aff', // Cor da borda ao passar o mouse
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#3E4676', // Cor do valor selecionado
        }),
    };

    const prevPageRef = useRef(currentPage);
    const prevItemsPerPageRef = useRef(itemsPerPage);

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
                if (prevPageRef.current !== currentPage || prevItemsPerPageRef.current !== itemsPerPage) {
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

                if (savedFilters) filtrosExtras["filtros"] = savedFilters;
                else delete filtrosExtras["filtros"];

                if (sortOrders) filtrosExtras["sort"] = sortOrders;
                else delete filtrosExtras["sort"];

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

        return () => clearTimeout(timer);
    }, [currentPage, itemsPerPage, savedFilters, sortOrders]);

    useEffect(() => {
        if (selectedTicket) {
            handleClick(selectedTicket);
        }
    }, [selectedTicket]);

    useEffect(() => {
        const fetchFilterOptions = async (hubs = []) => {
            try {
                const responses = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/hub`),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/categorias`),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/status-tickets`),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/usuarios-executores`),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/sla`),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/areas-negocio`),
                    hubs.length > 0 ? axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/unidade?hub=${hubs.join(',')}`) : Promise.resolve({ data: [] })
                ]);

                const [hubResponse, categoriasResponse, statusResponse, usuariosExecutoresResponse, slaResponse, areasNegocioResponse, unidadeResponse] = responses;

                const options = {
                    hub: hubResponse.data.map(hub => ({
                        value: hub,
                        label: hub
                    })),
                    categoria: categoriasResponse.data.map(categoria => ({
                        value: categoria,
                        label: categoria
                    })),
                    status: statusResponse.data.map(status => ({
                        value: status,
                        label: status
                    })),
                    grupo: usuariosExecutoresResponse.data.map(user => ({
                        value: user.id,
                        label: user.fila
                    })),
                    st_sla: [
                        {
                            value: "Em Atraso",
                            label: "Em Atraso"
                        },
                        {
                            value: "No Prazo",
                            label: "No Prazo"
                        }
                    ],
                    ds_nivel: slaResponse.data.map(sla => ({
                        value: sla.prioridade,
                        label: `${sla.prioridade} ${sla.descricao == null ? '' : `- ${sla.descricao}`}`
                    })),
                    area_negocio: areasNegocioResponse.data.map(area => ({
                        value: area,
                        label: area
                    })),
                    unidade: unidadeResponse.data.map(unidade => ({
                        value: unidade,
                        label: unidade
                    }))
                };

                setFilterOptions(options);
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterOptions(selectedHubs);
    }, [selectedHubs]);

    useEffect(() => {
        const fetchSavedFilters = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/${filtro}/${user.id_user}`);

                if (response.data.length === 0) return;
                console.log(response.data)
                const { dateFilters: apiDateFilters, filterOptions } = response.data;

                setDateFilters(prevDateFilters => ({
                    ...prevDateFilters,
                    ...apiDateFilters
                }));

                const updatedFilterSelectedOptions = {};
                for (const key in filterOptions) {
                    if (filterOptions[key].length) {
                        updatedFilterSelectedOptions[key] = filterOptions[key].map(option => ({
                            value: option,
                            label: option
                        }));
                    } else {
                        updatedFilterSelectedOptions[key] = [];
                    }
                }
                setFilterSelectedOptions(updatedFilterSelectedOptions);

                setSavedFilters(response.data);
                setFiltersOn(true);
            } catch (error) {
                console.error('Error fetching saved filters:', error);
            }
        };

        fetchSavedFilters();
    }, []);

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

    // const handleSortOrderToggle = (column) => {
    //     setSortOrders((prev) => {
    //         const currentOrder = prev[column];
    //         let newOrder = 'asc';

    //         if (currentOrder === 'asc') {
    //             newOrder = 'desc';
    //         } else if (currentOrder === 'desc') {
    //             newOrder = null;
    //         }

    //         return {
    //             ...prev,
    //             [column]: newOrder
    //         };
    //     });
    // };

    const handleDateChange = useCallback((column, type, value) => {
        const newDateFilters = {
            ...dateFilters,
            [column]: {
                ...dateFilters[column],
                [type]: value
            }
        };

        if (newDateFilters[column].startDate && newDateFilters[column].endDate) {
            const startDate = new Date(newDateFilters[column].startDate);
            const endDate = new Date(newDateFilters[column].endDate);

            if (startDate > endDate) {
                setDateErrors(prev => ({
                    ...prev,
                    [column]: 'A data de início não pode ser posterior à data de fim.'
                }));

                if (errorTimeouts[column]) {
                    clearTimeout(errorTimeouts[column]);
                }

                const timeoutId = setTimeout(() => {
                    setDateErrors(prev => ({
                        ...prev,
                        [column]: ''
                    }));
                }, 3000);

                setErrorTimeouts(prev => ({
                    ...prev,
                    [column]: timeoutId
                }));

                return;
            } else {
                setDateErrors(prev => ({
                    ...prev,
                    [column]: ''
                }));

                if (errorTimeouts[column]) {
                    clearTimeout(errorTimeouts[column]);
                }
            }
        }

        setDateFilters(newDateFilters);
    }, [dateFilters, errorTimeouts]);

    const handleSelectChange = (col, selectedOptions) => {
        setFilterSelectedOptions(prevOptions => {
            const updatedOptions = {
                ...prevOptions,
                [col]: selectedOptions
            };

            if (col === 'hub') {
                const newSelectedHubs = selectedOptions.map(option => option.value);
                setSelectedHubs(newSelectedHubs);

                updatedOptions.unidade = [];

                setFilterSelectedOptions(prev => ({
                    ...prev,
                    unidade: []
                }));
            }

            return updatedOptions;
        });
    };

    const handleSaveFilters = async () => {
        const cleanFilters = (filters) => {
            return {
                // sortOrders: Object.keys(filters.sortOrders).reduce((acc, key) => {
                //     const value = filters.sortOrders[key];
                //     if (value !== null) {
                //         acc[key] = value;
                //     }
                //     return acc;
                // }, {}),
                filterOptions: Object.keys(filters.filterOptions).reduce((acc, key) => {
                    const values = filters.filterOptions[key].filter(option => option !== "");
                    if (values.length > 0) {
                        acc[key] = values;
                    }
                    return acc;
                }, {}),
                dateFilters: Object.keys(filters.dateFilters).reduce((acc, key) => {
                    const { startDate, endDate } = filters.dateFilters[key];
                    if (startDate || endDate) {
                        acc[key] = { startDate, endDate };
                    }
                    return acc;
                }, {})
            };
        };

        const validateDateFilters = (filters) => {
            for (const key in filters.dateFilters) {
                const { startDate, endDate } = filters.dateFilters[key];
                if ((startDate && !endDate) || (!startDate && endDate)) {
                    alert(`Para o filtro "${key}", por favor, preencha tanto a data de início quanto a data de término.`);
                    return false;
                }
            }
            return true;
        };

        const savedFiltersLocal = {
            sortOrders,
            filterOptions: Object.keys(filterSelectedOptions).reduce((acc, key) => {
                acc[key] = filterSelectedOptions[key].map(option => option.value);
                return acc;
            }, {}),
            dateFilters
        };

        if (!validateDateFilters(savedFiltersLocal)) return;

        const cleanedFilters = cleanFilters(savedFiltersLocal);

        const hasData = Object.keys(cleanedFilters.filterOptions).length > 0 ||
            Object.keys(cleanedFilters.dateFilters).length > 0;

        if (hasData) {
            try {
                showLoadingOverlay();
                const filterConfig = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/${filtro}?user_id=${user.id_user}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(cleanedFilters)
                };

                const response = await axios.request(filterConfig);

                console.log(response.data);

                setSavedFilters(cleanedFilters);
                setFiltersOn(true);

                hideLoadingOverlay();
            } catch (error) {
                console.error('Error saving filters:', error);
                hideLoadingOverlay();
            }
        }
        else {
            try {
                showLoadingOverlay();

                const filterConfig = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/delete-${filtro}?user_id=${user.id_user}`
                };

                const response = await axios.request(filterConfig);

                console.log(response.data);

                clearFilters();

                hideLoadingOverlay();
            } catch (error) {
                console.error('Error deleting filters:', error);
                hideLoadingOverlay();
            }
        }

        setShowFilterDropdown(false);
    };

    const handleDeleteFilters = async () => {
        try {
            showLoadingOverlay();

            const filterConfig = {
                method: 'post',
                url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/delete-${filtro}?user_id=${user.id_user}`
            };

            const response = await axios.request(filterConfig);

            console.log(response.data);

            clearFilters();

            hideLoadingOverlay();
        } catch (error) {
            console.error('Error deleting filters:', error);
            hideLoadingOverlay();
        }

        setShowFilterDropdown(false);
    };

    const clearFilters = () => {
        setSavedFilters(null);
        setFiltersOn(false);
        setFilterSelectedOptions({});
        setDateFilters({
            abertura: { startDate: '', endDate: '' },
            data_limite: { startDate: '', endDate: '' }
        });
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
        setSortOrders(prevSortOrders => {
            const newSortOrders = { ...prevSortOrders };
            if (newSortOrders[column]) {
                if (newSortOrders[column] === 'asc') {
                    newSortOrders[column] = 'desc';
                } else if (newSortOrders[column] === 'desc') {
                    delete newSortOrders[column];
                }
            } else {
                newSortOrders[column] = 'asc';
            }
            return newSortOrders;
        });
        console.log(sortOrders)
    };

    const getSortClass = (column) => {
        if (sortOrders[column]) {
            return sortOrders[column] === 'asc' ? 'sorted-asc' : 'sorted-desc';
        }
        return '';
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

    return (
        <div className="container-meus-atendimentos">
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
                        className={`filter-icon ${filtersOn ? 'filter-icon-active' : ''}`}
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    />
                    {showFilterDropdown && (
                        <div className="filter-dropdown">
                            <h4>Escolha seu Filtro</h4>

                            {columnOptions.map((col) => (
                                <div key={col} className="filter-option">
                                    <h5>{columnDescriptions[col] || col.charAt(0).toUpperCase() + col.slice(1)}</h5>
                                    <div className="filter-select-container">
                                        {col === 'abertura' || col === 'data_limite' ? (
                                            <>
                                                {dateFilters[col] ? (
                                                    <>
                                                        <input
                                                            type="date"
                                                            placeholder="Data Início"
                                                            value={dateFilters[col].startDate || ''}
                                                            onChange={(e) => handleDateChange(col, 'startDate', e.target.value)}
                                                        />
                                                        <input
                                                            type="date"
                                                            placeholder="Data Fim"
                                                            value={dateFilters[col].endDate || ''}
                                                            onChange={(e) => handleDateChange(col, 'endDate', e.target.value)}
                                                        />
                                                    </>
                                                ) : (
                                                    <p>Selecione uma data</p>
                                                )}
                                                {dateErrors[col] && <p className="error-message">{dateErrors[col]}</p>}
                                            </>
                                        ) : (
                                            <Select
                                                className="filter-column-select"
                                                isMulti
                                                options={filterOptions[col] || []}
                                                value={filterSelectedOptions[col] || []}
                                                placeholder=""
                                                onChange={(selectedOptions) => handleSelectChange(col, selectedOptions)}
                                                styles={customStyles}
                                            />
                                        )}

                                        {/* <div
                                            className="sort-order-icons"
                                            onClick={() => handleSortOrderToggle(col)}
                                        >
                                            <FaArrowUp
                                                className={`sort-icon ${sortOrders[col] === 'asc' ? 'active' : ''}`}
                                            />
                                            <FaArrowDown
                                                className={`sort-icon ${sortOrders[col] === 'desc' ? 'active' : ''}`}
                                            />
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex' }}>
                                <button className="save-filter-button" onClick={handleSaveFilters}>
                                    Salvar
                                </button>
                                <button className="save-filter-button" onClick={handleDeleteFilters}>
                                    Limpar
                                </button>
                            </div>
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
                                    className={getSortClass('cod_fluxo')}
                                >
                                    Ticket
                                </th>
                                <th
                                    onClick={() => handleSort('abertura')}
                                    className={getSortClass('abertura')}
                                >
                                    Abertura
                                </th>
                                <th
                                    onClick={() => handleSort('status')}
                                    className={getSortClass('status')}
                                >
                                    Status
                                </th>
                                <th
                                    onClick={() => handleSort('st_sla')}
                                    className={getSortClass('st_sla')}
                                >
                                    SLA
                                </th>
                                <th
                                    onClick={() => handleSort('ds_nivel')}
                                    className={getSortClass('ds_nivel')}
                                >
                                    Prioridade
                                </th>
                                <th
                                    onClick={() => handleSort('categoria')}
                                    className={getSortClass('categoria')}
                                >
                                    Categoria
                                </th>
                                <th
                                    onClick={() => handleSort('subcategoria')}
                                    className={getSortClass('subcategoria')}
                                >
                                    Subcategoria
                                </th>
                                <th
                                    onClick={() => handleSort('assunto')}
                                    className={getSortClass('assunto')}
                                >
                                    Assunto
                                </th>
                                <th
                                    onClick={() => handleSort('data_limite')}
                                    className={getSortClass('data_limite')}
                                >
                                    Data Limite
                                </th>
                                <th
                                    onClick={() => handleSort('grupo')}
                                    className={getSortClass('grupo')}
                                >
                                    Analista Atual
                                </th>
                                <th
                                    onClick={() => handleSort('nome')}
                                    className={getSortClass('nome')}
                                >
                                    Nome
                                </th>
                                <th
                                    onClick={() => handleSort('area_negocio')}
                                    className={getSortClass('area_negocio')}
                                >
                                    Área de Negócio
                                </th>
                                <th
                                    onClick={() => handleSort('hub')}
                                    className={getSortClass('hub')}
                                >
                                    HUB
                                </th>
                                <th
                                    onClick={() => handleSort('unidade')}
                                    className={getSortClass('unidade')}
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
