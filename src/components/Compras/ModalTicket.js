import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ModalTicket = ({ isCartOpen, selectedTicket, closeTicketModal, editing }) => {
    const { user, token } = useAuth();

    const [total, setTotal] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);

    const [materiais, setMateriais] = useState([]);
    const [bionexo, setBionexo] = useState([]);
    const [aprovacoes, setAprovacoes] = useState([]);
    const [atividades, setAtividades] = useState([]);

    const [bloco, setBloco] = useState(null);
    const [fase, setFase] = useState(null);
    const [grupo, setGrupo] = useState(null);
    const [isNextIntegraBio, setIsNextIntegraBio] = useState(false);
    const [isNextIntegraSAP, setIsNextIntegraSAP] = useState(false);

    const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
    const [isAtividadesOpen, setIsAtividadesOpen] = useState(false);
    const [isBionexoOpen, setIsBionexoOpen] = useState(false);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showCloseBtn, setShowCloseBtn] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [aprovacaoMateriais, setAprovacaoMateriais] = useState(false);
    const [aprovacaoSolicitacao, setAprovacaoSolicitacao] = useState(false);

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
            const filteredMateriais = editing
                ? response.data.filter(material => material.id_status !== 3)
                : response.data;

            setMateriais(filteredMateriais);
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

    const fetchFases = () => {
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/wf-po/form/fases?bloco=${bloco}&valor=${total}&fase=${selectedTicket.id_fase}`,
            { headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email } }
        )
            .then(response => {
                setFase(response.data[0]?.id_fase);
                setGrupo(response.data[0]?.id_grupo);
                if (response.data[0].isIntegraBio) setIsNextIntegraBio(response.data[0].isIntegraBio);
                if (response.data[0].isIntegraSAP) setIsNextIntegraSAP(response.data[0].isIntegraSAP);
            })
            .catch(error => console.error('Error fetching fases:', error));
    };

    useEffect(() => {
        if (selectedTicket) {
            fetchMateriais();
            fetchBionexo();
            fetchAprovacoes();
            fetchAtividades();
            setTotal(parseFloat(selectedTicket.total_materiais) || 0);
            setBloco(selectedTicket.numero_bloco);
            setFase(selectedTicket.id_fase);
            setGrupo(selectedTicket.id_grupo);
            setAprovacaoMateriais(editing && selectedTicket.id_fase < 10);
            setAprovacaoSolicitacao(editing && selectedTicket.id_fase >= 10);
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
            setTotal(0);
            setBloco(null);
            setFase(null);
            setGrupo(null);
            setIsNextIntegraSAP(false);
            setIsNextIntegraBio(false);
            setAprovacaoMateriais(false);
        }
    }, [isCartOpen]);

    useEffect(() => {
        const newTotal = materiais
            .filter(material => material.status !== 'Reprovado')
            .reduce((acc, material) => {
                return acc + parseFloat(material.total);
            }, 0);
        setTotal(newTotal);
    }, [materiais]);

    useEffect(() => {
        if (isCartOpen) {
            fetchFases();
        }
    }, [total]);

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

    const sendRequest = async (config) => {
        try {
            const response = await axios.request(config);
            console.log(JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.error('Request Error:', error);
        }
    };

    const showLoadingOverlay = () => {
        document.getElementById('loading-overlay').style.display = 'flex';
    };

    const hideLoadingOverlay = () => {
        document.getElementById('loading-overlay').style.display = 'none';
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(materiais.map(material => material.codigo));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (codigo) => {
        if (selectedItems.includes(codigo)) {
            setSelectedItems(selectedItems.filter(item => item !== codigo));
        } else {
            setSelectedItems([...selectedItems, codigo]);
        }
    };

    const handleApprove = () => {
        const updatedMateriais = materiais.map((material) => {
            if (selectedItems.includes(material.codigo)) {
                if (material.status === 'Reprovado') {
                    setTotal(prevTotal => prevTotal + parseFloat(material.total));
                }
                return { ...material, status: 'Aprovado', id_status: 2, motivo_reprova: null };
            }
            return material;
        });
        setMateriais(updatedMateriais);
        setSelectedItems([]);
    };

    const handleReject = () => {
        const motivo = prompt("Digite o motivo da reprovação:");
        if (motivo) {
            const updatedMateriais = materiais.map((material) => {
                if (selectedItems.includes(material.codigo)) {
                    setTotal(prevTotal => prevTotal - parseFloat(material.total));
                    return { ...material, status: 'Reprovado', id_status: 3, motivo_reprova: motivo };
                }
                return material;
            });
            setMateriais(updatedMateriais);
            setSelectedItems([]);
        }
    };

    const handleQuantidadeChange = (codigo, novaQuantidade) => {
        const quantidadeValida = isNaN(parseFloat(novaQuantidade)) || novaQuantidade === '' || parseFloat(novaQuantidade) < 0
            ? 0
            : parseFloat(novaQuantidade);

        const updatedMateriais = materiais.map(material => {
            if (material.codigo === codigo) {
                const novoTotal = parseFloat(material.preco) * quantidadeValida;
                return {
                    ...material,
                    qtd: quantidadeValida,
                    total: novoTotal.toFixed(2)
                };
            }
            return material;
        });
        setMateriais(updatedMateriais);
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        setShowCloseBtn(false);
    };

    const handleSalvarAprovMat = async () => {
        const aprovacoes_insert = materiais.map(material => ({
            referencia_id: selectedTicket.id,
            codigo: material.codigo,
            grupo: material.grupo,
            material: material.material,
            qtd: material.qtd,
            preco: material.preco,
            total: material.total,
            status: material.id_status,
            executor: selectedTicket.id_executor,
            nome_executor: user.name,
            motivo_reprova: material.motivo_reprova,
        }));

        const materiais_update = materiais.map(material => ({
            id: material.id,
            qtd: material.qtd,
            status: fase === 10 ? material.id_status : (material.status === "Aprovado" ? 1 : material.id_status),
            motivo_reprova: fase === 10 ? material.motivo_reprova : (material.status !== "Aprovado" ? material.motivo_reprova : null),
            total: material.total,
        }));

        const data = formatDate(new Date(), 2);
        const atividade_insert = {
            referencia_id: selectedTicket.id,
            fase: fase,
            executor: grupo,
            numero_bloco: selectedTicket.numero_bloco,
            inicio: data,
        };

        const atividades_update = atividades.length > 0 ? [{
            id: atividades[atividades.length - 1].id,
            nome_executor: user.name,
            fim: data
        }] : [];

        const requisicao_update = {
            executor: grupo,
            fase: fase,
            total_materiais: total,
        };

        showLoadingOverlay();

        try {
            const wf_po_Config = {
                method: 'patch',
                url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po/${selectedTicket.id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-User-Email': user.email,
                },
                data: JSON.stringify(requisicao_update),
            };
            await sendRequest(wf_po_Config);

            for (const material of materiais_update) {
                const material_Config = {
                    method: 'patch',
                    url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po-material/${material.id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                    data: JSON.stringify(material),
                };
                await sendRequest(material_Config);
            }

            for (const task of atividades_update) {
                const task_Config = {
                    method: 'patch',
                    url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po-task/${task.id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                    data: JSON.stringify(task),
                };
                await sendRequest(task_Config);
            }

            for (const aprovacao of aprovacoes_insert) {
                const aprovacao_Config = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po-aprovacao`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                    data: JSON.stringify(aprovacao),
                };
                await sendRequest(aprovacao_Config);
            }

            const task_insert_Config = {
                method: 'post',
                url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po-task`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-User-Email': user.email,
                },
                data: JSON.stringify(atividade_insert),
            };
            await sendRequest(task_insert_Config);

            hideLoadingOverlay();

            setSuccessMessage("Enviado com sucesso!");
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                window.location.reload();
            }, 3000);
        } catch (error) {
            hideLoadingOverlay();
            console.error("Error saving wf-po:", error);
        }
    };

    const handleSalvarAprovSolic = async () => {
        const dataAtual = formatDate(new Date(), 2);
        const atividade_insert = [{
            referencia_id: selectedTicket.id,
            fase: fase,
            executor: grupo,
            numero_bloco: selectedTicket.numero_bloco,
            inicio: dataAtual,
        }];

        const atividades_update = atividades.length > 0 ? [{
            id: atividades[atividades.length - 1].id,
            nome_executor: user.name,
            fim: dataAtual
        }] : [];

        const requisicao_update = {
            executor: grupo,
            fase: fase,
        };

        showLoadingOverlay();
        try {
            if (isNextIntegraBio) {
                const data = materiais.filter(material => material.id_status === 2);
                const wf_po_Config = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/integracao/bionexo?id=${selectedTicket.id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                    data: JSON.stringify(data),
                };

                const bionexo = await sendRequest(wf_po_Config);

                if (bionexo?.code !== "1") {
                    throw new Error(`Erro na integração com Bionexo: ${bionexo?.retorno || 'Erro desconhecido'}`);
                }

                if (bionexo?.retorno) {
                    requisicao_update.id_bionexo = bionexo.retorno;
                }
            }

            if (isNextIntegraSAP) {
                const data = materiais.filter(material => material.id_status === 2);
                const wf_po_Config = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/integracao/sap`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                    data: JSON.stringify({
                        "unidade": selectedTicket.unidade,
                        "materiais": data,
                    }),
                };

                const sap = await sendRequest(wf_po_Config);

                if (sap?.error) {
                    hideLoadingOverlay();
                    setSuccessMessage(sap.error.join('<br>'));
                    setShowSuccessPopup(true);
                    setShowCloseBtn(true);
                    return;
                }

                hideLoadingOverlay();
                setSuccessMessage(sap?.retorno.join('<br>') ?? sap);
                setShowSuccessPopup(true);

                atividade_insert[0].fim = dataAtual;
                atividade_insert[0].nome_executor = user.name;

                atividade_insert.push({
                    referencia_id: selectedTicket.id,
                    executor: 13,
                    fase: 55,
                    numero_bloco: selectedTicket.numero_bloco,
                    inicio: dataAtual,
                })

                requisicao_update.id_sap = sap?.id ?? null;
                requisicao_update.executor = 13;
                requisicao_update.fase = 55;
            }

            const wf_po_Config = {
                method: 'patch',
                url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po/${selectedTicket.id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-User-Email': user.email,
                },
                data: JSON.stringify(requisicao_update),
            };
            await sendRequest(wf_po_Config);

            for (const task of atividades_update) {
                const task_Config = {
                    method: 'patch',
                    url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po-task/${task.id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                    data: JSON.stringify(task),
                };
                await sendRequest(task_Config);
            }

            for (const task of atividade_insert) {
                const task_insert_Config = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po-task`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                    data: JSON.stringify(task),
                };
                await sendRequest(task_insert_Config);
            }

            hideLoadingOverlay();

            if (isNextIntegraBio) {
                setSuccessMessage(`Cotação inserida na bionexo: ${requisicao_update?.id_bionexo}. Enviado com sucesso!`);
            }
            else if (isNextIntegraSAP) {
                setSuccessMessage(`Enviado com sucesso!`);
            }
            else {
                setSuccessMessage(`Enviado com sucesso!`);
            }

            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                window.location.reload();
            }, 3000);

        } catch (error) {
            hideLoadingOverlay();
            console.error('Erro ao salvar requisição:', error);
            setSuccessMessage(error.message || 'Erro ao salvar requisição.');
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 5000);
        }
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
                            <p><strong>#:</strong> {selectedTicket.id}</p>
                            {selectedTicket.id_bionexo && (<p><strong>#Bio:</strong> {selectedTicket.id_bionexo}</p>)}
                            {selectedTicket.id_sap && (<p><strong>#SAP:</strong> {selectedTicket.id_sap}</p>)}
                            <p><strong>Abertura:</strong> {formatDate(selectedTicket.dt_abertura, 1, true)}</p>
                            <p><strong>Fase:</strong> {selectedTicket.fase}</p>
                            <p><strong>Responsável:</strong> {selectedTicket.executor}</p>
                        </div>

                        <div className="form-row">
                            <div className="campo">
                                <label htmlFor="input-email">Email:</label>
                                <input id="input-email" type="email" value={selectedTicket.email??''} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="input-nome">Nome:</label>
                                <input id="input-nome" type="text" value={selectedTicket.nome??''} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="campo">
                                <label htmlFor="input-hub">Hub:</label>
                                <input id="input-hub" type="text" value={selectedTicket.hub??''} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="input-unidade">Unidade:</label>
                                <input id="input-unidade" type="text" value={selectedTicket.unidade??''} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="input-centro-custo">Centro de Custo:</label>
                                <input id="input-centro-custo" type="text" value={selectedTicket.centro_custo??''} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="campo">
                                <label htmlFor="input-area">Área:</label>
                                <input id="input-area" type="text" value={selectedTicket.area??''} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="input-tipo-solicitacao">Tipo de Solicitação:</label>
                                <input id="input-tipo-solicitacao" type="text" value={selectedTicket.tipo_solicitacao??''} readOnly />
                            </div>
                            {selectedTicket.tipo_solicitacao === "Produto" && (
                                <div className="campo">
                                    <label htmlFor="input-data-remessa">Data Remessa:</label>
                                    <input id="input-data-remessa" type="text" value={formatDate(selectedTicket.dt_remessa, 1, true)??''} readOnly />
                                </div>
                            )}
                            <div className="campo">
                                <label htmlFor="input-bloco">Bloco:</label>
                                <input id="input-bloco" type="text" value={selectedTicket.numero_bloco??''} readOnly />
                            </div>
                        </div>

                        {selectedTicket.tipo_solicitacao === "Serviço" && (
                            <div className="form-row">
                                <div className="campo">
                                    <label htmlFor="input-cod-forn">Código do Fornecedor:</label>
                                    <input id="input-cod-forn" type="text" value={selectedTicket.cod_fornecedor??''} readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-forn">Fornecedor:</label>
                                    <input id="input-forn" type="text" value={selectedTicket.fornecedor??''} readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-inicio-serv">Início do Serviço:</label>
                                    <input id="input-inicio-serv" type="text" value={formatDate(selectedTicket.dt_inicio_serv, 1, true)??''} readOnly />
                                </div>
                                <div className="campo">
                                    <label htmlFor="input-fim-serv">Fim do Serviço:</label>
                                    <input id="input-fim-serv" type="text" value={formatDate(selectedTicket.dt_fim_serv, 1, true)??''} readOnly />
                                </div>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="campo">
                                <label htmlFor="input-descricao">Descrição:</label>
                                <textarea id="input-descricao" rows="2" value={selectedTicket.descricao??''} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="input-observacoes">Observações:</label>
                                <textarea id="input-observacoes" rows="2" value={selectedTicket.observacoes??''} readOnly />
                            </div>
                        </div>

                        {aprovacaoMateriais && (
                            <div className="botoes-acoes">
                                <button onClick={handleApprove} disabled={selectedItems.length === 0}>Aprovar</button>
                                <button onClick={handleReject} disabled={selectedItems.length === 0}>Reprovar</button>
                            </div>
                        )}

                        <table className="tabela-tickets">
                            <thead>
                                <tr>
                                    {aprovacaoMateriais && (
                                        <th>
                                            <input
                                                type="checkbox"
                                                id="checkbox-select"
                                                onChange={handleSelectAll}
                                                checked={selectedItems.length === materiais.length && materiais.length > 0}
                                            />
                                        </th>
                                    )}
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
                                            {aprovacaoMateriais && (
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        id="checkbox-item"
                                                        checked={selectedItems.includes(material.codigo)}
                                                        onChange={() => handleSelectItem(material.codigo)}
                                                    />
                                                </td>
                                            )}
                                            <td>{material.codigo}</td>
                                            <td>{material.material}</td>
                                            {aprovacaoMateriais ? (
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={material.qtd}
                                                        onChange={(e) => handleQuantidadeChange(material.codigo, e.target.value)}
                                                    />
                                                </td>
                                            ) : (
                                                <td>{material.qtd}</td>
                                            )}
                                            <td>{material.preco}</td>
                                            <td>{material.total}</td>
                                            <td>{material.status}</td>
                                            <td>{material.motivo_reprova ? material.motivo_reprova : 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={aprovacaoMateriais ? "8" : "7"}>Nenhum material encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="total">
                            <p id="total-info">Total: R${total.toFixed(2)}</p>
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
                                                            <textarea rows={2} type="text" value={retornoBio.comentario ?? ''} readOnly />
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
                                                        <td>{aprovacao.motivo_reprova ? aprovacao.motivo_reprova : 'N/A'}</td>
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
                                                <th>Grupo Executor</th>
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
                                                        <td>{atividade.nome_executor}</td>
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

                        {fase === 15 && fase !== selectedTicket.id_fase && (
                            <div className="footer-note" id="footer-note">
                                <p>ATENÇÃO! Você é o último responsável pela aprovação dos materiais, ao enviar, será criado uma cotação no bionexo!</p>
                            </div>
                        )}

                        {fase === 45 && fase !== selectedTicket.id_fase && (
                            <div className="footer-note" id="footer-note">
                                <p>ATENÇÃO! Você é o último responsável pela aprovação da solicitação, ao enviar, será criado uma PO no SAP!</p>
                            </div>
                        )}

                        <div className="modal-footer" id="modal-footer">
                            <button className="btn-voltar" id="btn-voltar" onClick={closeTicketModal}>Fechar</button>
                            {aprovacaoMateriais && (
                                <button
                                    className="btn-voltar"
                                    onClick={handleSalvarAprovMat}
                                    disabled={materiais.some(material => material.status === "Pendente")}
                                >
                                    Enviar
                                </button>
                            )}
                            {aprovacaoSolicitacao && (
                                <button
                                    className="btn-voltar"
                                    onClick={handleSalvarAprovSolic}
                                >
                                    Enviar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {showSuccessPopup && (
                    <div className="popup-sucesso">
                        <p dangerouslySetInnerHTML={{ __html: successMessage }}></p>
                        {showCloseBtn && (<button onClick={handleClosePopup}>Ok</button>)}
                    </div>
                )}
            </div>
        )
    );
};

export default ModalTicket;