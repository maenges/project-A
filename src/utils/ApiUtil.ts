import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import SessionUtil from '@utils/SessionUtil';
import { refreshAccessToken } from '@/services/auth/auth.api';
import CommonResponse, { StatusCode } from '@/models/common/CommonResponse';

import { v4 as uuidv4 } from 'uuid';
import { Service } from '@/models/common/Service';
import { useLoadingStore } from '@/store/loading';

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

/* istanbul ignore next */
const getInstance = (
  serviceName: string,
  isLoading: boolean,
  params?: any,
  isFile?: boolean
): AxiosInstance => {
  const { showLoading, hideLoading } = useLoadingStore.getState();
  if (isLoading) {
    showLoading();
  }

  axios.defaults.headers.get['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.put['Content-Type'] = 'application/json';
  axios.defaults.headers.patch['Content-Type'] = 'application/json';
  axios.defaults.withCredentials = true;
  // const apiUrl = import.meta.env.REACT_APP_API_URL
  //   ? JSON.parse(import.meta.env.REACT_APP_API_URL)
  //   : {};

  let baseURL: string = '';
  const sessionUtil = new SessionUtil();

  switch (serviceName) {
    // case Service.KAL_BE:
    //   baseURL =
    //     import.meta.env.REACT_APP_NODE_ENV === 'local'
    //       ? apiUrl['KAL_BE'] + ':' + ServicePort.KAL_BE.toString()
    //       : apiUrl['KAL_BE'];
    //   break;
    case Service.POSTMAN:
      break;
    case Service.HOST:
      baseURL = import.meta.env.REACT_APP_AUTHORIZATION_REDIRECT_URL!;
      break;
    default:
      break;
  }

  const instance = axios.create({
    baseURL: baseURL,
    params: params || {},
    withCredentials: true,
    // timeout: 1000, // 사용시 timeout 관련 주석 해제 필요
  });

  // 공통 요청 처리
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (config?.headers) {
        // 기존 authorization 헤더 주석 처리
        // const accessToken: string | undefined =
        //   sessionUtil.getAccessTokenRefreshTokenInfo().accessToken;
        // if (accessToken) config.headers['authorization'] = `Bearer ${accessToken}`;

        // Postman 방식: accessToken을 idToken 쿠키로 추가
        // const accessToken = sessionStorage.getItem('accessToken');
        // if (accessToken) {
        //   config.headers['Cookie'] = `idToken=${accessToken}`;
        // }

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

      // timeout 에러 처리
      // if (error.code === 'ECONNABORTED') {
      //   console.error('API 요청 시간 초과:', error);
      //   return {
      //     successOrNot: 'N',
      //     statusCode: StatusCode.UNKNOWN_ERROR,
      //     data: {},
      //     HeaderMsg: '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.',
      //   } as CommonResponse;
      // }

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
            // 1. 새로운 토큰 재발급 함수를 호출합니다.
            await refreshAccessToken();

            // 2. 원래 실패했던 요청을 가져옵니다.
            const originalRequest = error.config;

            // 3. 헤더를 수정할 필요 없이, 원래 요청을 그대로 다시 보냅니다.
            //    NGINX가 갱신된 HttpOnly 쿠키를 사용하여 자동으로 새 토큰을 헤더에 넣어줍니다.
            const retryResponse = await axios.request(originalRequest as AxiosRequestConfig);
            return retryResponse.data as CommonResponse;
          } catch (refreshError) {
            // 토큰 재발급 실패 시, 로그인 페이지로 보내거나 에러를 반환합니다.
            // refreshAccessToken 함수 내부에서 이미 리디렉션 처리를 하므로 여기서는 에러만 반환해도 됩니다.
            return Promise.reject(refreshError);
          }
        } else {
          sessionUtil.deleteSessionInfo();
        }
      }

      if (error.response.status.toString() === '401') {
        return expiredError;
      }
      //  else {
      // sessionUtil.deleteSessionInfo();
      // return unknownError;
      // }
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

  // check session expired
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
