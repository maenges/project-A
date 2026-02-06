import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '../index.css';

// ── 도메인 기반 라우팅 ──
(() => {
  const host = window.location.hostname;
  const path = window.location.pathname;

  if (host === 'gold-1490.com' || host === 'www.gold-1490.com') {
    // 고객 도메인 → /client
    if (!path.startsWith('/client')) {
      window.location.replace('/client');
      return;
    }
  } else if (host === 'portal.gold-1490.com' || host === 'ops.gold-1490.com') {
    // 관리자 도메인 → / (client 경로 접근 차단)
    if (path.startsWith('/client')) {
      window.location.replace('/');
      return;
    }
  }
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // React 19 + react-activation 호환성 문제로 인해 StrictMode 임시 비활성화
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
);
