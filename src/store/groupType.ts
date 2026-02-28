import { create } from 'zustand';

export interface GroupTypeState {
  /** 사용자 그룹 타입 (예: 'HQ', 'ST', ...) */
  groupType: string;
  setGroupType: (v: string) => void;
}

export const useGroupTypeStore = create<GroupTypeState>((set) => ({
  groupType: '',
  setGroupType: (v) => set({ groupType: v }),
}));
