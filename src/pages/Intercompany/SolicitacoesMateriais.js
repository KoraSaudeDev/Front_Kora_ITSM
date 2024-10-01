import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import debounce from 'lodash/debounce';
import { FaShoppingCart } from 'react-icons/fa';
import '../../styles/WF_PO/NovaRequisicao.css';
import axios from 'axios';

const SolicitacoesMateriais = () => {
    const [options, setOptions] = useState({
        material: [],
        grupoMaterial: [],
    });

    const [codigoMaterial, setCodigoMaterial] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');
    const [items, setItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const fetchMaterials = debounce((inputValue) => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/sap/material`, {
            params: {
                material: inputValue,
            },
        })
            .then(response => {
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
            })
            .catch(error => {
                console.error('Erro ao buscar materiais:', error);
            });
    }, 10);

    useEffect(() => {
        if (selectedMaterial) {
            setPreco(selectedMaterial.preco);
            setCodigoMaterial(selectedMaterial.codigo);
            setUnidadeMedida(selectedMaterial.unidadeMedida);
        }
    }, [selectedMaterial]);

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

    const isAddButtonDisabled = !selectedMaterial || !quantidade || !unidadeMedida;

    return (
        <div className="container">
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
                        readOnly
                        className="campo-leitura"
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
                        onInputChange={(inputValue) => fetchMaterials(inputValue)}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default SolicitacoesMateriais;
