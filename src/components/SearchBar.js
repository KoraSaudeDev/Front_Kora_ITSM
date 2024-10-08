import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import Modal from '../pages/components/ModalTicket'; 
import { FaSearch } from 'react-icons/fa'; 
import { useAuth } from '../context/AuthContext';
import '../styles/SearchBar.css';

const statusOptions = {
  "Em Andamento": "#20C997",        
  "Em Atendimento": "#43A825",     
  "Aguardando Retorno Fornecedor": "#E87C86", 
  "Aguardando Retorno": "#F50057",  
  "Em Aberto": "#3B7DDD",          
  "Agendada": "#D500F9",          
  "Criação de Usuário": "#FF3D00", 
  "Finalizado": "#434343",         
  "Cancelado": "#D50000"            
};

const SearchBar = () => {
  const authToken = localStorage.getItem(process.env.REACT_APP_TOKEN_USER);
  const { user } = useAuth();
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    const fetchedSuggestions = await getSuggestions(value);
    setSuggestions(fetchedSuggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = async (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
      return [];
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/tickets-preview?p=${inputValue}&page=1&per_page=100`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } });
      return response.data.tickets.map((ticket) => ({
        name: `${ticket.cod_fluxo} - ${ticket.nome}`,
        status: ticket.status, 
        ticketData: ticket 
      }));
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
      return [];
    }
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => (
    <div className="suggestion-item">
      <span>{suggestion.name}</span>
      <span
        className="status-seach"
        style={{
          backgroundColor: statusOptions[suggestion.status] || '#000',
          color: 'white',
          width: '120px',
          height: '20px',
          lineHeight: '20px',
          textAlign: 'center',
          borderRadius: '6px',
          display: 'inline-block',
          fontSize: '12px',
          marginLeft: '10px',
          fontWeight: '500'
        }}
      >
        {suggestion.status}
      </span>
    </div>
  );

  const handleClick = async (ticket) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/ticket?cod_fluxo=${ticket.cod_fluxo}`, { headers: { 'Authorization': `Bearer ${authToken}`, 'X-User-Email': user.email } });
      setModalData(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao buscar informações do ticket:", error);
    }
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    handleClick(suggestion.ticketData);  
  };

  const inputProps = {
    placeholder: 'Consulta de Tickets...',
    value,
    onChange,
  };

  return (
    <div className="search-container">
      <Autosuggest
        suggestions={suggestions.slice(0, 50)} 
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        onSuggestionSelected={onSuggestionSelected}
        inputProps={inputProps}
      />
      {showModal && <Modal data={modalData} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SearchBar;
