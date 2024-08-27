import React, { useState, useEffect } from 'react';
import { FaTimes, FaFileAlt, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Modal = ({ data, onClose }) => {
    const { user } = useAuth();
    const [inicio, setInicio] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showAtividadesModal, setShowAtividadesModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isClosingAtividadesModal, setIsClosingAtividadesModal] = useState(false);
    const [isClosingModal, setIsClosingModal] = useState(false);
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [prioridadeSelecionada, setPrioridadeSelecionada] = useState(data.ds_nivel);
    const [selectedHub, setSelectedHub] = useState(data.hub || '');
    const [selectedCategoria, setSelectedCategoria] = useState(data.categoria || '');
    const [selectedSubcategoria, setSelectedSubcategoria] = useState(data.subcategoria || '');
    const [selectedUnidade, setSelectedUnidade] = useState(data.unidade || '');
    const [selectedAssunto, setSelectedAssunto] = useState(data.assunto || '');
    const [options, setOptions] = useState({
        hub: [],
        unidade: [],
        categoria: [],
        subcategoria: [],
        assunto: [],
        status: [],
        destinatarios: []
    });

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/hub`)
            .then(response => setOptions(prev => ({ ...prev, hub: response.data })))
            .catch(error => console.error('Erro ao carregar hubs:', error));

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/categorias`)
            .then(response => setOptions(prev => ({ ...prev, categoria: response.data })))
            .catch(error => console.error('Erro ao carregar categorias:', error));
    }, []);

    useEffect(() => {
        if (selectedHub) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/unidade?hub=${selectedHub}`)
                .then(response => setOptions(prev => ({ ...prev, unidade: response.data })))
                .catch(error => console.error('Erro ao carregar unidades:', error));
        } else {
            setSelectedUnidade('');
        }
    }, [selectedHub]);

    useEffect(() => {
        if (selectedCategoria) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/subcategorias?categoria=${selectedCategoria}`)
                .then(response => setOptions(prev => ({ ...prev, subcategoria: response.data })))
                .catch(error => console.error('Erro ao carregar subcategorias:', error));
        } else {
            setSelectedSubcategoria('');
            setSelectedAssunto('');
        }
    }, [selectedCategoria]);

    useEffect(() => {
        if (selectedSubcategoria) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/assuntos?categoria=${selectedCategoria}&subcategoria=${selectedSubcategoria}`)
                .then(response => setOptions(prev => ({ ...prev, assunto: response.data.map(ass => ass.assunto) })))
                .catch(error => console.error('Erro ao carregar assuntos:', error));
        } else {
            setSelectedAssunto('');
        }
    }, [selectedSubcategoria]);

    useEffect(() => {
        const fetchAtividades = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/ticket-tasks?id=${data.id}`);
                const sortedAtividades = response.data.sort((a, b) => new Date(a.dataAbertura) - new Date(b.dataAbertura));
                setAtividades(sortedAtividades);
            } catch (error) {
                console.error('Erro ao buscar as atividades:', error);
            }
        };

        fetchAtividades();
    }, [data.id]);

    useEffect(() => {
        const formatCustomDate = (date) => {
            const padToTwoDigits = (num) => String(num).padStart(2, '0');

            const year = date.getFullYear();
            const month = padToTwoDigits(date.getMonth() + 1);
            const day = padToTwoDigits(date.getDate());
            const hours = padToTwoDigits(date.getHours());
            const minutes = padToTwoDigits(date.getMinutes());
            const seconds = padToTwoDigits(date.getSeconds());

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        if (showAtividadesModal) {
            const now = new Date();
            const formattedDate = formatCustomDate(now);
            setInicio(formattedDate);
        }
    }, [showAtividadesModal]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/status`)
            .then(response => {
                setOptions(prevOptions => ({ ...prevOptions, status: response.data }));
            })
            .catch(error => {
                console.error('Error fetching status options:', error);
            });

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/usuarios-executores`)
            .then(response => {
                setOptions(prevOptions => ({ ...prevOptions, destinatarios: response.data }));
            })
            .catch(error => {
                console.error('Error fetching destinatarios options:', error);
            });
    }, []);

    if (!data) return null;

    const showLoadingOverlay = () => {
        document.getElementById('loading-overlay').style.display = 'flex';
    };

    const hideLoadingOverlay = () => {
        document.getElementById('loading-overlay').style.display = 'none';
    };

    const handleAnexoClick = async (anexoPath) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/file/open-url?path=${anexoPath}`);
            if (response.data) {
                window.open(response.data);
            }
        } catch (error) {
            console.error("Erro ao abrir o anexo:", error);
        }
    };

    const handleFileChange = (event, uploadType) => {
        const files = Array.from(event.target.files);
        let updatedFiles = files.map((file) => ({
            file,
            uploadType: uploadType,
        }));
    
        setSelectedFiles((prevFiles) => {
            if (uploadType === 1) {
                const filteredFiles = prevFiles.filter((fileObj) => fileObj.uploadType !== 1);
                return [...filteredFiles, ...updatedFiles];
            } else {
                return [...prevFiles, ...updatedFiles];
            }
        });
    };
    

    const handleAbrirAtividadesModal = () => {
        setAtividadeSelecionada(null);
        setIsEditMode(true);
        setShowAtividadesModal(true);
    };

    const handleFecharAtividadesModal = () => {
        setIsClosingAtividadesModal(true);
        setTimeout(() => {
            setShowAtividadesModal(false);
            setIsClosingAtividadesModal(false);
        }, 500);
    };

    const handleSalvarAtividade = () => {
        const aberto_em = document.querySelector('#inicio-task').value;
        const aberto_por = document.querySelector('#aberto-por-task').value;
        const descricao = document.querySelector('#descricao-task').value.trim();
        const executor = document.querySelector('#executor-task').value;
        const status = document.querySelector('#status-task').value;
        var tipo_atividade = document.querySelector('input[name="visibilidade"]:checked');

        if (!tipo_atividade){
            tipo_atividade = 'Privada';
        }
        else{
            tipo_atividade = 'Pública';
        }

        if (!descricao || !status || !executor ) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const novaAtividade = {
            cod_fluxo: data.id,
            alterar: 1,
            aberto_em,
            aberto_por,
            status,
            descricao,
            executor,
            tipo_atividade,
            ds_anexo: null
        };

        const fileInput = document.getElementById('anexoAtividade');
        const files = fileInput.files;

        if (files.length > 0) {
            novaAtividade.ds_anexo = files[0].name;

            const updatedFiles = Array.from(files).map((file) => ({
                file,
                uploadType: 2,
            }));

            setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
        }

        if (atividades.length > 0) {
            const ultimaAtividadeIndex = atividades.length - 1;
            const ultimaAtividade = atividades[ultimaAtividadeIndex];

            ultimaAtividade.alterar = 1;

            if (!ultimaAtividade.dt_fim) {
                ultimaAtividade.dt_fim = inicio;
            }
            if (!ultimaAtividade.ds_concluido_por) {
                ultimaAtividade.ds_concluido_por = aberto_por;
            }

            const updatedAtividades = [...atividades];
            updatedAtividades[ultimaAtividadeIndex] = ultimaAtividade;

            setAtividades(updatedAtividades);
        }

        setAtividades([...atividades, novaAtividade]);
        handleFecharAtividadesModal();
    };

    const handleAbrirDetalhesAtividade = (atividade) => {
        setAtividadeSelecionada(atividade);
        setIsEditMode(false);
        setShowAtividadesModal(true);
    };

    const handleFieldChange = (field, value) => {
        switch (field) {
            case 'hub':
                setSelectedHub(value);
                setSelectedUnidade('');
                break;
            case 'categoria':
                setSelectedCategoria(value);
                setSelectedSubcategoria('');
                setSelectedAssunto('');
                break;
            case 'subcategoria':
                setSelectedSubcategoria(value);
                setSelectedAssunto('');
                break;
            case 'unidade':
                setSelectedUnidade(value);
                break;
            case 'assunto':
                setSelectedAssunto(value);
                break;
            default:
                break;
        }
    };

    const handlePrioridadeClick = (prioridade) => {
        setPrioridadeSelecionada(prioridade);
    };

    const handleSalvarTicket = async () => {
        if (!selectedHub || !selectedUnidade || !selectedCategoria || !selectedSubcategoria || !selectedAssunto || !prioridadeSelecionada) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        function toTitleCase(str) {
            if (str === "EM ATENDIMENTO") return "Em Andamento";
            return str
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        showLoadingOverlay();

        const update_tasks = atividades
            .filter(task => task.alterar === 1 && task.id !== undefined)
            .map(task => ({
                cod_task: task.cod_task,
                ds_concluido_por: task.ds_concluido_por,
                dt_fim: task.dt_fim,
            }));

        const insert_tasks = atividades.filter(task => task.alterar === 1 && task.id === undefined);

        const ultimoItem = atividades[atividades.length - 1];

        const resposta_chamado = document.querySelector("#resp-chamado").value;

        const update_tickets = {
            hub: selectedHub,
            unidade: selectedUnidade,
            categoria: selectedCategoria,
            subcategoria: selectedSubcategoria,
            assunto: selectedAssunto,
            ds_nivel: prioridadeSelecionada,
            status: toTitleCase(ultimoItem.status),
            grupo: ultimoItem.executor,
            sla: prioridades.find(line => line.prioridade === prioridadeSelecionada)?.sla,
            resposta_chamado: resposta_chamado === '' ? null : resposta_chamado
        };

        if (update_tickets.status === "Finalizado") {
            update_tickets.finalizado_por = ultimoItem.aberto_por;
            update_tickets.data_fim = ultimoItem.aberto_em;
            update_tickets.bl_reabertura = 1;
        }

        const sendRequest = async (config) => {
            try {
                const response = await axios.request(config);
                console.log(JSON.stringify(response.data));
            } catch (error) {
                console.error('Request Error:', error);
            }
        };

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const formData = new FormData();
                formData.append('file', selectedFiles[i].file);
                formData.append('uploadType', selectedFiles[i].uploadType);

                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/tickets/file/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 202) {
                    console.log(response.data.filename)
                    if (selectedFiles[i].uploadType === 1) {
                        update_tickets.anexo_resposta = response?.data?.filename;
                    }
                    else if (selectedFiles[i].uploadType === 2) {
                        const matchedAtividade = insert_tasks.find(task => task.ds_anexo === selectedFiles[i].file.name);
                        if (matchedAtividade) {
                            matchedAtividade.ds_anexo = response?.data?.filename;
                        }
                    }
                } else {
                    console.error(`Erro ao enviar o arquivo ${selectedFiles[i].name}:`, response);
                }
            }

            const ticketConfig = {
                method: 'patch',
                url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/${data.cod_fluxo}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(update_tickets)
            };

            await sendRequest(ticketConfig);

            for (const task of update_tasks) {
                const taskConfig = {
                    method: 'patch',
                    url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/task/${task.cod_task}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(task)
                };

                await sendRequest(taskConfig);
            }

            for (const task of insert_tasks) {
                delete task.alterar;

                const taskConfig = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/task`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(task)
                };

                await sendRequest(taskConfig);
            }

            hideLoadingOverlay();

            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                window.location.reload();
            }, 3000);

        } catch (error) {
            hideLoadingOverlay();
            console.error("Error saving ticket and tasks:", error);
        }
    };

    const handleCloseModal = () => {
        setIsClosingModal(true);
        setTimeout(() => {
            onClose();
            setIsClosingModal(false);
        }, 500);
    };

    const statusOptions = {
        "Em Andamento": "#ffc107",
        "Aguardando Retorno Fornecedor": "#17a2b8",
        "Aguardando Retorno": "#6c757d",
        "Em Aberto": "#007bff",
        "Agendada": "#6610f2",
        "Criação de Usuário": "#fd7e14"
    };

    const slaOptions = {
        "Em Atraso": "#dc3545",
        "No Prazo": "#28a745"
    };

    const prioridades = [
        {
            "prioridade": "P1",
            "sla": "240",
            "tipo_tempo": "Corrido"
        },
        {
            "prioridade": "P2",
            "sla": "480",
            "tipo_tempo": "Corrido"
        },
        {
            "prioridade": "P3",
            "sla": "1200",
            "tipo_tempo": "Útil"
        },
        {
            "prioridade": "P4",
            "sla": "1800",
            "tipo_tempo": "Útil"
        },
        {
            "prioridade": "P5",
            "sla": "3000",
            "tipo_tempo": "Útil"
        },
        {
            "prioridade": "P6",
            "sla": "4200",
            "tipo_tempo": "Útil"
        },
        {
            "prioridade": "P7",
            "sla": "9000",
            "tipo_tempo": "Útil"
        }
    ];

    return (
        <div>
            <div className="modal-overlay">
                <div className={`modal ${isClosingModal ? 'fechar' : ''}`}>
                    <div className="modal-header">
                        <h3>Ticket #{data.cod_fluxo}</h3>
                        <div className="botao-salvar-container">
                            <button className="botao-salvar-ticket" onClick={handleSalvarTicket}>
                                Salvar
                            </button>
                        </div>
                        <button className="fechar-modal" onClick={handleCloseModal}><FaTimes /></button>
                    </div>

                    <div className="modal-filters">
                        <div className="campo-selecao">
                            <strong className="link-label">Categoria</strong>
                            <select
                                value={selectedCategoria}
                                onChange={(e) => handleFieldChange('categoria', e.target.value)}
                            >
                                <option></option>
                                {options.categoria.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="campo-selecao">
                            <strong className="link-label">Subcategoria</strong>
                            <select
                                value={selectedSubcategoria}
                                onChange={(e) => handleFieldChange('subcategoria', e.target.value)}
                                disabled={!selectedCategoria}
                            >
                                <option></option>
                                {options.subcategoria.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="campo-selecao">
                            <strong className="link-label">Assunto</strong>
                            <select
                                value={selectedAssunto}
                                onChange={(e) => handleFieldChange('assunto', e.target.value)}
                                disabled={!selectedSubcategoria}
                            >
                                <option></option>
                                {options.assunto.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="conteudo-modal">
                        <div className="conteudo-modal-esquerda">
                            <p><strong>Nome:</strong> {data.nome}</p>
                            <p><strong>Matrícula:</strong> {data.matricula}</p>
                            <p><strong>E-mail Solicitante:</strong> {data.email_solicitante}</p>
                            <p><strong>Telefone:</strong> {data.telefone}</p>
                            <p><strong>Cargo:</strong> {data.cargo_solic}</p>
                            <p><strong>Área de Negócio:</strong> {data.area_negocio}</p>
                            <p><strong>Descrição:</strong> {data.descricao}</p>
                            <p style={{ display: 'flex', alignItems: 'center' }}>
                                <strong>Anexo:</strong>
                                {data.anexo ? (
                                    <>
                                        <a onClick={() => handleAnexoClick(data.anexo)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            {data.anexo.split('/').pop()}
                                            <FaFileAlt
                                                className="icone-anexo"
                                                style={{ marginLeft: '5px' }}
                                            />
                                        </a>
                                    </>
                                ) : (
                                    'Nenhum anexo'
                                )}
                            </p>
                        </div>

                        <div className="conteudo-modal-direita">
                            <div className="header-status-sla">
                                <div className="status-container">
                                    <strong>Status:</strong>
                                    <span
                                        className="status-bolinha"
                                        style={{
                                            backgroundColor: statusOptions[data.status] || '#000',
                                            marginLeft: '8px'
                                        }}
                                    ></span>
                                    {data.status}
                                </div>
                                <div className="sla-container">
                                    <strong>SLA:</strong>
                                    <span
                                        className="sla-bolinha"
                                        style={{
                                            backgroundColor: slaOptions[data.st_sla] || '#000',
                                            marginLeft: '8px'
                                        }}
                                    ></span>
                                    {data.st_sla}
                                </div>
                            </div>

                            <p><strong className="data">Abertura:</strong> {data.abertura}</p>
                            <p><strong className="data">Data Limite:</strong> {data.data_limite}</p>
                            <p><strong className="data">Tipo da SLA:</strong> {prioridades.find(p => p.prioridade === prioridadeSelecionada)?.tipo_tempo.toUpperCase() || ''}</p>


           
                            <div className="campo-editavel">
                                <strong>Prioridade:</strong>
                                <select
                                    value={prioridadeSelecionada}
                                    onChange={(e) => handlePrioridadeClick(e.target.value)}
                                >
                                    {prioridades.map(prioridade => (
                                        <option key={prioridade.prioridade} value={prioridade.prioridade}>
                                            {prioridade.prioridade}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="campo-editavel">
                                <strong>Hub:</strong>
                                <select
                                    value={selectedHub}
                                    onChange={(e) => handleFieldChange('hub', e.target.value)}
                                >
                                    <option></option>
                                    {options.hub.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="campo-editavel">
                                <strong>Unidade de Negócio:</strong>
                                <select
                                    value={selectedUnidade}
                                    onChange={(e) => handleFieldChange('unidade', e.target.value)}
                                    disabled={!selectedHub}
                                >
                                    <option></option>
                                    {options.unidade.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <p>
                                <strong id="campor-resp-chamado">Reposta Chamado:</strong>
                                <textarea id="resp-chamado" defaultValue={data.resposta_chamado}></textarea>
                            </p>
                            <p style={{ display: 'flex', alignItems: 'center' }}>
                                <strong>Anexo Reposta:</strong>
                                {data.anexo_resposta ? (
                                    <>
                                        <a
                                            onClick={() => handleAnexoClick(data.anexo_resposta)}
                                            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                        >
                                            {data.anexo_resposta.split('/').pop()}
                                            <FaFileAlt
                                                className="icone-anexo"
                                                style={{ marginLeft: '5px' }}
                                            />
                                        </a>
                                        <button
                                            onClick={() => setEditMode(true)}
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            id='editar'
                                        >
                                            Editar
                                        </button>
                                    </>
                                ) : (
                                    <input
                                        type="file"
                                        id="anexo_resposta"
                                        onChange={(e) => handleFileChange(e, 1)}
                                    />
                                )}
                            </p>
                            {editMode && (
                                <input
                                    type="file"
                                    id="anexo_resposta"
                                    onChange={(e) => handleFileChange(e, 1)}
                                    style={{ display: 'block', marginTop: '10px' }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="campo-atividades">
                        <h4>Atividades</h4>
                        <button className="botao-atividades" onClick={handleAbrirAtividadesModal}>
                            <FaPlus style={{ marginRight: '8px' }} /> Atividade
                        </button>
                        {atividades.slice().reverse().map((atividade, index) => (
                            <div className="card-atividade" key={index} onClick={() => handleAbrirDetalhesAtividade(atividade)}>
                                <p><label>Task:</label> {atividade.cod_task}</p>
                                <p><label>Status:</label> {atividade.status}</p>
                                <p><label>Início:</label> {atividade.aberto_em}</p>
                                <p><label>Fim:</label> {atividade.dt_fim}</p>
                                <p><label>Destinatário:</label> {atividade.executor}</p>
                                <p><label>Visibilidade:</label> {atividade.tipo_atividade}</p>
                                <p style={{ display: 'flex', alignItems: 'center' }}>
                                    <label>Anexo:</label>
                                    {atividade.ds_anexo ? (
                                        <>
                                            <a onClick={() => handleAnexoClick(atividade.ds_anexo)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                {atividade.ds_anexo.split('/').pop()}
                                                <FaFileAlt
                                                    className="icone-anexo"
                                                    style={{ marginLeft: '5px' }}
                                                />
                                            </a>
                                        </>
                                    ) : (
                                        'Nenhum anexo'
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showAtividadesModal && (
                <div className="modal-overlay">
                    <div className={`modal atividades-modal ${isClosingAtividadesModal ? 'fechar' : ''}`}>
                        {atividadeSelecionada ? (
                            <>
                                <div className="modal-header">
                                    <h3>Detalhes da Atividade</h3>
                                    <button className="fechar-modal" onClick={handleFecharAtividadesModal}>
                                        <FaTimes />
                                    </button>
                                </div>
                                <div className="conteudo-modal-atividades">
                                    <p><label>Task:</label> {atividadeSelecionada.cod_task}</p>
                                    <p><label>Aberto Por:</label> {atividadeSelecionada.aberto_por}</p>
                                    <p><label>Concluído Por:</label> {atividadeSelecionada.ds_concluido_por}</p>
                                    <p><label>Status:</label> {atividadeSelecionada.status}</p>
                                    <p><label>Início:</label> {atividadeSelecionada.aberto_em}</p>
                                    <p><label>Fim:</label> {atividadeSelecionada.dt_fim}</p>
                                    <p><label>Destinatário:</label> {atividadeSelecionada.executor}</p>
                                    <p><label>Descrição:</label> {atividadeSelecionada.descricao}</p>
                                    <p><label>Visibilidade:</label> {atividadeSelecionada.tipo_atividade}</p>
                                    <p><label>Duração (Útil):</label> {atividadeSelecionada.tempo}</p>
                                    <p><label>Duração (Corrida):</label> {atividadeSelecionada.tempo_corrido}</p>
                                    <p><label>Observações:</label> {atividadeSelecionada.ds_obs}</p>
                                    <p style={{ display: 'flex', alignItems: 'center' }}>
                                        <label>Anexo:</label>
                                        {atividadeSelecionada.ds_anexo ? (
                                            <>
                                                <a onClick={() => handleAnexoClick(atividadeSelecionada.ds_anexo)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                    {atividadeSelecionada.ds_anexo.split('/').pop()}
                                                    <FaFileAlt
                                                        className="icone-anexo"
                                                        style={{ marginLeft: '5px' }}
                                                    />
                                                </a>
                                            </>
                                        ) : (
                                            'Nenhum anexo'
                                        )}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="modal-header">
                                    <h3>Ticket #{data.cod_fluxo}</h3>
                                    <button className="fechar-modal" onClick={handleFecharAtividadesModal}>
                                        <FaTimes />
                                    </button>
                                </div>
                                <div className="conteudo-modal-atividades">
                                    <div className="campo-detalhe">
                                        <label htmlFor="inicio-task">Início:</label>
                                        <input type="text" id="inicio-task" value={inicio} readOnly />
                                    </div>
                                    <div className="campo-detalhe">
                                        <label htmlFor="aberto-por-task">Aberto Por:</label>
                                        <input type="text" id="aberto-por-task" value={user.name} readOnly />
                                    </div>
                                    <textarea className="textarea-atividade" placeholder="Descrição" id="descricao-task"></textarea>
                                    <p>
                                        <label>Status:</label>
                                        <select id="status-task">
                                            <option></option>
                                            {options.status.map((status, index) => (
                                                <option key={index} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </p>
                                    <p>
                                        <label>Destinatário:</label>
                                        <select className="select-destinatario" id="executor-task">
                                            <option></option>
                                            {options.destinatarios.map((destinatario, index) => (
                                                <option key={index} value={destinatario}>{destinatario}</option>
                                            ))}
                                        </select>
                                    </p>
                                    <div className="switch-container">
                                        <label className="switch-label">
                                            <input type="radio" name="visibilidade" value="Pública" className="radio-visibilidade" />
                                            Pública
                                        </label>

                                    </div>
                                    <div className="campo-anexo">
                                        <label htmlFor="anexoAtividade" className="label-anexo">Anexar Arquivo:</label>
                                        <input type="file" id="anexoAtividade" className="input-anexo" />
                                    </div>
                                    <button className="botao-salvar-atividade" onClick={handleSalvarAtividade}>Salvar</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {showSuccessMessage && (
                <div className={`success-message ${showSuccessMessage ? 'show' : 'hide'}`}>
                    Ticket salvo com sucesso!
                </div>
            )}
        </div>
    );
};

export default Modal;
