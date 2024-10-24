import "../styles/Cadastro.css";
import Select from "react-select";
import React, { useState } from "react";
import Header from "../components/Header";
import { PiInfo } from "react-icons/pi";


const Cadastro = () => {
  const [showFields, setShowFields] = useState(false);


  // Mock states selected values
  const [areaValue, setAreaValue] = useState("");
  const [cargoValue, setCargoValue] = useState("");
  const [custoValue, setCustoValue] = useState("");
  const [hubValue, setHubValue] = useState("");
  const [unidadeValue, setUnidadeValue] = useState("");
  const [camisaValue, setCamisaValue] = useState("");
  const [cpfValue, setCpfValue] = useState("");
  const [phoneValue, setPhoneValue] = useState('');

  const options = [
    {
      value: "1",
      label: "Option 1",
    },
    {
      value: "2",
      label: "Option 2",
    },
    {
      value: "3",
      label: "Option 3",
    },
  ];


   const handleCpfChangeMask = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); 
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); 
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); 
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpfValue(value);
  };

  const handlePhoneChangeMask = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); 
    value = value.replace(/(\d{2})(\d)/, '($1) $2'); 
    value = value.replace(/(\d{5})(\d)/, '$1-$2'); 
    setPhoneValue(value);
  };


  return (
    <>
      <Header />
      <div className="custom-cadastro-background">
        <div className="cadastro-header">
          <div className="cadastro-field">
            <label for="cpf">CPF *</label>
            <input
              type="text"
              id="cpf"
              value={cpfValue} 
              onChange={handleCpfChangeMask} 
              maxLength="14"
              placeholder="000.000.000-00"
              className="cadastro-input"
            />
          </div>
          <div className="cadastro-field">
            <label for="data_nascimento">Data Nascimento *</label>
            <input
              type="date"
              id="data_nascimento"
              className="cadastro-input"
            />
          </div>
          <div className="cadastro-field">
            <label for="matricula">
              Matrícula{" "}
              <div
                data-tooltip="Caso não saiba, busque o RH"
                className="label-info"
              >
                <PiInfo />
              </div>
            </label>
            <input type="number" id="matricula" className="cadastro-input" />
          </div>

          <button
            className="cadastro-button cadastro-button-secondary"
            onClick={() => setShowFields(true)}
          >
            Buscar
          </button>
        </div>

        <p className="cadastro-description">
          Preencha os campos acima, para verificar se o usuário já está
          cadastrado.
        </p>

        {showFields && (
          <>
            <div className="cadastro-field-grid">
              <div className="cadastro-field">
                <label for="nome">Nome *</label>
                <input type="text" id="nome" className="cadastro-input" />
              </div>
              <div className="cadastro-field">
                <label for="email">Email *</label>
                <input type="email" id="email" className="cadastro-input" />
              </div>
              <div className="cadastro-field">
                <label for="select-grupo-material">Área de negócio *</label>
                <Select
                  id="select-grupo-material"
                  value={areaValue}
                  onChange={(value) => setAreaValue(value)}
                  placeholder="Selecione a área de negócio"
                  isClearable
                  options={options}
                  className="cadastro-select"
                />
              </div>
              <div className="cadastro-field">
                <label for="select-grupo-cargo">Cargo * </label>
                <Select
                  id="select-grupo-cargo"
           
                  placeholder="Selecione o cargo"
                  value={cargoValue}
                  onChange={(value) => setCargoValue(value)}
                  isClearable
                  options={options}
                  className="cadastro-select"
                />
              </div>

              <div className="cadastro-field">
                <label for="phone">Telefone Celular *</label>
                <input
                  type="text"
                  id="phone"
                  value={phoneValue} 
                  onChange={handlePhoneChangeMask} 
                  maxLength="15"
                  placeholder="(00) 00000-0000"
                  className="cadastro-input"
                />
              </div>
              <div className="cadastro-field">
                <label for="select-grupo-custo">Centro de Custo *</label>
                <Select
                  id="select-grupo-custo"
                  value={custoValue}
                  onChange={(value) => setCustoValue(value)}
                  placeholder="Selecione o centro de custo"
                  isClearable
                  options={options}
                  className="cadastro-select"
                />
              </div>
              <div className="cadastro-field">
                <label for="select-grupo-hub">HUB *</label>
                <Select
                  id="select-grupo-hub"
                  value={hubValue}
                  onChange={(value) => setHubValue(value)}
                  placeholder="Selecione o HUB"
                  isClearable
                  options={options}
                  className="cadastro-select"
                />
              </div>
              <div className="cadastro-field">
                <label for="select-grupo-unidade">Unidade *</label>
                <Select
                  id="select-grupo-unidade"
                  value={unidadeValue}
                  onChange={(value) => setUnidadeValue(value)}
                  placeholder="Selecione a unidade"
                  isClearable
                  options={options}
                  className="cadastro-select"
                />
              </div>

              <div className="cadastro-field">
                <label for="gestor">Gestor Imediato *</label>
                <input type="text" id="gestor" className="cadastro-input" />
              </div>
              <div className="cadastro-field">
                <label for="email">Email Gestor *</label>
                <input type="email" id="email" className="cadastro-input" />
              </div>
              <div className="cadastro-field">
                <label for="select-grupo-camiseta">Tamanho Camiseta *</label>
                <Select
                  id="select-grupo-camiseta"
                  value={camisaValue}
                  onChange={(value) => setCamisaValue(value)}
                  placeholder="Selecione o tamanho da camiseta"
                  isClearable
                  options={options}
                  className="cadastro-select"
                />
              </div>
              <div className="cadastro-field">
                <label for="calcado">Tamanho Calçado * </label>
                <input type="number" id="calcado" className="cadastro-input" />
              </div>
            </div>

            <div className="cadastro-container-checkbox">
              <div className="cadastro-field-checkbox">
                <input type="checkbox" id="prestador" name="prestador" />
                <label for="prestador">Prestador de serviço</label>
              </div>

              <div className="cadastro-field-checkbox">
                <input
                  type="checkbox"
                  id="usuario_ativo"
                  name="usuario_ativo"
                />
                <label for="usuario_ativo">Usuário Ativo</label>
              </div>
            </div>

            <div className="cadastro-container-buttons">
              <button className="cadastro-button cadastro-button-primary">
                Cadastrar
              </button>
              <button
                onClick={() => setShowFields(false)}
                className="cadastro-button cadastro-button-secondary"
              >
                Limpar Campos
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Cadastro;
