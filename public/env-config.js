/*
 * Runtime env injector (optional)
 *
 * - In production, you can replace/override this file at deploy time
 *   to inject runtime values without rebuilding the frontend.
 * - In local(dev), this file prevents a 404 on GET /env-config.js.
 *
 * Expected shape:
 *   window.__ENV = { VITE_API_BASE_URL: '...', VITE_SOCKET_URL: '...', ... }
 */

(function () {
  // Keep any pre-injected values, otherwise default to empty.
  window.__ENV = window.__ENV || {};

  // 소켓 서버 URL (필요시 운영 환경에서 변경)
  // window.__ENV.VITE_SOCKET_URL = 'http://localhost:3000';
})();
