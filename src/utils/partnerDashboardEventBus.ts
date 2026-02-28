import { EventBus } from './EventBus';

type PartnerDashboardEvents = {
  balance_update: { money: number };
  transaction_processed: { type: 'RECHARGE' | 'EXCHANGE'; approved: boolean; amount: number };
};

export const partnerDashboardEventBus = new EventBus<PartnerDashboardEvents>();

export const PartnerDashboardEventDispatch = <K extends keyof PartnerDashboardEvents>(
  eventName: K,
  payload: PartnerDashboardEvents[K]
) => {
  partnerDashboardEventBus.emit(eventName, payload);
};

export const PartnerDashboardAddEventListeners = (
  callback: <K extends keyof PartnerDashboardEvents>(
    eventName: K,
    payload: PartnerDashboardEvents[K]
  ) => void
) => {
  const unsubFns: Array<() => void> = [];

  unsubFns.push(
    partnerDashboardEventBus.on('balance_update', (payload) => callback('balance_update', payload))
  );
  unsubFns.push(
    partnerDashboardEventBus.on('transaction_processed', (payload) =>
      callback('transaction_processed', payload)
    )
  );

  return () => {
    unsubFns.forEach((fn) => fn());
  };
};
