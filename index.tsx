import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global CSS
import App from './App';
// If you're using reportWebVitals or serviceWorker, they'd be imported here

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you're measuring performance, you might call reportWebVitals here
// reportWebVitals();