import { create } from 'zustand';
import { NotifyAddEventListeners } from '@/utils/notifyEventBus';
import { ReactNode } from 'react';

export type Alram = {
  message: ReactNode;
  type: 'alert' | 'confirm';
  title?: string;

  id: string;
  close: (value?: any) => void;
  size?: 'SM' | 'MD' | 'LG';
};

interface NotifyState {
  stack: Alram[];
  contextId?: string;
  addAlram: (alram: Alram) => void;
  removeAlram: (id: string) => void;
}

export const useNotifyStore = create<NotifyState>((set) => ({
  stack: [],
  addAlram: (alram) => set((state) => ({ stack: [alram, ...state.stack] })),
  removeAlram: (id) => set((state) => ({ stack: state.stack.filter((alram) => alram.id !== id) })),
}));

NotifyAddEventListeners('notify', (action: any) => {
  const { addAlram, removeAlram } = useNotifyStore.getState();
  switch (action.type) {
    case 'addAlram':
      return addAlram(action.payload);
    case 'removeAlram':
      return removeAlram(action.payload);
  }
});

// useNotifyProviderId 함수 정의
export const useNotifyProviderId = (id?: string) => {
  const contextId = useNotifyStore((state) => state.contextId);
  return id || contextId || 'notify-root';
};
