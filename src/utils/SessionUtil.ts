import {
  AccessTokenRefrehTokenEnum,
  AccessTokenRefreshTokenInfo,
  Session,
  SessionInfo,
  SessionRequest,
  SessionRequestTokenEnum,
} from '@/models/common/Session';

export default class SessionUtil {
  public getSessionInfo = (): SessionInfo => {
    let sessionInfo: SessionInfo = {} as SessionInfo;

    sessionInfo = {
      sessionId: this.getSessionStorageValue(Session.SESSION_ID),
      email: this.getSessionStorageValue('email'),
      userName: this.getSessionStorageValue('memberName'),
      userId: this.getSessionStorageValue('memberId'),
      roleType: this.getSessionStorageValue('roleType'),
      deptCode: this.getSessionStorageValue('deptCode'),
      menus: this.getSessionStorageValue('menus')
        ? JSON.parse(this.getSessionStorageValue('menus'))
        : undefined,
      //departmentOrganizationCode: this.getSessionStorageValue('departmentOrganizationCode'),
      //roleId: this.getSessionStorageValue('roleId'),
      //languageCode: this.getSessionStorageValue('languageCode'),
    };

    return sessionInfo;
  };

  public getAccessTokenRefreshTokenInfo = (): AccessTokenRefreshTokenInfo => {
    let accessTokenRefreshTokenInfo: AccessTokenRefreshTokenInfo =
      {} as AccessTokenRefreshTokenInfo;

    accessTokenRefreshTokenInfo = {
      refreshToken: this.getSessionStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN),
      accessToken: this.getSessionStorageValue(AccessTokenRefrehTokenEnum.ACCESS_TOKEN),
      clientName: this.getSessionStorageValue(AccessTokenRefrehTokenEnum.CLIENT_NAME),
    };

    return accessTokenRefreshTokenInfo;
  };

  public setSessionInfo = (sessionInfo: SessionInfo): void => {
    for (const [key, value] of Object.entries(sessionInfo)) {
      this.setSessionStorageValue(
        key,
        value ? (typeof value === 'object' ? JSON.stringify(value) : value) : ''
      );
    }
  };

  public setAccessTokenRefreshTokenInfo = (
    accessTokenRefreshTokenInfo: AccessTokenRefreshTokenInfo
  ): void => {
    for (const [key, value] of Object.entries(accessTokenRefreshTokenInfo)) {
      this.setSessionStorageValue(key, value ?? '');
    }
  };

  public getSessionRequestInfo = (): SessionRequest => {
    return {
      oktaIdToken: this.getSessionStorageValue(SessionRequestTokenEnum.OKTA_ID_TOKEN),
      oktaAccessToken: this.getSessionStorageValue(SessionRequestTokenEnum.ACCESS_TOKEN),
    };
  };

  public getLocalSessionRequestInfo = (): SessionRequest => {
    return {
      oktaIdToken: this.getSessionStorageValue(SessionRequestTokenEnum.OKTA_ID_TOKEN),
      oktaAccessToken: this.getSessionStorageValue(SessionRequestTokenEnum.ACCESS_TOKEN),
    };
  };

  public setSessionRequestInfo = (sessionRequestInfo: SessionRequest): void => {
    for (const [key, value] of Object.entries(sessionRequestInfo)) {
      this.setSessionStorageValue(key, value ?? '');
    }
  };

  public deleteSessionInfo = (): void => {
    this.deleteSessionStorage();
  };

  public setLocalSessionInfo = (): void => {
    this.deleteSessionStorage();
    sessionStorage.setItem('accessToken', import.meta.env.REACT_APP_ACCESS_TOKEN as string);
    sessionStorage.setItem('refreshToken', import.meta.env.REACT_APP_REFRESH_TOKEN as string);
    sessionStorage.setItem('clientName', import.meta.env.REACT_CLIENT_NAME as string);
    sessionStorage.setItem('env', import.meta.env.REACT_APP_NODE_ENV as string);
  };

  // public deleteAccessTokenRefreshTokenInfo = (): void => {
  //   this.deleteAccessTokenRefreshTokenStorage();
  // };

  public getSessionId = (): string => {
    return this.getSessionStorageValue(Session.SESSION_ID);
  };

  // public getRefreshToken = (): string => {
  //   return this.getSessionStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN);
  // };

  public getAccessToken = (): string => {
    return this.getSessionStorageValue(AccessTokenRefrehTokenEnum.ACCESS_TOKEN);
  };

  public getRefreshToken = (): string => {
    return this.getSessionStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN);
  };

  public getOktaIdToken = (): string => {
    return this.getSessionStorageValue(AccessTokenRefrehTokenEnum.OKTA_ID_TOKEN);
  };

  public getCodeVerifier = (): string => {
    return this.getSessionStorageValue(AccessTokenRefrehTokenEnum.CODE_VERIFIER);
  };

  // public getClientName = (): string => {
  //   return this.getSessionStorageValue(AccessTokenRefrehTokenEnum.CLIENT_NAME);
  // };

  public setSessionId = (sessionId: string): void => {
    this.setSessionStorageValue(Session.SESSION_ID, sessionId);
  };

  public setRefreshToken = (refreshToken: string): void => {
    this.setSessionStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN, refreshToken);
  };

  public setAccessToken = (accessToken: string): void => {
    this.setSessionStorageValue(AccessTokenRefrehTokenEnum.ACCESS_TOKEN, accessToken);
  };

  public setOktaIdToken = (oktaIdToken: string): void => {
    this.setSessionStorageValue(AccessTokenRefrehTokenEnum.OKTA_ID_TOKEN, oktaIdToken);
  };

  public setCodeVerifier = (codeVerifier: string): void => {
    this.setSessionStorageValue(AccessTokenRefrehTokenEnum.CODE_VERIFIER, codeVerifier);
  };

  private getSessionStorageValue = (key: string): string => {
    /* istanbul ignore if */
    if (!key) return '';
    const value = sessionStorage.getItem(key) || '';
    return value && value !== 'undefined' ? value : '';
  };
  private setSessionStorageValue = (key: string, value: any): void => {
    /* istanbul ignore else */
    if (key) {
      sessionStorage.setItem(key, value as string);
    }
  };

  private deleteSessionStorage = (): void => {
    sessionStorage.clear();
  };

  /* google logout */
  public googleLogout = (): void => {
    this.deleteSessionInfo();

    const redirectUri: string = encodeURIComponent(
      import.meta.env.REACT_APP_AUTHORIZATION_REDIRECT_URL || ''
    );
    window.location.assign(
      'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=' +
        redirectUri
    );
  };

  /* localStorage */
  public getLocalAccessTokenRefreshTokenInfo = (): AccessTokenRefreshTokenInfo => {
    return {
      refreshToken: this.getLocalStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN),
      accessToken: this.getLocalStorageValue(AccessTokenRefrehTokenEnum.ACCESS_TOKEN),
      clientName: this.getLocalStorageValue(AccessTokenRefrehTokenEnum.CLIENT_NAME),
    };
  };

  public getLocalSessionInfo = (): SessionInfo => {
    return {
      sessionId: this.getLocalStorageValue(Session.SESSION_ID),
      email: this.getLocalStorageValue('email'),
      userName: this.getLocalStorageValue('memberName'),
      userId: this.getLocalStorageValue('memberId'),
      roleType: this.getLocalStorageValue('roleType'),
      deptCode: this.getLocalStorageValue('deptCode'),
      menus: this.getLocalStorageValue('menus')
        ? JSON.parse(this.getLocalStorageValue('menus'))
        : undefined,
    };
  };

  public getRefreshLocalToken = (): string => {
    return this.getLocalStorageValue(AccessTokenRefrehTokenEnum.REFRESH_TOKEN);
  };

  public setLocalStorageInfo = (tokenInfo: any): void => {
    for (const [key, value] of Object.entries(tokenInfo)) {
      this.setLocalStorageValue(key, value ?? '');
    }
  };

  public deleteLocalStorage = (): void => {
    localStorage.clear();
  };

  private getLocalStorageValue = (key: string): string => {
    /* istanbul ignore if */
    if (!key) return '';
    const value = localStorage.getItem(key) || '';
    return value && value !== 'undefined' ? value : '';
  };

  private setLocalStorageValue = (key: string, value: any): void => {
    /* istanbul ignore else */
    if (key) {
      localStorage.setItem(key, value as string);
    }
  };
}
