/**
 * 런타임/빌드 환경 변수 헬퍼
 * - 1순위: window.__ENV (public/env-config.js에서 주입)
 * - 2순위: Vite 빌드 타임 환경변수 (import.meta.env)
 */
const runtimeEnv: Record<string, string> =
  (typeof window !== 'undefined' && (window as any).__ENV) || {};

export const getEnv = (key: string): string | undefined => {
  if (runtimeEnv && key in runtimeEnv) {
    return runtimeEnv[key];
  }
  return (import.meta.env as any)[key];
};
