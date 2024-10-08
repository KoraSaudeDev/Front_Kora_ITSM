import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ModalTicket = ({ isCartOpen, selectedTicket, closeTicketModal }) => {
    const { user, token } = useAuth();
    const [materiais, setMateriais] = useState([]);
    const [bionexo, setBionexo] = useState([]);
    const [aprovacoes, setAprovacoes] = useState([]);
    const [atividades, setAtividades] = useState([]);

    const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
    const [isAtividadesOpen, setIsAtividadesOpen] = useState(false);
    const [isBionexoOpen, setIsBionexoOpen] = useState(false);

    const toggleHistorico = () => setIsHistoricoOpen(!isHistoricoOpen);
    const toggleAtividades = () => setIsAtividadesOpen(!isAtividadesOpen);
    const toggleBionexo = () => setIsBionexoOpen(!isBionexoOpen);

    const fetchMateriais = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/wf-po/wf-po-materiais?referencia_id=${selectedTicket.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    }
                }
            );
            setMateriais(response.data);
        } catch (error) {
            console.error('Erro ao buscar os materiais:', error);
        }
    };

    const fetchAprovacoes = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/wf-po/wf-po-aprovacoes?referencia_id=${selectedTicket.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                }
            );
            setAprovacoes(response.data);
        } catch (error) {
            console.error('Erro ao buscar aprovações:', error);
        }
    };

    const fetchAtividades = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/wf-po/wf-po-tasks?referencia_id=${selectedTicket.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                }
            );
            setAtividades(response.data);
        } catch (error) {
            console.error('Erro ao buscar as atividades:', error);
        }
    };

    const fetchBionexo = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/wf-po/wf-po-bionexo?referencia_id=${selectedTicket.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                }
            );
            setBionexo(response.data);
        } catch (error) {
            console.error('Erro ao buscar as retorno bionexo:', error);
        }
    };

    useEffect(() => {
        if (selectedTicket) {
            fetchMateriais();
            fetchBionexo();
            fetchAprovacoes();
            fetchAtividades();
        }
    }, [selectedTicket]);

    useEffect(() => {
        if (!isCartOpen) {
            setMateriais([]);
            setBionexo([]);
            setAprovacoes([]);
            setAtividades([]);
            setIsHistoricoOpen(false);
            setIsAtividadesOpen(false);
            setIsBionexoOpen(false);
        }
    }, [isCartOpen]);

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
                            <p><strong>Requisição:</strong> {selectedTicket.id}</p>
                            <p><strong>Abertura:</strong> {formatDate(selectedTicket.dt_abertura, 1, true)}</p>
                            <p><strong>Fase:</strong> {selectedTicket.fase}</p>
                            <p><strong>Responsável:</strong> {selectedTicket.executor}</p>
                        </div>

                        <div className="form-row">
                            <div className="campo">
                                <label htmlFor="input-email">Email:</label>
                                <input id="input-email" type="email" value={selectedTicket.email} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="input-nome">Nome:</label>
                                <input id="input-nome" type="text" value={selectedTicket.nome} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="campo">
                                <label htmlFor="input-hub">Hub:</label>
                                <input id="input-hub" type="text" value={selectedTicket.hub} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="input-unidade">Unidade:</label>
                                <input id="input-unidade" type="text" value={selectedTicket.unidade} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="input-centro-custo">Centro de Custo:</label>
                                <input id="input-centro-custo" type="text" value={selectedTicket.centro_custo} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="campo">
                                <label htmlFor="input-area">Área:</label>
                                <input id="input-area" type="text" value={selectedTicket.area} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="input-tipo-solicitacao">Tipo de Solicitação:</label>
                                <input id="input-tipo-solicitacao" type="text" value={selectedTicket.tipo_solicitacao} readOnly />
                            </div>
                            {selectedTicket.tipo_solicitacao === "Produto" && (
                                <div className="campo">
                                    <label htmlFor="input-data-remessa">Data Remessa:</label>
                                    <input id="input-data-remessa" type="text" value={formatDate(selectedTicket.dt_remessa, 1, true)} readOnly />
                                </div>
                            )}
                            <div className="campo">
                                <label htmlFor="input-bloco">Bloco:</label>
                                <input id="input-bloco" type="text" value={selectedTicket.numero_bloco} readOnly />
                            </div>
                        </div>
                        {selectedTicket.tipo_solicitacao === "Serviço" && (
                            <div className="form-row">
                                <div className="campo">
                                    <label htmlFor="input-cod-forn">Código do Fornecedor:</label>
                                    <input id="input-cod-forn" type="text" value={selectedTicket.cod_fornecedor} readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-forn">Fornecedor:</label>
                                    <input id="input-forn" type="text" value={selectedTicket.fornecedor} readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-inicio-serv">Início do Serviço:</label>
                                    <input id="input-inicio-serv" type="text" value={formatDate(selectedTicket.dt_inicio_serv, 1, true)} readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-fim-serv">Fim do Serviço:</label>
                                    <input id="input-fim-serv" type="text" value={formatDate(selectedTicket.dt_fim_serv, 1, true)} readOnly />
                                </div>
                            </div>
                        )}
                        <div className="form-row">
                            <div className="campo">
                                <label htmlFor="input-descricao">Descrição:</label>
                                <textarea id="input-descricao" rows="2" value={selectedTicket.descricao} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="input-observacoes">Observações:</label>
                                <textarea id="input-observacoes" rows="2" value={selectedTicket.observacoes} readOnly />
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
                                {materiais.length > 0 ? (
                                    materiais.map((material, index) => (
                                        <tr key={index}>
                                            <td><input type="checkbox" id="checkbox-item" /></td>
                                            <td>{material.codigo}</td>
                                            <td>{material.material}</td>
                                            <td>{material.qtd}</td>
                                            <td>{material.preco}</td>
                                            <td>{material.total}</td>
                                            <td>{material.status}</td>
                                            <td>{material.motivo_reprova ? material.motivo_reprova : 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">Nenhum material encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="total">
                            <p id="total-info">Total: R$900.00</p>
                        </div>

                        {bionexo.length > 0 && (
                            <div className="accordion" id="accordion-cotacao">
                                <h4 onClick={toggleBionexo} className={isBionexoOpen ? 'active' : ''}>
                                    Retorno Cotação Bionexo
                                    {isBionexoOpen ? <FaChevronUp /> : <FaChevronDown />}
                                </h4>
                                {isBionexoOpen && (
                                    <div className="accordion-content active">
                                        {bionexo.map((retornoBio, index) => (
                                            <div key={index}>
                                                <h4>{`${retornoBio.cod_produto} - ${retornoBio.razao_social} (${retornoBio.cnpj})`}</h4>
                                                <div>
                                                    <div className="form-row">
                                                        <div className="campo">
                                                            <strong>Faturamento Mínimo:</strong>
                                                            <input type="text" value={retornoBio.faturamento_min} readOnly />
                                                        </div>
                                                        <div className="campo">
                                                            <strong>Id Forma de Pagamento:</strong>
                                                            <input type="text" value={retornoBio.id_forma_pag} readOnly />
                                                        </div>
                                                        <div className="campo">
                                                            <strong>Observação Carrinho:</strong>
                                                            <input type="text" value={retornoBio.observacao} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="campo">
                                                            <strong>Prazo de Entrega:</strong>
                                                            <input type="text" value={retornoBio.prazo_entrega + " dias"} readOnly />
                                                        </div>
                                                        <div className="campo">
                                                            <strong>Validade da Proposta:</strong>
                                                            <input type="text" value={formatDate(retornoBio.validade_proposta, 1, true)} readOnly />
                                                        </div>
                                                        <div className="campo">
                                                            <strong>Frete:</strong>
                                                            <input type="text" value={retornoBio.frete} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="campo">
                                                            <strong>Preço Unitário:</strong>
                                                            <input type="text" value={"R$ " + retornoBio.preco_unitario} readOnly />
                                                        </div>
                                                        <div className="campo">
                                                            <strong>Preço Total:</strong>
                                                            <input type="text" value={"R$ " + retornoBio.preco_total} readOnly />
                                                        </div>
                                                        <div className="campo">
                                                            <strong>Quantidade:</strong>
                                                            <input type="text" value={retornoBio.quantidade} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="campo">
                                                            <strong>Fabricante:</strong>
                                                            <input type="text" value={retornoBio.fabricante} readOnly />
                                                        </div>
                                                        <div className="campo">
                                                            <strong>Embalagem:</strong>
                                                            <input type="text" value={retornoBio.embalagem} readOnly />
                                                        </div>
                                                        <div className="campo">
                                                            <strong>Retorno:</strong>
                                                            <input type="text" value={formatDate(retornoBio.inserido_em, 1, true)} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="campo">
                                                            <strong>Comentário:</strong>
                                                            <textarea rows={2} type="text" value={retornoBio.comentario} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

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
                                                <th>#</th>
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
                                            {aprovacoes.length > 0 ? (
                                                aprovacoes.map((aprovacao, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{aprovacao.codigo}</td>
                                                        <td>{aprovacao.material}</td>
                                                        <td>{aprovacao.qtd}</td>
                                                        <td>{aprovacao.preco}</td>
                                                        <td>{aprovacao.total}</td>
                                                        <td>{aprovacao.status}</td>
                                                        <td>{aprovacao.executor}</td>
                                                        <td>{aprovacao.motivo_reprova ? aprovacoes.motivo_reprova : 'N/A'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="9">Nenhuma aprovação encontrada.</td>
                                                </tr>
                                            )}
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
                                    <table className="tabela-historico">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Fase</th>
                                                <th>Executor</th>
                                                <th>Início</th>
                                                <th>Fim</th>
                                                <th>Motivo Reprova</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {atividades.length > 0 ? (
                                                atividades.map((atividade, index) => (
                                                    <tr key={index}>
                                                        <td>{atividade.id}</td>
                                                        <td>{atividade.fase}</td>
                                                        <td>{atividade.executor}</td>
                                                        <td>{formatDate(atividade.inicio, 1, true)}</td>
                                                        <td>{formatDate(atividade.fim, 1, true)}</td>
                                                        <td>{atividade.motivo_reprova ? atividade.motivo_reprova : 'N/A'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6">Nenhuma atividade encontrada.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
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
            </div >
        )
    );
};

export default ModalTicket;