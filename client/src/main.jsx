import 'regenerator-runtime/runtime';
import { createRoot } from 'react-dom/client';
import './locales/i18n';
import App from './App';
import { ApiErrorBoundaryProvider } from './hooks/ApiErrorBoundaryContext';
import './style.css';
import './mobile.css';
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/copy-tex.js';
import './utils/consoleFilter';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ApiErrorBoundaryProvider>
    <App />
  </ApiErrorBoundaryProvider>
);
