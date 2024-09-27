import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/WF_PO/Solicitacoes.css';

const Solicitacoes = ({ cartItems = [] }) => {
    const [tickets, setTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Efeito para adicionar os itens do carrinho como tickets ao atualizar `cartItems`
    useEffect(() => {
        if (cartItems.length > 0) {
            const newTickets = cartItems.map((item, index) => ({
                abertura: new Date().toLocaleString(), // Define automaticamente a data de abertura
                nome: item.material, // Nome do material
                email: 'example@example.com', // Placeholder para o email
                fase: 'Em Aberto', // Fase inicial do ticket
                responsavel: 'Usuário', // Responsável
                hub: 'Default Hub', // HUB padrão
                unidade: 'Default Unidade', // Unidade padrão
                acao: 'Visualizar', // Ação padrão
            }));
            // Atualiza o estado com os novos tickets
            setTickets((prevTickets) => [...prevTickets, ...newTickets]);
            // Calcula o total de páginas
            setTotalPages(Math.ceil((tickets.length + newTickets.length) / itemsPerPage));
        }
    }, [cartItems]);

    // Função para alterar a página atual
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Função para renderizar os tickets da página atual
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
                <td>{ticket.acao}</td>
            </tr>
        ));
    };

    return (
        <div className="container-solicitacoes">
            <h2>Tickets Recebidos</h2>
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
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <FaChevronLeft />
                </button>
                <span>{currentPage} de {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

export default Solicitacoes;
