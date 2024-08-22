import React, { useState } from 'react';
import { FaTimes, FaFileAlt, FaPlus, FaEdit } from 'react-icons/fa';

const Modal = ({ data, onClose }) => {
    const [showAtividadesModal, setShowAtividadesModal] = useState(false);
    const [isClosingAtividadesModal, setIsClosingAtividadesModal] = useState(false);
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [prioridadeSelecionada, setPrioridadeSelecionada] = useState(null);
    const [isEditing, setIsEditing] = useState({
        hub: false,
        unidadeNegocio: false,
        categoria: false,
        subcategoria: false,
        assunto: false
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

    const handleEditClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: true }));
    };

    const handleFieldChange = (field, value) => {
        console.log(field, value)
        setIsEditing((prev) => ({ ...prev, [field]: false }));
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

    const options = {
        hub: ['Hub 1', 'Hub 2', 'Hub 3'],
        unidadeNegocio: ['Unidade 1', 'Unidade 2', 'Unidade 3'],
        categoria: ['Categoria 1', 'Categoria 2', 'Categoria 3'],
        subcategoria: ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3'],
        assunto: ['Assunto 1', 'Assunto 2', 'Assunto 3']
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
                            <p><strong>SLA (Útil):</strong>
                                <span
                                    className="sla-bolinha"
                                    style={{
                                        backgroundColor: slaOptions[data.sla_util] || '#000',
                                        marginRight: '8px'
                                    }}
                                ></span>
                                {data.sla_util}
                            </p>

                            {data.status !== 'Concluido' && data.status !== 'Cancelado' && (
                                <>
                                    <p><strong>HUB:</strong>
                                        {isEditing.hub ? (
                                            <select
                                                value={data.hub}
                                                onChange={(e) => handleFieldChange('hub', e.target.value)}
                                                onBlur={() => handleFieldChange('hub', data.hub)}
                                            >
                                                {options.hub.map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <>
                                                {data.hub}
                                                <FaEdit
                                                    className="edit-icon"
                                                    onClick={() => handleEditClick('hub')}
                                                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                />
                                            </>
                                        )}
                                    </p>

                                    <p><strong>Unidade de Negócio:</strong>
                                        {isEditing.unidadeNegocio ? (
                                            <select
                                                value={data.unidadeNegocio}
                                                onChange={(e) => handleFieldChange('unidadeNegocio', e.target.value)}
                                                onBlur={() => handleFieldChange('unidadeNegocio', data.unidadeNegocio)}
                                            >
                                                {options.unidadeNegocio.map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <>
                                                {data.unidadeNegocio}
                                                <FaEdit
                                                    className="edit-icon"
                                                    onClick={() => handleEditClick('unidadeNegocio')}
                                                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                />
                                            </>
                                        )}
                                    </p>

                                    <p><strong>Categoria:</strong>
                                        {isEditing.categoria ? (
                                            <select
                                                value={data.categoria}
                                                onChange={(e) => handleFieldChange('categoria', e.target.value)}
                                                onBlur={() => handleFieldChange('categoria', data.categoria)}
                                            >
                                                {options.categoria.map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <>
                                                {data.categoria}
                                                <FaEdit
                                                    className="edit-icon"
                                                    onClick={() => handleEditClick('categoria')}
                                                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                />
                                            </>
                                        )}
                                    </p>

                                    <p><strong>Subcategoria:</strong>
                                        {isEditing.subcategoria ? (
                                            <select
                                                value={data.subcategoria}
                                                onChange={(e) => handleFieldChange('subcategoria', e.target.value)}
                                                onBlur={() => handleFieldChange('subcategoria', data.subcategoria)}
                                            >
                                                {options.subcategoria.map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <>
                                                {data.subcategoria}
                                                <FaEdit
                                                    className="edit-icon"
                                                    onClick={() => handleEditClick('subcategoria')}
                                                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                />
                                            </>
                                        )}
                                    </p>

                                    <p><strong>Assunto:</strong>
                                        {isEditing.assunto ? (
                                            <select
                                                value={data.assunto}
                                                onChange={(e) => handleFieldChange('assunto', e.target.value)}
                                                onBlur={() => handleFieldChange('assunto', data.assunto)}
                                            >
                                                {options.assunto.map((option, index) => (
                                                    <option key={index} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <>
                                                {data.assunto}
                                                <FaEdit
                                                    className="edit-icon"
                                                    onClick={() => handleEditClick('assunto')}
                                                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                />
                                            </>
                                        )}
                                    </p>
                                </>
                            )}

                            <p><strong>Nome Completo:</strong> {data.nomeCompleto}</p>
                            <p><strong>Matrícula:</strong> {data.matricula}</p>
                            <p><strong>Telefone:</strong> {data.telefone}</p>
                            <p><strong>E-mail Solicitante:</strong> {data.emailSolicitante}</p>
                            <p><strong>Cargo:</strong> {data.cargo}</p>
                            <p><strong>Data de Criação:</strong> {data.abertura}</p>
                            <p><strong>Descrição:</strong> {data.descricao}</p>
                            <p style={{ display: 'flex', alignItems: 'center' }}><strong>Autorização:</strong>&nbsp;
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
                        {data.status !== 'Concluido' && data.status !== 'Cancelado' && (
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
                                        <p><strong>Descrição:</strong> {atividade.descricao}</p>
                                        <p><strong>Destinatário:</strong> {atividade.destinatario}</p>
                                        <p><strong>Visibilidade:</strong> {atividade.visibilidade}</p>
                                        <p><strong>Anexo:</strong>
                                            {atividade.anexo}&nbsp;
                                            <FaFileAlt
                                                className="icone-anexo"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => window.open(URL.createObjectURL(new Blob([atividade.anexo])))}
                                            />
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                    <p><strong>Descrição:</strong> {atividadeSelecionada.descricao}</p>
                                    <p><strong>Destinatário:</strong> {atividadeSelecionada.destinatario}</p>
                                    <p><strong>Visibilidade:</strong> {atividadeSelecionada.visibilidade}</p>
                                    <p><strong>Anexo:</strong>
                                        {atividadeSelecionada.anexo}&nbsp;
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
                                    <p><strong>Início:</strong> {data.abertura}</p>
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
                                    <p><strong>SLA (Útil):</strong>
                                        <span
                                            className="sla-bolinha"
                                            style={{
                                                backgroundColor: slaOptions[data.sla_util] || '#000',
                                                marginRight: '8px'
                                            }}
                                        ></span>
                                        {data.sla_util}
                                    </p>
                                    <textarea className="textarea-atividade" placeholder="Descrição"></textarea>
                                    <select className="select-destinatario">
                                        <option value="">Selecionar Destinatário</option>
                                        {[...Array(10).keys()].map(i => (
                                            <option key={i} value={`Opção ${i + 1}`}>Opção {i + 1}</option>
                                        ))}
                                    </select>
                                    <div className="switch-container">
                                        <label className="switch-label">
                                            Pública
                                            <input type="radio" name="visibilidade" value="publica" className="radio-visibilidade" />
                                        </label>
                                        <label className="switch-label">
                                            Privada
                                            <input type="radio" name="visibilidade" value="privada" className="radio-visibilidade" />
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