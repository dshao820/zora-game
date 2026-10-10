import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ProgressProvider } from './hooks/useGameProgress';
import { ReplayProvider } from './hooks/useReplay';
import './index.css';

// 避免幼兒誤觸造成縮放或長按選單
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressProvider>
      <ReplayProvider>
        <App />
      </ReplayProvider>
    </ProgressProvider>
  </StrictMode>,
);
