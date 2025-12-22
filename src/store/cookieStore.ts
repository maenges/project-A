import { create } from 'zustand';

type UserState = {
  userId: string | null;
  role: 'HQ' | 'ST' | null;
  groupKey: string | null;
  setUser: (u: { userId: string; role: any; groupKey: string }) => void;
  clear: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  role: null,
  groupKey: null,
  setUser: (u) => set({ ...u }),
  clear: () => set({ userId: null, role: null, groupKey: null }),
}));
