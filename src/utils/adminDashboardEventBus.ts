import { EventBus } from './EventBus';

type AdminDashboardEvents = {
  balance_update: { balance: number };
  new_signup: void;
  new_deposit: void;
  new_withdraw: void;
  new_support: void;
  online_count_update: { count: number };
};

export const adminDashboardEventBus = new EventBus<AdminDashboardEvents>();

export const AdminDashboardEventDispatch = <K extends keyof AdminDashboardEvents>(
  eventName: K,
  payload: AdminDashboardEvents[K]
) => {
  adminDashboardEventBus.emit(eventName, payload);
};

export const AdminDashboardAddEventListeners = (
  callback: <K extends keyof AdminDashboardEvents>(
    eventName: K,
    payload: AdminDashboardEvents[K]
  ) => void
) => {
  const unsubFns: Array<() => void> = [];

  unsubFns.push(
    adminDashboardEventBus.on('balance_update', (payload) => callback('balance_update', payload))
  );
  unsubFns.push(
    adminDashboardEventBus.on('new_signup', (payload) => callback('new_signup', payload))
  );
  unsubFns.push(
    adminDashboardEventBus.on('new_deposit', (payload) => callback('new_deposit', payload))
  );
  unsubFns.push(
    adminDashboardEventBus.on('new_withdraw', (payload) => callback('new_withdraw', payload))
  );
  unsubFns.push(
    adminDashboardEventBus.on('new_support', (payload) => callback('new_support', payload))
  );
  unsubFns.push(
    adminDashboardEventBus.on('online_count_update', (payload) =>
      callback('online_count_update', payload)
    )
  );

  return () => {
    unsubFns.forEach((fn) => fn());
  };
};
