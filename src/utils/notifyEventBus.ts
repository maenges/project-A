import { Alram } from '@/store/notifyStore';
import { EventBus } from './EventBus';

type NotifyEvent<T extends string, P = void> = {
  providerId: string;
} & {
  type: T;
} & (P extends void ? { payload?: any } : { payload: P });

type Events = {
  loading: NotifyEvent<'add', { id: string }> | NotifyEvent<'remove', { id: string }>;
  notify: NotifyEvent<'addAlram', Alram> | NotifyEvent<'removeAlram', string>;
};

const bus = new EventBus<Events>();

export const NotifyEventDispatch: EventBus<Events>['emit'] = (...args) => bus.emit(...args);

export const NotifyAddEventListeners: EventBus<Events>['on'] = (...args) => bus.on(...args);
