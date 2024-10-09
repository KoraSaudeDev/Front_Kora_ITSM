import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaShoppingCart } from 'react-icons/fa';
import '../../../styles/WF_PO/NovaRequisicao.css';
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

    const [descricao, setDescricao] = useState('');
    const [observacao, setObservacao] = useState('');

    const [codigoMaterial, setCodigoMaterial] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [inputMaterial, setInputMaterial] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');

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
    }, []);

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
        // Função para manipular o envio do formulário
    };

    const menuRequisicao = [
        { label: 'Nova Requisição', path: '/suporte/nova-requisicao-wf' },
        { label: 'Minhas Solicitações', path: '/suporte/minhas-solicitacoes' },
        { label: 'Acompanhar', path: '/suporte/acompanhar' },
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
                    {/* Novo Formulário */}
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

                        
                    </form>

                    
                    <div className="cadastro-material">
                        <div className="cadastro-material-header">
                            <h3 id='titulo-cadastro'>Cadastrar Material</h3>
                            <div className="cart-container">
                                <FaShoppingCart className="cart-icon" onClick={toggleCartModal} />
                                {items.length > 0 && (
                                    <span className="cart-notification">{items.length}</span>
                                )}
                            </div>
                        </div>

                        <div className="campo" style={{ width: '100%' }}>
                            <label htmlFor="codigoMaterial">Código do Material</label>
                            <input
                                type="text"
                                id="codigoMaterial"
                                value={codigoMaterial}
                                onChange={(e) => setCodigoMaterial(e.target.value)}
                            />
                        </div>
                        <div className="campo" style={{ width: '100%' }}>
                            <label htmlFor="material">Material</label>
                            <Select
                                id="material"
                                value={selectedMaterial}
                                onChange={setSelectedMaterial}
                                options={options.material}
                                placeholder="Digite para pesquisar"
                                onInputChange={handleMaterialInputChange}
                                isClearable
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
                            <label htmlFor="preco">Preço</label>
                            <input
                                type="number"
                                id="preco"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                            />
                        </div>
                        <div className="campo" style={{ width: '100%' }}>
                            <label htmlFor="unidadeMedida">Unidade de Medida</label>
                            <input
                                type="text"
                                id="unidadeMedida"
                                value={unidadeMedida}
                                readOnly
                            />
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
                </div>
            </div>
        </div>
    );
};

export default NovoTicketCompras;
