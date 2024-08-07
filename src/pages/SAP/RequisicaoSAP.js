import React, { useState } from 'react';
import 'styles/SAP/RequisicaoSAP.css';

const filters = [
  { id: 'requisicao_compra', label: 'Requisição de Compras', type: 'text', placeholder: 'Digite a Requisição de compra' },
  { id: 'tipo_documento', label: 'Tipo de documento', type: 'text', placeholder: 'Digite o Tipo de documento' },
  { id: 'categoria_documento', label: 'Categoria do documento', type: 'text', placeholder: 'Digite a categoria do documento' },
  { id: 'quantidade_solicitada', label: 'Quantidade Solicitada', type: 'text', placeholder: 'Digite a quantidade solicitada' },
  { id: 'data_solicitacao', label: 'Data Solicitada', type: 'date' },
  { id: 'data_remessa', label: 'Data da remessa', type: 'date' },
  { id: 'material', label: 'Material', type: 'text', placeholder: 'Digite Material' },
  { id: 'texto_breve', label: 'Texto Breve', type: 'text', placeholder: 'Digite o Texto Breve' },
  { id: 'grupo_mercadoria', label: 'Buscar Grupo Mercadoria', type: 'text', placeholder: 'Digite o nome código do grupo de mercadoria' },
  { id: 'requisitante', label: 'Requisitante', type: 'text', placeholder: 'Digite o requisitante' },
  { id: 'pedido', label: 'Pedido', type: 'text', placeholder: 'Digite o pedido' },
  { id: 'acompanhamento', label: 'Nº Acompanhamento', type: 'text', placeholder: 'Digite o Número do Acompanhamento' },
  { id: 'centro', label: 'Centro', type: 'text', placeholder: 'Digite o Número do centro' },
  { id: 'processamento_compra', label: 'Estado processamento requisição de compra', type: 'text', placeholder: 'Estado processamento requisição de compra' }
];

const RequisicaoSAP = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterValues, setFilterValues] = useState({});

  const handleFilterChange = (filterId) => {
    if (selectedFilters.includes(filterId)) {
      setSelectedFilters(selectedFilters.filter(id => id !== filterId));
      setFilterValues({ ...filterValues, [filterId]: '' });
    } else {
      setSelectedFilters([...selectedFilters, filterId]);
    }
  };

  const handleInputChange = (filterId, value) => {
    setFilterValues({ ...filterValues, [filterId]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted filter values:', filterValues);
  };

  return (
    <div className="container">
      {}
      <div className="filters-box">
        <h5>Filtros</h5>
        {filters.map(filter => (
          <div key={filter.id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={filter.id}
              onChange={() => handleFilterChange(filter.id)}
              checked={selectedFilters.includes(filter.id)}
            />
            <label className="form-check-label" htmlFor={filter.id}>{filter.label}</label>
          </div>
        ))}
      </div>

      {}
      <div className="selected-filters-box">
        <h5>Campos Selecionados</h5>
        <form onSubmit={handleSubmit}>
          {selectedFilters.map(filterId => {
            const filter = filters.find(f => f.id === filterId);
            return (
              <div key={filterId} className="mb-3">
                <label htmlFor={filterId} className="form-label">{filter.label}</label>
                <input
                  type={filter.type}
                  className="form-control"
                  id={filterId}
                  placeholder={filter.placeholder}
                  value={filterValues[filterId]}
                  onChange={(e) => handleInputChange(filterId, e.target.value)}
                />
              </div>
            );
          })}
          {selectedFilters.length > 0 && (
            <button type="submit" className="btn btn-primary">Consultar</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default RequisicaoSAP;
