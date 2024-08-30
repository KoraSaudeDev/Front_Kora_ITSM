import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaFileAlt, FaPlus, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Modal = ({ data, onClose }) => {
    const { user } = useAuth();
    const [inicio, setInicio] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showAtividadesModal, setShowAtividadesModal] = useState(false);
    const [showAnexosModal, setShowAnexosModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [isClosingAtividadesModal, setIsClosingAtividadesModal] = useState(false);
    const [isClosingAnexosModal, setIsClosingAnexosModal] = useState(false);
    const [isClosingModal, setIsClosingModal] = useState(false);
    const [atividades, setAtividades] = useState([]);
    const [anexos, setAnexos] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
    const [anexoSelecionado, setAnexoSelecionado] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [prioridadeSelecionada, setPrioridadeSelecionada] = useState(data.ds_nivel);
    const [selectedHub, setSelectedHub] = useState(data.hub || '');
    const [selectedCategoria, setSelectedCategoria] = useState(data.categoria || '');
    const [selectedSubcategoria, setSelectedSubcategoria] = useState(data.subcategoria || '');
    const [selectedUnidade, setSelectedUnidade] = useState(data.unidade || '');
    const [selectedAssunto, setSelectedAssunto] = useState(data.assunto || '');
    const [emailDomains, setEmailDomains] = useState([]);
    const [isEmailDomainEditable, setIsEmailDomainEditable] = useState(false);
    const [isAllowedCreateUser, setIsAllowedCreateUser] = useState(false);
    const fileInputRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState(data.dominio_email || '');
    const [organizacaoDomains, setOrganizacaoDomains] = useState(data.organizacao_dominio || '');
    const [options, setOptions] = useState({
        hub: [],
        unidade: [],
        categoria: [],
        subcategoria: [],
        assunto: [],
        status: [],
        destinatarios: []
    });

    const formsEspecificos = {
        "novo_usuario": data.novo_usuario,
        "primeiro_nome_user": data.primeiro_nome_user,
        "sobrenome_user": data.sobrenome_user,
        "email_user": data.email_user,
        "usuario_mv": data.usuario_mv,
        "dt_nascimento": data.dt_nascimento,
        "cpf": data.cpf,
        "matricula_senior": data.matricula_senior,
        "matricula_final": data.matricula_final,
        "n_tel_usuario": data.n_tel_usuario,
        "usuario_modelo": data.usuario_modelo,
        "ds_tipo_colaborador": data.ds_tipo_colaborador,
        "hub_novo_usu": data.hub_novo_usu,
        "unidade_novo_usu": data.unidade_novo_usu,
        "centro_custo": data.centro_custo,
        "cargo": data.cargo,
        "departamento_novo_usuario": data.departamento_novo_usuario,
        "ds_entidade": data.ds_entidade,
        "ds_acesso_solic": data.ds_acesso_solic,
        "cod_prest_mv": data.cod_prest_mv,
        "tipo_usuario": data.tipo_usuario,
        "ds_vinc_empr": data.ds_vinc_empr,
        "empresa_colab_cadastrado": data.empresa_colab_cadastrado,
        "sigla_cp": data.sigla_cp,
        "registro_cp": data.registro_cp,
        "ds_tipo_cargo": data.ds_tipo_cargo,
        "dominio_email": data.dominio_email,
        "organizacao_dominio": data.organizacao_dominio,
        "ds_licenca": data.ds_licenca,
        "ds_custo_novo_usu": data.ds_custo_novo_usu,
        "ds_gestor": data.ds_gestor,
        "ds_email_gestor": data.ds_email_gestor,
        "ds_gerente": data.ds_gerente,
        "ds_email_gerente": data.ds_email_gerente,
        "aprovador_sap": data.aprovador_sap,
        "public_alvo": data.public_alvo,
        "obj_comunicacao": data.obj_comunicacao,
        "n_verba": data.n_verba,
        "material_referencia": data.material_referencia,
        "urgencia": data.urgencia,
        "ds_endereco": data.ds_endereco,
        "email_receb_alias": data.email_receb_alias,
        "endereco_alias": data.endereco_alias,
        "ds_obs": data.ds_obs,
    };
    const formsEspecificosLabels = {
        "novo_usuario": "Nome Completo Usuário",
        "primeiro_nome_user": "Primeiro Nome do Usuário",
        "sobrenome_user": "Sobrenome do Usuário",
        "email_user": "Email do Usuário",
        "usuario_mv": "Usuário MV",
        "dt_nascimento": "Data de Nascimento",
        "cpf": "CPF",
        "matricula_senior": "Matrícula Senior",
        "matricula_final": "Matrícula Final",
        "n_tel_usuario": "Telefone do Usuário",
        "usuario_modelo": "Usuário Modelo",
        "ds_tipo_colaborador": "Tipo de Colaborador",
        "hub_novo_usu": "Hub do Novo Usuário",
        "unidade_novo_usu": "Unidade do Novo Usuário",
        "centro_custo": "Centro de Custo",
        "cargo": "Cargo",
        "departamento_novo_usuario": "Departamento do Novo Usuário",
        "ds_entidade": "Entidade",
        "ds_acesso_solic": "Acesso Solicitado",
        "cod_prest_mv": "Código do Prestador MV",
        "tipo_usuario": "Tipo de Usuário",
        "ds_vinc_empr": "Vínculo Empregatício",
        "empresa_colab_cadastrado": "Empresa do Colaborador Cadastrado",
        "sigla_cp": "Sigla CP",
        "registro_cp": "Registro CP",
        "ds_tipo_cargo": "Tipo de Cargo",
        "dominio_email": "Domínio de Email",
        "organizacao_dominio": "Organização do Domínio",
        "ds_licenca": "Licença",
        "ds_custo_novo_usu": "Custo do Novo Usuário",
        "ds_gestor": "Gestor",
        "ds_email_gestor": "Email do Gestor",
        "ds_gerente": "Gerente",
        "ds_email_gerente": "Email do Gerente",
        "aprovador_sap": "Aprovador SAP",
        "public_alvo": "Público Alvo",
        "obj_comunicacao": "Objetivo de Comunicação",
        "n_verba": "Número de Verba",
        "material_referencia": "Material de Referência",
        "urgencia": "Urgência",
        "ds_endereco": "Endereço",
        "email_receb_alias": "Email Recebido pelo Alias",
        "endereco_alias": "Endereço do Alias",
        "ds_obs": "Observações",
    };
    const statusOptions = {
        "Em Andamento": "#ffc107",
        "Em Atendimento": "#A6c620",
        "Aguardando Retorno Fornecedor": "#17a2b8",
        "Aguardando Retorno": "#fd7e90",
        "Em Aberto": "#007bff",
        "Agendada": "#6610f2",
        "Criação de Usuário": "#fd7e14",
        "Finalizado": "#229a00",
        "Cancelado": "#FF0000"
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
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/ticket-files?id=${data.id}`);
                const sortedFiles = response.data.sort((a, b) => new Date(a.dataAbertura) - new Date(b.dataAbertura));
                setAnexos(sortedFiles);
            } catch (error) {
                console.error('Erro ao buscar os anexos:', error);
            }
        };

        fetchFiles();
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

        if (showAtividadesModal || showAnexosModal) {
            const now = new Date();
            const formattedDate = formatCustomDate(now);
            setInicio(formattedDate);
        }
    }, [showAtividadesModal, showAnexosModal]);

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
                const formattedData = response.data.map(destinatario => ({
                    value: `${destinatario.id} - ${destinatario.fila}`,
                    label: destinatario.fila
                }));
                setOptions(prevOptions => ({ ...prevOptions, destinatarios: formattedData }));
            })
            .catch(error => {
                console.error('Error fetching destinatarios options:', error);
            });

    }, []);

    useEffect(() => {
        if (
            data.categoria === "Acesso/Rede" &&
            data.subcategoria === "Contas de E-mail/Rede" &&
            data.ctrl_criacao_usuario === 3 &&
            (data.assunto.includes("E-mail") || data.assunto.includes("Rede")) &&
            (data.status === "Em Andamento" || data.status === "Em Aberto")
        ) {
            setIsEmailDomainEditable(true);
            setIsAllowedCreateUser(true);

            axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/dominios-email`)
                .then(response => {
                    setEmailDomains(response.data);
                })
                .catch(error => {
                    console.error('Error fetching email domains:', error);
                });
        } else {
            setIsEmailDomainEditable(false);
            setIsAllowedCreateUser(false);
        }
    }, [data]);

    if (!data) return null;

    function formatDate(dateString, type = 1) {
        if (!dateString) {
            return '';
        }

        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        if (type === 1) return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        else if (type === 2) return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        else return '';
    }


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

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        if (files.length > 0) {
            const updatedFiles = files.map((file) => ({
                file,
                uploadType: 3,
            }));

            setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);

            const newAnexos = files.map((file) => ({
                cod_fluxo: data.id,
                ds_adicionado_por: user.name,
                abertura: formatDate(new Date().toISOString(), 2),
                ds_texto: '',
                ds_anexo: file.name,
                alterar: 1,
            }));

            setAnexos((prevAnexos) => [...prevAnexos, ...newAnexos]);
        }
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

    const handleAbrirAnexosModal = () => {
        setAnexoSelecionado(null);
        setShowAnexosModal(true);
    };

    const handleFecharAnexosModal = () => {
        setIsClosingAnexosModal(true);
        setTimeout(() => {
            setShowAnexosModal(false);
            setIsClosingAnexosModal(false);
        }, 500);
    };

    const handleSalvarAtividade = () => {
        const aberto_em = document.querySelector('#inicio-task').value;
        const aberto_por = document.querySelector('#aberto-por-task').value;
        const descricao = document.querySelector('#descricao-task').value.trim();
        var executor = document.querySelector('#executor-task').value;
        const status = document.querySelector('#status-task').value;
        var tipo_atividade_checkbox = document.querySelector('input#tipo-atividade');

        var tipo_atividade = 'Privada';
        if (tipo_atividade_checkbox && tipo_atividade_checkbox.checked) {
            tipo_atividade = 'Pública';
        }

        if (!descricao || !status || !executor) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        executor = executor.split(' - ');

        const novaAtividade = {
            cod_fluxo: data.id,
            alterar: 1,
            aberto_em,
            aberto_por,
            status,
            descricao,
            id_executor: executor[0],
            executor: executor[1],
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

    const handleAbrirDetalhesAnexo = (anexo) => {
        setAnexoSelecionado(anexo);
        setIsEditMode(false);
        setShowAnexosModal(true);
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

    const handleDomainChange = (event) => {
        const selectedDomain = event.target.value;
        setSelectedDomain(selectedDomain);

        const selectedOrganization = emailDomains.find(domain => domain.dominio === selectedDomain)?.organizacao || '';
        setOrganizacaoDomains(selectedOrganization);
    };

    const handlePrioridadeClick = (prioridade) => {
        setPrioridadeSelecionada(prioridade);
    };

    const handleSalvarTicket = async (statusParam = null) => {
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

        //showLoadingOverlay();

        const insert_anexos = anexos.filter(task => task.alterar === 1 && task.id === undefined);

        const update_tasks = atividades
            .filter(task => task.alterar === 1 && task.id !== undefined)
            .map(task => ({
                cod_task: task.cod_task,
                ds_concluido_por: task.ds_concluido_por,
                dt_fim: task.dt_fim,
            }));

        const insert_tasks = atividades.filter(task => task.alterar === 1 && task.id === undefined);

        const ultimoItem = atividades[atividades.length - 1];

        //const resposta_chamado = document.querySelector("#resp-chamado").value;

        const update_tickets = {
            hub: selectedHub,
            unidade: selectedUnidade,
            categoria: selectedCategoria,
            subcategoria: selectedSubcategoria,
            assunto: selectedAssunto,
            ds_nivel: prioridadeSelecionada,
            status: statusParam === null ? toTitleCase(ultimoItem.status) : statusParam,
            executor: ultimoItem.id_executor,
            grupo: ultimoItem.executor,
            sla: prioridades.find(line => line.prioridade === prioridadeSelecionada)?.sla,
            //resposta_chamado: resposta_chamado === '' ? null : resposta_chamado
        };

        if (selectedDomain) update_tickets.dominio_email = selectedDomain;
        if (organizacaoDomains) update_tickets.organizacao_dominio = organizacaoDomains

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
                    if (selectedFiles[i].uploadType === 1) {
                        update_tickets.anexo_resposta = response?.data?.filename;
                    } else if (selectedFiles[i].uploadType === 2) {
                        const matchedAtividade = insert_tasks.find(task => task.ds_anexo === selectedFiles[i].file.name);
                        if (matchedAtividade) {
                            matchedAtividade.ds_anexo = response?.data?.filename;
                        }
                    } else if (selectedFiles[i].uploadType === 3) {
                        const matchedFile = insert_anexos.find(task => task.ds_anexo === selectedFiles[i].file.name);
                        if (matchedFile) {
                            matchedFile.ds_anexo = response?.data?.filename;
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
                delete task.id_executor;
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

            for (const file of insert_anexos) {
                delete file.alterar;

                const fileConfig = {
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/file`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(file)
                };

                await sendRequest(fileConfig);
            }

            hideLoadingOverlay();

            setSuccessMessage('Ticket salvo com sucesso!');
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                window.location.reload();
            }, 1800);

        } catch (error) {
            hideLoadingOverlay();
            console.error("Error saving ticket and tasks:", error);
        }
    };

    const handleCreateUser = async () => {
        if (!selectedDomain || !organizacaoDomains) {
            alert('Por favor, preencha um domínio de email que possua organização.');
            return;
        }

        showLoadingOverlay();

        const param = {
            "Status": data.status,
            "Abertura": data.abertura,
            "Telefone": data.n_tel_usuario,
            "Email": data.email_solicitante,
            "gestor_imediato": data.ds_gestor,
            "gestor_imediato_email": data.ds_email_gestor,
            "gerente_area": data.ds_gerente,
            "nome_usuario": data.novo_usuario,
            "hub_usuario": data.hub_novo_usu,
            "unidade_usuario": data.unidade_novo_usu,
            "funcao_usuario": data.cargo,
            "departamento_usuario": data.departamento_novo_usuario,
            "senha_usuario": `${data.id}@`,
            "tipo_licenca": data.ds_licenca,
            "email_gerente": data.ds_email_gerente,
            "dominio_email": selectedDomain,
            "organizacao_dominio": organizacaoDomains,
            "centro_custo": data.centro_custo,
            "matricula_usuario": data.matricula_final,
            "tipo_colaborador": data.ds_tipo_colaborador,
            "Nome_Empresa": data.Nome_Empresa,
            "Logon_Script": data.Logon_Script,
            "Cidade": data.Cidade,
            "Estado": data.Estado,
            "CEP": data.CEP,
            "Pais": data.Pais,
            "Site": data.Site,
            "Endereco": data.Endereco,
            "cod_empresa": data.cod_empresa,
            "telefone_empresa": data.telefone_empresa,
            "N° Ticket": data.cod_fluxo,
            "id": data.id,
            "tipo_criacao": data.ctrl_criacao_usuario,
            "app": "tickets"
        }

        const config = {
            method: 'post',
            url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/create-user-google`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(param)
        };
        const response = await axios.request(config);
        console.log(response.data);

        hideLoadingOverlay();
        setSuccessMessage(response.data);
        setShowSuccessMessage(true);

        setTimeout(() => {
            setShowSuccessMessage(false);
            handleSalvarTicket('Criação de Usuário');
        }, 1300);
    }

    const handleCloseModal = () => {
        setIsClosingModal(true);
        setTimeout(() => {
            onClose();
            setIsClosingModal(false);
        }, 500);
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    };

    const toggleExpand = () => {
        setIsExpanded(prevState => !prevState);
    };

    const convertStatusToTitleCase = (status) => {
        return status
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleOverlayClick = (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            handleCloseModal();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal ${isClosingModal ? 'fechar' : ''}`}>
                <div className="modal-header">
                    <h3>Ticket #{data.cod_fluxo}</h3>
                    <div className="botao-salvar-container">
                        {isAllowedCreateUser && (
                            <button className="botao-salvar-ticket" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleCreateUser}>
                                <FaUserPlus /> Criar Usuário
                            </button>
                        )}

                        <button className="botao-salvar-ticket" onClick={() => handleSalvarTicket()}>
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

                <div className={`conteudo-modal ${isExpanded ? 'expandido' : 'reduzido'}`}>
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
                        {Object.entries(formsEspecificos).map(([key, value]) => {
                            if (key === "dominio_email" && isEmailDomainEditable) {
                                return (
                                    <div key={key}>
                                        <p style={{ display: 'flex', alignItems: 'center' }}>
                                            <label htmlFor="dominio_email" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>
                                                <strong>Domínio Email:</strong>
                                            </label>
                                            <select
                                                id="dominio_email"
                                                name="dominio_email"
                                                value={selectedDomain}
                                                onChange={(e) => {
                                                    setSelectedDomain(e.target.value);
                                                    handleDomainChange(e);
                                                }}
                                            >
                                                <option></option>
                                                {emailDomains.map((domain) => (
                                                    <option key={domain.dominio} value={domain.dominio}>
                                                        {domain.dominio}
                                                    </option>
                                                ))}
                                            </select>
                                        </p>
                                        {organizacaoDomains && (
                                            <p><strong>{formsEspecificosLabels['organizacao_dominio']}</strong> {organizacaoDomains}</p>
                                        )}
                                    </div>
                                );
                            } else if (key === "organizacao_dominio" && !isEmailDomainEditable) {
                                return (
                                    value !== null && value !== undefined && value !== '' && (
                                        <p key={key}>
                                            <strong>{formsEspecificosLabels[key]}:</strong> {value}
                                        </p>
                                    )
                                );
                            } else if (key === "organizacao_dominio" && isEmailDomainEditable) {
                                return;
                            }
                            else {
                                return (
                                    value !== null && value !== undefined && value !== '' && value !== 'R$ 0/Mês' && (
                                        <p key={key}>
                                            <strong>{formsEspecificosLabels[key]}:</strong> {value}
                                        </p>
                                    )
                                );
                            }
                        })}
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

                        <p><strong className="data">Abertura:</strong> {formatDate(data.abertura)}</p>
                        <p><strong className="data">Data Limite:</strong> {formatDate(data.data_limite)}</p>
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
                    </div>
                </div>

                <div className="ver-mais-container">
                    <button className="botao-ver-mais" onClick={toggleExpand}>
                        {isExpanded ? 'Ver Menos' : 'Ver Mais'}
                    </button>
                </div>


                <div className="campo-atividades">
                    <h4>Atividades e Anexos</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="botao-atividades" onClick={handleAbrirAtividadesModal}>
                            <FaPlus style={{ marginRight: '8px' }} /> Atividade
                        </button>
                        <div className="input-anexo-container">
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                className="botao-anexo"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <FaPlus style={{ marginRight: '8px' }} /> Anexo
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 3 }}>
                            {atividades.slice().reverse().map((atividade, index) => (
                                <div className="card-atividade" key={index} onClick={() => handleAbrirDetalhesAtividade(atividade)}>
                                    <div className="status-container" style={{ textAlign: 'right' }}>
                                        <span
                                            className="status-bolinha"
                                            style={{
                                                backgroundColor: statusOptions[convertStatusToTitleCase(atividade.status)] || '#000',
                                                marginRight: '8px'
                                            }}
                                        ></span>
                                    </div>

                                    <p id='status-bolinha'>{atividade.status}</p>
                                    <p><label>Início:</label> {formatDate(atividade.aberto_em)}</p>
                                    <p><label>Aberto por:</label> {atividade.aberto_por}</p>
                                    <p><label>Destinatário:</label> {atividade.executor}</p>
                                    <p><label>Descrição:</label> {truncateText(atividade.descricao, 50)}</p>

                                    <p style={{ display: 'flex', alignItems: 'center' }}>
                                        <label>Anexo:</label>
                                        {atividade.ds_anexo ? (
                                            <>
                                                <a onClick={() => handleAnexoClick(atividade.ds_anexo)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                    {atividade.ds_anexo.split('/').pop()}
                                                    <FaFileAlt className="icone-anexo" style={{ marginLeft: '5px' }} />
                                                </a>
                                            </>
                                        ) : (
                                            'Nenhum anexo'
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div style={{ flex: 1 }}>
                            {anexos.slice().reverse().map((anexo, index) => (
                                <div className="card-anexo" key={index} onClick={() => handleAnexoClick(anexo.ds_anexo)}>
                                    <p><strong>Nome:</strong> {anexo.ds_adicionado_por}</p>
                                    <p><strong>Data de Abertura:</strong> {formatDate(anexo.abertura)}</p>
                                    <p><strong>Arquivo:</strong>
                                        <a>
                                            {anexo.ds_anexo.split('/').pop()}
                                            <FaFileAlt
                                                className="icone-anexo"
                                                style={{ marginLeft: '5px' }}
                                            />
                                        </a>
                                    </p>
                                </div>
                            ))}
                        </div>
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
                                                <option key={index} value={destinatario.value}>{destinatario.label}</option>
                                            ))}
                                        </select>
                                    </p>
                                    <div className="switch-container">
                                        <label htmlFor="tipo-atividade">Pública:</label>
                                        <label className="switch">
                                            <input type="checkbox" id="tipo-atividade" />
                                            <span className="slider round"></span>
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

            {showAnexosModal && anexoSelecionado && (
                <div className="modal-overlay">
                    <div className={`modal anexos-modal ${isClosingAnexosModal ? 'fechar' : ''}`}>
                        <div className="modal-header">
                            <h3>Detalhes do Anexo</h3>
                            <button className="fechar-modal" onClick={handleFecharAnexosModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="conteudo-modal-anexos">
                            <p><label>Nome:</label> {anexoSelecionado.ds_adicionado_por}</p>
                            <p><label>Data de Abertura:</label> {anexoSelecionado.abertura}</p>
                            <p><label>Descrição:</label> {anexoSelecionado.ds_texto}</p>
                            <p style={{ display: 'flex', alignItems: 'center' }}>
                                <label>Arquivo:</label>
                                <a onClick={() => handleAnexoClick(anexoSelecionado.ds_anexo)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    {anexoSelecionado.ds_anexo.split('/').pop()}
                                    <FaFileAlt
                                        className="icone-anexo"
                                        style={{ marginLeft: '5px' }}
                                    />
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessMessage && (
                <div className={`success-message ${showSuccessMessage ? 'show' : 'hide'}`}>
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default Modal;
