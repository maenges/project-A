import { io, Socket } from 'socket.io-client';
import { useAdminDashboardStore } from '@/store/adminDashboard';
import { AdminDashboardEventDispatch } from './adminDashboardEventBus';

let adminSocket: Socket | null = null;

/**
 * 관리자 WebSocket 연결 (관리자 로그인 후 호출)
 */
export function connectAdminSocket(): void {
  // 이미 연결되어 있으면 무시
  if (adminSocket?.connected) {
    console.log('⚠️ 관리자 WebSocket 이미 연결됨');
    return;
  }

  // 기존 소켓이 있으면 정리
  if (adminSocket) {
    adminSocket.removeAllListeners();
    adminSocket.disconnect();
    adminSocket = null;
  }

  adminSocket = io('/admin-connection', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    upgrade: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 3000,
    timeout: 20000,
    forceNew: false,
  });

  adminSocket.on('connect', () => {
    console.log('✅ 관리자 WebSocket 연결됨:', adminSocket?.id);
  });

  adminSocket.on('connect_error', (err) => {
    console.error('❌ 관리자 WebSocket 연결 실패:', err.message);
  });

  adminSocket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`🔄 관리자 WebSocket 재연결 시도 중... (${attemptNumber}번째)`);
  });

  adminSocket.on('reconnect', (attemptNumber) => {
    console.log(`✅ 관리자 WebSocket 재연결 성공 (${attemptNumber}번째 시도)`);
  });

  adminSocket.on('reconnect_failed', () => {
    console.error('❌ 관리자 WebSocket 재연결 실패 (모든 시도 소진)');
  });

  adminSocket.on('disconnect', (reason) => {
    console.log('🔌 관리자 WebSocket 해제:', reason);
    if (reason === 'io server disconnect' && adminSocket) {
      adminSocket.connect();
    }
  });

  // ========== 이벤트 수신 ==========

  // 보유금 업데이트
  //   adminSocket.on('balance_update', (data: { balance: number }) => {
  //     console.log('💰 [Admin] 보유금 업데이트:', data);
  //     const { setBalance } = useAdminDashboardStore.getState();
  //     setBalance(data.balance);
  //     AdminDashboardEventDispatch('balance_update', data);
  //   });

  // 가입신청 (승인대기)
  adminSocket.on('pending_approval_count', (data?: { count?: number }) => {
    console.log('👤 [Admin] 새 가입신청:', data);
    const { incrementPendingApprovalCount } = useAdminDashboardStore.getState();
    incrementPendingApprovalCount();

    // 음성 알림 재생
    try {
      const audio = new Audio('/voice/customer-wait.mp3');
      audio.play().catch((err) => console.warn('음성 재생 실패:', err));
    } catch (err) {
      console.warn('음성 재생 오류:', err);
    }

    AdminDashboardEventDispatch('new_signup', undefined);
  });

  // 충전 신청
  adminSocket.on('new_deposit_count', (data?: { count?: number }) => {
    console.log('💵 [Admin] 새 충전신청:', data);
    const { incrementDepositCount } = useAdminDashboardStore.getState();
    incrementDepositCount();

    // 음성 알림 재생
    try {
      const audio = new Audio('/voice/recharge.mp3');
      audio.play().catch((err) => console.warn('음성 재생 실패:', err));
    } catch (err) {
      console.warn('음성 재생 오류:', err);
    }

    AdminDashboardEventDispatch('new_deposit', undefined);
  });

  // 환전 신청
  adminSocket.on('new_withdraw_count', (data?: { count?: number }) => {
    console.log('💸 [Admin] 새 환전신청:', data);
    const { incrementWithdrawCount } = useAdminDashboardStore.getState();
    incrementWithdrawCount();

    // 음성 알림 재생
    try {
      const audio = new Audio('/voice/exchange.mp3');
      audio.play().catch((err) => console.warn('음성 재생 실패:', err));
    } catch (err) {
      console.warn('음성 재생 오류:', err);
    }

    AdminDashboardEventDispatch('new_withdraw', undefined);
  });

  // 새 문의
  adminSocket.on('new_support_count', (data?: { count?: number }) => {
    console.log('❓ [Admin] 새 문의:', data);
    const { incrementSupportCount } = useAdminDashboardStore.getState();
    incrementSupportCount();

    // 음성 알림 재생
    try {
      const audio = new Audio('/voice/answer-admin.mp3');
      audio.play().catch((err) => console.warn('음성 재생 실패:', err));
    } catch (err) {
      console.warn('음성 재생 오류:', err);
    }

    AdminDashboardEventDispatch('new_support', undefined);
  });

  // 실시간 접속자 수 업데이트 (5초마다)
  adminSocket.on('userStatus', (data: { timestamp: string; total: number; online: number }) => {
    console.log('👥 [Admin] 실시간 접속자 수:', data);
    const { setOnlineCount } = useAdminDashboardStore.getState();
    setOnlineCount(data.online || 0);
  });
}

/**
 * 관리자 WebSocket 해제 (로그아웃 시 호출)
 */
export function disconnectAdminSocket(): void {
  if (adminSocket) {
    adminSocket.disconnect();
    adminSocket = null;
    console.log('🔌 관리자 WebSocket 수동 해제');
  }
}

/**
 * 현재 관리자 WebSocket 연결 상태 확인
 */
export function isAdminSocketConnected(): boolean {
  return adminSocket?.connected ?? false;
}
