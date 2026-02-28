import { create } from 'zustand';

export interface PartnerDashboardState {
  /** 보유머니 */
  money: number;
  /** 보유롤링금 */
  rollingMoney: number;
  /** 슬롯 롤링(%) */
  slotRollingPercent: number;
  /** 카지노 롤링(%) */
  casinoRollingPercent: number;

  // Actions
  setMoney: (v: number) => void;
  setRollingMoney: (v: number) => void;
  setSlotRollingPercent: (v: number) => void;
  setCasinoRollingPercent: (v: number) => void;

  /** 전체 초기화 */
  resetAll: () => void;
}

export const usePartnerDashboardStore = create<PartnerDashboardState>((set) => ({
  money: 0,
  rollingMoney: 0,
  slotRollingPercent: 0,
  casinoRollingPercent: 0,

  setMoney: (money) => set({ money }),
  setRollingMoney: (rollingMoney) => set({ rollingMoney }),
  setSlotRollingPercent: (slotRollingPercent) => set({ slotRollingPercent }),
  setCasinoRollingPercent: (casinoRollingPercent) => set({ casinoRollingPercent }),

  resetAll: () =>
    set({
      money: 0,
      rollingMoney: 0,
      slotRollingPercent: 0,
      casinoRollingPercent: 0,
    }),
}));
