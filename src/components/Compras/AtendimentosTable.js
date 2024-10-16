import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from 'react-icons/fa';
import ModalTicket from './ModalTicket';
import { useAuth } from '../../context/AuthContext';

const AtendimentosTable = ({ url, filtrosExtras = {}, tipo_tela, editing = false }) => {
    const { user, token } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Fake data for tickets (replace this with API calls)
    const fakeTickets = [
        {
            id: 'TK001',
            dt_abertura: '2024-10-10T08:45:00',
            nome: 'Lucas Silva',
            email: 'lucas.silva@example.com',
            fase: 'Em Andamento',
            executor: 'João Pereira',
            hub: 'São Paulo',
            unidade: 'Unidade Central',
            centroCusto: 'Marketing',
            tipoEquipamento: 'Estação de Trabalho',
            descricao: 'Aquisição de novo notebook para o setor de Marketing.',
            observacao: 'Urgente. Precisa ser entregue até o final do mês.',
            materiais: [
                { nome: 'Notebook Dell XPS 13', quantidade: 2, preco: 7500, total: 15000 }
            ],
            total_materiais: 15000,
            comentarios: [
                { usuario: 'Lucas Silva', mensagem: 'Precisamos desse equipamento o quanto antes.', timestamp: '2024-10-11 10:12' },
                { usuario: 'João Pereira', mensagem: 'Estou agilizando a compra.', timestamp: '2024-10-12 11:22' }
            ]
        },
        {
            id: 'TK002',
            dt_abertura: '2024-10-09T11:30:00',
            nome: 'Maria Souza',
            email: 'maria.souza@example.com',
            fase: 'Pendente',
            executor: 'Ana Costa',
            hub: 'Rio de Janeiro',
            unidade: 'Unidade Sul',
            centroCusto: 'RH',
            tipoEquipamento: 'CHIP',
            descricao: 'Solicitação de chips para novas linhas móveis.',
            observacao: '',
            materiais: [
                { nome: 'CHIP Vivo', quantidade: 5, preco: 10, total: 50 }
            ],
            total_materiais: 50,
            comentarios: [
                { usuario: 'Ana Costa', mensagem: 'Enviarei os chips na próxima semana.', timestamp: '2024-10-10 12:32' }
            ]
        },
        // Outros tickets aqui...
    ];

    // useEffect to load tickets on mount
    useEffect(() => {
        setTickets(fakeTickets);
        setTotalPages(1);
    }, []);

    // Format date function
    function formatDate(dateString) {
        if (!dateString) return '';
        let date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    // Pagination handler
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Modal handler to view ticket
    const openTicketModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsCartOpen(true);
    };

    const closeTicketModal = () => {
        setIsCartOpen(false);
        setSelectedTicket(null);
    };

    // Render tickets dynamically
    const renderTickets = () => {
        return tickets.map((ticket, index) => (
            <tr key={index}>
                <td>{ticket.id}</td>
                <td>{formatDate(ticket.dt_abertura)}</td>
                <td>{ticket.nome}</td>
                <td>{ticket.email}</td>
                <td>{ticket.fase}</td>
                <td>{ticket.executor}</td>
                <td>{ticket.hub}</td>
                <td>{ticket.unidade}</td>
                <td>
                    <FaShoppingCart className="cart-icon" onClick={() => openTicketModal(ticket)} />
                </td>
            </tr>
        ));
    };

    return (
        <>
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
                >
                    <FaChevronLeft />
                </button>
                <span>{currentPage} de {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <FaChevronRight />
                </button>
            </div>

            {isCartOpen && selectedTicket && (
                <ModalTicket
                    isCartOpen={isCartOpen}
                    selectedTicket={selectedTicket}
                    closeTicketModal={closeTicketModal}
                />
            )}
        </>
    );
};

export default AtendimentosTable;
