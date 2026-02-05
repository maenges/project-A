import { EventBus } from './EventBus';

type InboxMessageEvents = {
  message_received: void;
};

export const inboxMessageEventBus = new EventBus<InboxMessageEvents>();

export const InboxMessageEventDispatch = (
  eventName: keyof InboxMessageEvents,
  payload: InboxMessageEvents[typeof eventName]
) => {
  inboxMessageEventBus.emit(eventName, payload);
};

export const InboxMessageAddEventListeners = (
  callback: (eventName: keyof InboxMessageEvents, payload: any) => void
) => {
  const unsubFns: Array<() => void> = [];

  unsubFns.push(
    inboxMessageEventBus.on('message_received', (payload) => callback('message_received', payload))
  );

  return () => {
    unsubFns.forEach((fn) => fn());
  };
};
