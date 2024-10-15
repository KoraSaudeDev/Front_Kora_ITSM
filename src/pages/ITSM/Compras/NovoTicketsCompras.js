import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaShoppingCart } from 'react-icons/fa';
import '../../../styles/ITSM/Compras/NovoTicketCompras.css';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import SidebarInterna from '../../../components/SidebarInterna';

const NovoTicketCompras = () => {
    const { user, token } = useAuth();
    const [options, setOptions] = useState({
        hub: [],
        unidade: [],
        centroCusto: [],
        tipoEquipamento: [
            { value: 'Linha Móvel', label: 'Linha Móvel (Linha Existente)' },
            { value: 'CHIP', label: 'CHIP (Nova Linha)' },
            { value: 'Estação de Trabalho', label: 'Estação de Trabalho' },
            { value: 'Software', label: 'Software' },
            { value: 'Link de dados', label: 'Link de dados' },
            { value: 'Regularização de Compras', label: 'Regularização de Compras' },
            { value: 'Microsoft', label: 'Microsoft' },
            { value: 'Outros Equipamentos', label: 'Outros Equipamentos' }
        ],
    });

    const [selectedHub, setSelectedHub] = useState(null);
    const [selectedUnidade, setSelectedUnidade] = useState(null);
    const [selectedCentroCusto, setSelectedCentroCusto] = useState(null);
    const [selectedTipoEquipamento, setSelectedTipoEquipamento] = useState(null);
    const [gestorResponsavel, setGestorResponsavel] = useState(null);
    const [anexo, setAnexo] = useState(null); 

    const [descricao, setDescricao] = useState('');
    const [observacao, setObservacao] = useState('');

    const [codigoMaterial, setCodigoMaterial] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [inputMaterial, setInputMaterial] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');

    const [linhaMovel, setLinhaMovel] = useState({ numeroLinha: '', nomeUsuario: '', numeroMatricula: '', descricaoSolicitacao: '' });
    const [chip, setChip] = useState({ quantidade: '', nomeUsuarios: '', numeroMatriculas: '' });
    const [microsoft, setMicrosoft] = useState({ nomeColaborador: '', matriculaColaborador: '', emailColaborador: '', ferramenta: null, autorizacaoDiretor: null });

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/wf-po/form/hub`, { headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email } })
            .then(response => {
                setOptions(prevOptions => ({
                    ...prevOptions,
                    hub: response.data.map(hub => ({ value: hub, label: hub }))
                }));
            })
            .catch(error => console.error('Error fetching hubs:', error));
    }, [token, user.email]);

    useEffect(() => {
        if (selectedHub) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/wf-po/form/unidade?hub=${selectedHub.value}`, { headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email } })
                .then(response => {
                    setOptions(prevOptions => ({
                        ...prevOptions,
                        unidade: response.data.map(item => ({
                            value: item.cod_sap,
                            label: item.unidade
                        }))
                    }));
                    setSelectedUnidade(null);
                    setSelectedCentroCusto(null);
                })
                .catch(error => console.error('Error fetching unidades:', error));
        } else {
            setOptions(prevOptions => ({
                ...prevOptions,
                unidade: [],
                centroCusto: [],
            }));
            setSelectedUnidade(null);
            setSelectedCentroCusto(null);
        }
    }, [selectedHub]);

    useEffect(() => {
        if (selectedUnidade) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/sap/centro-custo?empresa=${selectedUnidade.value}`, { headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email } })
                .then(response => {
                    setOptions(prevOptions => ({
                        ...prevOptions,
                        centroCusto: response.data.map(item => ({ value: item.centro_custo, label: item.centro_custo }))
                    }));
                    setSelectedCentroCusto(null);
                })
                .catch(error => console.error('Error fetching centro de custo:', error));
        } else {
            setOptions(prevOptions => ({
                ...prevOptions,
                centroCusto: [],
            }));
            setSelectedCentroCusto(null);
        }
    }, [selectedUnidade]);

    const handleSendForm = () => {
       
    };

    const menuRequisicao = [
        { label: 'Nova Requisição', path: '/suporte/novo-ticket-compras' },
        { label: 'Minhas Solicitações', path: '/suporte/nova-solicitacao-compras' },
        { label: 'Validação', path: '/suporte/aprovacoes-compras' },
    ];

    const fetchMaterials = (inputValue, type) => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/material/search`, {
            params: { query: inputValue, type: type },
            headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email }
        })
        .then(response => {
            setOptions(prevOptions => ({
                ...prevOptions,
                material: response.data.map(material => ({ value: material.id, label: material.name }))
            }));
        })
        .catch(error => console.error('Error fetching materials:', error));
    };

    const handleMaterialInputChange = (inputValue) => {
        setInputMaterial(inputValue);
        fetchMaterials(inputValue, 'nome');
        if (!selectedMaterial) {
            setCodigoMaterial('');
            setPreco('');
            setUnidadeMedida('');
            setSelectedMaterial(null);
        }
    };

    const handleAddItem = () => {
        const materialPreco = parseFloat(preco) || 0;
        const quantidadeNumerica = parseFloat(quantidade) || 1;
        const newItem = {
            codigo: codigoMaterial || '0000000' + (items.length + 1),
            material: selectedMaterial?.label || '',
            quantidade: quantidadeNumerica,
            preco: materialPreco.toFixed(2),
            total: (quantidadeNumerica * materialPreco).toFixed(2),
            unidadeMedida: unidadeMedida,
        };
        setTotal((prevTotal) => parseFloat(prevTotal) + quantidadeNumerica * materialPreco);
        setItems([...items, newItem]);
        setCodigoMaterial('');
        setSelectedMaterial(null);
        setQuantidade('');
        setPreco('');
        setUnidadeMedida('');
    };

    const toggleCartModal = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleRemoveItem = (index) => {
        const itemToRemove = items[index];
        setTotal((prevTotal) => parseFloat(prevTotal) - parseFloat(itemToRemove.total));
        setItems(items.filter((_, i) => i !== index));
        setEditingIndex(null);
        setCodigoMaterial('');
        setSelectedMaterial(null);
        setQuantidade('');
        setPreco('');
        setUnidadeMedida('');
    };

    const handleEditItem = (index) => {
        const itemToEdit = items[index];
        setCodigoMaterial(itemToEdit.codigo);
        setSelectedMaterial({ label: itemToEdit.material, value: itemToEdit.codigo });
        setQuantidade(itemToEdit.quantidade);
        setPreco(itemToEdit.preco);
        setUnidadeMedida(itemToEdit.unidadeMedida);
        setEditingIndex(index);
    };

    const handleSaveEdit = () => {
        const materialPreco = parseFloat(preco) || 0;
        const quantidadeNumerica = parseFloat(quantidade) || 1;
        const updatedItem = {
            codigo: codigoMaterial,
            material: selectedMaterial?.label || '',
            quantidade: quantidadeNumerica,
            preco: materialPreco.toFixed(2),
            total: (quantidadeNumerica * materialPreco).toFixed(2),
            unidadeMedida: unidadeMedida,
        };
        const updatedItems = [...items];
        updatedItems[editingIndex] = updatedItem;
        const totalDifference = (quantidadeNumerica * materialPreco) - parseFloat(items[editingIndex].total);
        setTotal((prevTotal) => prevTotal + totalDifference);
        setItems(updatedItems);
        setEditingIndex(null);
        setCodigoMaterial('');
        setSelectedMaterial(null);
        setQuantidade('');
        setPreco('');
        setUnidadeMedida('');
    };

    const renderAdditionalFields = () => {
        if (selectedTipoEquipamento?.value === 'Linha Móvel') {
            return (
                <>
                    <div className="campo">
                        <label>Nº da linha *</label>
                        <input type="text" value={linhaMovel.numeroLinha} onChange={(e) => setLinhaMovel({ ...linhaMovel, numeroLinha: e.target.value })} />
                    </div>
                    <div className="campo">
                        <label>Nome do usuário *</label>
                        <input type="text" value={linhaMovel.nomeUsuario} onChange={(e) => setLinhaMovel({ ...linhaMovel, nomeUsuario: e.target.value })} />
                    </div>
                    <div className="campo">
                        <label>Nº da matrícula *</label>
                        <input type="text" value={linhaMovel.numeroMatricula} onChange={(e) => setLinhaMovel({ ...linhaMovel, numeroMatricula: e.target.value })} />
                    </div>
                    <div className="campo">
                        <label>Descrição da solicitação *</label>
                        <textarea value={linhaMovel.descricaoSolicitacao} onChange={(e) => setLinhaMovel({ ...linhaMovel, descricaoSolicitacao: e.target.value })}></textarea>
                    </div>
                </>
            );
        } else if (selectedTipoEquipamento?.value === 'CHIP') {
            return (
                <>
                    <div className="campo">
                        <label>Quantidade *</label>
                        <input type="number" value={chip.quantidade} onChange={(e) => setChip({ ...chip, quantidade: e.target.value })} />
                    </div>
                    <div className="campo">
                        <label>Nome do usuário(s) *</label>
                        <textarea value={chip.nomeUsuarios} onChange={(e) => setChip({ ...chip, nomeUsuarios: e.target.value })}></textarea>
                    </div>
                    <div className="campo">
                        <label>Nº da matrícula(s) *</label>
                        <textarea value={chip.numeroMatriculas} onChange={(e) => setChip({ ...chip, numeroMatriculas: e.target.value })}></textarea>
                    </div>
                </>
            );
        } else if (selectedTipoEquipamento?.value === 'Microsoft') {
            return (
                <>
                    <div className="campo">
                        <label>Nome do Colaborador *</label>
                        <input type="text" value={microsoft.nomeColaborador} onChange={(e) => setMicrosoft({ ...microsoft, nomeColaborador: e.target.value })} />
                    </div>
                    <div className="campo">
                        <label>Matrícula do Colaborador *</label>
                        <input type="text" value={microsoft.matriculaColaborador} onChange={(e) => setMicrosoft({ ...microsoft, matriculaColaborador: e.target.value })} />
                    </div>
                    <div className="campo">
                        <label>E-mail do Colaborador *</label>
                        <input type="email" value={microsoft.emailColaborador} onChange={(e) => setMicrosoft({ ...microsoft, emailColaborador: e.target.value })} />
                    </div>
                    <div className="campo">
                        <label>Ferramentas *</label>
                        <Select
                            value={microsoft.ferramenta}
                            onChange={(selectedOption) => setMicrosoft({ ...microsoft, ferramenta: selectedOption })}
                            options={[
                                { value: 'Microsoft Office (Excel)', label: 'Microsoft Office (Excel)' },
                                { value: 'Microsoft Power BI Free', label: 'Microsoft Power BI Free' },
                                { value: 'Microsoft Project', label: 'Microsoft Project' },
                                { value: 'Microsoft Planner', label: 'Microsoft Planner' },
                                { value: 'Microsoft Power BI Pro', label: 'Microsoft Power BI Pro' },
                                { value: 'Microsoft Visio', label: 'Microsoft Visio' }
                            ]}
                            isClearable
                            placeholder="Selecione a ferramenta"
                        />
                    </div>
                    <div className="campo">
                        <label>Autorização do Diretor (anexo) *</label>
                        <input type="file" onChange={(e) => setMicrosoft({ ...microsoft, autorizacaoDiretor: e.target.files[0] })} />
                    </div>
                </>
            );
        }
        return null;
    };

    const handleSendTicket = async () => {
        // Função para enviar o ticket
    };

    const isAddButtonDisabled = !selectedMaterial || !quantidade || !unidadeMedida;

    return (
        <div className="layout-geral">
            <div id="loading-overlay" className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
            <SidebarInterna menuItems={menuRequisicao} />
            <div className="container">
                <div className="form-wrapper">
                    <form className="formulario" onSubmit={handleSendForm}>
                        <div className="row">
                            <div className="campo">
                                <label htmlFor="abertoEm">Aberto Em *</label>
                                <input type="datetime-local" id="abertoEm" value={new Date().toISOString().slice(0, 16)} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="relator">Relator *</label>
                                <input type="text" id="relator" value={user?.name || ''} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="email">E-mail *</label>
                                <input type="email" id="email" value={user?.email || ''} readOnly />
                            </div>
                        </div>

                        <div className="row">
                            <div className="campo">
                                <label htmlFor="setorRequerente">Setor Requerente *</label>
                                <Select
                                    value={selectedUnidade}
                                    onChange={setSelectedUnidade}
                                    options={options.unidade}
                                    isClearable
                                    placeholder="Selecione o Setor Requerente"
                                />
                            </div>
                            <div className="campo">
                                <label htmlFor="hub">HUB *</label>
                                <Select
                                    value={selectedHub}
                                    onChange={setSelectedHub}
                                    options={options.hub}
                                    isClearable
                                    placeholder="Selecione o HUB"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="campo">
                                <label htmlFor="unidadeNegocio">Unidade de Negócio *</label>
                                <Select
                                    value={selectedUnidade}
                                    onChange={setSelectedUnidade}
                                    options={options.unidade}
                                    isClearable
                                    placeholder="Selecione a Unidade de Negócio"
                                />
                            </div>
                            <div className="campo">
                                <label htmlFor="centroCusto">Centro de Custo *</label>
                                <Select
                                    value={selectedCentroCusto}
                                    onChange={setSelectedCentroCusto}
                                    options={options.centroCusto}
                                    isClearable
                                    placeholder="Selecione o Centro de Custo"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="campo">
                                <label htmlFor="tipoEquipamento">Tipo de Equipamento *</label>
                                <Select
                                    value={selectedTipoEquipamento}
                                    onChange={setSelectedTipoEquipamento}
                                    options={options.tipoEquipamento}
                                    isClearable
                                    placeholder="Selecione o Tipo de Equipamento"
                                />
                            </div>
                        </div>

                        {/* Renderização Condicional dos Inputs com Base no Tipo de Equipamento Selecionado */}
                        {renderAdditionalFields()}

                        <div className="row">
                            <div className="campo">
                                <label htmlFor="gestorResponsavel">Gestor(a) Responsável *</label>
                                <Select
                                    value={gestorResponsavel}
                                    onChange={setGestorResponsavel}
                                    options={[]} // Aqui você preencherá com os gestores disponíveis
                                    isClearable
                                    placeholder="Selecione o Gestor(a) Responsável"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="campo">
                                <label htmlFor="descricao">Descrição *</label>
                                <textarea
                                    id="descricao"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Descreva os detalhes da requisição"
                                />
                            </div>
                        </div>

                        {/* Parte de Cadastrar Material */}
                        <div className="cadastro-material">
                            <div className="cadastro-material-header">
                                <h3 id="titulo-cadastro">Cadastrar Material</h3>
                                <div className="cart-container">
                                    <FaShoppingCart className="cart-icon" onClick={toggleCartModal} />
                                    {items.length > 0 && (
                                        <span className="cart-notification">{items.length}</span>
                                    )}
                                </div>
                            </div>

                            <div className="campo" style={{ width: '100%' }}>
                                <label htmlFor="equipamento">Equipamento *</label>
                                <Select
                                    id="equipamento"
                                    value={selectedMaterial}
                                    onChange={setSelectedMaterial}
                                    options={options.material}
                                    placeholder="Selecione o Equipamento"
                                    onInputChange={handleMaterialInputChange}
                                    isClearable
                                />
                            </div>
                            <div className="campo" style={{ width: '100%' }}>
                                <label htmlFor="valorEstimado">Valor Estimado *</label>
                                <input
                                    type="number"
                                    id="valorEstimado"
                                    value={preco}
                                    onChange={(e) => setPreco(e.target.value)}
                                />
                            </div>
                            <div className="campo" style={{ width: '100%' }}>
                                <label htmlFor="quantidade">Quantidade</label>
                                <input
                                    type="number"
                                    id="quantidade"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                />
                            </div>
                            <div className="campo" style={{ width: '100%' }}>
                                <label htmlFor="justificativa">Justificativa</label>
                                <textarea
                                    id="justificativa"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Insira a justificativa"
                                />
                            </div>
                            <div className="campo" style={{ width: '100%' }}>
                                <label htmlFor="linkProduto">Link do Produto Desejado</label>
                                <input
                                    type="text"
                                    id="linkProduto"
                                    value={inputMaterial}
                                    onChange={(e) => setInputMaterial(e.target.value)}
                                />
                            </div>
                            <div className="campo" style={{ width: '100%' }}>
                                <label htmlFor="anexo">Anexo (se houver)</label>
                                <input type="file" onChange={(e) => setAnexo(e.target.files[0])} />
                            </div>

                            <button
                                type="button"
                                onClick={editingIndex === null ? handleAddItem : handleSaveEdit}
                                className="botao-adicionar"
                                disabled={isAddButtonDisabled}
                            >
                                {editingIndex === null ? 'Adicionar' : 'Salvar'}
                            </button>

                            <div className="campo botoes">
                                <button type="submit" className="botao-enviar">
                                    Enviar
                                </button>
                            </div>
                        </div>

                        {/* Modal do Carrinho */}
                        {isCartOpen && (
                            <div className="modal-overlay">
                                <div className="modal">
                                    <div className="modal-header">
                                        <h3>Itens do Carrinho</h3>
                                        <span className="close" onClick={toggleCartModal}>&times;</span>
                                    </div>
                                    <div className="tabela-itens">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Item</th>
                                                    <th>Quantidade</th>
                                                    <th>Preço</th>
                                                    <th>Unidade</th>
                                                    <th>Total</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7">Nenhum registro encontrado</td>
                                                    </tr>
                                                ) : (
                                                    items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.codigo}</td>
                                                            <td>{item.material}</td>
                                                            <td>{item.quantidade}</td>
                                                            <td>{item.preco}</td>
                                                            <td>{item.unidadeMedida}</td>
                                                            <td>{item.total}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditItem(index)}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveItem(index)}
                                                                >
                                                                    Remover
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="total-info">
                                        <p>Total: R$ {total.toFixed(2)}</p>
                                    </div>
                                    <div className="campo botoes">
                                        <button type="button" onClick={handleSendTicket}>
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NovoTicketCompras;
