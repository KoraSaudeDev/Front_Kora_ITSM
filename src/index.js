import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from './components/ErrorBoundary';

window.onerror = (message, source, lineno, colno, error) => {
  console.error(`Global error: ${message} at ${source}:${lineno}:${colno}`, error);
  return true;
};

const rootElement = document.getElementById('root');
ReactDOM.render(
  <GoogleOAuthProvider clientId="759061524098-2lds7su9bpuoij6tapvq425s2hormnnd.apps.googleusercontent.com">
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </GoogleOAuthProvider>,
  rootElement
);

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
