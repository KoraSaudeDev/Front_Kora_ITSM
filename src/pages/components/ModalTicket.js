import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { FaTimes, FaFileAlt, FaPlus, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Modal = ({ data, onClose }) => {
    const { user } = useAuth();
    const [inicioCheck, setInicioCheck] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [erro, setErro] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [adicionandoAtividades, setAdicionandoAtividades] = useState(false);
    const [adicionandoAnexos, setAdicionandoAnexos] = useState(false);
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
    const [prioridadeSelecionada, setPrioridadeSelecionada] = useState(data.ds_nivel);
    const [selectedHub, setSelectedHub] = useState(data.hub || '');
    const [selectedUnidade, setSelectedUnidade] = useState(data.unidade || '');
    const [selectedCategoria, setSelectedCategoria] = useState(data.categoria || '');
    const [selectedSubcategoria, setSelectedSubcategoria] = useState(data.subcategoria || '');
    const [selectedAssunto, setSelectedAssunto] = useState(data.assunto || '');
    const [selectedDestinatario, setSelectedDestinatario] = useState(data.executor || '');
    const [destinatarioDefault, setDestinatarioDefault] = useState(data.executor || '');
    const [selectedStatus, setSelectedStatus] = useState(data.status || '');
    const [dataLimite, setDataLimite] = useState(data.data_limite);
    const [sla, setSla] = useState('');
    const [emailDomains, setEmailDomains] = useState([]);
    const [isEmailDomainEditable, setIsEmailDomainEditable] = useState(false);
    const [isAllowedCreateUser, setIsAllowedCreateUser] = useState(false);
    const fileInputRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState(data.dominio_email || '');
    const [organizacaoDomains, setOrganizacaoDomains] = useState(data.organizacao_dominio || '');
    const [executor, setExecutor] = useState(null);
    const [options, setOptions] = useState({
        hub: [],
        unidade: [],
        categoria: [],
        subcategoria: [],
        assunto: [],
        status: [],
        destinatarios: [],
        prioridades: []
    });

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#007aff' : state.isFocused ? '#e0f7fa' : 'white', // Cor de fundo
            color: state.isSelected ? 'white' : '#3E4676', // Cor do texto
            padding: 10,
        }),
        control: (provided) => ({
            ...provided,
            borderColor: '#007aff', // Cor da borda do select
            boxShadow: 'none', // Remover sombra
            '&:hover': {
                borderColor: '#007aff', // Cor da borda ao passar o mouse
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#3E4676', // Cor do valor selecionado
        }),
    };

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
        "Em Andamento": "#20C997",
        "Em Atendimento": "#20C997",
        "Aguardando Retorno Fornecedor": "#E87C86",
        "Aguardando Retorno": "#F50057",
        "Em Aberto": "#3B7DDD",
        "Agendada": "#D500F9",
        "Criação de Usuário": "#FF3D00",
        "Finalizado": "#434343",
        "Cancelado": "#D50000"
    };
    const slaOptions = {
        "Em Atraso": "#dc3545",
        "No Prazo": "#28a745"
    };

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
                .then(response => setOptions(prev => ({ ...prev, assunto: response.data })))
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
            setInicioCheck(formattedDate);
            setInicio(formattedDate);
            setFim('');
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
                const formattedData = response.data.map(destinatario => {
                    if (String(destinatario.id) === String(selectedDestinatario)) {
                        setSelectedDestinatario(`${destinatario.id} - ${destinatario.fila}`)
                    }
                    return {
                        value: `${destinatario.id} - ${destinatario.fila}`,
                        label: destinatario.fila
                    };
                });
                setOptions(prevOptions => ({ ...prevOptions, destinatarios: formattedData }));
            })
            .catch(error => {
                console.error('Error fetching destinatarios options:', error);
            });
    }, []);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/sla`)
            .then(response => {
                setOptions(prevOptions => ({
                    ...prevOptions,
                    prioridades: response.data
                }));
                const prioridadeAtual = response.data.find(e => e.prioridade === prioridadeSelecionada);
                if (prioridadeAtual?.tipo_tempo === "Útil") {
                    setSla(data.st_sla)
                }
                else {
                    setSla(data.st_sla_corrido)
                }
            })
            .catch(error => {
                console.error("Erro ao buscar prioridades:", error);
            });
    }, []);

    useEffect(() => {
        if (
            data.categoria === "Acesso/Rede" &&
            data.subcategoria === "Contas de E-mail/Rede" &&
            [1, 2, 3].includes(data.ctrl_criacao_usuario) &&
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

    useEffect(() => {
        const updateAtividades = async () => {
            if (adicionandoAtividades) {
                showLoadingOverlay();

                const filteredFiles = selectedFiles.filter(file => file.uploadType === 2);

                const update_tasks = atividades
                    .filter(task => task.alterar === 1 && task.cod_task !== undefined)
                    .map(task => ({
                        cod_task: task.cod_task,
                        ds_concluido_por: task.ds_concluido_por,
                        dt_fim: formatDate(task.dt_fim, 2),
                    }));

                var insert_tasks = atividades.filter(task => task.alterar === 1 && task.cod_task === undefined);

                const ultimoItem = atividades[atividades.length - 1];

                const update_tickets = {
                    status: toTitleCase(ultimoItem?.status ?? data.status),
                    executor: (ultimoItem?.id_executor ?? data.executor),
                    grupo: (ultimoItem?.executor ?? data.grupo)
                };

                if (update_tickets.status === "Finalizado") {
                    update_tickets.finalizado_por = ultimoItem?.aberto_por ?? data.finalizado_por;
                    update_tickets.data_fim = ultimoItem?.aberto_em ?? formatDate(data.data_fim, 2);
                    update_tickets.bl_reabertura = 1;
                }

                setSelectedDestinatario(`${ultimoItem?.id_executor ?? data.executor} - ${ultimoItem?.executor ?? data.grupo}`);
                setDestinatarioDefault(ultimoItem?.id_executor ?? data.executor);
                setSelectedStatus(toTitleCase(ultimoItem?.status ?? data.status));

                try {
                    for (let i = 0; i < filteredFiles.length; i++) {
                        const formData = new FormData();
                        formData.append('file', filteredFiles[i].file);
                        formData.append('uploadType', filteredFiles[i].uploadType);

                        try {
                            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/tickets/file/upload`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            });

                            if (response.status === 202) {
                                const matchedAtividade = insert_tasks.find(task => task.ds_anexo === filteredFiles[i].file.name);
                                if (matchedAtividade) {
                                    matchedAtividade.ds_anexo = response?.data?.filename;
                                }
                            } else {
                                console.error(`Erro ao enviar o arquivo ${filteredFiles[i].file.name}:`, response);
                            }
                        } catch (error) {
                            console.error(`Erro ao enviar o arquivo ${filteredFiles[i].file.name}:`, error);
                        }
                    }

                    setSelectedFiles(prevFiles => prevFiles.filter(file => file.uploadType !== 2));

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
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify(task),
                        };

                        await sendRequest(taskConfig);
                    }

                    for (let i = 0; i < insert_tasks.length; i++) {
                        const taskCopy = { ...insert_tasks[i] };
                        delete taskCopy.id_executor;
                        delete taskCopy.alterar;

                        const taskConfig = {
                            method: 'post',
                            url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/task`,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify(taskCopy),
                        };

                        let retorno = await sendRequest(taskConfig);

                        setAtividades(prevAtividades => {
                            const updatedAtividades = [...prevAtividades];
                            const index = updatedAtividades.findIndex(a => a === insert_tasks[i]);
                            if (index !== -1) {
                                updatedAtividades[index] = { ...updatedAtividades[index], cod_task: retorno.task_id };
                            }
                            return updatedAtividades;
                        });
                        console.log(insert_tasks[i].status)

                        let emailSubject, emailBody, toEmails, emails;

                        switch (insert_tasks[i].status) {
                            case "AGUARDANDO RETORNO":
                                emailSubject = "Tickets - Aguardando Retorno";
                                emailBody = `<h1 style='color:blue'>Chamado aguardando retorno</h1><p>Email que era para ter recebido: ${data.email_solicitante}</p>`;
                                await sendEmail("pedro.magalhaes@korasaude.com.br", emailSubject, emailBody);
                                break;

                            case "EM ABERTO":
                            case "EM ATENDIMENTO":
                                emails = await getEmailsForQueue(ultimoItem?.id_executor ?? data.executor, data.unidade);
                                if (emails.length < 1) break;

                                emailSubject = "Tickets - Chamado Encaminhado";
                                emailBody = `<h1 style='color:blue'>Chamado encaminhado</h1><p>Emails: ${emails.join(', ')}</p>`;
                                await sendEmail("pedro.magalhaes@korasaude.com.br", emailSubject, emailBody);
                                break;

                            case "AGENDADA":
                                emails = await getEmailsForQueue(ultimoItem?.id_executor ?? data.executor, data.unidade);
                                emails.push(data.email_solicitante);

                                emailSubject = "Tickets - Chamado Agendado";
                                emailBody = `<h1 style='color:blue'>Chamado agendado</h1><p>Emails: ${emails.join(', ')}</p>`;
                                await sendEmail("pedro.magalhaes@korasaude.com.br", emailSubject, emailBody);
                                break;

                            case "FINALIZADO":
                                emailSubject = "Tickets - Finalizado";
                                emailBody = `<h1 style='color:blue'>Chamado finalizado</h1><p>Email que era para ter recebido: ${data.email_solicitante}</p>`;
                                await sendEmail("pedro.magalhaes@korasaude.com.br", emailSubject, emailBody);
                                break;

                            default:
                                break;
                        }
                    }

                    setAtividades(prevAtividades =>
                        prevAtividades.map(task => {
                            const { alterar, ...rest } = task;
                            return rest;
                        })
                    );

                    axios.post(`${process.env.REACT_APP_API_BASE_URL}/tickets/update/sla?cod_fluxo=${data.cod_fluxo}`);

                    const logConfig = {
                        method: 'post',
                        url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/log`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            "nome": user.name,
                            "email": user.email,
                            "cod_fluxo": data.cod_fluxo,
                            "log": JSON.stringify({
                                "updated_ticket": update_tickets,
                                "inserted_task": insert_tasks,
                                "updated_task": update_tasks
                            })
                        })
                    }
                    axios.request(logConfig);

                    hideLoadingOverlay();
                    setSuccessMessage('Atividade salva com sucesso!');
                    setShowSuccessMessage(true);
                    setTimeout(() => {
                        setShowSuccessMessage(false);
                    }, 1800);
                } catch (error) {
                    hideLoadingOverlay();
                    console.error("Error saving tasks:", error);
                }

                setAdicionandoAtividades(false);
            }
        };
        updateAtividades();
    }, [adicionandoAtividades]);

    useEffect(() => {
        const updateAnexos = async () => {
            if (adicionandoAnexos) {
                showLoadingOverlay();

                const filteredFiles = selectedFiles.filter(file => file.uploadType === 3);

                const insert_anexos = anexos.filter(file => file.alterar === 1 && file.cod_anexo === undefined);

                try {
                    for (let i = 0; i < filteredFiles.length; i++) {
                        const formData = new FormData();
                        formData.append('file', filteredFiles[i].file);
                        formData.append('uploadType', filteredFiles[i].uploadType);

                        try {
                            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/tickets/file/upload`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            });

                            if (response.status === 202) {
                                const matchedAnexos = insert_anexos.find(line => line.ds_anexo === filteredFiles[i].file.name);
                                if (matchedAnexos) {
                                    matchedAnexos.ds_anexo = response?.data?.filename;
                                }
                            } else {
                                console.error(`Erro ao enviar o arquivo ${filteredFiles[i].file.name}:`, response);
                            }
                        } catch (error) {
                            console.error(`Erro ao enviar o arquivo ${filteredFiles[i].file.name}:`, error);
                        }
                    }

                    setSelectedFiles(prevFiles => prevFiles.filter(file => file.uploadType !== 3));

                    for (let i = 0; i < insert_anexos.length; i++) {
                        const fileCopy = { ...insert_anexos[i] };
                        delete fileCopy.alterar;

                        const fileConfig = {
                            method: 'post',
                            url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/file`,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: JSON.stringify(fileCopy),
                        };

                        let retorno = await sendRequest(fileConfig);

                        setAnexos(prevAnexos => {
                            const updatedAnexos = [...prevAnexos];
                            const index = updatedAnexos.findIndex(a => a === insert_anexos[i]);
                            if (index !== -1) {
                                updatedAnexos[index] = { ...updatedAnexos[index], cod_anexo: retorno.anexo_id };
                            }
                            return updatedAnexos;
                        });
                    }

                    const logConfig = {
                        method: 'post',
                        url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/log`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            "nome": user.name,
                            "email": user.email,
                            "cod_fluxo": data.cod_fluxo,
                            "log": JSON.stringify({
                                "insert_anexos": insert_anexos
                            })
                        })
                    }
                    axios.request(logConfig);

                    hideLoadingOverlay();
                    setSuccessMessage('Anexo(s) salvo(s) com sucesso!');
                    setShowSuccessMessage(true);
                    setTimeout(() => {
                        setShowSuccessMessage(false);
                    }, 1800);
                } catch (error) {
                    hideLoadingOverlay();
                    console.error("Error saving anexos:", error);
                }

                setAdicionandoAnexos(false);
            }
        };
        updateAnexos();
    }, [adicionandoAnexos]);

    if (!data) return null;

    const sendRequest = async (config) => {
        try {
            const response = await axios.request(config);
            console.log(JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.error('Request Error:', error);
        }
    };

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
        else if (type === 3) return date.toISOString().slice(0, 19);
        else return '';
    };

    function toTitleCase(str) {
        if (str === "EM ATENDIMENTO") return "Em Andamento";
        if (str === "CANCELADA") return "Cancelado";
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const sendEmail = async (to, subject, body, cc = [], bcc = []) => {
        const emailConfig = {
            method: 'post',
            url: `${process.env.REACT_APP_API_BASE_URL}/email/send`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                to,
                subject,
                body,
                cc,
                bcc
            })
        };
        await sendRequest(emailConfig);
    };

    const getEmailsForQueue = async (executor, unidade) => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/email-fila?id_fila=${executor}&unidade=${unidade}`);
        return response.data;
    };

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

            setAdicionandoAnexos(true);
        }
    };

    const handleInicioChange = (e) => {
        const newInicio = e.target.value;
        if (fim && new Date(newInicio) > new Date(fim)) {
            setErro('A data de início não pode ser posterior à data de fim.');
            setTimeout(() => {
                setErro('');
            }, 4000);
        } else {
            setInicio(newInicio);
            setFim('');
            setErro('');
        }
    };

    const handleFimChange = (e) => {
        const newFim = e.target.value;
        if (inicio && new Date(newFim) < new Date(inicio)) {
            setErro('A data de fim não pode ser anterior à data de início.');
            setTimeout(() => {
                setErro('');
            }, 4000);
        } else {
            setFim(newFim);
            setErro('');
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

    const handleFecharAnexosModal = () => {
        setIsClosingAnexosModal(true);
        setTimeout(() => {
            setShowAnexosModal(false);
            setIsClosingAnexosModal(false);
        }, 500);
    };

    const handleSalvarAtividade = () => {
        const aberto_por = document.querySelector('#aberto-por-task').value;
        const descricao = document.querySelector('#descricao-task').value.trim();
        const status = document.querySelector('#status-task').value;
        var tipo_atividade_checkbox = document.querySelector('input#tipo-atividade');

        var tipo_atividade = 'Privada';
        if (tipo_atividade_checkbox && tipo_atividade_checkbox.checked) {
            tipo_atividade = 'Pública';
        }

        if (!descricao || !status || !executor || !inicio) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if (inicio !== inicioCheck && !fim) {
            alert("Como a data de início foi alterada, é obrigatório o preenchimento da data fim.");
            return;
        }

        var executorSplit = executor.value.split(' - ');

        const novaAtividade = {
            cod_fluxo: data.id,
            alterar: 1,
            aberto_em: formatDate(inicio, 2),
            aberto_por,
            status,
            descricao,
            id_executor: executorSplit[0],
            executor: executorSplit[1],
            tipo_atividade,
            ds_anexo: null
        };

        if (novaAtividade.status == "FINALIZADO") novaAtividade.dt_fim = novaAtividade.aberto_em;

        if (fim) novaAtividade.dt_fim = formatDate(fim, 2);

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
        setAdicionandoAtividades(true);
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
            case 'assunto':
                setSelectedAssunto(value);
                // const selectedAssuntoObj = options.assunto.find(option => option.assunto === value);
                // if (selectedAssuntoObj) {
                //     const destinatario = options.destinatarios.find(dest => dest.value.startsWith(selectedAssuntoObj.grupo_atendimento));
                //     if (destinatario) {
                //         setSelectedDestinatario(destinatario.value);
                //     }
                // }
                break;
            case 'unidade':
                setSelectedUnidade(value);
                break;
            case 'destinatarios':
                setSelectedDestinatario(value);
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

    const handlePrioridadeChange = async (event) => {
        setPrioridadeSelecionada(event.target.value)

        const prioridade = options.prioridades.find(p => p.prioridade === event.target.value);

        if (!prioridade) {
            console.error('Prioridade não encontrada');
            return;
        }

        let data_atualizada = null;
        const sla = parseInt(prioridade.sla, 10);

        if (prioridade.tipo_tempo === "Corrido") {
            data_atualizada = await adicionaMinutosCorridos(data.abertura, sla);
            const tempo_minutos_corridos = parseInt(data.tempo_minutos_corridos, 10);
            console.log(sla, tempo_minutos_corridos, tempo_minutos_corridos <= sla);
            setSla(tempo_minutos_corridos <= sla ? "No Prazo" : "Em Atraso");
        } else {
            data_atualizada = await adicionaMinutosUteis(data.abertura, sla);
            const tempo_minutos = parseInt(data.tempo_minutos, 10);
            console.log(sla, tempo_minutos, tempo_minutos <= sla);
            setSla(tempo_minutos <= sla ? "No Prazo" : "Em Atraso");
        }

        setDataLimite(data_atualizada);
    };

    const handleSalvarTicket = async (statusParam = null, senha = null) => {
        if (!selectedHub || !selectedUnidade || !selectedCategoria || !selectedSubcategoria || !selectedAssunto || !prioridadeSelecionada || !selectedDestinatario) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        showLoadingOverlay();

        const insert_tasks = [];

        const ultimoItem = atividades[atividades.length - 1];

        var id_executor = null;
        var executor = null;

        const destinatarioParts = selectedDestinatario.split(" - ");

        if (String(destinatarioParts[0]) !== String(destinatarioDefault)) {
            id_executor = destinatarioParts[0];
            executor = selectedDestinatario.substring(id_executor.length + 3);
            statusParam = "Em Andamento";

            insert_tasks.push({
                "cod_fluxo": data.id,
                "aberto_em": formatDate(new Date().toISOString(), 2),
                "aberto_por": user.name,
                "status": "EM ATENDIMENTO",
                "descricao": "Solicitação encaminhada...",
                "id_executor": id_executor,
                "executor": executor,
                "tipo_atividade": "Privada"
            });
        }

        //const resposta_chamado = document.querySelector("#resp-chamado").value;

        const update_tickets = {
            hub: selectedHub ?? data.hub,
            unidade: selectedUnidade ?? data.unidade,
            categoria: selectedCategoria ?? data.categoria,
            subcategoria: selectedSubcategoria ?? data.subcategoria,
            assunto: selectedAssunto ?? data.assunto,
            ds_nivel: prioridadeSelecionada ?? data.ds_nivel,
            status: statusParam === null ? toTitleCase(ultimoItem?.status ?? data.status) : statusParam,
            executor: id_executor === null ? (ultimoItem?.id_executor ?? data.executor) : id_executor,
            grupo: executor === null ? (ultimoItem?.executor ?? data.grupo) : executor,
            sla: options.prioridades.find(line => line.prioridade === prioridadeSelecionada)?.sla ?? data.sla,
            data_limite: dataLimite ?? data.data_limite
            //resposta_chamado: resposta_chamado === '' ? null : resposta_chamado
        };

        if (selectedDomain) update_tickets.dominio_email = selectedDomain;
        if (organizacaoDomains) update_tickets.organizacao_dominio = organizacaoDomains;
        if (senha) update_tickets.senha_usuario = senha;

        try {
            const ticketConfig = {
                method: 'patch',
                url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/${data.cod_fluxo}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(update_tickets)
            };

            await sendRequest(ticketConfig);

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
                
                let emailSubject, emailBody, emails;
                emails = await getEmailsForQueue(ultimoItem?.id_executor ?? data.executor, data.unidade);
                if (emails.length > 0) {
                    emailSubject = "Tickets - Chamado Encaminhado";
                    emailBody = `<h1 style='color:blue'>Chamado encaminhado</h1><p>Emails: ${emails.join(', ')}</p>`;
                    await sendEmail("pedro.magalhaes@korasaude.com.br", emailSubject, emailBody);
                }
            }

            axios.post(`${process.env.REACT_APP_API_BASE_URL}/tickets/update/sla?cod_fluxo=${data.cod_fluxo}`);

            const logConfig = {
                method: 'post',
                url: `${process.env.REACT_APP_API_BASE_URL}/tickets/update/log`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "nome": user.name,
                    "email": user.email,
                    "cod_fluxo": data.cod_fluxo,
                    "log": JSON.stringify({
                        "updated_ticket": update_tickets,
                        "inserted_task": insert_tasks
                    })
                })
            }
            axios.request(logConfig);

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

    async function adicionaMinutosUteis(dataInicio, minutos, horarioInicio = "08:00:00", horarioFim = "18:00:00") {
        let dataAtual = new Date(dataInicio);
        let horasDeTrabalhoPorDia = (new Date(`01/01/2000 ${horarioFim}`).getHours() - new Date(`01/01/2000 ${horarioInicio}`).getHours()) * 60;

        let dias = 0;
        let minutosRestantes = parseInt(minutos);

        function ehDiaUtil(data) {
            const diaDaSemana = data.getDay();
            return diaDaSemana > 0 && diaDaSemana < 6;
        }

        let horaAtualMinutos = dataAtual.getHours() * 60 + dataAtual.getMinutes();
        let inicioMinutos = parseInt(horarioInicio.split(":")[0]) * 60 + parseInt(horarioInicio.split(":")[1]);
        let fimMinutos = parseInt(horarioFim.split(":")[0]) * 60 + parseInt(horarioFim.split(":")[1]);

        if (horaAtualMinutos < inicioMinutos) {
            dataAtual.setHours(parseInt(horarioInicio.split(":")[0]), parseInt(horarioInicio.split(":")[1]), 0);
        } else if (horaAtualMinutos > fimMinutos) {
            dataAtual.setDate(dataAtual.getDate() + 1);
            dataAtual.setHours(parseInt(horarioInicio.split(":")[0]), parseInt(horarioInicio.split(":")[1]), 0);
        }

        while (minutosRestantes > 0) {
            if (ehDiaUtil(dataAtual)) {
                let horaAtual = dataAtual.getHours() * 60 + dataAtual.getMinutes();
                let minutosAteOFinalDoDia = fimMinutos - horaAtual;

                if (minutosRestantes <= minutosAteOFinalDoDia) {
                    dataAtual.setMinutes(dataAtual.getMinutes() + minutosRestantes);
                    minutosRestantes = 0;
                } else {
                    minutosRestantes -= minutosAteOFinalDoDia;
                    dataAtual.setDate(dataAtual.getDate() + 1);
                    dataAtual.setHours(parseInt(horarioInicio.split(":")[0]), parseInt(horarioInicio.split(":")[1]), 0);
                    dias++;
                }
            } else {
                dataAtual.setDate(dataAtual.getDate() + 1);
            }
        }

        // Formatação da data de retorno no formato "YYYY-MM-DD HH:MM:SS"
        let year = dataAtual.getFullYear();
        let month = dataAtual.getMonth() + 1;
        let day = dataAtual.getDate();
        let hour = dataAtual.getHours();
        let minute = dataAtual.getMinutes();
        let second = dataAtual.getSeconds();
        let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

        return formattedDate;
    }

    async function adicionaMinutosCorridos(dataInicio, minutos) {
        let dataAtual = new Date(dataInicio);
        dataAtual.setMinutes(dataAtual.getMinutes() + parseInt(minutos));

        let year = dataAtual.getFullYear();
        let month = dataAtual.getMonth() + 1;
        let day = dataAtual.getDate();
        let hour = dataAtual.getHours();
        let minute = dataAtual.getMinutes();
        let second = dataAtual.getSeconds();
        let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

        return formattedDate;
    }

    const handleCreateUser = async () => {
        if (!selectedDomain || !organizacaoDomains) {
            alert('Por favor, preencha um domínio de email que possua organização.');
            return;
        }

        try {
            if ([1, 3].includes(data.ctrl_criacao_usuario)) {
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
                    handleSalvarTicket('Criação de Usuário', `${data.id}@`);
                }, 1300);
            }
            else {
                handleSalvarTicket('Criação de Usuário', `${data.id}@`);
            }
        } catch (error) {
            hideLoadingOverlay();
            console.error("Error creating user:", error);
        }
    };

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
            if (showAtividadesModal) {
                handleFecharAtividadesModal();
            }
            else {
                handleCloseModal();
            }
        }

    };

    const categoriaOptions = options.categoria.map(option => ({ value: option, label: option }));
    const subcategoriaOptions = selectedCategoria
        ? [
            ...options.subcategoria.map(option => ({ value: option, label: option })),
            ...(options.subcategoria.includes(selectedSubcategoria)
                ? []
                : [{ value: selectedSubcategoria, label: selectedSubcategoria }])
        ]
        : [];
    const assuntoOptions = selectedSubcategoria
        ? [
            ...options.assunto.map(option => ({ value: option.assunto, label: option.assunto })),
            ...(options.assunto.find(option => option.assunto === selectedAssunto)
                ? []
                : [{ value: selectedAssunto, label: selectedAssunto }])
        ]
        : [];
    const destinatarioOptions = options.destinatarios.map((destinatario) => ({
        value: destinatario.value,
        label: destinatario.label,
    }));
    const filteredPrioridades = options.prioridades.filter(prioridade => {
        if (prioridadeSelecionada === 'P6') {
            return prioridade.prioridade !== 'P7';
        } else if (prioridadeSelecionada === 'P7') {
            return prioridade.prioridade !== 'P6';
        }
        return prioridade.prioridade !== 'P6' && prioridade.prioridade !== 'P7';
    });
    const unidadeOptions = selectedHub
        ? [
            ...options.unidade.map(option => ({ value: option, label: option })),
            ...(options.unidade.includes(selectedUnidade)
                ? []
                : [{ value: selectedUnidade, label: selectedUnidade }])
        ]
        : [];

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div id="loading-overlay" className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
            <div className={`modal ${isClosingModal ? 'fechar' : ''}`}>
                <div className="modal-header">
                    <h3>#{data.cod_fluxo}</h3>
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
                        <strong className="link-label">Categoria <span className="campo-obrigatorio">*</span></strong>
                        <Select
                            className="select-destinatario"
                            value={categoriaOptions.find(option => option.value === selectedCategoria) || null}
                            onChange={(selectedOption) => handleFieldChange('categoria', selectedOption ? selectedOption.value : '')}
                            options={categoriaOptions}
                            isClearable
                            placeholder=""
                            styles={customStyles}
                        />
                    </div>
                    <div className="campo-selecao">
                        <strong className="link-label">Subcategoria <span className="campo-obrigatorio">*</span></strong>
                        <Select
                            className="select-destinatario"
                            value={subcategoriaOptions.find(option => option.value === selectedSubcategoria) || null}
                            onChange={(selectedOption) => handleFieldChange('subcategoria', selectedOption ? selectedOption.value : '')}
                            options={subcategoriaOptions}
                            isClearable
                            placeholder=""
                            isDisabled={!selectedCategoria}
                            styles={customStyles}
                        />
                    </div>
                    <div className="campo-selecao">
                        <strong className="link-label">Assunto <span className="campo-obrigatorio">*</span></strong>
                        <Select
                            className="select-destinatario"
                            value={assuntoOptions.find(option => option.value === selectedAssunto) || null}
                            onChange={(selectedOption) => handleFieldChange('assunto', selectedOption ? selectedOption.value : '')}
                            options={assuntoOptions}
                            isClearable
                            placeholder=""
                            isDisabled={!selectedSubcategoria}
                            styles={customStyles}
                        />
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
                                            <strong>{formsEspecificosLabels[key]}:</strong>
                                            {key === "dt_nascimento" ? formatDate(value) : value}
                                        </p>
                                    )
                                );
                            }
                        })}

                        <div className="ver-mais-container">
                            <button className="botao-ver-mais" onClick={toggleExpand}>
                                {isExpanded ? 'Ver Menos' : 'Ver Mais'}
                            </button>
                        </div>
                    </div>

                    <div className="conteudo-modal-direita">
                        <div className="header-status-sla">
                            <div className="status-container">
                                <strong>Status:</strong>
                                <span
                                    className="status-rect"
                                    style={{
                                        backgroundColor: statusOptions[selectedStatus] || '#ffffff',
                                    }}
                                >
                                    {selectedStatus}
                                </span>
                            </div>
                            <div className="sla-container">
                                <strong>SLA:</strong>
                                <span
                                    className="sla-rect"
                                    style={{
                                        backgroundColor: slaOptions[sla] || '#ffffff',
                                    }}
                                >
                                    {sla}
                                </span>
                            </div>
                        </div>

                        <p><strong className="data">Abertura:</strong> {formatDate(data.abertura)}</p>
                        <p><strong className="data">Data Limite:</strong> {formatDate(dataLimite)}</p>
                        <p><strong className="data">Tipo do SLA:</strong> {options.prioridades.find(p => p.prioridade === prioridadeSelecionada)?.tipo_tempo.toUpperCase() || ''}</p>

                        <div className="campo-editavel">
                            <strong>Analista Atual: <span className="campo-obrigatorio">*</span></strong>
                            <Select
                                className="select-destinatario"
                                id="executor-ticket"
                                value={destinatarioOptions.find(option => option.value === selectedDestinatario)}
                                onChange={(selectedOption) => handleFieldChange('destinatarios', selectedOption ? selectedOption.value : '')}
                                options={destinatarioOptions}
                                isClearable
                                placeholder=""
                            />
                        </div>
                        <div className="campo-editavel">
                            <strong>Prioridade: <span className="campo-obrigatorio">*</span></strong>
                            <Select
                                className="select-destinatario"
                                value={filteredPrioridades.map(option => ({ value: option.prioridade, label: option.prioridade })).find(option => option.value === prioridadeSelecionada) || null}
                                onChange={(selectedOption) => handlePrioridadeChange({ target: { value: selectedOption ? selectedOption.value : '' } })}
                                options={filteredPrioridades.map(option => ({ value: option.prioridade, label: option.prioridade }))}
                                isClearable
                                placeholder=""
                                styles={customStyles}
                            />
                        </div>
                        <div className="campo-editavel">
                            <strong>Hub: <span className="campo-obrigatorio">*</span></strong>
                            <Select
                                className="select-destinatario"
                                value={options.hub.map(option => ({ value: option, label: option })).find(option => option.value === selectedHub) || null}
                                onChange={(selectedOption) => handleFieldChange('hub', selectedOption ? selectedOption.value : '')}
                                options={options.hub.map(option => ({ value: option, label: option }))}
                                isClearable
                                placeholder=""
                                styles={customStyles}
                            />
                        </div>
                        <div className="campo-editavel">
                            <strong>Unidade de Negócio: <span className="campo-obrigatorio">*</span></strong>
                            <Select
                                className="select-destinatario"
                                value={unidadeOptions.find(option => option.value === selectedUnidade) || null}
                                onChange={(selectedOption) => handleFieldChange('unidade', selectedOption ? selectedOption.value : '')}
                                options={unidadeOptions}
                                isClearable
                                placeholder=""
                                isDisabled={!selectedHub}
                                styles={customStyles}
                            />
                        </div>
                    </div>
                </div>

                <div className="campo-atividades">
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
                                    <p
                                        id='status-bolinha'
                                        style={{
                                            backgroundColor: statusOptions[convertStatusToTitleCase(atividade.status)] || '#000',
                                            color: 'white',
                                            padding: '4px 8px 4px 8px',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {convertStatusToTitleCase(atividade.status)}
                                    </p>
                                    <p><label>Início:</label> {formatDate(atividade.aberto_em)}</p>
                                    <p><label>Aberto por:</label> {atividade.aberto_por}</p>
                                    <p><label>Destinatário:</label> {atividade.executor}</p>
                                    <p><label>Descrição:</label> {truncateText(atividade.descricao, 50)}</p>

                                    <p style={{ display: 'flex', alignItems: 'center' }}>
                                        <label>Anexo:</label>
                                        {atividade.ds_anexo ? (
                                            <>
                                                <a
                                                    onClick={atividade.id ? () => handleAnexoClick(atividade.ds_anexo) : null}
                                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                >
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
                                <div className="card-anexo" key={index} onClick={anexo.id ? () => handleAnexoClick(anexo.ds_anexo) : null}>
                                    <p><strong>Nome:</strong> {anexo.ds_adicionado_por}</p>
                                    <p><strong>Data de Abertura:</strong> {formatDate(anexo.abertura)}</p>
                                    {anexo.ds_texto && <p><strong>Descrição:</strong> {anexo.ds_texto}</p>}
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
                                    <p><label>Início:</label> {formatDate(atividadeSelecionada.aberto_em)}</p>
                                    <p><label>Fim:</label> {formatDate(atividadeSelecionada.dt_fim)}</p>
                                    <p><label>Destinatário:</label> {atividadeSelecionada.executor}</p>
                                    <p><label>Descrição:</label> {atividadeSelecionada.descricao}</p>
                                    <p><label>Visibilidade:</label> {atividadeSelecionada.tipo_atividade}</p>
                                    <p>
                                        <label>Duração:</label>
                                        {options.prioridades.find(p => p.prioridade === prioridadeSelecionada)?.tipo_tempo.toUpperCase() === 'ÚTIL'
                                            ? (atividadeSelecionada.tempo ? ` ${atividadeSelecionada.tempo} - ÚTIL` : '')
                                            : (atividadeSelecionada.tempo_corrido ? ` ${atividadeSelecionada.tempo_corrido} - CORRIDO` : '')}
                                    </p>
                                    <p><label>Observações:</label> {atividadeSelecionada.ds_obs}</p>
                                    <p style={{ display: 'flex', alignItems: 'center' }}>
                                        <label>Anexo:</label>
                                        {atividadeSelecionada.ds_anexo ? (
                                            <>
                                                <a onClick={atividadeSelecionada.id ? () => handleAnexoClick(atividadeSelecionada.ds_anexo) : null}
                                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
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
                                        <input
                                            type="datetime-local"
                                            id="inicio-task"
                                            value={inicio}
                                            onChange={handleInicioChange}
                                            step="1"
                                            min={formatDate(data.abertura, 3)}
                                            max={formatDate(inicioCheck, 3)}
                                        />
                                    </div>
                                    <div className="campo-detalhe">
                                        <label htmlFor="fim-task">Fim:</label>
                                        <input
                                            type="datetime-local"
                                            id="fim-task"
                                            value={fim}
                                            onChange={handleFimChange}
                                            step="1"
                                            min={formatDate(data.abertura, 3)}
                                            max={formatDate(inicioCheck, 3)}
                                            disabled={!inicio}
                                        />
                                    </div>
                                    <div className="campo-detalhe">
                                        {erro && <div className="erro-mensagem">{erro}</div>}
                                    </div>
                                    <div className="campo-detalhe">
                                        <label htmlFor="aberto-por-task">Aberto Por:</label>
                                        <input type="text" id="aberto-por-task" value={user.name} readOnly />
                                    </div>
                                    <textarea className="textarea-atividade" placeholder="Descrição" id="descricao-task" rows="3"></textarea>
                                    <div>
                                        <label>Status:</label><br></br>
                                        <select id="status-task" >
                                            <option></option>
                                            {options.status.map((status, index) => (
                                                <option key={index} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Destinatário:</label>
                                        <Select
                                            className="select-destinatario"
                                            id="executor-task"
                                            options={destinatarioOptions}
                                            isClearable
                                            placeholder=""
                                            onChange={selectedOption => setExecutor(selectedOption)}
                                        />
                                    </div>
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
                                    <button className="botao-salvar-atividade" onClick={handleSalvarAtividade}>Adicionar</button>
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