/*
 * Runtime env injector (optional)
 *
 * - In production, you can replace/override this file at deploy time
 *   to inject runtime values without rebuilding the frontend.
 * - In local(dev), this file prevents a 404 on GET /env-config.js.
 *
 * Expected shape:
 *   window.__ENV = { VITE_API_BASE_URL: '...', ... }
 */

(function () {
  // Keep any pre-injected values, otherwise default to empty.
  window.__ENV = window.__ENV || {};
})();
