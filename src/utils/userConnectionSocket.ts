import { io, Socket } from 'socket.io-client';

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
