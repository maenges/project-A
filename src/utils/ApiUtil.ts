import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import SessionUtil from '@utils/SessionUtil';
import { refreshAccessToken } from '@/services/auth/auth.api';
import CommonResponse, { StatusCode } from '@/models/common/CommonResponse';

import { v4 as uuidv4 } from 'uuid';
import { Service } from '@/models/common/Service';
import { useLoadingStore } from '@/store/loading';

const TIMESTAMP_FIELDS = ['created', 'updated', 'created_at', 'updated_at'];

export function formatDate(dateString?: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  );
}

function convertTimestampFields(obj: any) {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key in obj) {
    if (TIMESTAMP_FIELDS.includes(key) && typeof obj[key] === 'string') {
      obj[key] = formatDate(obj[key]);
    }

    if (typeof obj[key] === 'object') {
      convertTimestampFields(obj[key]);
    }
  }
  return obj;
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface QueryParams {
  [key: string]: string | string[] | number | boolean;
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
}

export interface ApiRequest {
  service: Service;
  url: string;
  method: Method;
  params?: ParamObject;
  config?: Config;
  redirect?: string;
}

/**
 * 런타임/빌드 환경 변수 헬퍼
 * - 1순위: window.__ENV (env-config.js에서 주입)
 * - 2순위: Vite 빌드 타임 환경변수 (import.meta.env)
 */
const runtimeEnv: Record<string, string> =
  (typeof window !== 'undefined' && (window as any).__ENV) || {};

const getEnv = (key: string): string | undefined => {
  if (runtimeEnv && key in runtimeEnv) {
    return runtimeEnv[key];
  }
  return (import.meta.env as any)[key];
};

/* istanbul ignore next */
const getInstance = (
  serviceName: Service,
  isLoading: boolean,
  params?: any,
  isFile?: boolean
): AxiosInstance => {
  const { showLoading, hideLoading } = useLoadingStore.getState();
  if (isLoading) {
    showLoading();
  }
  // CSRF 방지 헤더 추가
  axios.defaults.headers.common['X-ADMIN-REQUEST'] = 'true';

  axios.defaults.headers.get['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.put['Content-Type'] = 'application/json';
  axios.defaults.headers.patch['Content-Type'] = 'application/json';
  axios.defaults.withCredentials = true;

  let baseURL = '';
  const sessionUtil = new SessionUtil();

  switch (serviceName) {
    case Service.POSTMAN:
      // 여기서만 사용하니까 이 값만 잘 주입되면 됨
      baseURL = getEnv('VITE_API_BASE_URL') || getEnv('REACT_APP_API_URL') || '';
      break;

    case Service.HOST:
      baseURL = getEnv('REACT_APP_AUTHORIZATION_REDIRECT_URL') || '';
      break;

    default:
      baseURL = '';
      break;
  }

  // 디버깅용 로그 (원하면 나중에 제거)
  if (!baseURL) {
    console.warn('[API] baseURL 이 비어 있습니다. service =', serviceName);
  } else {
    console.log('[API] baseURL =', baseURL, 'service =', serviceName);
  }

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    params: params || {},
    withCredentials: import.meta.env.VITE_API_WITH_CREDENTIALS === 'true',
  });

  // 공통 요청 처리
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (config?.headers) {
        if (sessionUtil.getSessionInfo().sessionId) {
          config.headers['x-session-id'] = sessionUtil.getSessionInfo().sessionId || '';
        }
        if (isFile) {
          config.headers['Content-Type'] = 'multipart/form-data';
        } else {
          config.headers['x-correlation-id'] =
            window.location.pathname === '/'
              ? 'root'.concat('_').concat(uuidv4())
              : window.location.pathname?.concat('_').concat(uuidv4()) || '';
          config.headers['Content-Type'] = 'application/json';
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
      response.data = convertTimestampFields(response.data);
      const commonResponse: CommonResponse =
        response.status === 204
          ? {
              successOrNot: 'Y',
              statusCode: StatusCode.NO_CONTENT,
              data: {},
            }
          : (response.data as CommonResponse);
      if (response.status !== 204) commonResponse.header = response?.headers;

      if (isLoading) {
        hideLoading();
      }
      return commonResponse;
    },

    async (error: any): Promise<any> => {
      if (isLoading) {
        hideLoading();
      }

      const unknownError: CommonResponse = {
        successOrNot: 'N',
        statusCode: StatusCode.UNKNOWN_ERROR,
        data: {},
      };

      const expiredError: CommonResponse = {
        successOrNot: 'N',
        statusCode: StatusCode.SESSION_EXPIRED,
        data: {},
      };

      const downloadError: CommonResponse = {
        successOrNot: 'N',
        statusCode: StatusCode.DOWNLOAD_SIZE_EXCEEDS,
        data: {},
      };

      if (error.response && error.response.status.toString().indexOf('50') === 0) {
        // updown excel download exceeds error
        if (
          error.response.status.toString() === '502' &&
          error.response.data instanceof Blob &&
          error.response.data.type === 'application/json'
        ) {
          const text: string = await error.response.data.text();
          if (text.indexOf('"errorCode" : 605') >= 0) {
            return downloadError;
          }
        } else if (
          error.response?.headers &&
          error.response?.headers['content-type'] === 'text/html'
        ) {
          // refresh token 만료시 로그인으로 이동
          window.location.href = '/login';
        } else if (error.response.status.toString() === '500') {
          let HeaderMsg;
          switch (error.response.config.method.toString().toUpperCase()) {
            case Method.GET:
              HeaderMsg = '조회에 실패하였습니다. 잠시 후 다시 시도해주세요.';
              break;
            case Method.POST:
              HeaderMsg = '등록에 실패하였습니다. 잠시 후 다시 시도해주세요.';
              break;
            case Method.PUT:
              HeaderMsg = '수정에 실패하였습니다. 잠시 후 다시 시도해주세요.';
              break;
            case Method.DELETE:
              HeaderMsg = '삭제에 실패하였습니다. 잠시 후 다시 시도해주세요.';
              break;
          }
          return {
            successOrNot: 'N',
            statusCode: StatusCode.UNKNOWN_ERROR,
            data: {},
            HeaderMsg,
          } as CommonResponse;
        }
      }

      if (error.response && error.response.status.toString().indexOf('40') === 0) {
        if (error.response.data instanceof Blob) {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          error.response.data = {
            errorCode: json.errorCode,
          };
        }

        if (
          error.response.status.toString() === '403' &&
          error.response.data.errorCode.toString() === '301'
        ) {
          try {
            await refreshAccessToken();
            const originalRequest = error.config;
            const retryResponse = await axios.request(originalRequest as AxiosRequestConfig);
            return retryResponse.data as CommonResponse;
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        } else {
          sessionUtil.deleteSessionInfo();
        }
      }

      if (error.response?.status?.toString() === '401') {
        return expiredError;
      }

      return unknownError;
    }
  );

  return instance;
};

const getQueryStringFormat = (queryParams?: object) => {
  if (!queryParams) return '';
  const queryString = Object.entries(queryParams)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0
          ? value.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
          : [];
      } else {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    })
    .join('&');
  return queryString ? `?${queryString}` : '';
};

export const callApi = async (apiRequest: ApiRequest): Promise<CommonResponse> => {
  const url: string = apiRequest.url + getQueryStringFormat(apiRequest.params?.queryParams);
  const isLoading = apiRequest.config?.isLoading || false;
  const isFile = apiRequest.config?.isFile || false;
  const sessionUtil = new SessionUtil();

  let response: CommonResponse = {
    successOrNot: 'N',
    statusCode: StatusCode.UNKNOWN_ERROR,
    data: {},
  };
  switch (apiRequest.method) {
    case Method.GET:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).get(url);
      break;
    case Method.POST:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).post(
        url,
        apiRequest.params?.bodyParams
      );
      break;
    case Method.PUT:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).put(
        url,
        apiRequest.params?.bodyParams
      );
      break;
    case Method.PATCH:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).patch(
        url,
        apiRequest.params?.bodyParams
      );
      break;
    case Method.DELETE:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).delete(url);
      break;
    default:
      break;
  }

  if (response.successOrNot === 'N' && response.statusCode === 'SESSION_EXPIRE') {
    sessionUtil.deleteSessionInfo();
    window.location.href = '/login';
  }

  return response;
};

export const callApiForFile = async (apiRequest: ApiRequest): Promise<any> => {
  const url: string = apiRequest.url + getQueryStringFormat(apiRequest.params?.queryParams);
  const isLoading = apiRequest.config?.isLoading || false;
  const isFile = apiRequest.config?.isFile || false;
  let response;

  switch (apiRequest.method) {
    case Method.GET:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).get(url);
      break;
    case Method.POST:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).post(
        url,
        apiRequest.params?.bodyParams
      );
      break;
    case Method.PUT:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).put(
        url,
        apiRequest.params?.bodyParams
      );
      break;
    case Method.PATCH:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).patch(
        url,
        apiRequest.params?.bodyParams
      );
      break;
    case Method.DELETE:
      response = await getInstance(apiRequest.service, isLoading, {}, isFile).delete(url);
      break;
    default:
      throw Error('Not Supported Method');
  }
  return response;
};
