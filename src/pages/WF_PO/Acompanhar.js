import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from 'react-icons/fa';
import '../../styles/WF_PO/Solicitacoes.css';

const Acompanhar = ({ cartItems = [] }) => {
    const [tickets, setTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null); // Ticket selecionado para exibição no modal
    const [selectAll, setSelectAll] = useState(false); // Adicionando a opção de selecionar todos no modal

    useEffect(() => {
        let newTickets = [];

        if (cartItems.length > 0) {
            newTickets = cartItems.map((item, index) => ({
                abertura: new Date().toLocaleString(),
                nome: item.nome || `Material ${index + 1}`,  // Preencher nome do ticket
                email: item.email || 'example@example.com',  // Preencher e-mail do ticket
                fase: 'Pendente',
                responsavel: 'Coordenador CC',
                hub: item.hub || 'Default Hub',  // Preencher hub
                unidade: item.unidade || 'Default Unidade',  // Preencher unidade
                codigo: item.codigo || '0000000000',  // Código do item
                item: item.nome || `Item ${index + 1}`,  // Nome do item
                quantidade: item.quantidade || 1, // Quantidade do item
                preco: item.preco || 100, // Preço unitário
                total: item.quantidade * (item.preco || 100), // Total (quantidade * preço)
                motivoRecusa: item.motivoRecusa || '',  // Motivo da recusa (vazio por padrão)
                acao: (
                    <FaShoppingCart 
                        className="cart-icon" 
                        onClick={() => openTicketModal(item)} 
                    />
                ),
            }));
        }

        if (newTickets.length === 0) {
            newTickets = [{
                abertura: new Date().toLocaleString(),
                nome: 'Produto Exemplo',
                email: 'example@example.com',
                fase: 'Pendente',
                responsavel: 'João Silva',
                hub: 'HUB Central',
                unidade: 'Unidade A',
                codigo: '0000000000',
                item: 'Produto Exemplo',
                quantidade: 10,
                preco: 90,
                total: 900,
                motivoRecusa: '',
                acao: (
                    <FaShoppingCart 
                        className="cart-icon" 
                        onClick={() => openTicketModal({})} 
                    />
                ),
            }];
        }

        setTickets(newTickets);
        setTotalPages(Math.ceil(newTickets.length / itemsPerPage));
    }, [cartItems]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
    };

    const renderTickets = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return tickets.slice(startIndex, endIndex).map((ticket, index) => (
            <tr key={index}>
                <td>{ticket.codigo}</td>
                <td>{ticket.item}</td>
                <td>{ticket.quantidade}</td>
                <td>{(ticket.preco || 0).toFixed(2)}</td> {/* Verificação aplicada aqui */}
                <td>{(ticket.total || 0).toFixed(2)}</td> {/* Verificação aplicada aqui */}
                <td>{ticket.fase}</td>
                <td>{ticket.motivoRecusa || '-'}</td>
                <td>{ticket.acao}</td>
            </tr>
        ));
    };

    const openTicketModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsCartOpen(true);
    };

    const closeTicketModal = () => {
        setIsCartOpen(false);
        setSelectedTicket(null);
    };

    return (
        <div className="container-solicitacoes">
            <h2>Tickets Recebidos</h2>
            <table className="tabela-tickets">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Item</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Motivo da Recusa</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.length > 0 ? renderTickets() : (
                        <tr>
                            <td colSpan="8">Nenhum registro encontrado</td>
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

            {/* Modal */}
            {isCartOpen && selectedTicket && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Detalhes do Ticket</h3>
                            <span className="close" onClick={closeTicketModal}>&times;</span>
                        </div>
                        <div className="modal-content">

                            {/* Campos adicionais no modal */}
                            <div className="form-row">
                                <div className="campo">
                                    <label>Email:</label>
                                    <input type="email" value={selectedTicket.email || 'example@example.com'} readOnly />
                                </div>
                                <div className="campo">
                                    <label>Nome:</label>
                                    <input type="text" value={selectedTicket.nome || 'Nome do Solicitante'} readOnly />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="campo">
                                    <label>Hub:</label>
                                    <input type="text" value={selectedTicket.hub || 'Default Hub'} readOnly />
                                </div>
                                <div className="campo">
                                    <label>Unidade:</label>
                                    <input type="text" value={selectedTicket.unidade || 'Default Unidade'} readOnly />
                                </div>
                                <div className="campo">
                                    <label>Centro de Custo:</label>
                                    <input type="text" value="Acomodações Térreo" readOnly />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="campo">
                                    <label>Área:</label>
                                    <input type="text" value="Ambulatório" readOnly />
                                </div>
                                <div className="campo">
                                    <label>Tipo de Solicitação:</label>
                                    <input type="text" value="Produto" readOnly />
                                </div>
                                <div className="campo">
                                    <label>Data Remessa:</label>
                                    <input type="text" value="12/09/2024" readOnly />
                                </div>
                                <div className="campo">
                                    <label>Bloco:</label>
                                    <input type="text" value="P/3" readOnly />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="campo">
                                    <label>Descrição:</label>
                                    <textarea rows="2" value="Verificar problema" readOnly />
                                </div>
                                <div className="campo">
                                    <label>Observações:</label>
                                    <textarea rows="2" value="" readOnly />
                                </div>
                            </div>

                            {/* Tabela no modal */}
                            <table className="tabela-detalhes-modal">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={handleSelectAll} checked={selectAll} /> Selecionar Todos</th>
                                        <th>Código</th>
                                        <th>Item</th>
                                        <th>Quantidade</th>
                                        <th>Preço</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Motivo da Recusa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input type="checkbox" /></td>
                                        <td>{selectedTicket.codigo}</td>
                                        <td>{selectedTicket.item}</td>
                                        <td>{selectedTicket.quantidade}</td>
                                        <td>{(selectedTicket.preco || 0).toFixed(2)}</td> {/* Verificação aplicada aqui */}
                                        <td>{(selectedTicket.total || 0).toFixed(2)}</td> {/* Verificação aplicada aqui */}
                                        <td>{selectedTicket.fase}</td>
                                        <td>{selectedTicket.motivoRecusa || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Botões Aprovar/Reprovar no modal */}
                            <div className="modal-footer">
                                <button className="approve-btn">Aprovar</button>
                                <button className="reject-btn">Reprovar</button>
                                <button onClick={closeTicketModal}>Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Acompanhar;
