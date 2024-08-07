import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);


window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
