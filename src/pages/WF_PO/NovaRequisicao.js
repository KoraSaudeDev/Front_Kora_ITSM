import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { debounce } from 'lodash';
import { FaShoppingCart } from 'react-icons/fa';
import '../../styles/WF_PO/NovaRequisicao.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import SidebarInterna from '../../components/SidebarInterna';

const NovaRequisicao = () => {
    const { user, token } = useAuth();
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
    const [selectedBloco, setSelectedBloco] = useState(null);
    const [selectedGrupoMaterial, setSelectedGrupoMaterial] = useState(null);
    const [selectedAreaNegocio, setSelectedAreaNegocio] = useState(null);
    const [selectedTipoSolicitacao, setSelectedTipoSolicitacao] = useState(null);
    const [selectedMotivoSolic, setSelectedMotivoSolic] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [observacao, setObservacao] = useState('');

    const [fase, setFase] = useState(null);
    const [grupo, setGrupo] = useState(null);

    const [codigoMaterial, setCodigoMaterial] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [inputMaterial, setInputMaterial] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');

    const [dataRemessa, setDataRemessa] = useState('');
    const [codigoFornecedor, setCodigoFornecedor] = useState('');
    const [selectedFornecedor, setSelectedFornecedor] = useState(null);
    const [inputFornecedor, setInputFornecedor] = useState('');
    const [inicioServico, setInicioServico] = useState('');
    const [fimServico, setFimServico] = useState('');

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
                            label: item.unidade,
                            bloco_produto: item.bloco_produto,
                            bloco_servico: item.bloco_servico
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

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/areas-negocio`, { headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email } })
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
            headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email }
        })
            .then(response => {
                if (pesquisa === 'nome') {
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
                else if (pesquisa === 'cod') {
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

    const fetchFornecedores = debounce((inputValue, pesquisa) => {

        if (!inputValue) return;

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/sap/fornecedor`, {
            params: {
                fornecedor: inputValue,
                pesquisa
            },
            headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email }
        })
            .then(response => {
                if (pesquisa === 'nome') {
                    setOptions(prevOptions => ({
                        ...prevOptions,
                        fornecedores: response.data.map(item => ({
                            value: item.fornecedor,
                            label: item.fornecedor,
                            codigo: item.codigo,
                        }))
                    }));
                }
                else if (pesquisa === 'cod') {
                    if (response.data.length < 1) return;
                    setSelectedFornecedor({
                        value: response.data[0].fornecedor,
                        label: response.data[0].fornecedor,
                        codigo: response.data[0].codigo,
                    })
                }
            })
            .catch(error => {
                console.error('Erro ao buscar fornecedores:', error);
            });
    }, 10);

    useEffect(() => {
        if (selectedMaterial) {
            if (!preco) setPreco(selectedMaterial.preco);
            setCodigoMaterial(selectedMaterial.codigo);
            setUnidadeMedida(selectedMaterial.unidadeMedida);
        }
        else {
            setPreco('');
            setUnidadeMedida('');
        }
    }, [selectedMaterial]);

    useEffect(() => {
        if (selectedFornecedor) {
            setCodigoFornecedor(selectedFornecedor.codigo);
        }
    }, [selectedFornecedor]);

    useEffect(() => {
        setItems([]);
        setEditingIndex(null);
        setCodigoMaterial('');
        setSelectedMaterial(null);
        setQuantidade('');
        setPreco('');
        setUnidadeMedida('');
    }, [selectedTipoSolicitacao, selectedGrupoMaterial]);

    useEffect(() => {
        setOptions(prevOptions => ({
            ...prevOptions,
            grupoMaterial: []
        }));
        if (selectedTipoSolicitacao) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/sap/grupo-mercadoria?tipo=${selectedTipoSolicitacao.value}`, { headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email } })
                .then(response => {
                    setOptions(prevOptions => ({
                        ...prevOptions,
                        grupoMaterial: response.data.map(item => ({ value: item, label: item }))
                    }));
                })
                .catch(error => console.error('Error fetching grupo de mercadoria:', error));
        }
    }, [selectedTipoSolicitacao]);

    useEffect(() => {
        if (selectedTipoSolicitacao && selectedUnidade) {
            if (selectedTipoSolicitacao.value === "Produto") setSelectedBloco(selectedUnidade.bloco_produto);
            else if (selectedTipoSolicitacao.value === "Serviço") setSelectedBloco(selectedUnidade.bloco_servico);
        }
        else setSelectedBloco(null);
    }, [selectedTipoSolicitacao, selectedUnidade]);

    useEffect(() => {
        if (selectedBloco) {
            fetchFases();
        }
    }, [selectedBloco, total])

    const fetchFases = () => {
        axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/wf-po/form/fases?bloco=${selectedBloco}&valor=${total}`,
            { headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': user.email } }
        )
            .then(response => {
                if (response.data[0].id_fase) setFase(response.data[0].id_fase);
                if (response.data[0].id_grupo) setGrupo(response.data[0].id_grupo);
            })
            .catch(error => console.error('Error fetching fases:', error));
    }

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

    const menuRequisicao = [
        { label: 'Nova Requisição', path: '/suporte/nova-requisicao-wf' },
        { label: 'Minhas Solicitações', path: '/suporte/minhas-solicitacoes' },
        { label: 'Aprovações', path: '/suporte/aprovacoes' },
        { label: 'Acompanhar', path: '/suporte/acompanhar' },
    ];

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

    const handleCodigoFornecedorChange = (event) => {
        const value = event.target.value;
        setCodigoFornecedor(value);
        fetchFornecedores(value, 'cod');
        setSelectedFornecedor(null);
        setOptions(prevOptions => ({
            ...prevOptions,
            fornecedores: []
        }));
    };

    const handleFornecedorInputChange = (inputValue) => {
        setInputFornecedor(inputValue);
        fetchFornecedores(inputValue, 'nome');
        if (!selectedFornecedor) {
            setCodigoFornecedor('');
            setSelectedFornecedor(null);
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

    const handleEditItem = (index) => {
        const itemToEdit = items[index];
        setEditingIndex(index);
        setCodigoMaterial(itemToEdit.codigo);
        setQuantidade(itemToEdit.quantidade);
        setPreco(itemToEdit.preco);
        setUnidadeMedida(itemToEdit.unidadeMedida);
        setSelectedMaterial(options.material.find(material => material.label === itemToEdit.material));
        toggleCartModal();
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

    const handleSaveEdit = () => {
        const updatedItems = [...items];
        const materialPreco = parseFloat(preco) || 0;
        const quantidadeNumerica = parseFloat(quantidade) || 1;

        const oldItemTotal = parseFloat(updatedItems[editingIndex].total);

        updatedItems[editingIndex] = {
            codigo: codigoMaterial,
            material: selectedMaterial?.label || '',
            quantidade: quantidadeNumerica,
            preco: materialPreco.toFixed(2),
            total: (quantidadeNumerica * materialPreco).toFixed(2),
            unidadeMedida: unidadeMedida,
        };

        const newItemTotal = quantidadeNumerica * materialPreco;
        setTotal((prevTotal) => parseFloat(prevTotal) - oldItemTotal + newItemTotal);
        setItems(updatedItems);
        setEditingIndex(null);
        setCodigoMaterial('');
        setSelectedMaterial(null);
        setQuantidade('');
        setPreco('');
        setUnidadeMedida('');
    };

    const handleSendTicket = async () => {
        const wf_po = {
            executor: grupo,
            email: user.email,
            nome: user.name,
            area: selectedAreaNegocio?.value,
            hub: selectedHub?.value,
            unidade: selectedUnidade?.label,
            centro_custo: selectedCentroCusto?.value,
            numero_bloco: selectedBloco,
            fase: fase,
            tipo_solicitacao: selectedTipoSolicitacao?.value,
            grupo_material: selectedGrupoMaterial?.value,
            total_materiais: total,
            descricao: descricao,
            observacoes: observacao,
            motivo_solicitacao: selectedMotivoSolic?.value,
        };

        if (selectedTipoSolicitacao.value === "Produto") {
            wf_po.dt_remessa = dataRemessa;
        } else if (selectedTipoSolicitacao.value === "Serviço") {
            wf_po.cod_fornecedor = codigoFornecedor;
            wf_po.fornecedor = selectedFornecedor.value;
            wf_po.dt_inicio_serv = inicioServico;
            wf_po.dt_fim_serv = fimServico;
        }

        const missingFields = [
            wf_po.executor,
            wf_po.email,
            wf_po.nome,
            wf_po.area,
            wf_po.hub,
            wf_po.unidade,
            wf_po.numero_bloco,
            wf_po.fase,
            wf_po.tipo_solicitacao,
            wf_po.grupo_material,
            wf_po.total_materiais,
            wf_po.descricao,
            wf_po.motivo_solicitacao,
            ...(selectedTipoSolicitacao.value === "Produto" ? [wf_po.dt_remessa] : []),
            ...(selectedTipoSolicitacao.value === "Serviço" ? [wf_po.cod_fornecedor, wf_po.fornecedor, wf_po.dt_inicio_serv, wf_po.dt_fim_serv] : []),
        ];

        if (missingFields.includes(undefined) || missingFields.includes('') || missingFields.includes(null) || items.length === 0) {
            alert('Preencha todos os campos obrigatórios e adicione pelo menos um item no carrinho.');
            return;
        }

        showLoadingOverlay();

        try {
            const wf_po_Config = {
                method: 'post',
                url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-User-Email': user.email,
                },
                data: JSON.stringify(wf_po),
            };

            const retorno = await sendRequest(wf_po_Config);

            if (retorno.id) {
                const task_Config = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po-task`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-User-Email': user.email,
                    },
                    data: JSON.stringify({
                        referencia_id: retorno.id,
                        fase: wf_po.fase,
                        executor: wf_po.executor,
                        numero_bloco: wf_po.numero_bloco,
                    }),
                };

                await sendRequest(task_Config);

                for (const item of items) {
                    const body = {
                        referencia_id: retorno.id,
                        codigo: item.codigo,
                        grupo: wf_po.grupo_material,
                        material: item.material,
                        qtd: item.quantidade,
                        unidade_medida: item.unidadeMedida,
                        preco: parseFloat(item.preco),
                        total: parseFloat(item.total),
                        status: 1,
                    };

                    const material_Config = {
                        method: 'post',
                        url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po-material`,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'X-User-Email': user.email,
                        },
                        data: JSON.stringify(body),
                    };

                    await sendRequest(material_Config);

                    const { unidade_medida, ...restBody } = body;
                    const aprovacaoBody = {
                        ...restBody,
                        executor: 1,
                        nome_executor: user.name,
                    };

                    const aprovacao_Config = {
                        method: 'post',
                        url: `${process.env.REACT_APP_API_BASE_URL}/wf-po/update/wf-po-aprovacao`,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'X-User-Email': user.email,
                        },
                        data: JSON.stringify(aprovacaoBody),
                    };

                    await sendRequest(aprovacao_Config);
                }

                hideLoadingOverlay();

                setShowSuccessPopup(true);
                setTimeout(() => {
                    setShowSuccessPopup(false);
                    window.location.reload();
                }, 3000);
            }
            else{
                hideLoadingOverlay();
            }
        } catch (error) {
            hideLoadingOverlay();
            console.error("Error adding wf-po:", error);
        }
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

                    <form className="formulario">
                        <div className="row">
                            <div className="campo">
                                <label htmlFor="email">Email *</label>
                                <input type="email" id="email" value={user?.email || ''} readOnly />
                            </div>
                            <div className="campo">
                                <label htmlFor="nome">Nome *</label>
                                <input type="text" id="nome" value={user?.name || 'Solicitante'} readOnly />
                            </div>
                        </div>

                        <div className="row">
                            <div className="campo">
                                <label htmlFor="hub">Hub *</label>
                                <Select
                                    value={selectedHub}
                                    onChange={setSelectedHub}
                                    options={options.hub}
                                    isClearable
                                />
                            </div>
                            <div className="campo">
                                <label htmlFor="unidade">Unidade *</label>
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
                                <label htmlFor="areaNegocio">Área de Negócio *</label>
                                <Select
                                    value={selectedAreaNegocio}
                                    onChange={setSelectedAreaNegocio}
                                    options={options.areaNegocio}
                                    isClearable
                                />
                            </div>
                            <div className="campo">
                                <label htmlFor="tipoSolicitacao">Tipo de Solicitação *</label>
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
                                    <label htmlFor="dataRemessa">Data de Remessa *</label>
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
                                <div className="campo" style={{ width: '100%' }}>
                                    <label htmlFor="codigoFornecedor">Código do Fornecedor *</label>
                                    <input
                                        type="text"
                                        id="codigoFornecedor"
                                        value={codigoFornecedor}
                                        onChange={handleCodigoFornecedorChange}
                                    />
                                </div>
                                <div className="campo" style={{ width: '100%' }}>
                                    <label htmlFor="fornecedor">Fornecedor *</label>
                                    <Select
                                        id="fornecedor"
                                        value={selectedFornecedor}
                                        onChange={setSelectedFornecedor}
                                        options={options.fornecedores}
                                        placeholder="Digite para pesquisar"
                                        className="select-field"
                                        onInputChange={handleFornecedorInputChange}
                                        isClearable
                                    />
                                </div>
                                <div className="campo">
                                    <label htmlFor="inicioServico">Início do Serviço *</label>
                                    <input
                                        type="date"
                                        id="inicioServico"
                                        value={inicioServico}
                                        onChange={(e) => setInicioServico(e.target.value)}
                                    />
                                </div>
                                <div className="campo">
                                    <label htmlFor="fimServico">Fim do Serviço *</label>
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
                                <label htmlFor="grupoMaterial">Grupo de Material*</label>
                                <Select
                                    value={selectedGrupoMaterial}
                                    onChange={setSelectedGrupoMaterial}
                                    options={options.grupoMaterial}
                                    isClearable
                                    isDisabled={!selectedTipoSolicitacao}
                                />
                            </div>
                            <div className="campo">
                                <label htmlFor="motivoSolic">Motivo da Solicitação *</label>
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
                                <label htmlFor="descricao">Descrição *</label>
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
                                    onChange={(e) => setPreco(e.target.value)}
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
                                Total: R$ {total.toFixed(2)}
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
                                <p>
                                    Total: R$ {total.toFixed(2)}
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
        </div >
    );
};

export default NovaRequisicao;