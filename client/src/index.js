import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for React 18+
import './index.css';
import App from './App';
import './styles/tailwind.css';
import 'animate.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root with createRoot method
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
