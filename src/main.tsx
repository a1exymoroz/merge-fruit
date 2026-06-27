import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { warmUpBackend } from './services/healthApi';
import './i18n';
import './index.css';

warmUpBackend();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
