import { create } from 'zustand';

export type ClientBalance = {
  userId: string;
  money: number;
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
