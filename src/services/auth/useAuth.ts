import { useEffect } from 'react';
// import { getRefreshToken } from './auth.api.ts';
// import { setLocalRefreshToken } from './authUtil.ts';

export const useAuth = () => {
  useEffect(() => {
    (async () => {
      try {
        // const { data } = await getRefreshToken();
        // const refreshToken = data?.value;
        // setLocalRefreshToken(refreshToken, data?.expiredAt);
      } catch {
        // 토큰 갱신 실패 시 무시 (로그인 페이지에서 처리)
      }
    })();
  }, []);
};
