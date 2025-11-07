import axios from 'axios';
import { getLocalRefreshToken, removeLocalRefreshToken } from './authUtil';

/**
 * Access Token 재발급을 요청합니다.
 */
export const refreshAccessToken = async () => {
  // localStorage에서 Refresh Token을 가져옵니다.
  const refreshToken = getLocalRefreshToken();

  if (!refreshToken) {
    console.error('Refresh Token이 없어 재발급을 중단합니다.');
    // 세션 정리 및 리디렉션 로직
    removeLocalRefreshToken();
    // sessionStorage.clear(); // 필요 시 다른 세션 정보도 정리
    window.location.href = '/';
    return Promise.reject(new Error('No refresh token available'));
  }

  try {
    await axios.post('/oauth2/v1/refresh', { refreshToken }, { withCredentials: true });
    console.log('Access Token 재발급 요청 성공.');
    return { success: true };
  } catch (error) {
    console.error('Access Token 재발급 실패:', error);
    // 재발급 실패 시 (Refresh Token 만료 등) 토큰을 지우고 리디렉션
    removeLocalRefreshToken();
    // sessionStorage.clear();
    window.location.href = '/';
    return Promise.reject(error);
  }
};

/**
 * 로그아웃을 처리합니다.
 */
export const logout = async () => {
  try {
    // NGINX의 /oauth2/v1/logout 엔드포인트에 POST 요청
    const response = await axios.post('/oauth2/v1/logout', null, { withCredentials: true });

    // NGINX가 응답으로 준 Okta 로그아웃 URL로 리디렉션
    if (response.data?.callback) {
      window.location.href = response.data.callback;
    } else {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('로그아웃 처리 중 에러 발생:', error);
    window.location.href = '/';
  }
};
