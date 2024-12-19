import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrimeReactProvider  } from 'primereact/api';
import "./index.css"; // Import Tailwind CSS
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core CSS
import 'primeicons/primeicons.css'; // PrimeIcons

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <PrimeReactProvider >
       <App />
     </PrimeReactProvider>
   
  </StrictMode>,
)
