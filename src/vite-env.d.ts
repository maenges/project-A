/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_API_URL: string;
  readonly REACT_APP_NODE_ENV: string;
  readonly REACT_APP_I18N_DEBUG: boolean;
  readonly REACT_APP_CLIENT_ID: string;
  readonly REACT_APP_AUTHORIZATION_REDIRECT_URL: string;
  readonly REACT_APP_AUTHORIZATION_GRANT_TYPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
