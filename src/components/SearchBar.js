import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import Modal from '../pages/components/ModalTicket'; 
import '../styles/SearchBar.css';

const SearchBar = () => {
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
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/tickets-preview?id=${inputValue}`);
      return response.data.tickets.map((ticket) => ({
        name: `Ticket #${ticket.cod_fluxo} - ${ticket.nome}`,
        ticketData: ticket 
      }));
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
      return [];
    }
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.name}
    </div>
  );

  const handleClick = async (ticket) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets/ticket?cod_fluxo=${ticket.cod_fluxo}`);
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
    placeholder: 'Pesquisar...',
    value,
    onChange,
  };

  return (
    <div>
      <Autosuggest
        suggestions={suggestions}
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