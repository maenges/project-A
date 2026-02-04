import { create } from 'zustand';

interface UnreadSupportState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  decrementUnreadCount: () => void;
  incrementUnreadCount: () => void;
}

export const useUnreadSupportStore = create<UnreadSupportState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count: number) => set({ unreadCount: count }),
  decrementUnreadCount: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));
