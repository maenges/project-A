import { create } from 'zustand';

export interface AdminDashboardState {
  // 보유금
  balance: number;
  // 승인대기 (가입신청)
  pendingApprovalCount: number;
  // 충전 대기
  depositCount: number;
  // 환전 대기
  withdrawCount: number;
  // 문의 대기
  supportCount: number;
  // 접속자수
  onlineCount: number;

  // Actions
  setBalance: (balance: number) => void;
  setPendingApprovalCount: (count: number) => void;
  setDepositCount: (count: number) => void;
  setWithdrawCount: (count: number) => void;
  setSupportCount: (count: number) => void;
  setOnlineCount: (count: number) => void;

  // Increment actions (WebSocket 이벤트용)
  incrementPendingApprovalCount: () => void;
  incrementDepositCount: () => void;
  incrementWithdrawCount: () => void;
  incrementSupportCount: () => void;

  // Decrement actions (처리 완료 시)
  decrementPendingApprovalCount: () => void;
  decrementDepositCount: () => void;
  decrementWithdrawCount: () => void;
  decrementSupportCount: () => void;

  // 전체 초기화
  resetAll: () => void;
}

export const useAdminDashboardStore = create<AdminDashboardState>((set) => ({
  balance: 0,
  pendingApprovalCount: 0,
  depositCount: 0,
  withdrawCount: 0,
  supportCount: 0,
  onlineCount: 0,

  setBalance: (balance) => set({ balance }),
  setPendingApprovalCount: (count) => set({ pendingApprovalCount: count }),
  setDepositCount: (count) => set({ depositCount: count }),
  setWithdrawCount: (count) => set({ withdrawCount: count }),
  setSupportCount: (count) => set({ supportCount: count }),
  setOnlineCount: (count) => set({ onlineCount: count }),

  incrementPendingApprovalCount: () =>
    set((state) => ({ pendingApprovalCount: state.pendingApprovalCount + 1 })),
  incrementDepositCount: () => set((state) => ({ depositCount: state.depositCount + 1 })),
  incrementWithdrawCount: () => set((state) => ({ withdrawCount: state.withdrawCount + 1 })),
  incrementSupportCount: () => set((state) => ({ supportCount: state.supportCount + 1 })),

  decrementPendingApprovalCount: () =>
    set((state) => ({ pendingApprovalCount: Math.max(0, state.pendingApprovalCount - 1) })),
  decrementDepositCount: () =>
    set((state) => ({ depositCount: Math.max(0, state.depositCount - 1) })),
  decrementWithdrawCount: () =>
    set((state) => ({ withdrawCount: Math.max(0, state.withdrawCount - 1) })),
  decrementSupportCount: () =>
    set((state) => ({ supportCount: Math.max(0, state.supportCount - 1) })),

  resetAll: () =>
    set({
      balance: 0,
      pendingApprovalCount: 0,
      depositCount: 0,
      withdrawCount: 0,
      supportCount: 0,
      onlineCount: 0,
    }),
}));
