import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerSW'

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker (disabled in development)
registerServiceWorker();
