export type MenuKey = 'casino' | 'slot' | 'deposit' | 'withdraw' | 'notice' | 'support' | 'inbox';

export type MenuInfo = {
  title: string;
  subtitle: string;
  heading: string;
};

export type NoticeItem = {
  title: string;
  author: string;
  date: string;
  isNew?: boolean;
};

export type DepositHistoryItem = {
  depositor: string;
  amount: number;
  requestedAt: string;
  processedAt?: string;
  result: string;
};

export type WithdrawHistoryItem = {
  bankName: string;
  accountHolder: string;
  amount: number;
  requestedAt: string;
  processedAt?: string;
  result: string;
};

export const menuConfig: Record<MenuKey, MenuInfo> = {
  casino: { title: '카지노', subtitle: 'LIVE CASINO', heading: 'LIVE CASINO' },
  slot: { title: '슬롯게임', subtitle: 'SLOT GAME', heading: 'SLOT GAME' },
  deposit: { title: '충전신청', subtitle: 'DEPOSIT', heading: 'DEPOSIT' },
  withdraw: { title: '환전신청', subtitle: 'WITHDRAW', heading: 'WITHDRAW' },
  notice: { title: '공지사항', subtitle: 'NOTICE', heading: 'NOTICE' },
  support: { title: '문의', subtitle: 'SUPPORT', heading: 'SUPPORT' },
  inbox: { title: '쪽지함', subtitle: 'INBOX', heading: 'INBOX' },
};

export const isMenuKey = (v: string | undefined): v is MenuKey => {
  return (
    v === 'casino' ||
    v === 'slot' ||
    v === 'deposit' ||
    v === 'withdraw' ||
    v === 'notice' ||
    v === 'support' ||
    v === 'inbox'
  );
};
