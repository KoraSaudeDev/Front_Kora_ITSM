import React, { useState } from 'react';
import 'styles/Atendimentos/NovoTicket.css';

const NovoTicket = () => {
    const [categoria, setCategoria] = useState('');
    const [subcategoria, setSubcategoria] = useState('');
    const [assunto, setAssunto] = useState('');
    const [exibirSubcategoria, setExibirSubcategoria] = useState(false);
    const [exibirAssunto, setExibirAssunto] = useState(false);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);

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

    const alterarCategoria = (e) => {
        setCategoria(e.target.value);
        setExibirSubcategoria(true); 
    };

    const alterarSubcategoria = (e) => {
        setSubcategoria(e.target.value);
        setExibirAssunto(true); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const novoTicket = {
            abertura: obterDataAtual(),
            nomeCompleto: document.getElementById("nome-completo").value,
            email: document.getElementById("email").value,
            matricula: document.getElementById("matricula").value,
            telefone: document.getElementById("telefone").value,
            cargo: document.getElementById("cargo").value,
            unidadeNegocio: document.getElementById("unidade-negocio").value,
            categoria,
            subcategoria,
            assunto,
            descricao: document.getElementById("descricao").value,
            anexo: document.getElementById("anexo").files[0]?.name || '',
            observacao: document.getElementById("observacao").value,
            status: "Em Andamento"
        };

        if (
            novoTicket.nomeCompleto &&
            novoTicket.matricula &&
            novoTicket.unidadeNegocio &&
            novoTicket.categoria &&
            novoTicket.descricao
        ) {
            console.log("Novo ticket criado:", novoTicket);

            setMostrarMensagem(true);

            setCategoria('');
            setSubcategoria('');
            setAssunto('');
            setExibirSubcategoria(false);
            setExibirAssunto(false);

            setTimeout(() => {
                setMostrarMensagem(false);
            }, 3000);

            // Limpar todos os campos de entrada
            document.getElementById("nome-completo").value = '';
            document.getElementById("email").value = '';
            document.getElementById("matricula").value = '';
            document.getElementById("telefone").value = '';
            document.getElementById("cargo").value = ''; // Adicionado para limpar o campo "Cargo"
            document.getElementById("descricao").value = '';
            document.getElementById("observacao").value = '';
            document.getElementById("unidade-negocio").value = '';
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    return (
        <div className="container-novo-ticket">
            {mostrarMensagem && (
                <div className="mensagem-sucesso">
                    Ticket enviado com sucesso!
                </div>
            )}
            <div className="info-basicas">
                <h2>Informações Básicas</h2>
                <form className="formulario" onSubmit={handleSubmit}>
                    <div className="campo">
                        <label htmlFor="abertura">Abertura</label>
                        <input type="text" id="abertura" name="abertura" value={obterDataAtual()} readOnly className="campo-leitura" />
                    </div>
                    <div className="campo">
                        <label htmlFor="nome-completo">Nome Completo <span className="campo-obrigatorio">*</span></label>
                        <input type="text" id="nome-completo" name="nome-completo" required />
                    </div>
                    <div className="campo">
                        <label htmlFor="email">E-mail Solicitante</label>
                        <input type="email" id="email" name="email" />
                    </div>
                    <div className="campo">
                        <label htmlFor="matricula">Matrícula <span className="campo-obrigatorio">*</span></label>
                        <input type="text" id="matricula" name="matricula" required />
                    </div>
                    <div className="campo">
                        <label htmlFor="telefone">Telefone (Apenas números)</label>
                        <input type="tel" id="telefone" name="telefone" />
                    </div>
                    <div className="campo">
                        <label htmlFor="cargo">Cargo</label>
                        <input type="text" id="cargo" name="cargo" />
                    </div>
                </form>
            </div>
            <div className="detalhes-ticket">
                <h2>Detalhes do Ticket</h2>
                <form className="formulario" onSubmit={handleSubmit}>
                    <div className="campo">
                        <label htmlFor="unidade-negocio">Unidade de Negócio <span className="campo-obrigatorio">*</span></label>
                        <select id="unidade-negocio" name="unidade-negocio" required>
                            <option value="unidade1">Unidade 1</option>
                            <option value="unidade2">Unidade 2</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label htmlFor="categoria">Categoria <span className="campo-obrigatorio">*</span></label>
                        <select id="categoria" name="categoria" value={categoria} onChange={alterarCategoria} required>
                            <option value="categoria1">Categoria 1</option>
                            <option value="categoria2">Categoria 2</option>
                        </select>
                    </div>
                    {exibirSubcategoria && (
                        <div className="campo">
                            <label htmlFor="subcategoria">Subcategoria <span className="campo-obrigatorio">*</span></label>
                            <select id="subcategoria" name="subcategoria" value={subcategoria} onChange={alterarSubcategoria} required>
                                <option value="subcategoria1">Subcategoria 1</option>
                                <option value="subcategoria2">Subcategoria 2</option>
                            </select>
                        </div>
                    )}
                    {exibirAssunto && (
                        <div className="campo">
                            <label htmlFor="assunto">Assunto <span className="campo-obrigatorio">*</span></label>
                            <select id="assunto" name="assunto" value={assunto} onChange={(e) => setAssunto(e.target.value)} required>
                                <option value="assunto1">Assunto 1</option>
                                <option value="assunto2">Assunto 2</option>
                            </select>
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
    );
};



export default NovoTicket;
