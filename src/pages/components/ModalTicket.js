import React, { useState, useEffect } from 'react';
import { FaTimes, FaFileAlt, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Modal = ({ data, onClose }) => {
    const { user } = useAuth();
    const [inicio, setInicio] = useState('');
    const [showAtividadesModal, setShowAtividadesModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isClosingAtividadesModal, setIsClosingAtividadesModal] = useState(false);
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
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
        if (showAtividadesModal) {
          const now = new Date();
          const formattedDate = now.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          setInicio(formattedDate.replace(',', ''));
        }
      }, [showAtividadesModal]);

    if (!data) return null;

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
        const descricao = document.querySelector('.conteudo-modal-atividades textarea').value.trim();
        const destinatario = document.querySelector('.conteudo-modal-atividades select').value;
        const visibilidade = document.querySelector('input[name="visibilidade"]:checked');
        const anexo = document.querySelector('#anexoAtividade').files[0]?.name || 'Nenhum anexo';

        if (!descricao || !destinatario || !visibilidade) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const novaAtividade = {
            descricao,
            destinatario,
            visibilidade: visibilidade.value,
            anexo
        };

        setAtividades([...atividades, novaAtividade]);
        handleFecharAtividadesModal();
    };

    const handleRemoverAtividade = (index) => {
        const novasAtividades = atividades.filter((_, i) => i !== index);
        setAtividades(novasAtividades);
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

    const handleSalvarTicket = () => {
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
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

    const prioridades = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

    return (
        <div>
            <div className="modal-overlay">
                <div className="modal">
                    <button className="fechar-modal" onClick={onClose}><FaTimes /></button>
                    <div className="conteudo-modal">
                        <div className="conteudo-modal-esquerda">
                            <h3>Detalhes do Ticket #{data.cod_fluxo}</h3>
                            <p><strong>Abertura:</strong> {data.abertura}</p>
                            <p><strong>Status:</strong>
                                <span
                                    className="status-bolinha"
                                    style={{
                                        backgroundColor: statusOptions[data.status] || '#000',
                                        marginRight: '8px'
                                    }}
                                ></span>
                                {data.status}
                            </p>
                            <p><strong>Data Limite:</strong>{data.data_limite}</p>
                            <p><strong>SLA (Útil):</strong>
                                <span
                                    className="sla-bolinha"
                                    style={{
                                        backgroundColor: slaOptions[data.st_sla] || '#000',
                                        marginRight: '8px'
                                    }}
                                ></span>
                                {data.st_sla}
                            </p>
                            <p><strong>Grupo | Destinatário:</strong>{data.grupo}</p>
                            <p><strong>Nome:</strong> {data.nome}</p>
                            <p><strong>Matrícula:</strong> {data.matricula}</p>
                            <p><strong>E-mail Solicitante:</strong> {data.email_solicitante}</p>
                            <p><strong>Cargo:</strong> {data.cargo_solic}</p>
                            <p><strong>Área de Negócio:</strong> {data.area_negocio}</p>
                            <p><strong>HUB:</strong>
                                <select
                                    value={selectedHub}
                                    onChange={(e) => handleFieldChange('hub', e.target.value)}
                                >
                                    {options.hub.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </p>
                            <p><strong>Unidade de Negócio:</strong>
                                <select
                                    value={selectedUnidade}
                                    onChange={(e) => handleFieldChange('unidade', e.target.value)}
                                    disabled={!selectedHub}
                                >
                                    {options.unidade.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </p>
                            <p><strong>Categoria:</strong>
                                <select
                                    value={selectedCategoria}
                                    onChange={(e) => handleFieldChange('categoria', e.target.value)}
                                >
                                    {options.categoria.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </p>
                            <p><strong>Subcategoria:</strong>
                                <select
                                    value={selectedSubcategoria}
                                    onChange={(e) => handleFieldChange('subcategoria', e.target.value)}
                                    disabled={!selectedCategoria}
                                >
                                    {options.subcategoria.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </p>
                            <p><strong>Assunto:</strong>
                                <select
                                    value={selectedAssunto}
                                    onChange={(e) => handleFieldChange('assunto', e.target.value)}
                                    disabled={!selectedSubcategoria}
                                >
                                    {options.assunto.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </p>
                            <p><strong>Descrição:</strong> {data.descricao}</p>
                            <p style={{ display: 'flex', alignItems: 'center' }}><strong>Anexo:</strong>&nbsp;
                                <a href={URL.createObjectURL(new Blob([data.autorizacao]))} target="_blank" rel="noopener noreferrer" style={{ marginRight: '5px' }}>
                                    Abrir
                                </a>
                                <FaFileAlt
                                    className="icone-anexo"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => window.open(URL.createObjectURL(new Blob([data.autorizacao])))}
                                />
                            </p>
                        </div>
                        <div className="conteudo-modal-direita">
                            <div className="campo-prioridades">
                                <label>Prioridade:</label>
                                <div className="botoes-prioridades">
                                    {prioridades.map(prioridade => (
                                        <button
                                            key={prioridade}
                                            className={`botao-prioridade ${prioridadeSelecionada === prioridade ? 'active' : ''}`}
                                            onClick={() => handlePrioridadeClick(prioridade)}
                                        >
                                            {prioridade}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button className="botao-atividades" onClick={handleAbrirAtividadesModal}>
                                <FaPlus style={{ marginRight: '8px' }} /> Atividades
                            </button>
                            {atividades.map((atividade, index) => (
                                <div className="card-atividade" key={index} onClick={() => handleAbrirDetalhesAtividade(atividade)}>
                                    <button className="remover-atividade" onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoverAtividade(index);
                                    }}>×</button>
                                    <p><strong>Cód. Task:</strong> {atividade.cod_task}</p>
                                    <p><strong>Status:</strong> {atividade.status}</p>
                                    <p><strong>Início:</strong> {atividade.aberto_em}</p>
                                    <p><strong>Fim:</strong> {atividade.dt_fim}</p>
                                    <p><strong>Destinatário:</strong> {atividade.executor}</p>
                                    <p><strong>Visibilidade:</strong> {atividade.tipo_atividade}</p>
                                    <p><strong>Anexo:</strong>
                                        {atividade.ds_anexo}&nbsp;
                                        <FaFileAlt
                                            className="icone-anexo"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => window.open(URL.createObjectURL(new Blob([atividade.anexo])))}
                                        />
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="botao-salvar-ticket" onClick={handleSalvarTicket}>Salvar</button>
                    </div>
                </div>
            </div>

            {showAtividadesModal && (
                <div className="modal-overlay">
                    <div className={`modal atividades-modal ${isClosingAtividadesModal ? 'fechar' : ''}`}>
                        <button className="fechar-modal" onClick={handleFecharAtividadesModal}>×</button>
                        <div className="conteudo-modal-atividades">
                            {atividadeSelecionada ? (
                                <>
                                    <h3>Detalhes da Atividade</h3>
                                    <p><strong>Cód. Task:</strong> {atividadeSelecionada.cod_task}</p>
                                    <p><strong>Aberto Por:</strong> {atividadeSelecionada.aberto_por}</p>
                                    <p><strong>Conluído Por:</strong> {atividadeSelecionada.ds_concluido_por}</p>
                                    <p><strong>Status:</strong> {atividadeSelecionada.status}</p>
                                    <p><strong>Início:</strong> {atividadeSelecionada.aberto_em}</p>
                                    <p><strong>Fim:</strong> {atividadeSelecionada.dt_fim}</p>
                                    <p><strong>Destinatário:</strong> {atividadeSelecionada.executor}</p>
                                    <p><strong>Descrição:</strong> {atividadeSelecionada.descricao}</p>
                                    <p><strong>Visibilidade:</strong> {atividadeSelecionada.tipo_atividade}</p>
                                    <p><strong>Duração (Útil):</strong> {atividadeSelecionada.tempo}</p>
                                    <p><strong>Duração (Corrida):</strong> {atividadeSelecionada.tempo_corrido}</p>
                                    <p><strong>Observações:</strong> {atividadeSelecionada.ds_obs}</p>
                                    <p><strong>Anexo:</strong>
                                        {atividadeSelecionada.ds_anexo}&nbsp;
                                        <FaFileAlt
                                            className="icone-anexo"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => window.open(URL.createObjectURL(new Blob([atividadeSelecionada.anexo])))}
                                        />
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3>Atividades do Ticket #{data.cod_fluxo}</h3>
                                    <p><strong>Início:</strong> {inicio}</p>
                                    <p><strong>Aberto Por:</strong> {user.name}</p>
                                    <textarea className="textarea-atividade" placeholder="Descrição"></textarea>
                                    <p><strong>Status:</strong>
                                        <select>
                                            <option>AGENDADA</option>
                                            <option>AGUARDANDO RETORNO</option>
                                            <option>AGUARDANDO RETORNO FORNECEDOR</option>
                                            <option>EM ABERTO</option>
                                            <option>EM ATENDIMENTO</option>
                                            <option>FINZALIZADO</option>
                                        </select>
                                    </p>
                                    <select className="select-destinatario">
                                        <option value="">Selecionar Destinatário</option>
                                        {[...Array(10).keys()].map(i => (
                                            <option key={i} value={`Opção ${i + 1}`}>Opção {i + 1}</option>
                                        ))}
                                    </select>
                                    <div className="switch-container">
                                        <label className="switch-label">
                                            <input type="radio" name="visibilidade" value="publica" className="radio-visibilidade" />
                                            Pública
                                        </label>
                                        <label className="switch-label">
                                            <input type="radio" name="visibilidade" value="privada" className="radio-visibilidade" checked />
                                            Privada
                                        </label>
                                    </div>
                                    <div className="campo-anexo">
                                        <label htmlFor="anexoAtividade" className="label-anexo">Anexar Arquivo:</label>
                                        <input type="file" id="anexoAtividade" className="input-anexo" />
                                    </div>
                                    <button className="botao-salvar-atividade" onClick={handleSalvarAtividade}>Salvar</button>
                                </>
                            )}
                        </div>
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