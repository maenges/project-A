import { create } from 'zustand';

interface GameFrameState {
  /** 현재 열린 게임 URL */
  gameUrl: string | null;
  /** 게임 iframe 열기 */
  openGame: (url: string) => void;
  /** 게임 iframe 닫기 */
  closeGame: () => void;
}

export const useGameFrameStore = create<GameFrameState>((set) => ({
  gameUrl: null,
  openGame: (url: string) => set({ gameUrl: url }),
  closeGame: () => set({ gameUrl: null }),
}));
