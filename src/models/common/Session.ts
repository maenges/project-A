import { Menu } from './Menu';

export interface SessionInfo {
  sessionId?: string;
  userId?: string | null;
  userName?: string;
  email?: string;
  languageCode?: string;
  roleType?: string;
  deptCode?: string;
  menus?: Menu[];
  userStateCode?: string;
}

export interface AccessTokenRefreshTokenInfo {
  refreshToken?: string | '';
  accessToken?: string | '';
  oktaIdToken?: string | '';
  clientName?: string | '';
}

export enum Session {
  SESSION_ID = 'sessionId',
}

export enum AccessTokenRefrehTokenEnum {
  REFRESH_TOKEN = 'refreshToken',
  ACCESS_TOKEN = 'accessToken',
  OKTA_ID_TOKEN = 'oktaIdToken',
  CLIENT_NAME = 'clientName',
  CODE_VERIFIER = 'codeVerifier',
}

export enum SessionRequestTokenEnum {
  OKTA_ID_TOKEN = 'oktaIdToken',
  ACCESS_TOKEN = 'accessToken',
}

export interface SessionRequest {
  oktaIdToken: string;
  oktaAccessToken: string;
}

export interface AccessTokenRefreshTokenRequest {
  code: string | '';
  state?: string | '';
}

export enum RoleType {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  NORMAL_USER = 'normal_user',
}
