import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from 'react-icons/fa';
import ModalTicket from './ModalTicket';
import { useAuth } from '../../context/AuthContext';
import { useRefresh } from '../../context/RefreshContext';
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

    const prevPageRef = useRef(currentPage);
    const prevItemsPerPageRef = useRef(itemsPerPage);

    const cacheKey = `${tipo_tela}_page_${currentPage}_items_${itemsPerPage}`;

  
    const fakeTickets = [
        {
            id: 'TK001',
            dt_abertura: '2024-10-10T08:45:00',
            nome: 'Lucas Silva',
            email: 'lucas.silva@example.com',
            fase: 'Em Andamento',
            executor: 'João Pereira',
            hub: 'São Paulo',
            unidade: 'Unidade Central'
        },
        {
            id: 'TK002',
            dt_abertura: '2024-10-09T11:30:00',
            nome: 'Maria Souza',
            email: 'maria.souza@example.com',
            fase: 'Pendente',
            executor: 'Ana Costa',
            hub: 'Rio de Janeiro',
            unidade: 'Unidade Sul'
        },
        {
            id: 'TK003',
            dt_abertura: '2024-10-08T14:00:00',
            nome: 'Pedro Oliveira',
            email: 'pedro.oliveira@example.com',
            fase: 'Concluído',
            executor: 'Carlos Santos',
            hub: 'Belo Horizonte',
            unidade: 'Unidade Norte'
        },
        {
            id: 'TK004',
            dt_abertura: '2024-10-07T09:15:00',
            nome: 'Cláudia Martins',
            email: 'claudia.martins@example.com',
            fase: 'Cancelado',
            executor: 'Fernanda Lima',
            hub: 'Brasília',
            unidade: 'Unidade Oeste'
        },
        {
            id: 'TK005',
            dt_abertura: '2024-10-06T16:30:00',
            nome: 'Ricardo Almeida',
            email: 'ricardo.almeida@example.com',
            fase: 'Em Andamento',
            executor: 'Juliana Souza',
            hub: 'Curitiba',
            unidade: 'Unidade Leste'
        }
    ];

    useEffect(() => {
      
        setTickets(fakeTickets);
        setTotalPages(1);

        prevPageRef.current = currentPage;
        prevItemsPerPageRef.current = itemsPerPage;

        return () => {};
    }, [currentPage, itemsPerPage, refreshKey]);

    function formatDate(dateString, type = 1, sub3Hrs = false) {
        if (!dateString) {
            return '';
        }

        let date;
        if (sub3Hrs) { 
            date = new Date(new Date(dateString).getTime() + new Date(dateString).getTimezoneOffset() * 60000);
        } else { 
            date = new Date(dateString);
        }
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
    }

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
            <tr key={index}>
                <td>{ticket.id}</td>
                <td>{formatDate(ticket.dt_abertura, 1, true)}</td>
                <td>{ticket.nome}</td>
                <td>{ticket.email}</td>
                <td>{ticket.fase}</td>
                <td>{ticket.executor}</td>
                <td>{ticket.hub}</td>
                <td>{ticket.unidade}</td>
                <td>
                    <FaShoppingCart
                        className="cart-icon"
                        onClick={() => openTicketModal(ticket)}
                    />
                </td>
            </tr>
        ));
    };

    return (
        <>
            <div id="loading-overlay" className="loading-overlay">
                <div className="loading-spinner"></div>
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
                        <th>Ação</th>
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

            {isCartOpen && selectedTicket && (
                <ModalTicket
                    isCartOpen={isCartOpen}
                    selectedTicket={selectedTicket}
                    closeTicketModal={closeTicketModal}
                    editing={editing}
                />
            )}
        </>
    );
};

export default AtendimentosTable;
