import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import '../../styles/Intercompany/SolicitacoesMateriais.css';

const SolicitacoesMateriais = () => {
    const materiaisEstoque = {
        'Agulhas': {
            'Hospital São Luiz': { quantidade: 15, codigo: 'A123', descricao: 'Agulhas médicas', medida: 'Unidade' },
            'Hospital Albert Einstein': { quantidade: 20, codigo: 'A123', descricao: 'Agulhas médicas', medida: 'Unidade' }
        },
        'Seringas': {
            'Hospital São Luiz': { quantidade: 30, codigo: 'S456', descricao: 'Seringas descartáveis', medida: 'Unidade' },
            'Hospital Albert Einstein': { quantidade: 50, codigo: 'S456', descricao: 'Seringas descartáveis', medida: 'Unidade' }
        }
    };

    const hospitais = ['Hospital São Luiz', 'Hospital Albert Einstein'];

    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [hospitalOrigem, setHospitalOrigem] = useState('');
    const [hospitalDestino, setHospitalDestino] = useState('');
    const [disponivel, setDisponivel] = useState(0);
    const [quantidade, setQuantidade] = useState(0);
    const [items, setItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        if (selectedMaterial && hospitalOrigem) {
            const materialData = materiaisEstoque[selectedMaterial][hospitalOrigem];
            setDisponivel(materialData.quantidade);
            setQuantidade(0);
        }
    }, [selectedMaterial, hospitalOrigem]);

    const handleAddToCart = () => {
        if (quantidade > 0 && quantidade <= disponivel) {
            const materialData = materiaisEstoque[selectedMaterial][hospitalOrigem];
            const newItem = {
                hospitalOrigem,
                hospitalDestino,
                material: selectedMaterial,
                codigo: materialData.codigo,
                descricao: materialData.descricao,
                medida: materialData.medida,
                quantidade,
            };
            setItems([...items, newItem]);
            setDisponivel(disponivel - quantidade);
            setQuantidade(0);
        } else {
            alert('Quantidade inválida!');
        }
    };

    const handleEnviarPedido = () => {
        setIsCartOpen(true);
    };

    const handleConfirmarPedido = () => {
        setItems([]);
        setIsCartOpen(false);
        setSelectedMaterial('');
        setHospitalOrigem('');
        setHospitalDestino('');
        setDisponivel(0);
        setShowSuccessPopup(true);
        setTimeout(() => {
            setShowSuccessPopup(false);
        }, 3000);
    };

    const toggleCartModal = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <div className="container">
            <div className="cadastro-material">
                <div className="cadastro-material-header">
                    <h3 id='titulo-cadastro'>Solicitação de Materiais</h3>
                    <div className="cart-container">
                        <FaShoppingCart className="cart-icon" id="cart-icon" onClick={toggleCartModal} />
                        {items.length > 0 && (
                            <span className="cart-notification" id="cart-notification">{items.length}</span>
                        )}
                    </div>
                </div>

                <div className="campo">
                    <label htmlFor="pesquisarMaterial">Pesquisar Material</label>
                    <select
                        id="pesquisarMaterial"
                        value={selectedMaterial}
                        onChange={(e) => setSelectedMaterial(e.target.value)}
                    >
                        <option value="">Selecione um material</option>
                        {Object.keys(materiaisEstoque).map(material => (
                            <option key={material} value={material}>{material}</option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label htmlFor="hospitalOrigem">Hospital Origem (Emprestador)</label>
                    <select
                        id="hospitalOrigem"
                        value={hospitalOrigem}
                        onChange={(e) => setHospitalOrigem(e.target.value)}
                    >
                        <option value="">Selecione o hospital de origem</option>
                        {hospitais.map(hospital => (
                            <option key={hospital} value={hospital}>{hospital}</option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label htmlFor="hospitalDestino">Hospital Destino (Receptor)</label>
                    <select
                        id="hospitalDestino"
                        value={hospitalDestino}
                        onChange={(e) => setHospitalDestino(e.target.value)}
                    >
                        <option value="">Selecione o hospital de destino</option>
                        {hospitais.map(hospital => (
                            <option key={hospital} value={hospital}>{hospital}</option>
                        ))}
                    </select>
                </div>

                {/* Mostrar a tabela apenas se todos os campos estiverem preenchidos */}
                {selectedMaterial && hospitalOrigem && hospitalDestino && (
                    <div className="campo">
                        <h4>Detalhes do Material</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Material</th>
                                    <th>Descrição</th>
                                    <th>Medida</th>
                                    <th>Quantidade Disponível</th>
                                    <th>Quantidade a Emprestar</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{materiaisEstoque[selectedMaterial][hospitalOrigem].codigo}</td>
                                    <td>{selectedMaterial}</td>
                                    <td>{materiaisEstoque[selectedMaterial][hospitalOrigem].descricao}</td>
                                    <td>{materiaisEstoque[selectedMaterial][hospitalOrigem].medida}</td>
                                    <td>{disponivel}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <button
                                                type="button"
                                                id="button-decrement"
                                                disabled={quantidade === 0}
                                                onClick={() => setQuantidade(quantidade - 1)}
                                            >-</button>
                                            <input
                                                type="number"
                                                id="quantidade"
                                                value={quantidade}
                                                onChange={(e) => setQuantidade(Number(e.target.value))}
                                                style={{ width: '50px', textAlign: 'center' }}
                                                min="0"
                                                max={disponivel}
                                            />
                                            <button
                                                type="button"
                                                id="button-increment"
                                                disabled={quantidade >= disponivel}
                                                onClick={() => setQuantidade(quantidade + 1)}
                                            >+</button>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            id="botao-adicionar-carrinho"
                                            onClick={handleAddToCart}
                                            disabled={quantidade === 0}
                                        >
                                            Adicionar ao Carrinho
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {items.length > 0 && (
                    <div id="botao-enviar-pedido-container">
                        <button
                            type="button"
                            id="botao-enviar-pedido"
                            onClick={handleEnviarPedido}
                        >
                            Enviar
                        </button>
                    </div>
                )}
            </div>

            {isCartOpen && (
                <div className={`modal-overlay ${isCartOpen ? 'modal-opening' : 'modal-closing'}`} id="modal-overlay">
                    <div className="modal" id="modal-carrinho">
                        <div className="modal-header" id="modal-header">
                            <h3>Resumo da Solicitação</h3>
                            <span className="close" id="modal-close" onClick={toggleCartModal}>&times;</span>
                        </div>
                        <div className="tabela-itens">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Hospital Origem</th>
                                        <th>Hospital Destino</th>
                                        <th>Material</th>
                                        <th>Código</th>
                                        <th>Descrição</th>
                                        <th>Medida</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan="7">Nenhum item no carrinho</td>
                                        </tr>
                                    ) : (
                                        items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.hospitalOrigem}</td>
                                                <td>{item.hospitalDestino}</td>
                                                <td>{item.material}</td>
                                                <td>{item.codigo}</td>
                                                <td>{item.descricao}</td>
                                                <td>{item.medida}</td>
                                                <td>{item.quantidade}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                id="botao-confirmar-pedido"
                                onClick={handleConfirmarPedido}
                            >
                                Confirmar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessPopup && (
                <div className="popup-sucesso">
                    Pedido solicitado com sucesso!
                </div>
            )}
        </div>
    );
};

export default SolicitacoesMateriais;
