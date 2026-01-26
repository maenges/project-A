import { EventBus } from './EventBus';

export type ClientAuthRequiredPayload = {
  reason?: 'unauthorized' | 'session-expired' | 'refresh-failed' | 'unknown';
  status?: string;
  url?: string;
};

export type ClientLogoutPayload = {
  source?: 'client' | 'unknown';
};

type Events = {
  authRequired: ClientAuthRequiredPayload;
  logout: ClientLogoutPayload;
};

const bus = new EventBus<Events>();

export const ClientAuthEventDispatch: EventBus<Events>['emit'] = (...args) => bus.emit(...args);

export const ClientAuthAddEventListeners: EventBus<Events>['on'] = (...args) => bus.on(...args);
