import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from 'react-icons/fa';
import ModalTicket from './ModalTicket';

const AtendimentoTable = ({ cartItems }) => {
    const [tickets, setTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        let newTickets = cartItems.length > 0 ? cartItems : [{
            abertura: new Date().toLocaleString(),
            nome: 'Produto Exemplo',
            email: 'example@example.com',
            fase: 'Em Aberto',
            responsavel: 'João Silva',
            hub: 'HUB Central',
            unidade: 'Unidade A',
            acao: (
                <FaShoppingCart
                    className="cart-icon"
                    onClick={() => openTicketModal({})}
                />
            ),
        }];

        if (JSON.stringify(newTickets) !== JSON.stringify(tickets)) {
            setTickets(newTickets);
            setTotalPages(Math.ceil(newTickets.length / itemsPerPage));
        }
    }, [cartItems, tickets, itemsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const openTicketModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsCartOpen(true);
    };

    const closeTicketModal = () => {
        setIsCartOpen(false);
        setSelectedTicket(null);
    };

    const renderTickets = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return tickets.slice(startIndex, endIndex).map((ticket, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{ticket.abertura}</td>
                <td>{ticket.nome}</td>
                <td>{ticket.email}</td>
                <td>{ticket.fase}</td>
                <td>{ticket.responsavel}</td>
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

            <ModalTicket 
                isCartOpen={isCartOpen} 
                selectedTicket={selectedTicket} 
                closeTicketModal={closeTicketModal}
            />
        </>
    );
};

export default AtendimentoTable;