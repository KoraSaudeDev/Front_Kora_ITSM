import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import 'styles/Atendimentos/NovoTicket.css';
import { useAuth } from '../../context/AuthContext';

const camposAcessoRede = {
    "Acesso/Rede": {
        "Alias (Apelido) de E-mail": {
            "Exclusão": [
                { id: "emailRecebimentoAlias", label: "Email Recebimento Alias", type: "email", className: "campo" },
                { id: "enderecoAlias", label: "Endereço Alias", type: "text", className: "campo" }
            ],
            "Novo": [
                { id: "emailRecebimentoAlias", label: "Email Recebimento Alias", type: "email", className: "campo" },
                { id: "enderecoAlias", label: "Endereço Alias", type: "text", className: "campo" }
            ]
        },
        "Caixas Compartilhadas": {
            "Alteração Nome": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Exclusão": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Novo": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Permissões": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ]
        },
        "Contas de E-mail/Rede": {
            "Alteração Nome": [
                { id: "nomeCompleto", label: "Nome Completo Usuário", type: "text", className: "campo" },
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Criação de E-mail e Login de Rede": [
                { id: "nomeCompleto", label: "Nome Completo Usuário", type: "text", className: "campo" },
                { id: "matricula", label: "Matrícula no Sênio (RH)", type: "text", className: "campo" },
                { id: "tipoColaborador", label: "Tipo Colaborador", type: "radio", options: ["Funcionário", "Terceirizado"], className: "campo" },
                { id: "hub", label: "HUB Novo Usuário", type: "text", className: "campo" },
                { id: "cargoo", label: "Cargo", type: "text", className: "campo" },
                { id: "departamento", label: "Departamento", type: "text", className: "campo" },
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "licenca", label: "Licença do Novo Usuário", type: "select", options: ["Frontline Starter", "Enterprise Starter", "Enterprise Standard"], className: "campo" },
                { id: "custo", label: "Custo", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "E-mail": [
                { id: "nomeCompleto", label: "Nome Completo Usuário", type: "text", className: "campo" },
                { id: "matricula", label: "Matrícula no Sênio (RH)", type: "text", className: "campo" },
                { id: "tipoColaborador", label: "Tipo Colaborador", type: "radio", options: ["Funcionário", "Terceirizado"], className: "campo" },
                { id: "hub", label: "HUB Novo Usuário", type: "text", className: "campo" },
                { id: "cargo", label: "Cargo", type: "text", className: "campo" },
                { id: "departamento", label: "Departamento", type: "text", className: "campo" },
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "licenca", label: "Licença do Novo Usuário", type: "select", options: ["Frontline Starter", "Enterprise Starter", "Enterprise Standard"], className: "campo" },
                { id: "custo", label: "Custo", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" }
            ],
            "Exclusão de Usuário": [
                { id: "nomeCompleto", label: "Nome Completo Usuário", type: "text", className: "campo" },
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Rede": [
                { id: "nomeCompleto", label: "Nome Completo Usuário", type: "text", className: "campo" },
                { id: "matricula", label: "Matrícula no Sênio (RH)", type: "text", className: "campo" },
                { id: "tipoColaborador", label: "Tipo Colaborador", type: "radio", options: ["Funcionário", "Terceirizado"], className: "campo" },
                { id: "hub", label: "HUB Novo Usuário", type: "text", className: "campo" },
                { id: "cargo", label: "Cargo", type: "text", className: "campo" },
                { id: "departamento", label: "Departamento", type: "text", className: "campo" },
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "licenca", label: "Licença do Novo Usuário", type: "select", options: ["Frontline Starter", "Enterprise Starter", "Enterprise Standard"], className: "campo" },
                { id: "custo", label: "Custo", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" }
            ]
        },
        "Drives Compartilhados": {
            "Alteração Nome": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Exclusão": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Novo": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Permissões": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ]
        },
        "Lista/Grupo de Distribuição": {
            "Alteração Nome": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Exclusão": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Novo": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ],
            "Permissões": [
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" },
                { id: "gestor", label: "Gestor Imediato", type: "text", className: "campo" },
                { id: "emailGestor", label: "E-mail Gestor Imediato", type: "email", className: "campo" },
                { id: "gerenteArea", label: "Gerente da Área", type: "text", className: "campo" },
                { id: "emailGerente", label: "E-mail Gerente", type: "email", className: "campo" }
            ]
        },
        "Reset de senha E-mail Google": {
            "Solicitar": [
                { id: "nomeCompleto", label: "Nome Completo Usuário", type: "text", className: "campo" },
                { id: "telefone", label: "Telefone para contato", type: "number", className: "campo" }
            ]
        }
    }
};

const NovoTicket = () => {
    const { user } = useAuth();
    const [options, setOptions] = useState({
        hub: [],
        unidade: [],
        categoria: [],
        subcategoria: [],
        assunto: [],
    });

    const [selectedHub, setSelectedHub] = useState(null);
    const [selectedUnidade, setSelectedUnidade] = useState(null);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
    const [selectedAssunto, setSelectedAssunto] = useState(null);
    const [dynamicFields, setDynamicFields] = useState([]);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#007aff' : '#ddd',
            boxShadow: state.isFocused ? '0 0 0 1px #007aff' : 'none',
            '&:hover': {
                borderColor: '#007aff',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#3E4676',
        }),
    };

    const obterDataAtual = () => {
        const agora = new Date();
        const dia = String(agora.getDate()).padStart(2, '0');
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const ano = agora.getFullYear();
        const horas = String(agora.getHours()).padStart(2, '0');
        const minutos = String(agora.getMinutes()).padStart(2, '0');
        const segundos = String(agora.getSeconds()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/hub`)
            .then(response => {
                const hubs = response.data.map(hub => ({ value: hub, label: hub }));
                setOptions(prev => ({ ...prev, hub: hubs }));
            })
            .catch(error => console.error('Erro ao carregar hubs:', error));

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/categorias`)
            .then(response => {
                const categorias = response.data.map(categoria => ({ value: categoria, label: categoria }));
                setOptions(prev => ({ ...prev, categoria: categorias }));
            })
            .catch(error => console.error('Erro ao carregar categorias:', error));
    }, []);

    useEffect(() => {
        if (selectedHub) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/unidade?hub=${selectedHub.value}`)
                .then(response => {
                    const unidades = response.data.map(unidade => ({ value: unidade, label: unidade }));
                    setOptions(prev => ({ ...prev, unidade: unidades }));
                })
                .catch(error => console.error('Erro ao carregar unidades:', error));
        } else {
            setSelectedUnidade(null);
        }
    }, [selectedHub]);

    useEffect(() => {
        if (selectedCategoria) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/subcategorias?categoria=${selectedCategoria.value}`)
                .then(response => {
                    const subcategorias = response.data.map(subcategoria => ({ value: subcategoria, label: subcategoria }));
                    setOptions(prev => ({ ...prev, subcategoria: subcategorias }));
                })
                .catch(error => console.error('Erro ao carregar subcategorias:', error));
        } else {
            setSelectedSubcategoria(null);
            setSelectedAssunto(null);
        }
    }, [selectedCategoria]);

    useEffect(() => {
        if (selectedSubcategoria) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/form/assuntos?categoria=${selectedCategoria?.value}&subcategoria=${selectedSubcategoria?.value}`)
                .then(response => {
                    const assuntos = response.data.map(assunto => ({ value: assunto.assunto, label: assunto.assunto }));
                    setOptions(prev => ({ ...prev, assunto: assuntos }));
                })
                .catch(error => console.error('Erro ao carregar assuntos:', error));
        } else {
            setSelectedAssunto(null);
        }
    }, [selectedSubcategoria]);

    useEffect(() => {
        if (selectedAssunto) {
            const assunto = selectedAssunto.value;
            let campos = [];
    
        
            if (selectedCategoria?.value === 'Acesso/Rede' && selectedSubcategoria?.value) {
                const categoriaAcessoRede = camposAcessoRede['Acesso/Rede'];
                const subcategoria = categoriaAcessoRede[selectedSubcategoria.value];
    
                if (subcategoria && subcategoria[assunto]) {
                    campos = subcategoria[assunto];
                }
            }
    
            if (assunto === 'Ajuste de acesso') {
                campos = [
                    { id: 'nomeCompleto', label: 'Nome Completo Usuário', type: 'text', required: true },
                    { id: 'usuarioMV', label: 'Usuário do MV', type: 'text', required: true },
                    { id: 'departamento', label: 'Departamento', type: 'text', required: true },
                    { id: 'matriculaSenior', label: 'Matrícula do Sênior (RH)', type: 'text', required: true },
                    { id: 'cargo', label: 'Cargo', type: 'text', required: true },
                    { id: 'unidadeUsuario', label: 'Unidade do Usuário', type: 'text', required: true },
                    { id: 'usuarioSimilar', label: 'Usuário Similar', type: 'text', required: true },
                    { id: 'acessoSolicitado', label: 'Acesso Solicitado', type: 'text', required: true },
                    { id: 'telefoneContato', label: 'Telefone para Contato', type: 'number', required: true },
                    { id: 'vinculoEmpregatício', label: 'Vínculo Empregatício', type: 'select', options: ['Funcionário da Rede', 'Terceiros (Cooperativa)'], required: true }
                ];
            }
    
            if (assunto === 'Criação de usuário') {
                campos = [
                    { id: 'nomeCompleto', label: 'Nome Completo Usuário', type: 'text', required: true },
                    { id: 'departamento', label: 'Departamento', type: 'text', required: true },
                    { id: 'dataNascimento', label: 'Data de Nascimento', type: 'date', required: true },
                    { id: 'matriculaSenior', label: 'Matrícula do Sênior (RH)', type: 'text', required: true },
                    { id: 'cpf', label: 'CPF (Apenas Número)', type: 'number', required: true },
                    { id: 'cargo', label: 'Cargo', type: 'text', required: true },
                    { id: 'unidadeUsuario', label: 'Unidade do Usuário', type: 'text', required: true },
                    { id: 'usuarioSimilar', label: 'Usuário Similar', type: 'text', required: true },
                    { id: 'acessoSolicitado', label: 'Acesso Solicitado', type: 'text', required: true },
                    { id: 'telefoneContato', label: 'Telefone para Contato', type: 'number', required: true },
                    { id: 'codigoPrestador', label: 'Código do prestador no sistema MV', type: 'text', required: false },
                    { id: 'tipoUsuario', label: 'Tipo de Usuário', type: 'select', options: ['Funcionário da Rede', 'Terceiros (Cooperativa)'], required: true }
                ];
            }
    
         
            if (assunto === 'Troca de senha') {
                campos = [
                    { id: 'nomeCompleto', label: 'Nome Completo Usuário', type: 'text', required: true },
                    { id: 'usuarioMV', label: 'Usuário do MV', type: 'text', required: true },
                    { id: 'departamento', label: 'Departamento', type: 'text', required: true },
                    { id: 'unidadeUsuario', label: 'Unidade do Usuário', type: 'text', required: true },
                    { id: 'telefoneContato', label: 'Telefone para Contato', type: 'number', required: true }
                ];
            }
    
       
            if (assunto === 'Ajuste no Perfil de Acesso') {
                campos = [
                    { id: 'ambienteSap', label: 'Ambiente SAP', type: 'select', options: ['Produção', 'Desenvolvimento', 'Qualidade'], required: true },
                    { id: 'usuarioSap', label: 'Usuário SAP', type: 'text', required: true },
                    { id: 'perfilAtribuido', label: 'Perfil a serem Atribuídos', type: 'select', options: ['Perfil 1', 'Perfil 2', 'Perfil 3'], required: true },
                    { id: 'motivoAjuste', label: 'Motivo Ajuste', type: 'select', options: ['Mudança de Cargo/Função', 'Substituição Temporária de Colaborador', 'Transferência de Departamento/Local', 'Outro'], required: true },
                    { id: 'descricaoAlteracao', label: 'Descrição da Alteração Solicitada', type: 'text', required: true }
                ];
            }
    
        
            if (assunto === 'Criação Login SAP') {
                campos = [
                    { id: 'ambienteSap', label: 'Ambiente SAP', type: 'select', options: ['Produção', 'Desenvolvimento', 'Qualidade'], required: true },
                    { id: 'nomeCompleto', label: 'Nome Completo Usuário', type: 'text', required: true },
                    { id: 'matriculaSenior', label: 'Matrícula no Sênior (RH)', type: 'text', required: true },
                    { id: 'cpf', label: 'CPF (Apenas Números)', type: 'number', required: true },
                    { id: 'cargo', label: 'Cargo', type: 'text', required: true },
                    { id: 'departamento', label: 'Departamento', type: 'text', required: true },
                    { id: 'email', label: 'E-mail Usuário', type: 'email', required: true },
                    { id: 'diretoria', label: 'Diretoria', type: 'text', required: true },
                    { id: 'substituirColaborador', label: 'Estou substituindo colaborador desligado?', type: 'select', options: ['Sim', 'Não'], required: true },
                    { id: 'perfilAtribuido', label: 'Perfil a serem Atribuídos', type: 'select', options: ['Perfil 1', 'Perfil 2', 'Perfil 3'], required: true },
                    { id: 'centroCusto', label: 'Centro de custo', type: 'select', options: ['Centro 1', 'Centro 2', 'Centro 3'], required: true },
                    { id: 'emailGestor', label: 'E-mail Gestor Imediato', type: 'email', required: true },
                    { id: 'descricao', label: 'Descrição', type: 'text', required: true },
                    { id: 'anexoAutorizacao', label: 'Anexar Autorização Gestor', type: 'file', required: true },
                    { id: 'termoAceitacao', label: 'Termo de Aceitação', type: 'select', options: ['Sim', 'Não'], required: true }
                ];
            }
    
           
            if (assunto === 'Reset de Senha SAP') {
                campos = [
                    { id: 'ambienteSap', label: 'Ambiente SAP', type: 'select', options: ['Produção', 'Desenvolvimento', 'Qualidade'], required: true },
                    { id: 'usuarioSap', label: 'Usuário SAP', type: 'text', required: true }
                ];
            }
    
           
            if (selectedCategoria?.value === 'TASY' && selectedSubcategoria?.value === 'Criação de Usuário') {
                campos = [
                    { id: 'nomeCompleto', label: 'Nome Completo Usuário', type: 'text', required: true },
                    { id: 'departamento', label: 'Departamento', type: 'text', required: true },
                    { id: 'dataNascimento', label: 'Data de Nascimento', type: 'date', required: true },
                    { id: 'matriculaUsuario', label: 'Matrícula do Usuário', type: 'text', required: true },
                    { id: 'cpf', label: 'CPF (Apenas Números)', type: 'number', required: true },
                    { id: 'cargo', label: 'Cargo', type: 'text', required: true },
                    { id: 'unidadeUsuario', label: 'Unidade do Usuário', type: 'text', required: true },
                    { id: 'usuarioSimilar', label: 'Usuário Similar', type: 'text', required: true },
                    { id: 'telefoneContato', label: 'Telefone para Contato (Apenas Números)', type: 'number', required: true },
                    { id: 'tipoUsuario', label: 'Tipo do Usuário', type: 'select', options: ['Administrativo', 'Assistencial'], required: true }
                ];
            }
    
            setDynamicFields(campos);
        } else {
            setDynamicFields([]);
        }
    }, [selectedAssunto, selectedSubcategoria, selectedCategoria]);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
    };

    return (
        <div className="container-novo-ticket">
            <div className="info-basicas-duas-colunas">
                <div className="coluna-esquerda">
                    <h2>Informações Básicas</h2>
                    <form className="formulario" onSubmit={handleSubmit}>
                        <div className="campo">
                            <label htmlFor="abertura">Abertura</label>
                            <input type="text" id="abertura" name="abertura" value={obterDataAtual()} readOnly className="campo-leitura" />
                        </div>
                        <div className="campo">
                            <label htmlFor="nome-completo">Nome Completo <span className="campo-obrigatorio">*</span></label>
                            <input type="text" value={user.name} id="nome-completo" name="nome-completo" required readOnly className="campo-leitura" />
                        </div>
                        <div className="campo">
                            <label htmlFor="email">E-mail Solicitante <span className="campo-obrigatorio">*</span></label>
                            <input type="email" value={user.email} id="email" name="email" required readOnly className="campo-leitura" />
                        </div>
                        <div className="campo">
                            <label htmlFor="matricula">Matrícula <span className="campo-obrigatorio">*</span></label>
                            <input type="number" id="matricula" name="matricula" required />
                        </div>
                        <div className="campo">
                            <label htmlFor="cargo-form">Cargo <span className="campo-obrigatorio">*</span></label>
                            <input type="text" id="cargo-form" name="cargo-form" required />
                        </div>
                        <div className="campo">
                            <label htmlFor="area-negocio">Área de Negócio <span className="campo-obrigatorio">*</span></label>
                            <input type="text" id="area-negocio" name="area-negocio" required />
                        </div>
                        <div className="campo">
                            <label htmlFor="hub">HUB <span className="campo-obrigatorio">*</span></label>
                            <Select
                                value={selectedHub}
                                onChange={setSelectedHub}
                                options={options.hub}
                                styles={customStyles}
                                isClearable
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="unidade-negocio">Unidade de Negócio <span className="campo-obrigatorio">*</span></label>
                            <Select
                                value={selectedUnidade}
                                onChange={setSelectedUnidade}
                                options={options.unidade}
                                styles={customStyles}
                                isClearable
                                isDisabled={!selectedHub}
                            />
                        </div>
                    </form>
                </div>

                <div className="coluna-direita">
                    <h2>Detalhes do Ticket</h2>
                    <form className="formulario" onSubmit={handleSubmit}>
                        <div className="campo">
                            <label htmlFor="categoria">Categoria <span className="campo-obrigatorio">*</span></label>
                            <Select
                                value={selectedCategoria}
                                onChange={setSelectedCategoria}
                                options={options.categoria}
                                styles={customStyles}
                                isClearable
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="subcategoria">Subcategoria <span className="campo-obrigatorio">*</span></label>
                            <Select
                                value={selectedSubcategoria}
                                onChange={setSelectedSubcategoria}
                                options={options.subcategoria}
                                styles={customStyles}
                                isClearable
                                isDisabled={!selectedCategoria}
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="assunto">Assunto <span className="campo-obrigatorio">*</span></label>
                            <Select
                                value={selectedAssunto}
                                onChange={setSelectedAssunto}
                                options={options.assunto}
                                styles={customStyles}
                                isClearable
                                isDisabled={!selectedSubcategoria}
                            />
                        </div>

                        
                        {dynamicFields.length > 0 && (
                            <div className="campo-dinamico">
                                {dynamicFields.map(field => (
                                    <div key={field.id} className="campo">
                                        <label htmlFor={field.id}>{field.label} <span className="campo-obrigatorio">*</span></label>
                                        {field.type === 'text' && (
                                            <input type="text" id={field.id} name={field.id} required={field.required} />
                                        )}
                                        {field.type === 'email' && (
                                            <input type="email" id={field.id} name={field.id} required={field.required} />
                                        )}
                                        {field.type === 'number' && (
                                            <input type="number" id={field.id} name={field.id} required={field.required} />
                                        )}
                                        {field.type === 'date' && (
                                            <input type="date" id={field.id} name={field.id} required={field.required} />
                                        )}
                                        {field.type === 'select' && field.options && (
                                            <select id={field.id} name={field.id} required={field.required}>
                                                {field.options.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {field.type === 'file' && (
                                            <input type="file" id={field.id} name={field.id} required={field.required} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="campo">
                            <label htmlFor="descricao">Descrição <span className="campo-obrigatorio">*</span></label>
                            <textarea id="descricao" name="descricao" rows="5" required></textarea>
                        </div>
                        <div className="campo campo-upload">
                            <label htmlFor="anexo">Anexo</label>
                            <input type="file" id="anexo" name="anexo" />
                        </div>
                        <div className="campo">
                            <label htmlFor="observacao">Observação</label>
                            <textarea id="observacao" name="observacao" rows="3"></textarea>
                        </div>
                        <button type="submit" className="botao-enviar">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NovoTicket;
