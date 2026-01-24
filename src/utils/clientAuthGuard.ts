import { callApi, Method } from './ApiUtil';
import { Service } from '@/models/common/Service';
import { ClientAuthEventDispatch } from './clientAuthEventBus';

let inFlight: Promise<boolean> | null = null;

/**
 * 쿠키(HTTPOnly) 기반 인증 전제.
 * - sessionStorage/localStorage 같은 클라이언트 저장소에 로그인 상태를 저장하지 않습니다.
 * - 필요 시 서버에 "지금 로그인 상태인가"를 물어봅니다.
 */
export const ensureClientLoggedIn = async (opts?: { openModal?: boolean }): Promise<boolean> => {
  const openModal = opts?.openModal ?? true;

  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/client/balance',
        method: Method.GET,
        redirect: false,
        // 여기서 401이 나도 ApiUtil이 모달을 자동으로 띄우지 않게 하고,
        // 아래에서 우리가 정책대로(=사용자 액션일 때만) 모달을 띄움
        suppressAuthEvent: true,
      });

      const ok = res.successOrNot === 'Y';
      if (!ok && openModal) {
        ClientAuthEventDispatch('authRequired', {
          reason: 'unauthorized',
          status: String(res.statusCode ?? ''),
          url: '/api/client/balance',
        });
      }
      return ok;
    } catch {
      if (openModal) {
        ClientAuthEventDispatch('authRequired', {
          reason: 'unknown',
          url: '/api/client/balance',
        });
      }
      return false;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
};
