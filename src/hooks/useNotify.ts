import { v4 } from 'uuid';
import { useCallback, useMemo } from 'react';
import { NotifyEventDispatch } from '@/utils/notifyEventBus';
import { Alram, useNotifyProviderId } from '@/store/notifyStore';
import { ToastContent, ToastOptions, TypeOptions, toast } from 'react-toastify';

type NotifyOption = string | Omit<Alram, 'id' | 'close' | 'type'>;

export const useNotify = (id?: string) => {
  const providerId = useNotifyProviderId(id);
  const _createAlram = useCallback(
    <T extends Alram['type']>(type: T) => createAlram<T>(providerId, type),
    [providerId]
  );

  type CustomToastType = TypeOptions | 'confirm'; // confirm 타입 추가

  type Toast = Pick<typeof toast, 'warning' | 'info' | 'error' | 'success'> & {
    confirm: (content: ToastContent, options?: ToastOptions) => ReturnType<typeof toast>;
  } & ((content: ToastContent, options?: ToastOptions) => ReturnType<typeof toast>);

  const _toast = useMemo<Toast>(() => {
    const createToast =
      (type: CustomToastType) => (content: ToastContent, options?: ToastOptions) => {
        toast.dismiss({ containerId: providerId });
        toast.clearWaitingQueue({ containerId: providerId });
        return toast(content, {
          ...options,
          containerId: providerId,
          toastId: v4(),
          position: 'bottom-center',
          className: 'ets-notify-toast',
          type: type === 'confirm' ? 'success' : type, // confirm을 success로 매핑
        });
      };

    return {
      info: createToast('info'),
      success: createToast('success'),
      warning: createToast('warning'),
      error: createToast('error'),
      confirm: createToast('confirm'), // confirm 추가
    } as Toast;
  }, [providerId]);

  return {
    alert: _createAlram('alert'),
    confirm: _createAlram('confirm'),
    toast: _toast,
  };
};

function createAlram<T extends Alram['type']>(providerId: string, type: T) {
  return (option: NotifyOption) =>
    new Promise<boolean>((resolve) => {
      const id = v4();
      const notify: Alram = {
        id,
        title: '',
        ...(typeof option == 'string' ? { message: option } : option),
        close: (value: any) => {
          NotifyEventDispatch('notify', {
            payload: id,
            providerId,
            type: 'removeAlram',
          });
          resolve(value);
        },
        type,
      };
      NotifyEventDispatch('notify', {
        payload: notify,
        providerId,
        type: 'addAlram',
      });
    });
}

// Backward compatibility
export const useModalState = () => {
  const { stack } = require('@/store/notifyStore').useNotifyStore();
  const modal = stack[0] || null;

  const closeModal = (result: boolean) => {
    if (modal) {
      modal.close(result);
    }
  };

  return {
    modal,
    closeModal,
  };
};
