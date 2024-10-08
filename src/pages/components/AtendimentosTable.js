import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { FaSearch, FaChevronLeft, FaChevronRight, FaFilter, FaArrowUp, FaArrowDown, FaDownload } from 'react-icons/fa';
import Select from 'react-select';
import Modal from './ModalTicket';
import caixaVazia from '../../assets/images/caixa-vazia.png';
import { useAuth } from '../../context/AuthContext';
import { useRefresh } from '../../context/RefreshContext';
import axios from 'axios';

const AtendimentosTable = ({ titulo, apiUrl, filtrosExtras = {}, tipoTela, filtro }) => {
    const authToken = localStorage.getItem(process.env.REACT_APP_TOKEN_USER);
    const { user } = useAuth();
    const { refreshKey } = useRefresh();
    const [atendimentos, setAtendimentos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [filterOptions, setFilterOptions] = useState({});
    const [filterSelectedOptions, setFilterSelectedOptions] = useState({});
    const [exportSelectedOptions, setExportSelectedOptions] = useState({});
    const [savedFilters, setSavedFilters] = useState(null);
    const [filtersOn, setFiltersOn] = useState(false);
    const [exportOptions, setExportOptions] = useState({});
    const [selectedHubs, setSelectedHubs] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [selectedSubcategoria, setSelectedSubcategoria] = useState('');
    const [selectedExportHubs, setSelectedExportHubs] = useState([]);
    const [selectedExportCategoria, setSelectedExportCategoria] = useState('');
    const [selectedExportSubcategoria, setSelectedExportSubcategoria] = useState('');
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

    const [dateExportFilters, setDateExportFilters] = useState({
        abertura: { startDate: '', endDate: '' },
        data_limite: { startDate: '', endDate: '' }
    });
    const [dateExportErrors, setDateExportErrors] = useState({
        abertura: '',
        data_limite: ''
    });
    const [errorExportTimeouts, setErrorExportTimeouts] = useState({});

    const columnOptions = [
        'abertura', 'status', 'st_sla', 'categoria', 'subcategoria', 'assunto',
        'ds_nivel', 'data_limite', 'executor', 'area_negocio', 'hub', 'unidade'
    ];
    const columnDescriptions = {
        abertura: 'Abertura',
        status: 'Status',
        st_sla: 'SLA',
        categoria: 'Categoria',
        subcategoria: 'Subcategoria',
        assunto: 'Assunto',
        ds_nivel: 'Prioridade',
        data_limite: 'Data limite',
        executor: 'Analista Atual',
        area_negocio: 'Área de negócio',
        hub: 'HUB',
        unidade: 'Unidade de negócio'
    };
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#007aff' : state.isFocused ? '#e0f7fa' : 'white',
            color: state.isSelected ? 'white' : '#3E4676',
            padding: 10,
        }),
        control: (provided) => ({
            ...provided,
            borderColor: '#007aff',
            boxShadow: 'none',
            width: '325px',
            '&:hover': {
                borderColor: '#007aff',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#3E4676',
        }),
    };

    const prevPageRef = useRef(currentPage);
    const prevItemsPerPageRef = useRef(itemsPerPage);
    const prevSavedFilters = useRef(savedFilters);

    const statusOptions = {
        "Em Andamento": "#20C997",
        "Em Atendimento": "#20C997",
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

    const prioridadeOptions = {
        "P1": "#FF0000",
        "P2": "#FF8C00",
        "P3": "#E5C200",
        "P4": "#1E90FF",
        "P5": "#28a745",
        "P6": "#36d184",
        "P7": "#0d5185"
    };

    const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });
    const [showMenu, setShowMenu] = React.useState(false);
    const [selectedAtendimento, setSelectedAtendimento] = React.useState(null);

    const cacheKey = `${tipoTela}_page_${currentPage}_items_${itemsPerPage}`;

    useEffect(() => {
        const fetchAtendimentos = async () => {
            try {
                if (prevPageRef.current !== currentPage || prevItemsPerPageRef.current !== itemsPerPage || prevSavedFilters.current !== savedFilters) {
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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                        'X-User-Email': user.email,
                    },
                    data: filtrosExtras
                };

                const response = await axios.request(config);
                const fetchedAtendimentos = response.data.tickets;

                const totalItems = response.data.total_items;

                hideLoadingOverlay();

                setAtendimentos(fetchedAtendimentos);
                setTotalPages(Math.ceil(totalItems / itemsPerPage));
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({ tickets: fetchedAtendimentos, totalItems })
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

        // const interval = setInterval(() => {
        //     fetchAtendimentos();
        // }, 30000);

        prevPageRef.current = currentPage;
        prevItemsPerPageRef.current = itemsPerPage;
        prevSavedFilters.current = savedFilters;

        return () => {
            clearTimeout(timer);
            //clearInterval(interval);
        };
    }, [currentPage, itemsPerPage, savedFilters, sortOrders, refreshKey]);

    useEffect(() => {
        const fetchFilterOptions = async (hubs = [], categoria = [], subcategoria = []) => {
            try {
                const responses = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/hub`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/categorias`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/status-tickets`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/usuarios-executores`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/sla`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/areas-negocio`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    hubs.length > 0 ? axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/unidade?hub=${hubs.join(',')}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }) : Promise.resolve({ data: [] }),
                    categoria.length > 0 ? axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/subcategorias?categoria=${categoria[0]}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }) : Promise.resolve({ data: [] }),
                    (categoria.length > 0 && subcategoria.length > 0) ? axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/assuntos?categoria=${categoria[0]}&subcategoria=${subcategoria[0]}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }) : Promise.resolve({ data: [] })
                ]);

                const [
                    hubResponse,
                    categoriasResponse,
                    statusResponse,
                    usuariosExecutoresResponse,
                    slaResponse,
                    areasNegocioResponse,
                    unidadeResponse,
                    subcategoriasResponse,
                    assuntosResponse
                ] = responses;

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
                    executor: usuariosExecutoresResponse.data.map(user => ({
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
                    })),
                    subcategoria: subcategoriasResponse.data.map(subcategoria => ({
                        value: subcategoria,
                        label: subcategoria
                    })),
                    assunto: assuntosResponse.data.map(assunto => ({
                        value: assunto.assunto,
                        label: assunto.assunto
                    }))
                };

                if (filterSelectedOptions.executor && filterSelectedOptions.executor.length > 0) {
                    const selectedExecutors = [];

                    filterSelectedOptions.executor.forEach(selectedExecutor => {
                        const matchingOption = options.executor.find(
                            option => option.value === selectedExecutor.value
                        );
                        if (matchingOption) {
                            selectedExecutors.push(matchingOption);
                        }
                    });

                    if (selectedExecutors.length > 0) {
                        setFilterSelectedOptions(prev => ({
                            ...prev,
                            executor: selectedExecutors
                        }));
                    }
                }

                setFilterOptions(options);
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterOptions(selectedHubs, selectedCategoria, selectedSubcategoria);
    }, [selectedHubs, selectedCategoria, selectedSubcategoria]);

    useEffect(() => {
        const fetchExportOptions = async (hubs = [], categoria = [], subcategoria = []) => {
            try {
                const responses = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/hub`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/categorias`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/status-tickets`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/usuarios-executores`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/sla`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/areas-negocio`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }),
                    hubs.length > 0 ? axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/unidade?hub=${hubs.join(',')}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }) : Promise.resolve({ data: [] }),
                    categoria.length > 0 ? axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/subcategorias?categoria=${categoria[0]}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }) : Promise.resolve({ data: [] }),
                    (categoria.length > 0 && subcategoria.length > 0) ? axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/assuntos?categoria=${categoria[0]}&subcategoria=${subcategoria[0]}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } }) : Promise.resolve({ data: [] })
                ]);

                const [
                    hubResponse,
                    categoriasResponse,
                    statusResponse,
                    usuariosExecutoresResponse,
                    slaResponse,
                    areasNegocioResponse,
                    unidadeResponse,
                    subcategoriasResponse,
                    assuntosResponse
                ] = responses;

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
                    executor: usuariosExecutoresResponse.data.map(user => ({
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
                    })),
                    subcategoria: subcategoriasResponse.data.map(subcategoria => ({
                        value: subcategoria,
                        label: subcategoria
                    })),
                    assunto: assuntosResponse.data.map(assunto => ({
                        value: assunto.assunto,
                        label: assunto.assunto
                    }))
                };

                options.status.push({ value: "Finalizado", label: "Finalizado" })
                options.status.push({ value: "Cancelado", label: "Cancelado" })

                setExportOptions(options);
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchExportOptions(selectedExportHubs, selectedExportCategoria, selectedExportSubcategoria);
    }, [selectedExportHubs, selectedExportCategoria, selectedExportSubcategoria]);

    useEffect(() => {
        const fetchSavedFilters = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/${filtro}/${user.id_user}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } });

                if (response.data.length === 0) return;

                const { dateFilters: apiDateFilters, filterOptions } = response.data;

                setDateFilters(prevDateFilters => ({
                    ...prevDateFilters,
                    ...apiDateFilters
                }));

                const updatedFilterSelectedOptions = {};
                for (const key in filterOptions) {
                    if (filterOptions[key].length) {
                        if (key === 'executor') {
                            updatedFilterSelectedOptions[key] = filterOptions[key].map(id => {
                                const executorOption = filterOptions.executor.find(exec => exec.value === id);
                                return {
                                    value: executorOption?.value || id,
                                    label: executorOption?.label || id
                                };
                            });
                        } else {
                            updatedFilterSelectedOptions[key] = filterOptions[key].map(option => ({
                                value: option,
                                label: option
                            }));
                        }
                    } else {
                        updatedFilterSelectedOptions[key] = [];
                    }
                }
                setFilterSelectedOptions(updatedFilterSelectedOptions);

                if (filterOptions.categoria) setSelectedCategoria(filterOptions.categoria);
                if (filterOptions.subcategoria) setSelectedSubcategoria(filterOptions.subcategoria);
                if (filterOptions.hub) setSelectedHubs(filterOptions.hub);

                setSavedFilters(response.data);
                setFiltersOn(true);
            } catch (error) {
                console.error('Error fetching saved filters:', error);
            }
        };

        fetchSavedFilters();
    }, []);

    useEffect(() => {
        const cod_fluxo = localStorage.getItem('cod_fluxo');

        if (cod_fluxo) {
            const fetchTicketData = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/ticket?cod_fluxo=${cod_fluxo}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } });
                    setModalData(response.data);
                    setShowModal(true);

                    localStorage.removeItem('cod_fluxo');
                } catch (error) {
                    console.error('Erro ao buscar dados do atendimento:', error);
                }
            };

            fetchTicketData();
        }
    }, []);

    useEffect(() => {
        if (showMenu) {
            window.addEventListener('click', handleClickOutside);
            window.addEventListener('scroll', handleClickOutside);
        } else {
            window.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleClickOutside);
        };
    }, [showMenu]);

    function formatDate(dateString, type = 1, sub3Hrs = false) {
        if (!dateString) {
            return '';
        }

        let date;
        if (sub3Hrs) { date = new Date(new Date(dateString).getTime() + new Date(dateString).getTimezoneOffset() * 60000) }
        else { date = new Date(dateString) }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        if (type === 1) return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        else if (type === 2) return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        else if (type === 3) return date.toISOString().slice(0, 19);
        else return '';
    };

    const showLoadingOverlay = () => {
        document.getElementById('loading-overlay').style.display = 'flex';
    };

    const hideLoadingOverlay = () => {
        document.getElementById('loading-overlay').style.display = 'none';
    };

    const handleClick = async (ticket) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/ticket?cod_fluxo=${ticket.cod_fluxo}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } });
            setModalData(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("Erro ao buscar informações do ticket:", error);
        }
    };

    const handleRightClick = (e, atendimento) => {
        e.preventDefault();

        const zoomFactor = 0.87;

        const clickX = (e.clientX / zoomFactor) + ((e.clientX / zoomFactor) * 0.15);
        const clickY = (e.clientY / zoomFactor) + ((e.clientY / zoomFactor) * 0.17);

        setMenuPosition({ x: clickX, y: clickY });
        setSelectedAtendimento(atendimento);
        setShowMenu(true);
    };

    const handleClickOutside = () => {
        setShowMenu(false);
    };

    const handleOpen = async (ticket) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/ticket?cod_fluxo=${ticket.cod_fluxo}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } });
            setModalData(response.data);
            setShowModal(true);
            setShowMenu(false);
        } catch (error) {
            console.error("Erro ao buscar informações do ticket:", error);
        }
    };

    const handleOpenInNewPage = (atendimento) => {
        localStorage.setItem('cod_fluxo', atendimento.cod_fluxo);

        const url = `${window.location.origin}${window.location.pathname}`;
        window.open(url, '_blank');

        setShowMenu(false);
    };

    const handleSearchChange = async (e) => {
        setCurrentPage(1);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${apiUrl}page=${currentPage}&per_page=${itemsPerPage}&cod_fluxo=${e.target.value}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'X-User-Email': user.email,
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
            const isMultiSelect = col !== 'categoria' && col !== 'subcategoria';

            const updatedOptions = {
                ...prevOptions,
                [col]: isMultiSelect
                    ? Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]
                    : [selectedOptions]
            };

            if (col === 'hub') {
                const newSelectedHubs = updatedOptions.hub.map(option => option.value);
                setSelectedHubs(newSelectedHubs);
                updatedOptions.unidade = [];

                setFilterSelectedOptions(prev => ({
                    ...prev,
                    unidade: []
                }));
            }

            if (col === 'categoria') {
                const newSelectedCategoria = [updatedOptions.categoria[0]?.value];
                setSelectedCategoria(newSelectedCategoria);
                updatedOptions.subcategoria = [];
                updatedOptions.assunto = [];

                setFilterSelectedOptions(prev => ({
                    ...prev,
                    subcategoria: [],
                    assunto: []
                }));
            }

            if (col === 'subcategoria') {
                const newSelectedSubcategoria = [updatedOptions.subcategoria[0]?.value];
                setSelectedSubcategoria(newSelectedSubcategoria);
                updatedOptions.assunto = [];

                setFilterSelectedOptions(prev => ({
                    ...prev,
                    assunto: []
                }));
            }

            return updatedOptions;
        });
    };

    const handleDateExportChange = useCallback((column, type, value) => {
        const newDateExportFilters = {
            ...dateExportFilters,
            [column]: {
                ...dateExportFilters[column],
                [type]: value
            }
        };

        if (newDateExportFilters[column].startDate && newDateExportFilters[column].endDate) {
            const startDate = new Date(newDateExportFilters[column].startDate);
            const endDate = new Date(newDateExportFilters[column].endDate);

            if (startDate > endDate) {
                setDateExportErrors(prev => ({
                    ...prev,
                    [column]: 'A data de início não pode ser posterior à data de fim.'
                }));

                if (errorExportTimeouts[column]) {
                    clearTimeout(errorExportTimeouts[column]);
                }

                const timeoutId = setTimeout(() => {
                    setDateExportErrors(prev => ({
                        ...prev,
                        [column]: ''
                    }));
                }, 3000);

                setErrorExportTimeouts(prev => ({
                    ...prev,
                    [column]: timeoutId
                }));

                return;
            } else {
                setDateExportErrors(prev => ({
                    ...prev,
                    [column]: ''
                }));

                if (errorExportTimeouts[column]) {
                    clearTimeout(errorExportTimeouts[column]);
                }
            }
        }

        setDateExportFilters(newDateExportFilters);
    }, [dateExportFilters, errorExportTimeouts]);

    const handleSelectExportChange = (col, selectedOptions) => {
        setExportSelectedOptions(prevOptions => {
            const isMultiSelect = col !== 'categoria' && col !== 'subcategoria';

            const updatedOptions = {
                ...prevOptions,
                [col]: isMultiSelect
                    ? Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]
                    : [selectedOptions]
            };

            if (col === 'hub') {
                const newSelectedHubs = updatedOptions.hub.map(option => option.value);
                setSelectedExportHubs(newSelectedHubs);
                updatedOptions.unidade = [];

                setExportSelectedOptions(prev => ({
                    ...prev,
                    unidade: []
                }));
            }

            if (col === 'categoria') {
                const newSelectedCategoria = [updatedOptions.categoria[0]?.value];
                setSelectedExportCategoria(newSelectedCategoria);
                updatedOptions.subcategoria = [];
                updatedOptions.assunto = [];

                setExportSelectedOptions(prev => ({
                    ...prev,
                    subcategoria: [],
                    assunto: []
                }));
            }

            if (col === 'subcategoria') {
                const newSelectedSubcategoria = [updatedOptions.subcategoria[0]?.value];
                setSelectedExportSubcategoria(newSelectedSubcategoria);
                updatedOptions.assunto = [];

                setExportSelectedOptions(prev => ({
                    ...prev,
                    assunto: []
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
                    const values = filters.filterOptions[key].filter(option => option !== "" && option !== null && option !== undefined);
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
                acc[key] = filterSelectedOptions[key].map(option => option?.value);
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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                        'X-User-Email': user.email,
                    },
                    data: JSON.stringify(cleanedFilters)
                };

                const response = await axios.request(filterConfig);

                hideLoadingOverlay();

                console.log(response.data);

                setSavedFilters(cleanedFilters);
                setFiltersOn(true);
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
                    url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/delete-${filtro}?user_id=${user.id_user}`,
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'X-User-Email': user.email,
                      }
                };

                const response = await axios.request(filterConfig);

                console.log(response.data);

                hideLoadingOverlay();

                clearFilters();
            } catch (error) {
                console.error('Error deleting filters:', error);
                hideLoadingOverlay();
            }
        }

        setShowFilterDropdown(false);
        setCurrentPage(1);
    };

    const handleDeleteFilters = async () => {
        try {
            showLoadingOverlay();

            const filterConfig = {
                method: 'post',
                url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/delete-${filtro}?user_id=${user.id_user}`,
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'X-User-Email': user.email,
                  }
            };

            const response = await axios.request(filterConfig);

            console.log(response.data);

            hideLoadingOverlay();

            clearFilters();
        } catch (error) {
            console.error('Error deleting filters:', error);
            hideLoadingOverlay();
        }

        setShowFilterDropdown(false);
        setCurrentPage(1);
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

    const handleExportTickets = async () => {
        const cleanFilters = (filters) => {
            return {
                filterOptions: Object.keys(filters.filterOptions).reduce((acc, key) => {
                    const values = filters.filterOptions[key].filter(option => option !== "" && option !== null && option !== undefined);
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
            filterOptions: Object.keys(exportSelectedOptions).reduce((acc, key) => {
                acc[key] = exportSelectedOptions[key].map(option => option?.value);
                return acc;
            }, {}),
            dateFilters: dateExportFilters
        };

        if (!validateDateFilters(savedFiltersLocal)) return;

        const cleanedFilters = cleanFilters(savedFiltersLocal);

        try {
            showLoadingOverlay();
            const filterConfig = {
                method: 'post',
                url: `${process.env.REACT_APP_API_BASE_URL}/tickets/export`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                    'X-User-Email': user.email,
                },
                data: JSON.stringify(cleanedFilters),
                responseType: 'blob'
            };

            const response = await axios(filterConfig);

            const now = new Date();
            const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `export_${timestamp}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error exporting tickets:', error);
            hideLoadingOverlay();
        }

        setShowExportDropdown(false);
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
                                                    <div className="date-inputs">
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
                                                    </div>
                                                ) : (
                                                    <p>Selecione uma data</p>
                                                )}
                                                {dateErrors[col] && <p className="error-message">{dateErrors[col]}</p>}
                                            </>
                                        ) : (
                                            <Select
                                                className="filter-column-select"
                                                isMulti={col !== 'categoria' && col !== 'subcategoria'}
                                                options={filterOptions[col] || []}
                                                value={filterSelectedOptions[col] || []}
                                                placeholder=""
                                                onChange={(selectedOptions) => handleSelectChange(col, selectedOptions)}
                                                styles={customStyles}
                                                isClearable
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

                <div className="export-icon-container">
                    <FaDownload
                        className={`export-icon ${filtersOn ? 'export-icon-active' : ''}`}
                        onClick={() => setShowExportDropdown(!showExportDropdown)}
                    />
                    {showExportDropdown && (
                        <div className="export-dropdown">
                            <h4>Filtros do Export</h4>

                            {columnOptions.map((col) => (
                                <div key={col} className="export-option">
                                    <h5>{columnDescriptions[col] || col.charAt(0).toUpperCase() + col.slice(1)}</h5>
                                    <div className="export-select-container">
                                        {col === 'abertura' || col === 'data_limite' ? (
                                            <>
                                                {dateExportFilters[col] ? (
                                                    <div className="date-inputs">
                                                        <input
                                                            type="date"
                                                            placeholder="Data Início"
                                                            value={dateExportFilters[col].startDate || ''}
                                                            onChange={(e) => handleDateExportChange(col, 'startDate', e.target.value)}
                                                        />
                                                        <input
                                                            type="date"
                                                            placeholder="Data Fim"
                                                            value={dateExportFilters[col].endDate || ''}
                                                            onChange={(e) => handleDateExportChange(col, 'endDate', e.target.value)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <p>Selecione uma data</p>
                                                )}
                                                {dateExportErrors[col] && <p className="error-message">{dateExportErrors[col]}</p>}
                                            </>
                                        ) : (
                                            <Select
                                                className="export-column-select"
                                                isMulti={col !== 'categoria' && col !== 'subcategoria'}
                                                options={exportOptions[col] || []}
                                                value={exportSelectedOptions[col] || []}
                                                placeholder=""
                                                onChange={(selectedOptions) => handleSelectExportChange(col, selectedOptions)}
                                                styles={customStyles}
                                                isClearable
                                            />

                                        )}
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex' }}>
                                <button className="save-export-button" onClick={handleExportTickets}>
                                    Exportar
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
                                <tr
                                    key={atendimento.cod_fluxo}
                                    onClick={() => handleClick(atendimento)}
                                    onContextMenu={(e) => handleRightClick(e, atendimento)}
                                    style={{ '--stagger': index + 1 }}
                                >
                                    <td id='cont-tabela'>{atendimento.cod_fluxo}</td>
                                    <td id='cont-tabela'>{formatDate(atendimento.abertura, 1, true)}</td>
                                    <td id='cont-tabela'>
                                        <span
                                            className="status"
                                            style={{
                                                backgroundColor: statusOptions[atendimento.status] || '#ffffff',
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
                                                backgroundColor: slaOptions[atendimento.sla_util] || '#ffffff',
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
                                    <td id='cont-tabela'>
                                        <span
                                            className="prioridade"
                                            style={{
                                                backgroundColor: prioridadeOptions[atendimento.ds_nivel] || '#ffffff',
                                                color: 'white',
                                                width: '120px',
                                                height: '30px',
                                                lineHeight: '30px',
                                                textAlign: 'center',
                                                borderRadius: '6px',
                                                display: 'inline-block',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {atendimento.prioridadeDescricao}
                                        </span>
                                    </td>
                                    <td id='cont-tabela'>{atendimento.categoria}</td>
                                    <td id='cont-tabela'>{atendimento.subcategoria}</td>
                                    <td id='cont-tabela'>{atendimento.assunto}</td>
                                    <td id='cont-tabela'>{formatDate(atendimento.data_limite)}</td>
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

            {showMenu &&
                ReactDOM.createPortal(
                    <div
                        className="context-menu"
                        style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
                    >
                        <ul>
                            <li onClick={() => handleOpen(selectedAtendimento)}>Abrir</li>
                            <li onClick={() => handleOpenInNewPage(selectedAtendimento)}>Abrir em outra página...</li>
                        </ul>
                    </div>,
                    document.body
                )
            }
        </div>
    );
};

export default AtendimentosTable;
