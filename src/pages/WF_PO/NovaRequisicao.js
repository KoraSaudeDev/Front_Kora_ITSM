import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { debounce } from 'lodash';
import { FaShoppingCart } from 'react-icons/fa';
import '../../styles/WF_PO/NovaRequisicao.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const NovaRequisicao = () => {
    const { user } = useAuth();
    const [options, setOptions] = useState({
        hub: [],
        unidade: [],
        centroCusto: [],
        areaNegocio: [],
        tipoSolicitacao: [
            { value: 'Produto', label: 'Produto' },
            { value: 'Serviço', label: 'Serviço' },
        ],
        motivoSolic: [
            { value: 'Requisição Semanal', label: 'Requisição Semanal' },
            { value: 'Requisição Mensal', label: 'Requisição Mensal' },
            { value: 'Requisição Urgente', label: 'Requisição Urgente' },
            { value: 'Outro', label: 'Outro' },
        ],
        material: [],
        grupoMaterial: [],
        fornecedores: []
    });

    const [selectedHub, setSelectedHub] = useState(null);
    const [selectedUnidade, setSelectedUnidade] = useState(null);
    const [selectedCentroCusto, setSelectedCentroCusto] = useState(null);
    const [selectedGrupoMaterial, setSelectedGrupoMaterial] = useState(null);
    const [selectedAreaNegocio, setSelectedAreaNegocio] = useState(null);
    const [selectedTipoSolicitacao, setSelectedTipoSolicitacao] = useState(null);
    const [selectedMotivoSolic, setSelectedMotivoSolic] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [observacao, setObservacao] = useState('');

    const [codigoMaterial, setCodigoMaterial] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [inputMaterial, setInputMaterial] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');

    const [dataRemessa, setDataRemessa] = useState('');
    const [codigoFornecedor, setCodigoFornecedor] = useState('');
    const [fornecedor, setFornecedor] = useState(null);
    const [inicioServico, setInicioServico] = useState('');
    const [fimServico, setFimServico] = useState('');

    const [items, setItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/wf-requisicao/form/hub`)
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
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/wf-requisicao/form/unidade?hub=${selectedHub.value}`)
                .then(response => {
                    setOptions(prevOptions => ({
                        ...prevOptions,
                        unidade: response.data.map(item => ({ value: item.cod_sap, label: item.unidade }))
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
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/sap/centro-custo?empresa=${selectedUnidade.value}`)
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

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/sap/grupo-mercadoria`)
            .then(response => {
                setOptions(prevOptions => ({
                    ...prevOptions,
                    grupoMaterial: response.data.map(item => ({ value: item, label: item }))
                }));
            })
            .catch(error => console.error('Error fetching grupo de mercadoria:', error));
    }, []);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/areas-negocio`)
            .then(response => {
                setOptions(prevOptions => ({
                    ...prevOptions,
                    areaNegocio: response.data.map(item => ({ value: item, label: item }))
                }));
            })
            .catch(error => console.error('Error fetching areas de negocio:', error));
    }, []);

    const fetchMaterials = debounce((inputValue, pesquisa) => {

        if (!inputValue || !selectedTipoSolicitacao?.value || !selectedGrupoMaterial?.value) return;

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/sap/material`, {
            params: {
                material: inputValue,
                tipo: selectedTipoSolicitacao?.value,
                grupo: selectedGrupoMaterial?.value,
                pesquisa
            },
        })
            .then(response => {
                if(pesquisa === 'nome'){
                    setOptions(prevOptions => ({
                        ...prevOptions,
                        material: response.data.map(item => ({
                            value: item.material,
                            label: item.material,
                            codigo: item.codigo,
                            grupo: item.grupo,
                            unidadeMedida: item.unidadeMedida,
                            preco: item.preco,
                        }))
                    }));
                }
                else if(pesquisa === 'cod'){
                    if (response.data.length < 1) return;
                    setSelectedMaterial({
                        value: response.data[0].material,
                            label: response.data[0].material,
                            codigo: response.data[0].codigo,
                            grupo: response.data[0].grupo,
                            unidadeMedida: response.data[0].unidadeMedida,
                            preco: response.data[0].preco,
                    });
                    setPreco(response.data[0].preco);
                    setUnidadeMedida(response.data[0].unidadeMedida);
                }
                
            })
            .catch(error => {
                console.error('Erro ao buscar materiais:', error);
            });
    }, 10);

    const fetchFornecedores = debounce((inputValue) => {

        if (!inputValue) return;

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/sap/fornecedor`, {
            params: {
                fornecedor: inputValue,
            },
        })
            .then(response => {
                setOptions(prevOptions => ({
                    ...prevOptions,
                    fornecedores: response.data.map(item => ({
                        value: item.fornecedor,
                        label: item.fornecedor,
                        codigo: item.codigo,
                    }))
                }));
            })
            .catch(error => {
                console.error('Erro ao buscar fornecedores:', error);
            });
    }, 10);

    useEffect(() => {
        if (selectedMaterial) {
            setPreco(selectedMaterial.preco);
            setCodigoMaterial(selectedMaterial.codigo);
            setUnidadeMedida(selectedMaterial.unidadeMedida);
        }
        else {
            setPreco('');
            setUnidadeMedida('');
        }
    }, [selectedMaterial]);

    useEffect(() => {
        if (fornecedor) {
            setCodigoFornecedor(fornecedor.codigo);
        }
        else {
            setCodigoFornecedor('');
        }
    }, [fornecedor]);

    useEffect(() => {
        setItems([]);
        setEditingIndex(null);
        setCodigoMaterial('');
        setSelectedMaterial(null);
        setQuantidade('');
        setPreco('');
        setUnidadeMedida('');
    }, [selectedTipoSolicitacao, selectedGrupoMaterial]);

    const handleCodigoChange = (event) => {
        const value = event.target.value;
        setCodigoMaterial(value);
        fetchMaterials(value, 'cod');
        setSelectedMaterial(null);
        setOptions(prevOptions => ({
            ...prevOptions,
            material: []
        }));
        setPreco('');
        setUnidadeMedida('');
    };

    const handleMaterialInputChange = (inputValue) => {
        setInputMaterial(inputValue);
        fetchMaterials(inputValue, 'nome');
        if(!selectedMaterial){
            setCodigoMaterial('');
            setPreco('');
            setUnidadeMedida('');
            setSelectedMaterial(null);
        }
    };

    const handleAddItem = () => {
        const materialPreco = selectedMaterial ? parseFloat(selectedMaterial.preco) : 0;
        const quantidadeNumerica = parseFloat(quantidade) || 1;
        const newItem = {
            codigo: codigoMaterial || '0000000' + (items.length + 1),
            material: selectedMaterial?.label || '',
            quantidade: quantidadeNumerica,
            preco: materialPreco.toFixed(2),
            total: (quantidadeNumerica * materialPreco).toFixed(2),
            unidadeMedida: unidadeMedida,
        };
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

    const handleEditItem = (index) => {
        const itemToEdit = items[index];
        setEditingIndex(index);
        setCodigoMaterial(itemToEdit.codigo);
        setSelectedMaterial(options.material.find(material => material.label === itemToEdit.material));
        setQuantidade(itemToEdit.quantidade);
        setPreco(itemToEdit.preco);
        setUnidadeMedida(itemToEdit.unidadeMedida);
    };

    const handleSaveEdit = () => {
        const updatedItems = [...items];
        const materialPreco = selectedMaterial ? parseFloat(selectedMaterial.preco) : 0;
        const quantidadeNumerica = parseFloat(quantidade) || 1;

        updatedItems[editingIndex] = {
            codigo: codigoMaterial,
            material: selectedMaterial?.label || '',
            quantidade: quantidadeNumerica,
            preco: materialPreco.toFixed(2),
            total: (quantidadeNumerica * materialPreco).toFixed(2),
            unidadeMedida: unidadeMedida,
        };

        setItems(updatedItems);
        setEditingIndex(null);
        setCodigoMaterial('');
        setSelectedMaterial(null);
        setQuantidade('');
        setPreco('');
        setUnidadeMedida('');
    };

    const handleSendTicket = () => {
        setShowSuccessPopup(true);
        setTimeout(() => {
            setShowSuccessPopup(false);
        }, 3000);
        setItems([]);
        toggleCartModal();
    };

    const isAddButtonDisabled = !selectedMaterial || !quantidade || !unidadeMedida;

    return (
        <div className="container">
            <div className="form-wrapper">

                <form className="formulario">
                    <div className="row">
                        <div className="campo">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value={user?.email || ''} readOnly />
                        </div>
                        <div className="campo">
                            <label htmlFor="nome">Nome</label>
                            <input type="text" id="nome" value={user?.name || 'Solicitante'} readOnly />
                        </div>
                    </div>

                    <div className="row">
                        <div className="campo">
                            <label htmlFor="hub">Hub</label>
                            <Select
                                value={selectedHub}
                                onChange={setSelectedHub}
                                options={options.hub}
                                isClearable
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="unidade">Unidade</label>
                            <Select
                                value={selectedUnidade}
                                onChange={setSelectedUnidade}
                                options={options.unidade}
                                isClearable
                                isDisabled={!selectedHub}
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="centroCusto">Centro de Custo</label>
                            <Select
                                value={selectedCentroCusto}
                                onChange={setSelectedCentroCusto}
                                options={options.centroCusto}
                                isClearable
                                isDisabled={!selectedUnidade}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="campo">
                            <label htmlFor="areaNegocio">Área de Negócio</label>
                            <Select
                                value={selectedAreaNegocio}
                                onChange={setSelectedAreaNegocio}
                                options={options.areaNegocio}
                                isClearable
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="tipoSolicitacao">Tipo de Solicitação</label>
                            <Select
                                value={selectedTipoSolicitacao}
                                onChange={setSelectedTipoSolicitacao}
                                options={options.tipoSolicitacao}
                                isClearable
                            />
                        </div>
                    </div>

                    {selectedTipoSolicitacao?.value === 'Produto' && (
                        <div className="row">
                            <div className="campo">
                                <label htmlFor="dataRemessa">Data de Remessa</label>
                                <input
                                    type="date"
                                    id="dataRemessa"
                                    value={dataRemessa}
                                    onChange={(e) => setDataRemessa(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {selectedTipoSolicitacao?.value === 'Serviço' && (
                        <div className="row">
                            <div className="campo">
                                <label htmlFor="codigoFornecedor">Código do Fornecedor</label>
                                <input
                                    type="text"
                                    id="codigoFornecedor"
                                    value={codigoFornecedor}
                                    onChange={(e) => setCodigoFornecedor(e.target.value)}
                                    disabled
                                />
                            </div>
                            <div className="campo">
                                <label htmlFor="fornecedor">Fornecedor</label>
                                <Select
                                    id="fornecedor"
                                    value={fornecedor}
                                    onChange={setFornecedor}
                                    options={options.fornecedores}
                                    placeholder="Digite para pesquisar"
                                    className="select-field"
                                    onInputChange={(inputValue) => fetchFornecedores(inputValue)}
                                    isClearable
                                />
                            </div>
                            <div className="campo">
                                <label htmlFor="inicioServico">Início do Serviço</label>
                                <input
                                    type="date"
                                    id="inicioServico"
                                    value={inicioServico}
                                    onChange={(e) => setInicioServico(e.target.value)}
                                />
                            </div>
                            <div className="campo">
                                <label htmlFor="fimServico">Fim do Serviço</label>
                                <input
                                    type="date"
                                    id="fimServico"
                                    value={fimServico}
                                    onChange={(e) => setFimServico(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="row">
                        <div className="campo">
                            <label htmlFor="grupoMaterial">Grupo de Material</label>
                            <Select
                                value={selectedGrupoMaterial}
                                onChange={setSelectedGrupoMaterial}
                                options={options.grupoMaterial}
                                isClearable
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="motivoSolic">Motivo da Solicitação</label>
                            <Select
                                value={selectedMotivoSolic}
                                onChange={setSelectedMotivoSolic}
                                options={options.motivoSolic}
                                isClearable
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="campo">
                            <label htmlFor="descricao">Descrição</label>
                            <textarea
                                id="descricao"
                                rows="3"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="observacao">Observações</label>
                            <textarea
                                id="observacao"
                                rows="3"
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                            />
                        </div>
                    </div>

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
                                onChange={handleCodigoChange}
                                disabled={!selectedTipoSolicitacao || !selectedGrupoMaterial}
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
                                className="select-field"
                                onInputChange={handleMaterialInputChange}
                                isDisabled={!selectedTipoSolicitacao || !selectedGrupoMaterial}
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
                                readOnly
                            />
                        </div>
                        <div className="campo" style={{ width: '100%' }}>
                            <label htmlFor="unidadeMedida">Unidade de Medida</label>
                            <input
                                type="text"
                                id="unidadeMedida"
                                value={unidadeMedida}
                                onChange={(e) => setUnidadeMedida(e.target.value)}
                                className="campo-leitura"
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
                    </div>

                    <div className="total-info">
                        <p>
                            Total: R$
                            {items.reduce((acc, item) => acc + parseFloat(item.total), 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="campo botoes">
                        <button type="button" className="botao-enviar" onClick={toggleCartModal}>Enviar</button>
                    </div>
                </form>
            </div>

            {isCartOpen && (
                <div className={`modal-overlay ${isCartOpen ? 'modal-opening' : 'modal-closing'}`}>
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
                                                        className="botao-editar"
                                                        onClick={() => handleEditItem(index)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="botao-excluir"
                                                        onClick={() =>
                                                            setItems(items.filter((_, i) => i !== index))
                                                        }
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
                            <p>
                                Total: R$
                                {items.reduce((acc, item) => acc + parseFloat(item.total), 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="campo botoes">
                            <button type="button" className="botao-enviar" onClick={handleSendTicket}>
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessPopup && (
                <div className="popup-sucesso">
                    <p>Enviado com sucesso!</p>
                </div>
            )}
        </div>
    );
};

export default NovaRequisicao;