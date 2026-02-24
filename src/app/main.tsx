import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '../index.css';

// ── 도메인 기반 라우팅은 CloudFront Function에서 처리 ──
// 도메인 정보가 브라우저에 노출되지 않도록
// CDN 엣지(CloudFront Function)에서 리다이렉트 수행
// → scripts/cf-domain-router.js 참고

ReactDOM.createRoot(document.getElementById('root')!).render(
  // React 19 + react-activation 호환성 문제로 인해 StrictMode 임시 비활성화
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
);
