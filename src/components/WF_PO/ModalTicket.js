import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const ModalTicket = ({ isCartOpen, selectedTicket, closeTicketModal }) => {
    const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
    const [isAtividadesOpen, setIsAtividadesOpen] = useState(false);
    const [isBionexoOpen, setIsBionexoOpen] = useState(false);

    const toggleHistorico = () => setIsHistoricoOpen(!isHistoricoOpen);
    const toggleAtividades = () => setIsAtividadesOpen(!isAtividadesOpen);
    const toggleBionexo = () => setIsBionexoOpen(!isBionexoOpen);

    return (
        isCartOpen && selectedTicket && (
            <div className="modal-overlay" id="modal-cart">
                <div className="modal" id="modal-details">
                    <div className="modal-header" id="modal-header">
                        <h3>Detalhes da Solicitação</h3>
                        <span className="close" onClick={closeTicketModal} id="btn-close-modal">&times;</span>
                    </div>
                    <div className="modal-content" id="modal-content">
                        <div className="requisicao-info" id="requisicao-info">
                            <p><strong>Requisição:</strong> 109</p>
                            <p><strong>Abertura:</strong> 13/08/2024 20:45:55</p>
                            <p><strong>Fase:</strong> Aprovação do(s) Produto(s)</p>
                            <p><strong>Responsável:</strong> Coordenador CC</p>
                        </div>

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
                                <textarea id="input-observacoes" rows="2" value="" readOnly />
                            </div>
                        </div>

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

                        <div className="total">
                            <p id="total-info">Total: R$900.00</p>
                        </div>

                        <div className="accordion" id="accordion-cotacao">
                            <h4 onClick={toggleBionexo} className={isBionexoOpen ? 'active' : ''}>
                                Retorno Cotação Bionexo
                                {isBionexoOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </h4>
                            {isBionexoOpen && (
                                <div className="accordion-content active">
                                    <p>Retorno Cotação Bionexo</p>
                                </div>
                            )}
                        </div>

                        <div className="accordion" id="accordion-historico">
                            <h4 onClick={toggleHistorico} className={isHistoricoOpen ? 'active' : ''}>
                                Histórico de Aprovações dos Materiais
                                {isHistoricoOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </h4>
                            {isHistoricoOpen && (
                                <div className="accordion-content active">
                                    <table className="tabela-historico">
                                        <thead>
                                            <tr>
                                                <th>Código</th>
                                                <th>Item</th>
                                                <th>Quantidade</th>
                                                <th>Preço</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Executor</th>
                                                <th>Motivo da Recusa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>000000000010008796</td>
                                                <td>AGULHA DESC. 25 X 12 REF. CF019-001</td>
                                                <td>10</td>
                                                <td>90.00</td>
                                                <td>900.00</td>
                                                <td>Pendente</td>
                                                <td>Solicitante</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="accordion" id="accordion-atividades">
                            <h4 onClick={toggleAtividades} className={isAtividadesOpen ? 'active' : ''}>
                                Atividades
                                {isAtividadesOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </h4>
                            {isAtividadesOpen && (
                                <div className="accordion-content active">
                                    <p>Aqui vai o histórico de atividades realizadas.</p>
                                </div>
                            )}
                        </div>

                        <div className="footer-note" id="footer-note">
                            <p>ATENÇÃO! Você é o último responsável pela aprovação dos materiais, ao enviar, será criado uma cotação no bionexo!</p>
                        </div>

                        <div className="modal-footer" id="modal-footer">
                            <button className="btn-voltar" id="btn-voltar" onClick={closeTicketModal}>Voltar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default ModalTicket;