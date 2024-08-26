import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
// ReactDOM.render(<GoogleOAuthProvider clientId="759061524098-2lds7su9bpuoij6tapvq425s2hormnnd.apps.googleusercontent.com"><App /></GoogleOAuthProvider>, rootElement);
ReactDOM.render(<App />, rootElement);


window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
