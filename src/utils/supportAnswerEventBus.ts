import { EventBus } from './EventBus';

type SupportAnswerEvents = {
  answer_completed: { notice_key: string } | void;
};

export const supportAnswerEventBus = new EventBus<SupportAnswerEvents>();

export const SupportAnswerEventDispatch = (
  eventName: keyof SupportAnswerEvents,
  payload: SupportAnswerEvents[typeof eventName]
) => {
  supportAnswerEventBus.emit(eventName, payload);
};

export const SupportAnswerAddEventListeners = (
  callback: (eventName: keyof SupportAnswerEvents, payload: any) => void
) => {
  const unsubFns: Array<() => void> = [];

  unsubFns.push(
    supportAnswerEventBus.on('answer_completed', (payload) => callback('answer_completed', payload))
  );

  return () => {
    unsubFns.forEach((fn) => fn());
  };
};
