import { create } from 'zustand';

interface GameFrameState {
  /** 현재 열린 게임 URL */
  gameUrl: string | null;
  /** 게임 iframe 열기 */
  openGame: (url: string) => void;
  /** 게임 iframe 닫기 */
  closeGame: () => void;
}

export const useGameFrameStore = create<GameFrameState>((set, get) => ({
  gameUrl: null,
  openGame: (url: string) => {
    // URL이 유효한 경우에만 게임 열기
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      console.warn('Invalid game URL:', url);
      return;
    }
    // 게임 열 때 히스토리 엔트리 추가 (뒤로가기 시 게임 닫기 위함)
    window.history.pushState({ gameOpen: true }, '', window.location.href);
    set({ gameUrl: url });
  },
  closeGame: () => {
    const { gameUrl } = get();
    if (gameUrl) {
      set({ gameUrl: null });
    }
  },
}));
