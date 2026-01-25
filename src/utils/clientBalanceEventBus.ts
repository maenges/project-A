import { EventBus } from './EventBus';

type Events = {
  refreshBalance: { source?: 'popup-close' | 'manual' | 'unknown' } | void;
};

const bus = new EventBus<Events>();

export const ClientBalanceEventDispatch: EventBus<Events>['emit'] = (...args) => bus.emit(...args);

export const ClientBalanceAddEventListeners: EventBus<Events>['on'] = (...args) => bus.on(...args);
