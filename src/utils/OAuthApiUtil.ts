import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import SessionUtil from './SessionUtil';

import CommonResponse, { StatusCode } from '@/models/common/CommonResponse';
// import { Buffer } from 'buffer'; // 현재 미사용
import { Service } from '@/models/common/Service';
import SessionApis from '@api/common/SessionApis';

export enum OAuthMethod {
  GET = 'GET',
  POST = 'POST',
}

export interface QueryParams {
  [key: string]: string | number | boolean;
}

export interface ParamObject {
  queryParams?: QueryParams;
  bodyParams?: object;
}

export interface ParamString {
  queryParams?: QueryParams;
  bodyParams?: string;
}

export interface Config {
  isLoading?: boolean;
  isFile?: boolean;
  isOAuth?: boolean;
  isAccessTokenRefreshToken?: boolean;
  isAccessTokenWithGoogleId?: boolean;
  isAccessToken?: boolean;
  isLogout?: boolean;
}

export interface OAuthApiRequest {
  service: Service;
  url: string;
  method: OAuthMethod;
  params?: ParamString;
  config?: Config;
  headers?: { [key: string]: string };
}

/* istanbul ignore next */
/* istanbul ignore next */
const getInstance = (serviceName: string, _isLoading: boolean, params?: any): AxiosInstance => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  const apiUrl = import.meta.env.REACT_APP_API_URL
    ? JSON.parse(import.meta.env.REACT_APP_API_URL)
    : {};
  let baseURL = `${apiUrl['OKTA']}`;

  switch (serviceName) {
    case Service.APIGEE_AUTH:
      baseURL = `${apiUrl['APIGEE_BE']}`;
      break;
  }
  const sessionUtil = new SessionUtil();
  const sessionApis = new SessionApis();

  const authenticationHeader = btoa(
    `${import.meta.env.REACT_APP_CLIENT_ID}:${import.meta.env.REACT_APP_CLIENT_ID}`
  );

  const instance = axios.create({
    baseURL: baseURL,
    params: params || {},
  });

  // 공통 요청 처리
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (config?.headers) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        switch (serviceName) {
          case Service.APIGEE_AUTH:
            config.headers['authorization'] = 'Basic ' + authenticationHeader;
            break;
        }
      }
      return config;
    },
    (error: any): Promise<any> => {
      return Promise.reject(error);
    }
  );

  // success / error 공통 처리
  instance.interceptors.response.use(
    (response: any): any => {
      const commonResponse: CommonResponse = {
        // idToken: '',
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: JSON.stringify(response),
        header: response?.headers,
      };
      return commonResponse;
    },

    (error: any): any => {
      const unknownError: CommonResponse = {
        // idToken: '',
        successOrNot: 'N',
        statusCode: StatusCode.UNKNOWN_ERROR,
        data: {},
      };

      if (error.response && error.response.status.toString().indexOf('40') === 0) {
        if (
          error.response.status.toString() === '403' &&
          error.response.data.errorCode.toString() === '302'
        ) {
          sessionUtil.deleteSessionInfo();
          sessionApis.oauthLogin();
        } else {
          sessionUtil.deleteSessionInfo();
          window.location.replace('/');
        }
      }
      return unknownError;
    }
  );

  return instance;
};

const getQueryStringFormat = (queryParams?: QueryParams) => {
  if (!queryParams) return '';
  const keys = Object.keys(queryParams);
  const queryString = keys
    .filter((key) => !!queryParams[key])
    .map((key) => `${key}=${encodeURIComponent(queryParams[key] as string)}`)
    .join('&');
  return queryString ? `?${queryString}` : '';
};

//oAuth 인증 관련 API
export const callAuthenticationApi = async (
  oauthApiRequest: OAuthApiRequest
): Promise<CommonResponse> => {
  const url: string =
    oauthApiRequest.url + getQueryStringFormat(oauthApiRequest.params?.queryParams);
  const isLoading = oauthApiRequest.config?.isLoading || false;

  switch (oauthApiRequest.method) {
    case OAuthMethod.GET:
      return await getInstance(oauthApiRequest.service, isLoading, {}).get(url);
    case OAuthMethod.POST:
      // bodyParams for OAuth requests
      return await getInstance(oauthApiRequest.service, isLoading, {}).post(
        url,
        oauthApiRequest.params?.bodyParams
      );
    default:
      throw Error('Not Supported Method');
  }
};
