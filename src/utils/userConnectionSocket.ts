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

  userSocket = io('/user-connection', {
    withCredentials: true,
    transports: ['websocket'],
  });

  //   userSocket.on('connect', () => {
  //     console.log('✅ 회원 접속 WebSocket 연결됨:', userSocket?.id);
  //   });

  //   userSocket.on('connect_error', (err) => {
  //     console.error('❌ 회원 접속 WebSocket 연결 실패:', err.message);
  //   });

  //   userSocket.on('disconnect', (reason) => {
  //     console.log('🔌 회원 접속 WebSocket 해제:', reason);
  //   });
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
