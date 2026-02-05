import { EventBus } from './EventBus';

type TransactionEvents = {
  transaction_processed: {
    type: 'RECHARGE' | 'EXCHANGE';
    approved: boolean;
    amount: number;
  };
};

export const transactionEventBus = new EventBus<TransactionEvents>();

export const TransactionEventDispatch = <K extends keyof TransactionEvents>(
  eventName: K,
  payload: TransactionEvents[K]
) => {
  transactionEventBus.emit(eventName, payload);
};

export const TransactionAddEventListeners = (
  callback: <K extends keyof TransactionEvents>(eventName: K, payload: TransactionEvents[K]) => void
) => {
  const unsubFns: Array<() => void> = [];

  unsubFns.push(
    transactionEventBus.on('transaction_processed', (payload) =>
      callback('transaction_processed', payload)
    )
  );

  return () => {
    unsubFns.forEach((fn) => fn());
  };
};
