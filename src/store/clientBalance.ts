import { create } from 'zustand';

export type ClientBalance = {
  userId: string;
  money: number;
  support_alarm?: boolean;
  inbox_alarm?: boolean;
};

type ClientBalanceState = {
  balance: ClientBalance | null;
  setBalance: (next: ClientBalance | null) => void;
  clearBalance: () => void;
};

// 메모리 스토어: sessionStorage/localStorage를 쓰지 않습니다.
export const useClientBalanceStore = create<ClientBalanceState>((set) => ({
  balance: null,
  setBalance: (next) => set({ balance: next }),
  clearBalance: () => set({ balance: null }),
}));

// 공지사항 읽음 처리 (localStorage 기반, 1시간 만료)
const NOTICE_READ_PREFIX = 'notice_read_';
const NOTICE_EXPIRE_MS = 60 * 60 * 1000; // 1시간

export const isNoticeRead = (noticeKey: string): boolean => {
  const stored = localStorage.getItem(`${NOTICE_READ_PREFIX}${noticeKey}`);
  if (!stored) return false;

  const timestamp = parseInt(stored, 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  // 1시간이 지났으면 만료
  if (now - timestamp > NOTICE_EXPIRE_MS) {
    localStorage.removeItem(`${NOTICE_READ_PREFIX}${noticeKey}`);
    return false;
  }

  return true;
};

export const markNoticeRead = (noticeKey: string): void => {
  localStorage.setItem(`${NOTICE_READ_PREFIX}${noticeKey}`, String(Date.now()));
};

export const clearExpiredNoticeReads = (): void => {
  const now = Date.now();
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(NOTICE_READ_PREFIX)) {
      const stored = localStorage.getItem(key);
      if (stored) {
        const timestamp = parseInt(stored, 10);
        if (isNaN(timestamp) || now - timestamp > NOTICE_EXPIRE_MS) {
          keysToRemove.push(key);
        }
      }
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
};
