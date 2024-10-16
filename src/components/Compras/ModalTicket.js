import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './ModalTicket.css';

const ModalTicket = ({ isCartOpen, selectedTicket, closeTicketModal, showApprovalButtons = true }) => {
    const { user, token } = useAuth();
    const [total, setTotal] = useState(0);
    const [materiais, setMateriais] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (selectedTicket && token) {
            fetchMateriais();
            fetchChatMessages();
            setTotal(parseFloat(selectedTicket.total_materiais) || 0);
        }
    }, [selectedTicket, token]);

    const fetchMateriais = async () => {
        try {
            setMateriais(selectedTicket.materiais || []);
        } catch (error) {
            console.error('Erro ao buscar materiais:', error);
        }
    };

    const fetchChatMessages = async () => {
        try {
            setChatMessages(selectedTicket.comentarios || []);
        } catch (error) {
            console.error('Erro ao buscar mensagens do chat:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const newChatMessage = {
            autor: user.name,
            mensagem: newMessage,
            data: new Date().toISOString(),
        };

        setChatMessages((prevMessages) => [...prevMessages, newChatMessage]);
        setNewMessage('');

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/wf-po/wf-po-chat`, {
                ticket_id: selectedTicket.id,
                mensagem: newMessage,
            }, {
                headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email }
            });
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
        }
    };

    return (
        isCartOpen && (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <h3>Solicitação de Compras</h3>
                        <button className="close-button" onClick={closeTicketModal}>&times;</button>
                    </div>

                    <div className="modal-content">
                        {/* Mostrar os botões Aprovar/Reprovar apenas se showApprovalButtons for true */}
                        {showApprovalButtons && (
                            <div className="actions">
                                <button className="approve-button"><FaCheck /> Aprovar</button>
                                <button className="reject-button"><FaTimes /> Reprovar</button>
                            </div>
                        )}

                        <div className="modal-columns">
                            <div className="left-column">
                                <h4>Resumo do Ticket</h4>
                                <div className="ticket-info">
                                    <div><strong>HUB:</strong> {selectedTicket.hub || 'Não especificado'}</div>
                                    <div><strong>Unidade:</strong> {selectedTicket.unidade || 'Não especificada'}</div>
                                    <div><strong>Centro de Custo:</strong> {selectedTicket.centroCusto || 'Não especificado'}</div>
                                    <div><strong>Tipo de Equipamento:</strong> {selectedTicket.tipoEquipamento || 'Não especificado'}</div>
                                    <div><strong>Descrição:</strong> {selectedTicket.descricao || 'Nenhuma descrição fornecida'}</div>
                                    <div><strong>Observação:</strong> {selectedTicket.observacao || 'Nenhuma observação fornecida'}</div>
                                </div>
                            </div>

                            <div className="vertical-divider"></div>

                            <div className="right-column">
                                <h4>Carrinho de Compras</h4>
                                <div className="cart-content">
                                    <table className="materials-table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Qtd</th>
                                                <th>Preço</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {materiais.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4">Nenhum material adicionado</td>
                                                </tr>
                                            ) : (
                                                materiais.map((material, index) => (
                                                    <tr key={index}>
                                                        <td>{material.nome}</td>
                                                        <td>{material.quantidade}</td>
                                                        <td>R${material.preco}</td>
                                                        <td>R${(material.quantidade * material.preco).toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="cart-total">
                                        <h3>Total: R${total.toFixed(2)}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h4>Comentários e Observações</h4>
                        <div className="chat-container">
                            {chatMessages.length > 0 ? (
                                chatMessages.map((msg, index) => (
                                    <div key={index} className="chat-message">
                                        <strong>{msg.autor}:</strong> {msg.mensagem}
                                        <span className="chat-timestamp">{new Date(msg.data).toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhuma mensagem encontrada.</p>
                            )}
                        </div>

                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="Escreva uma mensagem..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button onClick={handleSendMessage}><FaPaperPlane /></button>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button onClick={closeTicketModal} className="close-footer-button">Fechar</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ModalTicket;
