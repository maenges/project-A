import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // React 19 + react-activation 호환성 문제로 인해 StrictMode 임시 비활성화
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
);
