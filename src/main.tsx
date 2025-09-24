import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import PaymentTable from "./page/PaymentTable.tsx"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <PaymentTable/ > */}
  </StrictMode>
);
