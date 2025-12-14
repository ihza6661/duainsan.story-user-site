import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import '@/styles/index.css'
import { initSentry } from '@/lib/sentry'
import { initGA } from '@/lib/analytics'

// Initialize Sentry for error tracking
initSentry();

// Initialize Google Analytics 4
initGA();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
