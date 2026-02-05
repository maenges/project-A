import { io, Socket } from 'socket.io-client';
import { useClientBalanceStore } from '@/store/clientBalance';
import { useUnreadSupportStore } from '@/store/unreadSupport';
import { SupportAnswerEventDispatch } from './supportAnswerEventBus';
import { useUnreadInboxStore } from '@/store/unreadInbox';
import { InboxMessageEventDispatch } from './inboxMessageEventBus';
import { TransactionEventDispatch } from './transactionEventBus';

let userSocket: Socket | null = null;

/**
 * 회원 접속 WebSocket 연결 (로그인 성공 후 호출)
 */
export function connectUserSocket(): void {
  // 이미 연결되어 있으면 무시
  if (userSocket?.connected) {
    console.log('⚠️ 회원 접속 WebSocket 이미 연결됨');
    return;
  }

  // 기존 소켓이 있으면 정리
  if (userSocket) {
    userSocket.removeAllListeners();
    userSocket.disconnect();
    userSocket = null;
  }

  userSocket = io('/user-connection', {
    withCredentials: true,
    transports: ['websocket', 'polling'], // WebSocket 우선, polling fallback
    upgrade: true,
    // 재연결 설정 (백엔드 3초 Grace Period에 맞춤)
    reconnection: true,
    reconnectionAttempts: 5, // 5회 재시도
    reconnectionDelay: 1000, // 1초 후 재연결 시도
    reconnectionDelayMax: 3000, // 최대 3초까지 증가
    timeout: 20000, // 연결 타임아웃
    forceNew: false, // 기존 연결 재사용 허용
  });

  userSocket.on('connect', () => {
    console.log('✅ 회원 접속 WebSocket 연결됨:', userSocket?.id);
  });

  userSocket.on('connect_error', (err) => {
    console.error('❌ 회원 접속 WebSocket 연결 실패:', err.message);
  });

  // 재연결 시도 중
  userSocket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`🔄 회원 접속 WebSocket 재연결 시도 중... (${attemptNumber}번째)`);
  });

  // 재연결 성공
  userSocket.on('reconnect', (attemptNumber) => {
    console.log(`✅ 회원 접속 WebSocket 재연결 성공 (${attemptNumber}번째 시도)`);
  });

  // 재연결 실패
  userSocket.on('reconnect_failed', () => {
    console.error('❌ 회원 접속 WebSocket 재연결 실패 (모든 시도 소진)');
  });

  userSocket.on('disconnect', (reason) => {
    console.log('🔌 회원 접속 WebSocket 해제:', reason);
    // 서버에서 끊은 경우 수동 재연결 시도
    if (reason === 'io server disconnect' && userSocket) {
      userSocket.connect();
    }
  });

  // 잔액 업데이트 이벤트 수신
  userSocket.on('balance_update', (data: { money: number }) => {
    console.log('💰 잔액 업데이트 수신:', data);
    const { setBalance, balance } = useClientBalanceStore.getState();
    if (balance) {
      setBalance({
        ...balance,
        money: data.money,
      });
    }
  });

  // 답변완료 알림 수신
  userSocket.on('answer_completed', () => {
    console.log('📬 답변완료 알림 수신');
    const { incrementUnreadCount } = useUnreadSupportStore.getState();
    incrementUnreadCount();

    // 음성 알림 재생
    try {
      const audio = new Audio('/voice/answer-client2.mp3');
      audio.play().catch((err) => console.warn('음성 재생 실패:', err));
    } catch (err) {
      console.warn('음성 재생 오류:', err);
    }

    // EventBus로 이벤트 전파 (ClientSupportPage 등에서 구독 가능)
    SupportAnswerEventDispatch('answer_completed', undefined);
  });

  // 쪽지 수신 알림
  userSocket.on('message_received', () => {
    console.log('📨 쪽지 수신 알림');
    const { incrementUnreadCount } = useUnreadInboxStore.getState();
    incrementUnreadCount();

    // 음성 알림 재생
    try {
      const audio = new Audio('/voice/message-client.mp3');
      audio.play().catch((err) => console.warn('음성 재생 실패:', err));
    } catch (err) {
      console.warn('음성 재생 오류:', err);
    }

    // EventBus로 이벤트 전파 (ClientInboxPage 등에서 구독 가능)
    InboxMessageEventDispatch('message_received', undefined);
  });

  // 충전/환전 처리 완료 알림
  userSocket.on(
    'transaction_processed',
    (data: { type: 'RECHARGE' | 'EXCHANGE'; approved: boolean; amount: number }) => {
      console.log('💳 거래 처리 알림 수신:', data);

      let message = '';
      let audioFile = '';

      if (data.type === 'RECHARGE') {
        // 충전
        if (data.approved) {
          message = `충전이 승인되었습니다. (${data.amount.toLocaleString('ko-KR')}원)`;
          audioFile = '/voice/recharge-ok.mp3';
        } else {
          message = `충전이 거절되었습니다. (${data.amount.toLocaleString('ko-KR')}원)`;
          audioFile = '/voice/recharge-deny.mp3';
        }
      } else if (data.type === 'EXCHANGE') {
        // 환전
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

      // EventBus로 이벤트 전파 (ClientDepositPage, ClientWithdrawPage에서 구독)
      TransactionEventDispatch('transaction_processed', {
        type: data.type,
        approved: data.approved,
        amount: data.amount,
      });

      console.log('📢', message);
    }
  );
}

/**
 * 회원 접속 WebSocket 해제 (로그아웃 시 호출)
 */
export function disconnectUserSocket(): void {
  if (userSocket) {
    userSocket.disconnect();
    userSocket = null;
    console.log('🔌 회원 접속 WebSocket 수동 해제');
  }
}

/**
 * 현재 WebSocket 연결 상태 확인
 */
export function isUserSocketConnected(): boolean {
  return userSocket?.connected ?? false;
}
