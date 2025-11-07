import { callApi, Method } from '@utils/ApiUtil';
import { callAuthenticationApi, OAuthMethod } from '@utils/OAuthApiUtil';
import { Service } from '@/models/common/Service';
import SessionUtil from '@utils/SessionUtil';
import {
  SessionInfo,
  // SessionRequest, // 현재 미사용
  AccessTokenRefreshTokenRequest,
  AccessTokenRefreshTokenInfo,
} from '@/models/common/Session';
import CommonResponse from '@/models/common/CommonResponse';
import { jwtDecode } from 'jwt-decode';
import { generateVerifier, generateChallenge } from '@utils/HashUtil';
import { v4 as uuidv4 } from 'uuid';

export default class SessionApis {
  public login = async (isLoading = true) => {
    const sessionUtil = new SessionUtil();
    const { name, email, sub }: any = jwtDecode(sessionUtil?.getOktaIdToken());

    const param = {
      name: name || '',
      email: email || '',
      sub: sub || '',
    };
    return callApi({
      service: Service.KAL_BE,
      url: '/api/v1/session',
      method: Method.POST,
      params: {
        bodyParams: param,
      },
      config: {
        isLoading: isLoading,
      },
    });
  };

  public ApplicationInfoRequest = async (): Promise<SessionInfo> => {
    const sessionUtil = new SessionUtil();
    const sessionResponse = await this.login();

    if (sessionResponse.successOrNot === 'Y') {
      const sessionInfo: SessionInfo = sessionResponse.data as SessionInfo;
      sessionUtil.setSessionInfo(sessionInfo);
      console.log(sessionResponse);
      return sessionInfo;
    }
    throw new Error('Login failed');
  };

  public oauthLogin = async () => {
    const apiUrl = import.meta.env.REACT_APP_API_URL
      ? JSON.parse(import.meta.env.REACT_APP_API_URL)
      : {};
    const oktaIssuer = `${apiUrl['OKTA']}`;
    const redirectUri = import.meta.env.REACT_APP_AUTHORIZATION_REDIRECT_URL || '';
    const clientId = import.meta.env.REACT_APP_CLIENT_ID || '';
    const code_challenge_method = 'S256';
    const state = 'state'.concat('_').concat(uuidv4()) || '';
    const sessionUtil = new SessionUtil();

    const _codeVerifier = generateVerifier();
    sessionStorage.setItem('codeVerifier', _codeVerifier); //<<<<--화면이 redirect되면서 local store는 초기화되므로 session storage에 저장
    sessionUtil.setCodeVerifier(_codeVerifier);
    generateChallenge(_codeVerifier, code_challenge_method)
      .then((codeChallenge) => {
        const requestParam = new URLSearchParams({
          client_id: clientId || '',
          response_type: 'code',
          scope: 'openid email profile',
          redirect_uri: redirectUri,
          state: state,
          code_challenge_method: code_challenge_method,
          code_challenge: codeChallenge,
        }).toString();

        const oktaOAuthUrl = `${oktaIssuer}/oauth2/v1/authorize`;
        localStorage.setItem('requParam:', requestParam); //<<<<--
        window.location.href = oktaOAuthUrl + '?' + requestParam;
      })
      .catch((error: { message: any }) => {
        console.error('when redirected error is occurred. The error message is ', error.message);
      });
  };

  public localLogin() {
    new SessionUtil().setLocalSessionInfo();
    window.location.href = '/';
  }

  //AccessToken 만료시 RefreshToken으로 AccessToken 재발급(ApiUtil.ts)
  public accessTokenRefeshRequest = async (isLoading = true, isAccessToken = true) => {
    const sessionUtil = new SessionUtil();
    const accessTokenParameter = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: sessionUtil.getRefreshToken(),
    }).toString();

    let accessTokenRefreshTokenResponse: CommonResponse = {
      successOrNot: 'N',
      statusCode: 'N', // StatusCode.UNKNOWN_ERROR,
      data: {},
    };

    accessTokenRefreshTokenResponse = await callAuthenticationApi({
      service: Service.APIGEE_AUTH,
      url: '/oauth2/v1/token',
      method: OAuthMethod.POST,
      params: {
        bodyParams: accessTokenParameter || '',
      },
      config: {
        isLoading: isLoading,
        isAccessToken: isAccessToken,
      },
    });

    const accessTokenRefreshTokenJson = JSON.parse(accessTokenRefreshTokenResponse.data as string);

    const { given_name }: any = jwtDecode(accessTokenRefreshTokenJson.data);

    const accessTokenRefreshTokenInfo: AccessTokenRefreshTokenInfo = {
      accessToken: accessTokenRefreshTokenJson.data.access_token,
      refreshToken: accessTokenRefreshTokenJson.data.refresh_token,
      oktaIdToken: accessTokenRefreshTokenJson.data.okta_id_token,
      clientName: given_name,
    };
    sessionUtil.deleteSessionInfo();
    sessionUtil.setAccessTokenRefreshTokenInfo(accessTokenRefreshTokenInfo);
    return accessTokenRefreshTokenResponse;
  };

  public accessTokenRequset = async (authorizationCode: string, state: string) => {
    const accessTokenRefreshTokenRequest: AccessTokenRefreshTokenRequest = {
      code: authorizationCode || '',
      state: state || '',
    };

    return await this.oktaIdTokenRequest(accessTokenRefreshTokenRequest)
      .then((response) => {
        if (response.successOrNot === 'Y') {
          const oktaData = JSON.parse(response.data as string);
          return this.apigeeTokenRequest(oktaData.data.id_token);
        }
      })
      .catch((error) => {
        console.log('errorMessage', error.response.data);
        throw new Error(`cannot get Apigee access token.`);
      });
  };

  //Okta ID token 요청
  public oktaIdTokenRequest = async (oktaIdTokenRequest: AccessTokenRefreshTokenRequest) => {
    const redirectUri: string = import.meta.env.REACT_APP_AUTHORIZATION_REDIRECT_URL || '';
    const authorizationGrantType: string = import.meta.env.REACT_APP_AUTHORIZATION_GRANT_TYPE || '';
    const sessionUtil = new SessionUtil();

    const requestBody = new URLSearchParams({
      grant_type: authorizationGrantType,
      redirect_uri: redirectUri,
      code: oktaIdTokenRequest.code,
      code_verifier: sessionUtil.getCodeVerifier(),
      client_id: import.meta.env.REACT_APP_CLIENT_ID || '',
    }).toString();
    sessionUtil.deleteSessionInfo();

    return await callAuthenticationApi({
      service: Service.OKTA,
      url: '/oauth2/v1/token',
      method: OAuthMethod.POST,
      params: {
        bodyParams: requestBody,
      },
      config: {
        isLoading: true,
      },
    });
  };

  //apigee token 발급 요청
  public apigeeTokenRequest = async (oktaIdToken: string) => {
    const sessionUtil = new SessionUtil();
    const requestBody = new URLSearchParams({
      grant_type: 'okta_id_token',
      okta_id_token: oktaIdToken,
    }).toString();

    return await callAuthenticationApi({
      service: Service.APIGEE_AUTH,
      url: '/oauth2/v1/token',
      method: OAuthMethod.POST,
      params: {
        bodyParams: requestBody,
      },
      config: {
        isLoading: true,
      },
    })
      .then((response) => {
        if (response.successOrNot === 'Y') {
          const apigeeData = JSON.parse(response.data as string);

          const accessTokenRefreshTokenInfo: AccessTokenRefreshTokenInfo = {
            accessToken: apigeeData.data.access_token,
            refreshToken: apigeeData.data.refresh_token,
            oktaIdToken: oktaIdToken,
          };
          sessionUtil.deleteSessionInfo();
          sessionUtil.setAccessTokenRefreshTokenInfo(accessTokenRefreshTokenInfo);
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error_description ||
          error.response?.data?.message ||
          'Cannot get Apigee access/refresh token';
        console.error('Apigee Token Request Error:', errorMessage);
        //throw new Error(errorMessage);
      });
  };

  public logoutRequset = async (isLoading = true, isLogout = true) => {
    let logoutResponse: CommonResponse = {
      successOrNot: 'N',
      statusCode: 'N', // StatusCode.UNKNOWN_ERROR,
      data: {},
    };

    if (import.meta.env.REACT_APP_NODE_ENV === 'local') {
      const logoutParameter = `client_id=${import.meta.env.REACT_APP_CLIENT_ID || ''}&grant_type=revoke_token`;

      logoutResponse = await callAuthenticationApi({
        service: Service.APIGEE_AUTH,
        url: '/oauth2/v1/revoketoken',
        method: OAuthMethod.POST,
        params: {
          //  queryParams: {...accessTokenRefreshTokenReqeust},
          bodyParams: logoutParameter,
        },
        config: {
          isLoading: isLoading,
          isLogout: isLogout,
        },
      });
    } else {
      logoutResponse = await callApi({
        service: Service.HOST,
        url: '/revoke-token',
        method: Method.POST,
        config: {
          isLoading: isLoading,
        },
      });
    }

    return logoutResponse;
  };

  public logout = async (isLoading = true) => {
    return await callApi({
      service: Service.KAL_BE,
      url: '/api/v1/session',
      method: Method.DELETE,
      config: {
        isLoading: isLoading,
      },
    });
  };
}
