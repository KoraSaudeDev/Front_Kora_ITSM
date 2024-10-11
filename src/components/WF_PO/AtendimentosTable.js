import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from 'react-icons/fa';
import ModalTicket from './ModalTicket';
import { useAuth } from '../../context/AuthContext';
import { useRefresh } from '../../context/RefreshContext';
import Select from 'react-select';
import axios from 'axios';

const AtendimentosTable = ({ url, filtrosExtras = {}, tipo_tela, editing = false }) => {
    const { user, token } = useAuth();
    const { refreshKey } = useRefresh();
    const [tickets, setTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [options, setOptions] = useState({ grupoMaterial: [] });
    const [selectedGrupoMaterial, setSelectedGrupoMaterial] = useState(null);

    const prevPageRef = useRef(currentPage);
    const prevItemsPerPageRef = useRef(itemsPerPage);

    const cacheKey = `${tipo_tela}_page_${currentPage}_items_${itemsPerPage}`;

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/sap/grupo-mercadoria`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-User-Email': user.email
            }
        })
            .then(response => {
                setOptions(prevOptions => ({
                    ...prevOptions,
                    grupoMaterial: response.data.map(item => ({
                        value: item,
                        label: item
                    }))
                }));
            })
            .catch(error => console.error('Error fetching grupo de mercadoria:', error));
    }, []);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                if (prevPageRef.current !== currentPage || prevItemsPerPageRef.current !== itemsPerPage) {
                    showLoadingOverlay();
                }

                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    const { tickets, totalItems } = JSON.parse(cachedData);
                    setTickets(tickets);
                    setTotalPages(Math.ceil(totalItems / itemsPerPage));
                }

                const requestUrl = `${url}page=${currentPage}&per_page=${itemsPerPage}`;

                if (selectedGrupoMaterial) filtrosExtras["grupo_mercadoria"] = selectedGrupoMaterial.value;
                else delete filtrosExtras["grupo_mercadoria"];

                const config = {
                    method: 'POST',
                    url: requestUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                    data: filtrosExtras
                };

                const response = await axios.request(config);
                const fetchedTickets = response.data.tickets;
                const totalItems = response.data.total_items;

                setTickets(fetchedTickets);
                setTotalPages(Math.ceil(totalItems / itemsPerPage));

                if (!selectedGrupoMaterial) {
                    localStorage.setItem(
                        cacheKey,
                        JSON.stringify({ tickets: fetchedTickets, totalItems })
                    );
                }

                hideLoadingOverlay();
            } catch (error) {
                console.error('Erro ao buscar tickets:', error);
                hideLoadingOverlay();
            }
        };

        fetchTickets();

        prevPageRef.current = currentPage;
        prevItemsPerPageRef.current = itemsPerPage;

        return () => {
        };
    }, [currentPage, itemsPerPage, refreshKey, selectedGrupoMaterial]);

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

    const handleGrupoMatChange = (e) => {
        showLoadingOverlay();
        setCurrentPage(1);
        setSelectedGrupoMaterial(e);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const openTicketModal = async (ticket) => {
        try {
            const config = {
                method: 'GET',
                url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/wf-po?id=${ticket.id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-User-Email': user.email,
                },
                data: filtrosExtras
            };

            const response = await axios.request(config);
            setSelectedTicket(response.data);
            setIsCartOpen(true);
        }
        catch (error) {
            console.error("Erro ao buscar informações da requisição:", error);
        }
    };

    const closeTicketModal = () => {
        setIsCartOpen(false);
        setSelectedTicket(null);
    };

    const renderTickets = () => {
        return tickets.map((ticket, index) => (
            <tr key={index} onClick={() => openTicketModal(ticket)}>
                <td>{ticket.id}</td>
                <td>{formatDate(ticket.dt_abertura, 1, true)}</td>
                <td>{ticket.nome}</td>
                <td>{ticket.email}</td>
                <td>{ticket.fase}</td>
                <td>{ticket.executor}</td>
                <td>{ticket.hub}</td>
                <td>{ticket.unidade}</td>
                <td>{ticket.grupo_material}</td>
                <td>{ticket.tipo_solicitacao}</td>
            </tr>
        ));
    };

    return (
        <>
            <div id="loading-overlay" className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
            <div className="form-row">
                <div className="campo">
                    <label htmlFor="select-grupo-material">Grupo de Material:</label>
                    <Select
                        id="select-grupo-material"
                        value={selectedGrupoMaterial}
                        onChange={(e) => { handleGrupoMatChange(e) }}
                        options={options.grupoMaterial}
                        isClearable
                    />
                </div>
            </div>
            <table className="tabela-tickets">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Abertura</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Fase</th>
                        <th>Responsável</th>
                        <th>HUB</th>
                        <th>Unidade</th>
                        <th>Grupo Mercadoria</th>
                        <th>Tipo Solicitação</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.length > 0 ? renderTickets() : (
                        <tr>
                            <td colSpan="9">Nenhum registro encontrado</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    id="btn-prev-page">
                    <FaChevronLeft />
                </button>
                <span id="pagination-info">{currentPage} de {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    id="btn-next-page">
                    <FaChevronRight />
                </button>
            </div>

            <ModalTicket
                isCartOpen={isCartOpen}
                selectedTicket={selectedTicket}
                closeTicketModal={closeTicketModal}
                editing={editing}
            />
        </>
    );
};

export default AtendimentosTable;