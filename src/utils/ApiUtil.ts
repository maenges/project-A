import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import SessionUtil from '@utils/SessionUtil';
import CommonResponse, { StatusCode } from '@/models/common/CommonResponse';

import { v4 as uuidv4 } from 'uuid';
import { Service } from '@/models/common/Service';
import { useLoadingStore } from '@/store/loading';
import { ClientAuthEventDispatch } from '@/utils/clientAuthEventBus';

const TIMESTAMP_FIELDS = ['created', 'updated', 'created_at', 'updated_at'];

let refreshInFlight: Promise<void> | null = null;

const isRefreshRequest = (url?: string): boolean => {
  if (!url) return false;
  return url.includes('/api/auth/refresh');
};

// 로그인 페이지 예외 처리
const isLoginRequest = (url?: string): boolean => {
  if (!url) return false;
  return url.includes('/api/auth/login');
};

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
  /**
   * 인증 만료/401 처리 시 리다이렉트 제어
   * - string: 해당 경로로 이동 (예: '/login')
   * - false: 리다이렉트 하지 않음 (client 영역 등에서 모달로 처리할 때)
   * - undefined: 기본 정책 적용 (현재 경로가 /client면 리다이렉트 안함, 그 외는 /login)
   */
  redirect?: string | false;

  /**
   * redirect=false(=client 영역 기본)일 때, authRequired 이벤트(로그인 모달 오픈)를 억제합니다.
   * - 헤더에서 로그인 여부를 조용히 판별하는 용도 등
   */
  suppressAuthEvent?: boolean;
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

const getEnvBool = (key: string, defaultValue: boolean): boolean => {
  const value = getEnv(key);
  if (value == null) return defaultValue;
  return value === 'true';
};

const getDefaultAuthRedirect = (): string | false => {
  if (typeof window === 'undefined') return '/login';
  // client 영역은 강제 /login 이동 대신 화면에서 모달/토스트 처리할 수 있도록 기본값을 'no redirect'로 둠
  if (window.location.pathname.startsWith('/client')) return false;
  return '/login';
};

const redirectToAuth = (
  redirect: string | false | undefined,
  meta?: {
    reason?: 'unauthorized' | 'session-expired' | 'refresh-failed' | 'unknown';
    status?: string;
    url?: string;
  },
  suppressAuthEvent?: boolean
) => {
  const target = redirect ?? getDefaultAuthRedirect();

  if (target === false) {
    if (suppressAuthEvent) return;
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/client')) {
      ClientAuthEventDispatch('authRequired', {
        reason: meta?.reason ?? 'unauthorized',
        status: meta?.status,
        url: meta?.url,
      });
    }
    return;
  }

  window.location.href = target;
};

/* istanbul ignore next */
const getInstance = (
  serviceName: Service,
  isLoading: boolean,
  params?: any,
  isFile?: boolean,
  redirect?: string | false,
  suppressAuthEvent?: boolean
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

  // 쿠키 기반 인증(HTTPOnly access_token) 사용 시, 로컬 포함 항상 쿠키를 주고받아야 합니다.
  // (특히 프론트/백엔드가 다른 Origin이면 withCredentials=false일 때 Set-Cookie가 저장되지 않음)
  // 기본값은 true (쿠키 기반 인증 전제)
  const withCredentials = getEnvBool('VITE_API_WITH_CREDENTIALS', true);
  axios.defaults.withCredentials = withCredentials;

  let baseURL = '';
  const sessionUtil = new SessionUtil();

  switch (serviceName) {
    case Service.POSTMAN:
      // 여기서만 사용하니까 이 값만 잘 주입되면 됨
      // baseURL = getEnv('VITE_API_BASE_URL') || getEnv('REACT_APP_API_URL') || '';
      baseURL = '';
      break;

    case Service.HOST:
      baseURL = getEnv('REACT_APP_AUTHORIZATION_REDIRECT_URL') || '';
      break;

    default:
      baseURL = '';
      break;
  }

  const instance = axios.create({
    baseURL,
    params: params || {},
    withCredentials,
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

      // 백엔드가 message로 내려주는 에러/메시지를 기존 프론트 규격(HeaderMsg)으로 매핑
      if (!commonResponse.HeaderMsg && commonResponse.message) {
        commonResponse.HeaderMsg = commonResponse.message;
      }

      if (isLoading) {
        hideLoading();
      }
      return commonResponse;
    },

    async (error: any): Promise<any> => {
      if (isLoading) {
        hideLoading();
      }

      const status = error.response?.status?.toString();
      const originalRequest = error.config as
        | (AxiosRequestConfig & { _retry?: boolean })
        | undefined;

      const unknownError: CommonResponse = {
        successOrNot: 'N',
        statusCode: StatusCode.UNKNOWN_ERROR,
        data: {},
      };

      // const expiredError: CommonResponse = {
      //   successOrNot: 'N',
      //   statusCode: StatusCode.SESSION_EXPIRED,
      //   data: {},
      // };

      // const blockedError: CommonResponse = {
      //   successOrNot: 'N',
      //   statusCode: StatusCode.BLOCKED_USER,
      //   message: '차단된 사용자입니다. 관리자에게 문의해주세요.',
      //   data: {},
      // };

      // const alreadyExists: CommonResponse = {
      //   successOrNot: 'N',
      //   statusCode: StatusCode.,
      //   message: '이미 존재하는 데이터입니다.',
      //   data: {},
      // };

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
          redirectToAuth(
            redirect,
            { reason: 'refresh-failed', status, url: error.response?.config?.url },
            suppressAuthEvent
          );
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

      // 기준: 401 발생 시 /api/auth/refresh 호출 후 원요청 재시도
      // - refresh 요청 자체(무한루프 방지) / 이미 재시도한 요청은 제외
      if (
        status === '401' &&
        originalRequest &&
        !originalRequest._retry &&
        !isRefreshRequest(originalRequest.url) &&
        !isLoginRequest(originalRequest.url)
      ) {
        originalRequest._retry = true;

        try {
          if (!refreshInFlight) {
            const refreshClient = axios.create({
              baseURL: instance.defaults.baseURL,
              withCredentials: true,
            });
            refreshInFlight = refreshClient
              .post('/api/auth/refresh')
              .then(() => undefined)
              .finally(() => {
                refreshInFlight = null;
              });
          }

          await refreshInFlight;

          // refresh 성공 후, 실패했던 요청을 그대로 재시도
          return await instance.request(originalRequest);
        } catch (_e) {
          redirectToAuth(
            redirect,
            { reason: 'refresh-failed', status, url: originalRequest.url },
            suppressAuthEvent
          );
          return {
            successOrNot: 'N',
            statusCode: StatusCode.SESSION_EXPIRED,
            data: {},
          } as CommonResponse;
        }
      }

      // refresh 후에도 401이 계속 발생하거나, refresh 대상이 아닌 401은 로그인 처리로 위임
      if (
        status === '401' &&
        originalRequest &&
        !isRefreshRequest(originalRequest.url) &&
        !isLoginRequest(originalRequest.url)
      ) {
        redirectToAuth(
          redirect,
          {
            reason: 'unauthorized',
            status,
            url: originalRequest.url,
          },
          suppressAuthEvent
        );
        return {
          successOrNot: 'N',
          statusCode: StatusCode.SESSION_EXPIRED,
          data: {},
        } as CommonResponse;
      }

      if (error.response && error.response.status.toString().indexOf('40') === 0) {
        if (error.response.data instanceof Blob) {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          error.response.data = {
            errorCode: json.errorCode,
          };
        }
      }

      // if (status === '403') {
      //   return blockedError;
      // }

      // if (status === '401') {
      //   return expiredError;
      // }

      // 4xx 등 비-2xx 응답이 JSON(CommonResponse 형태)로 내려오는 경우 message -> HeaderMsg 매핑
      if (error.response?.data && typeof error.response.data === 'object') {
        const serverData = error.response.data as CommonResponse;
        const normalized: CommonResponse = {
          ...unknownError,
          ...serverData,
          successOrNot: serverData.successOrNot ?? 'N',
          statusCode:
            typeof (serverData as any).statusCode === 'number'
              ? String((serverData as any).statusCode)
              : ((serverData as any).statusCode ?? StatusCode.UNKNOWN_ERROR),
          data: serverData.data ?? {},
          HeaderMsg: serverData.HeaderMsg ?? serverData.message ?? (serverData as any).headerMsg,
        };
        return normalized;
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

  let response: CommonResponse = {
    successOrNot: 'N',
    statusCode: StatusCode.UNKNOWN_ERROR,
    data: {},
  };
  switch (apiRequest.method) {
    case Method.GET:
      response = await getInstance(
        apiRequest.service,
        isLoading,
        {},
        isFile,
        apiRequest.redirect,
        apiRequest.suppressAuthEvent
      ).get(url);
      break;
    case Method.POST:
      response = await getInstance(
        apiRequest.service,
        isLoading,
        {},
        isFile,
        apiRequest.redirect,
        apiRequest.suppressAuthEvent
      ).post(url, apiRequest.params?.bodyParams);
      break;
    case Method.PUT:
      response = await getInstance(
        apiRequest.service,
        isLoading,
        {},
        isFile,
        apiRequest.redirect,
        apiRequest.suppressAuthEvent
      ).put(url, apiRequest.params?.bodyParams);
      break;
    case Method.PATCH:
      response = await getInstance(
        apiRequest.service,
        isLoading,
        {},
        isFile,
        apiRequest.redirect,
        apiRequest.suppressAuthEvent
      ).patch(url, apiRequest.params?.bodyParams);
      break;
    case Method.DELETE:
      response = await getInstance(
        apiRequest.service,
        isLoading,
        {},
        isFile,
        apiRequest.redirect,
        apiRequest.suppressAuthEvent
      ).delete(url, { data: apiRequest.params?.bodyParams });
      break;
    default:
      break;
  }

  if (response.successOrNot === 'N' && response.statusCode === 'SESSION_EXPIRE') {
    redirectToAuth(
      apiRequest.redirect,
      {
        reason: 'session-expired',
        status: String(response.statusCode),
        url: apiRequest.url,
      },
      apiRequest.suppressAuthEvent
    );
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
      response = await getInstance(
        apiRequest.service,
        isLoading,
        {},
        isFile,
        apiRequest.redirect
      ).get(url);
      break;
    case Method.POST:
      response = await getInstance(
        apiRequest.service,
        isLoading,
        {},
        isFile,
        apiRequest.redirect
      ).post(url, apiRequest.params?.bodyParams);
      break;
    case Method.PUT:
      response = await getInstance(
        apiRequest.service,
        isLoading,
        {},
        isFile,
        apiRequest.redirect
      ).put(url, apiRequest.params?.bodyParams);
      break;
    case Method.PATCH:
      response = await getInstance(
        apiRequest.service,
        isLoading,
        {},
        isFile,
        apiRequest.redirect
      ).patch(url, apiRequest.params?.bodyParams);
      break;
    case Method.DELETE:
      response = await getInstance(
        apiRequest.service,
        isLoading,
        {},
        isFile,
        apiRequest.redirect
      ).delete(url, { data: apiRequest.params?.bodyParams });
      break;
    default:
      throw Error('Not Supported Method');
  }
  return response;
};
