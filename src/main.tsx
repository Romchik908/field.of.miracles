import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '/lab-grotesque-font.css?url';
import App from './App.tsx';
import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
