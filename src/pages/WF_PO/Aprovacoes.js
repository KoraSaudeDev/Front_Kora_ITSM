import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from 'react-icons/fa'; 
import '../../styles/WF_PO/Solicitacoes.css';

const Aprovacoes = ({ cartItems = [] }) => {
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

        setTickets(newTickets);
        setTotalPages(Math.ceil(newTickets.length / itemsPerPage));
    }, [cartItems]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} id="btn-prev-page">
                    <FaChevronLeft />
                </button>
                <span id="pagination-info">{currentPage} de {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} id="btn-next-page">
                    <FaChevronRight />
                </button>
            </div>

            {/* Modal */}
            {isCartOpen && selectedTicket && (
                <div className="modal-overlay" id="modal-cart">
                    <div className="modal" id="modal-details">
                        <div className="modal-header" id="modal-header">
                            <h3>Detalhes do Ticket</h3>
                            <span className="close" onClick={closeTicketModal} id="btn-close-modal">&times;</span>
                        </div>
                        <div className="modal-content" id="modal-content">
                            {/* Requisição Info */}
                            <div className="requisicao-info" id="requisicao-info">
                                <p><strong>Requisição:</strong> 109</p>
                                <p><strong>Abertura:</strong> 13/08/2024 20:45:55</p>
                                <p><strong>Fase:</strong> Aprovação do(s) Produto(s)</p>
                                <p><strong>Responsável:</strong> Coordenador CC</p>
                            </div>

                            {/* Form Fields */}
                            <div className="form-row">
                                <div className="campo">
                                    <label htmlFor="input-email">Email:</label>
                                    <input id="input-email" type="email" value="pedro.marchesini@korasaude.com.br" readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-nome">Nome:</label>
                                    <input id="input-nome" type="text" value="Pedro" readOnly />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="campo">
                                    <label htmlFor="input-hub">Hub:</label>
                                    <input id="input-hub" type="text" value="ES" readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-unidade">Unidade:</label>
                                    <input id="input-unidade" type="text" value="ES: HOSPITAL MERIDIONAL S.A (Cariacica)" readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-centro-custo">Centro de Custo:</label>
                                    <input id="input-centro-custo" type="text" value="ACOMODACOES TERREO (1410101001)" readOnly />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="campo">
                                    <label htmlFor="input-area">Área:</label>
                                    <input id="input-area" type="text" value="AMBULATORIO" readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-tipo-solicitacao">Tipo de Solicitação:</label>
                                    <input id="input-tipo-solicitacao" type="text" value="Produto" readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-data-remessa">Data Remessa:</label>
                                    <input id="input-data-remessa" type="text" value="12/09/2024" readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-bloco">Bloco:</label>
                                    <input id="input-bloco" type="text" value="P/3" readOnly />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="campo">
                                    <label htmlFor="input-descricao">Descrição:</label>
                                    <textarea id="input-descricao" rows="2" value="teste" readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-observacoes">Observações:</label>
                                    <textarea id="input-observacoes" rows="2" value="" />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="form-row">
                                <button className="btn-aprovar" id="btn-aprovarr">Aprovar</button>
                                <button className="btn-reprovar" id="btn-reprovarr">Reprovar</button>
                            </div>

                            {/* Table */}
                            <table className="tabela-tickets">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" id="checkbox-select" /></th>
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
                                        <td><input type="checkbox" id="checkbox-item" /></td>
                                        <td>000000000010008796</td>
                                        <td>AGULHA DESC. 25 X 12 REF. CF019-001</td>
                                        <td>10</td>
                                        <td>90.00</td>
                                        <td>900.00</td>
                                        <td>Pendente</td>
                                        <td>Motivo da Recusa</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Total */}
                            <div className="total">
                                <p id="total-info">Total: R$900.00</p>
                            </div>

                            {/* Histórico de Aprovações dos Materiais */}
                            <div className="accordion" id="accordion-historico">
                                <h4>Histórico de Aprovações dos Materiais</h4>
                            </div>
                            
                            {/* Atividades */}
                            <div className="accordion" id="accordion-atividades">
                                <h4>Atividades</h4>
                            </div>

                            {/* Footer Note */}
                            <div className="footer-note" id="footer-note">
                                <p>ATENÇÃO! Você é o último responsável pela aprovação dos materiais, ao enviar, será criado uma cotação no bionexo!</p>
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer" id="modal-footer">
                                <button className="btn-voltar" id="btn-voltar" onClick={closeTicketModal}>Voltar</button>
                                <button className="btn-enviar" id="btn-enviar">Enviar Cotação</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Aprovacoes;
