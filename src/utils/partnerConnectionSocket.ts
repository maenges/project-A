import { io, Socket } from 'socket.io-client';
import { usePartnerDashboardStore } from '@/store/partnerDashboard';
import { PartnerDashboardEventDispatch } from './partnerDashboardEventBus';
import { useUnreadInboxStore } from '@/store/unreadInbox';
import { InboxMessageEventDispatch } from './inboxMessageEventBus';
import { useUnreadSupportStore } from '@/store/unreadSupport';
import { SupportAnswerEventDispatch } from './supportAnswerEventBus';

let partnerSocket: Socket | null = null;

/**
 * 파트너 WebSocket 연결 (파트너 로그인 후 호출)
 */
export function connectPartnerSocket(): void {
  // 이미 연결되어 있으면 무시
  if (partnerSocket?.connected) {
    console.log('⚠️ 파트너 WebSocket 이미 연결됨');
    return;
  }

  // 기존 소켓이 있으면 정리
  if (partnerSocket) {
    partnerSocket.removeAllListeners();
    partnerSocket.disconnect();
    partnerSocket = null;
  }

  partnerSocket = io('/partner-connection', {
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

  partnerSocket.on('connect', () => {
    console.log('✅ 파트너 WebSocket 연결됨:', partnerSocket?.id);
  });

  partnerSocket.on('connect_error', (err) => {
    console.error('❌ 파트너 WebSocket 연결 실패:', err.message);
  });

  partnerSocket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`🔄 파트너 WebSocket 재연결 시도 중... (${attemptNumber}번째)`);
  });

  partnerSocket.on('reconnect', (attemptNumber) => {
    console.log(`✅ 파트너 WebSocket 재연결 성공 (${attemptNumber}번째 시도)`);
  });

  partnerSocket.on('reconnect_failed', () => {
    console.error('❌ 파트너 WebSocket 재연결 실패 (모든 시도 소진)');
  });

  partnerSocket.on('disconnect', (reason) => {
    console.log('🔌 파트너 WebSocket 해제:', reason);
    if (reason === 'io server disconnect' && partnerSocket) {
      partnerSocket.connect();
    }
  });

  // 잔액 업데이트 이벤트 수신 (emitPartnerBalanceUpdate)
  partnerSocket.on('balance_update', (data: { money: number }) => {
    console.log('💰 [Partner] 잔액 업데이트 수신:', data);
    usePartnerDashboardStore.getState().setMoney(data.money);
    PartnerDashboardEventDispatch('balance_update', { money: data.money });
  });

  // 충전/환전 처리 완료 알림 (파트너 본인 요청 승인/거절)
  partnerSocket.on(
    'transaction_processed',
    (data: { type: 'RECHARGE' | 'EXCHANGE'; approved: boolean; amount: number }) => {
      console.log('💳 [Partner] 거래 처리 알림 수신:', data);

      let message = '';
      let audioFile = '';

      if (data.type === 'RECHARGE') {
        if (data.approved) {
          message = `충전이 승인되었습니다. (${data.amount.toLocaleString('ko-KR')}원)`;
          audioFile = '/voice/recharge-ok.mp3';
        } else {
          message = `충전이 거절되었습니다. (${data.amount.toLocaleString('ko-KR')}원)`;
          audioFile = '/voice/recharge-deny.mp3';
        }
      } else if (data.type === 'EXCHANGE') {
        if (data.approved) {
          message = `환전이 승인되었습니다. (${data.amount.toLocaleString('ko-KR')}원)`;
          audioFile = '/voice/exchange-ok.mp3';
        } else {
          message = `환전이 거절되었습니다. (${data.amount.toLocaleString('ko-KR')}원)`;
          audioFile = '/voice/exchange-deny.mp3';
        }
      }

      // 음성 알림 재생
      if (audioFile) {
        try {
          const audio = new Audio(audioFile);
          audio.play().catch((err) => console.warn('음성 재생 실패:', err));
        } catch (err) {
          console.warn('음성 재생 오류:', err);
        }
      }

      // EventBus로 이벤트 전파
      PartnerDashboardEventDispatch('transaction_processed', {
        type: data.type,
        approved: data.approved,
        amount: data.amount,
      });

      console.log('📢', message);
    }
  );

  // 쪽지 수신 알림
  partnerSocket.on('message_received', (data?: { notice_key: string }) => {
    console.log('📨 [Partner] 쪽지 수신 알림:', data);
    const { incrementUnreadCount } = useUnreadInboxStore.getState();
    incrementUnreadCount();

    try {
      const audio = new Audio('/voice/message-client.mp3');
      audio.play().catch((err) => console.warn('음성 재생 실패:', err));
    } catch (err) {
      console.warn('음성 재생 오류:', err);
    }

    InboxMessageEventDispatch('message_received', data ?? undefined);
  });

  // 답변완료 알림 수신
  partnerSocket.on('answer_completed', (data?: { notice_key: string }) => {
    console.log('📬 [Partner] 답변완료 알림 수신:', data);
    const { incrementUnreadCount } = useUnreadSupportStore.getState();
    incrementUnreadCount();

    try {
      const audio = new Audio('/voice/answer-client2.mp3');
      audio.play().catch((err) => console.warn('음성 재생 실패:', err));
    } catch (err) {
      console.warn('음성 재생 오류:', err);
    }

    SupportAnswerEventDispatch('answer_completed', data ?? undefined);
  });
}

/**
 * 파트너 WebSocket 해제 (로그아웃 시 호출)
 */
export function disconnectPartnerSocket(): void {
  if (partnerSocket) {
    partnerSocket.disconnect();
    partnerSocket = null;
    console.log('🔌 파트너 WebSocket 수동 해제');
  }
}

/**
 * 현재 파트너 WebSocket 연결 상태 확인
 */
export function isPartnerSocketConnected(): boolean {
  return partnerSocket?.connected ?? false;
}
