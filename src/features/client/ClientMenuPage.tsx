import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ClientSiteHeader } from './components';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './components/clientStyleTokens';
import banner1 from '@/assets/images/banner/banner_1.png';
import banner2 from '@/assets/images/banner/banner_2.png';
import banner3 from '@/assets/images/banner/banner_3.png';
import banner4 from '@/assets/images/banner/banner_4.png';
import banner5 from '@/assets/images/banner/banner_5.png';
import banner6 from '@/assets/images/banner/banner_6.png';

type MenuKey =
  | 'casino'
  | 'slot'
  | 'mini'
  | 'deposit'
  | 'withdraw'
  | 'bet'
  | 'mypage'
  | 'event'
  | 'notice'
  | 'support'
  | 'inbox';

type NoticeItem = {
  title: string;
  author: string;
  date: string;
  isNew?: boolean;
};

type DepositHistoryItem = {
  depositor: string;
  amount: number;
  requestedAt: string;
  processedAt?: string;
  result: string;
};

type WithdrawHistoryItem = {
  withdrawer: string;
  amount: number;
  requestedAt: string;
  processedAt?: string;
  result: string;
};

const menuConfig: Record<MenuKey, { title: string; subtitle: string; heading: string }> = {
  casino: { title: '카지노', subtitle: 'LIVE CASINO', heading: 'LIVE CASINO' },
  slot: { title: '슬롯게임', subtitle: 'SLOT GAME', heading: 'SLOT GAME' },
  mini: { title: '미니게임', subtitle: 'MINI GAME', heading: 'MINI GAME' },
  deposit: { title: '충전신청', subtitle: 'DEPOSIT', heading: 'DEPOSIT' },
  withdraw: { title: '환전신청', subtitle: 'WITHDRAW', heading: 'WITHDRAW' },
  bet: { title: '베팅내역', subtitle: 'BET HISTORY', heading: 'BET HISTORY' },
  mypage: { title: '마이페이지', subtitle: 'MY PAGE', heading: 'MY PAGE' },
  event: { title: '이벤트', subtitle: 'EVENT', heading: 'EVENT' },
  notice: { title: '공지사항', subtitle: 'NOTICE', heading: 'NOTICE' },
  support: { title: '문의', subtitle: 'SUPPORT', heading: 'SUPPORT' },
  inbox: { title: '쪽지함', subtitle: 'INBOX', heading: 'INBOX' },
};

const Wrap = styled.section`
  max-width: ${CLIENT_MAX_WIDTH};
  margin: 14px auto 40px;
  padding: 0 ${CLIENT_SIDE_PADDING};
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const NoticePanel = styled.section`
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 25% 0%, rgba(255, 205, 120, 0.14), transparent 46%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.12));
    pointer-events: none;
  }
`;

const NoticeInner = styled.div`
  position: relative;
  z-index: 1;
  padding: 22px 22px 18px;
`;

const NoticeTitle = styled.h2`
  margin: 0 0 14px;
  font-weight: 1000;
  letter-spacing: -0.6px;
  font-size: 28px;
  color: rgba(255, 255, 255, 0.92);
`;

const NoticeTable = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
`;

const NoticeHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 160px 170px;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.78);
  font-weight: 1000;
  letter-spacing: -0.2px;
  font-size: 13px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr 88px;
    .author {
      display: none;
    }
  }
`;

const NoticeRow = styled.button<{ $active?: boolean }>`
  width: 100%;
  border: none;
  background: ${({ $active }) => ($active ? 'rgba(255, 205, 120, 0.10)' : 'transparent')};
  color: inherit;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 160px 170px;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr 88px;
    .author {
      display: none;
    }
  }
`;

const NoticeCellTitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 1000;
  letter-spacing: -0.2px;
  font-size: 13px;
  min-width: 0;

  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .new {
    font-size: 11px;
    font-weight: 1000;
    color: rgba(255, 205, 120, 0.95);
    letter-spacing: 0.2px;
  }
`;

const NoticeCell = styled.div`
  color: rgba(255, 255, 255, 0.72);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.1px;
  text-align: right;
`;

const DepositPanel = styled.section`
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
`;

const DepositInner = styled.div`
  padding: 16px;
`;

const FormTable = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 12px;
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  &:first-child {
    border-top: none;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 12px;
  }
`;

const FormLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 1000;
  letter-spacing: -0.2px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const ValueText = styled.div`
  color: rgba(255, 255, 255, 0.92);
  font-weight: 1100;
  letter-spacing: -0.2px;
`;

const Field = styled.input`
  width: 100%;
  max-width: 520px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.92);
  padding: 0 12px;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: -0.2px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
    font-weight: 800;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 205, 120, 0.55);
    box-shadow: 0 0 0 3px rgba(255, 205, 120, 0.14);
  }
`;

const FieldShort = styled(Field)`
  max-width: 280px;

  @media (max-width: 720px) {
    max-width: 100%;
  }
`;

const FieldAmount = styled(Field)`
  max-width: 360px;

  @media (max-width: 720px) {
    max-width: 100%;
  }
`;

const Inline = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const MiniBtn = styled.button<{ $tone?: 'gold' | 'gray' }>`
  height: 32px;
  padding: 0 10px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 1000;
  letter-spacing: -0.2px;
  cursor: pointer;
  border: 1px solid
    ${({ $tone }) => ($tone === 'gold' ? 'rgba(255, 205, 120, 0.75)' : 'rgba(255, 255, 255, 0.14)')};
  background: ${({ $tone }) =>
    $tone === 'gold' ? 'rgba(255, 205, 120, 0.92)' : 'rgba(255, 255, 255, 0.10)'};
  color: ${({ $tone }) => ($tone === 'gold' ? '#141414' : 'rgba(255, 255, 255, 0.88)')};

  &:hover {
    filter: brightness(1.03);
    background: ${({ $tone }) =>
      $tone === 'gold' ? 'rgba(255, 205, 120, 0.98)' : 'rgba(255, 255, 255, 0.13)'};
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 2px;
  }
`;

const AmountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Hint = styled.div`
  color: rgba(255, 255, 255, 0.65);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: -0.1px;
  line-height: 1.35;
`;

const SubmitWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 18px 0 4px;
`;

const SubmitBtn = styled.button`
  width: min(520px, 100%);
  height: 52px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.86);
  color: rgba(0, 0, 0, 0.78);
  font-weight: 1100;
  letter-spacing: -0.2px;
  cursor: pointer;

  &:hover {
    filter: brightness(1.02);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 3px;
  }
`;

const HistoryTitle = styled.h2`
  margin: 18px 0 12px;
  font-weight: 1100;
  letter-spacing: -0.8px;
  font-size: 26px;
  color: rgba(255, 255, 255, 0.92);

  @media (max-width: 720px) {
    margin: 14px 0 10px;
    font-size: 20px;
    letter-spacing: -0.5px;
  }
`;

const HistoryTable = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
  max-width: 100%;
  overflow-x: hidden;
`;

const HistoryScroll = styled.div`
  &[data-scroll='true'] {
    max-height: calc(44px + 66px * 5);
    overflow-y: auto;
    overscroll-behavior: contain;

    /* 헤더/바디 컬럼 정렬을 위해 스크롤바 공간을 안정적으로 예약 */
    scrollbar-gutter: stable;

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.22) rgba(255, 255, 255, 0.06);

    /* WebKit */
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.06);
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 999px;
      border: 2px solid rgba(255, 255, 255, 0.06);
    }
  }

  @media (max-width: 720px) {
    &[data-scroll='true'] {
      max-height: 360px;
    }
  }
`;

const HistoryBody = styled.div``;

const HistoryHead = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr 1.2fr 1.2fr 1fr 120px;
  gap: 12px;
  padding: 12px 16px;
  background: rgb(18, 18, 18);
  color: rgba(255, 255, 255, 0.78);
  font-weight: 1000;
  letter-spacing: -0.2px;
  font-size: 13px;
  height: 44px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  & > * {
    min-width: 0;
  }

  .requested,
  .processed {
    text-align: center;
  }

  @media (max-width: 980px) {
    grid-template-columns: 1.1fr 1fr 1.2fr 1fr 110px;
    .processed {
      display: none;
    }
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1.1fr 1fr 76px;
    gap: 8px;
    padding: 10px 12px;
    font-size: 11px;
    height: 38px;
    .requested,
    .processed {
      display: none;
    }
  }
`;

const HistoryRow = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr 1.2fr 1.2fr 1fr 120px;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  align-items: center;
  height: 66px;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.86);
  font-weight: 900;
  letter-spacing: -0.2px;

  & > * {
    min-width: 0;
  }

  .requested,
  .processed {
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 980px) {
    grid-template-columns: 1.1fr 1fr 1.2fr 1fr 110px;
    .processed {
      display: none;
    }
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1.1fr 1fr 76px;
    gap: 8px;
    padding: 10px 12px;
    height: auto;
    min-height: 56px;
    font-size: 12px;
    line-height: 1.2;
    .requested,
    .processed {
      display: none;
    }

    button {
      height: 28px;
      padding: 0 8px;
      border-radius: 8px;
      font-size: 12px;
    }
  }

  .amount {
    text-align: center;
    font-size: 18px;
    font-weight: 1100;

    @media (max-width: 720px) {
      font-size: 14px;
      line-height: 1.15;
    }
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 205, 120, 0.18);
  border: 1px solid rgba(255, 205, 120, 0.22);
  color: rgba(255, 235, 205, 0.96);
  font-weight: 1100;
  letter-spacing: -0.2px;
  font-size: 12px;
  justify-self: center;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 720px) {
    height: 24px;
    padding: 0 8px;
    font-size: 11px;
  }
`;

const Left = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  min-height: 420px;
  position: relative;

  @media (max-width: 980px) {
    min-height: 260px;
  }

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(255, 205, 120, 0.25), rgba(255, 255, 255, 0.02)),
      linear-gradient(135deg, rgba(15, 15, 15, 0.18), rgba(0, 0, 0, 0.45));
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.9) contrast(1.05);
    opacity: 0.72;
    transform: scale(1.03);
  }

  .caption {
    position: absolute;
    left: 18px;
    bottom: 16px;
    color: rgba(255, 255, 255, 0.92);
    font-weight: 1000;
    letter-spacing: -0.4px;
    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.65);

    small {
      display: block;
      margin-top: 4px;
      color: rgba(255, 255, 255, 0.68);
      font-weight: 900;
      letter-spacing: 0.2px;
    }
  }
`;

const Right = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  padding: 18px;
`;

const Heading = styled.div`
  font-weight: 1000;
  letter-spacing: -0.6px;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Tile = styled.button<{ $bg?: string }>`
  height: 118px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: ${({ $bg }) =>
    $bg
      ? `linear-gradient(135deg, rgba(0,0,0,0.32), rgba(0,0,0,0.10)), url(${$bg}) center / cover no-repeat`
      : 'rgba(0, 0, 0, 0.35)'};
  color: rgba(255, 255, 255, 0.92);
  font-weight: 1000;
  letter-spacing: -0.2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 14px;
  text-align: left;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 30%, rgba(255, 205, 120, 0.18), rgba(255, 255, 255, 0.02)),
      linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.4));
    pointer-events: none;
  }

  .label {
    position: relative;
    z-index: 1;
    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.65);
  }

  span {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.62);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.46);
    border-color: rgba(255, 205, 120, 0.35);
  }
`;

const casinoBanners = [banner1, banner2, banner3, banner4, banner5, banner6];

const FALLBACK_ITEMS = [
  { name: 'PRAGMATIC PLAY', sub: '프라그마틱 게임' },
  { name: 'Evolution Gaming', sub: '에볼루션' },
  { name: 'Sexy Gaming', sub: '섹시게이밍' },
  { name: 'ALLBET', sub: '올벳' },
  { name: 'SKYWIND', sub: '스카이 윈드' },
  { name: 'Microgaming', sub: '마이크로소프트 게임' },
];

const isMenuKey = (v: string | undefined): v is MenuKey => {
  return (
    v === 'casino' ||
    v === 'slot' ||
    v === 'mini' ||
    v === 'deposit' ||
    v === 'withdraw' ||
    v === 'bet' ||
    v === 'mypage' ||
    v === 'event' ||
    v === 'notice' ||
    v === 'support' ||
    v === 'inbox'
  );
};

const ClientMenuPage = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const menu = isMenuKey(key) ? menuConfig[key] : null;

  useEffect(() => {
    if (menu) return;
    navigate('/client', { replace: true });
  }, [menu, navigate]);

  if (!menu) return null;

  const menuKey = key as MenuKey;
  const leftImageSrc =
    menuKey === 'casino' ? casinoBanners[0] : '/ckeditor/samples/img/header-bg.png';
  const useTileBanners = menuKey === 'casino';

  const selectedTitle = (location.state as { title?: string } | null)?.title;

  const noticeItems: NoticeItem[] = useMemo(
    () => [
      {
        title: '롤링비 미지급 게임 안내',
        author: '관리자',
        date: '2025-06-29 19:29:40',
        isNew: true,
      },
      {
        title: '비정상적인 이용에 대한 제재 안내',
        author: '관리자',
        date: '2024-11-29 12:00:53',
        isNew: true,
      },
      { title: '충전 및 환전 규정', author: '관리자', date: '2023-04-27 12:10:34', isNew: true },
      { title: '라이브 카지노 및 슬롯 규정', author: '관리자', date: '2023-04-27 12:08:54' },
    ],
    []
  );

  const [depositHistory, setDepositHistory] = useState<DepositHistoryItem[]>([
    {
      depositor: 'mmpuu02',
      amount: 5_000_000,
      requestedAt: '2025-11-15 12:26:57',
      processedAt: '2025-11-15 12:26:57',
      result: '상부지급',
    },
    {
      depositor: 'mmpuu02',
      amount: 1_000_000,
      requestedAt: '2026-01-22 10:03:12',
      processedAt: '2026-01-22 10:05:40',
      result: '처리완료',
    },
    {
      depositor: 'mmpuu02',
      amount: 500_000,
      requestedAt: '2026-01-21 22:18:09',
      processedAt: '2026-01-21 22:22:11',
      result: '처리완료',
    },
    {
      depositor: 'mmpuu02',
      amount: 100_000,
      requestedAt: '2026-01-20 14:44:01',
      processedAt: '2026-01-20 14:48:27',
      result: '처리완료',
    },
    {
      depositor: 'mmpuu02',
      amount: 50_000,
      requestedAt: '2026-01-19 09:11:33',
      processedAt: '2026-01-19 09:15:02',
      result: '처리완료',
    },
    {
      depositor: 'mmpuu02',
      amount: 10_000,
      requestedAt: '2026-01-18 02:05:17',
      processedAt: '2026-01-18 02:10:55',
      result: '처리완료',
    },
    {
      depositor: 'mmpuu02',
      amount: 300_000,
      requestedAt: '2026-01-17 19:36:58',
      processedAt: undefined,
      result: '처리중',
    },
  ]);

  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawHistoryItem[]>([
    {
      withdrawer: 'mmpuu02',
      amount: 870_000,
      requestedAt: '2026-01-22 05:22:41',
      processedAt: '2026-01-22 05:27:32',
      result: '처리완료',
    },
    {
      withdrawer: 'mmpuu02',
      amount: 500_000,
      requestedAt: '2026-01-16 03:06:07',
      processedAt: '2026-01-16 03:10:24',
      result: '처리완료',
    },
  ]);

  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [amountText, setAmountText] = useState('0');
  const [depositorName, setDepositorName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const formatWon = (n: number) => `${n.toLocaleString('ko-KR')}원`;
  const normalizeAmount = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    if (!digits) return '0';
    return Number(digits).toLocaleString('ko-KR');
  };

  const parseAmountText = (raw: string) => {
    const n = Number(String(raw ?? '').replace(/[^0-9]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };

  useEffect(() => {
    if (menuKey === 'deposit') {
      setWithdrawPassword('');
      setAmountText('0');
      setDepositorName('');
    }

    if (menuKey === 'withdraw') {
      setWithdrawPassword('');
      setAmountText('0');
      setBankName('');
      setAccountHolder('');
      setAccountNumber('');
    }
  }, [menuKey]);

  if (menuKey === 'notice') {
    return (
      <>
        <ClientSiteHeader />
        <Wrap>
          <NoticePanel aria-label="notice panel">
            <NoticeInner>
              <NoticeTitle>공지사항</NoticeTitle>
              <NoticeTable role="table" aria-label="notice list">
                <NoticeHead role="row">
                  <div>제목</div>
                  <div className="author" style={{ textAlign: 'right' }}>
                    글쓴이
                  </div>
                  <div style={{ textAlign: 'right' }}>날짜</div>
                </NoticeHead>
                {noticeItems.map((x) => (
                  <NoticeRow
                    key={x.title}
                    type="button"
                    $active={Boolean(selectedTitle && x.title.includes(selectedTitle))}
                    onClick={() => window.alert(`공지 상세(데모): ${x.title}`)}
                  >
                    <NoticeCellTitle>
                      <span className="text">
                        {x.title} {x.isNew ? <span className="new">NEW</span> : null}
                      </span>
                    </NoticeCellTitle>
                    <NoticeCell className="author">{x.author}</NoticeCell>
                    <NoticeCell>{x.date}</NoticeCell>
                  </NoticeRow>
                ))}
              </NoticeTable>
            </NoticeInner>
          </NoticePanel>
        </Wrap>
      </>
    );
  }

  if (menuKey === 'support') {
    return (
      <>
        <ClientSiteHeader />
        <Wrap>
          <NoticePanel aria-label="support board">
            <NoticeInner>
              <NoticeTitle>문의</NoticeTitle>
              <NoticeTable role="table" aria-label="support list">
                <NoticeHead role="row">
                  <div>제목</div>
                  <div className="author" style={{ textAlign: 'right' }}>
                    글쓴이
                  </div>
                  <div style={{ textAlign: 'right' }}>날짜</div>
                </NoticeHead>
              </NoticeTable>
            </NoticeInner>
          </NoticePanel>
        </Wrap>
      </>
    );
  }

  if (menuKey === 'inbox') {
    return (
      <>
        <ClientSiteHeader />
        <Wrap>
          <NoticePanel aria-label="inbox board">
            <NoticeInner>
              <NoticeTitle>쪽지함</NoticeTitle>
              <NoticeTable role="table" aria-label="inbox list">
                <NoticeHead role="row">
                  <div>제목</div>
                  <div className="author" style={{ textAlign: 'right' }}>
                    보낸사람
                  </div>
                  <div style={{ textAlign: 'right' }}>날짜</div>
                </NoticeHead>
              </NoticeTable>
            </NoticeInner>
          </NoticePanel>
        </Wrap>
      </>
    );
  }

  if (menuKey === 'withdraw') {
    const balance = 2346;
    const quickAmounts = [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000];

    return (
      <>
        <ClientSiteHeader />
        <Wrap>
          <DepositPanel aria-label="withdraw">
            <DepositInner>
              <FormTable aria-label="withdraw form">
                <FormRow>
                  <FormLabel>출금가능금액</FormLabel>
                  <ValueText>{balance.toLocaleString('ko-KR')}원</ValueText>
                </FormRow>

                <FormRow>
                  <FormLabel>출금금액</FormLabel>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <FieldAmount
                      value={amountText}
                      onChange={(e) => setAmountText(normalizeAmount(e.target.value))}
                      placeholder=""
                      inputMode="numeric"
                      autoComplete="off"
                    />
                    <AmountGrid aria-label="quick withdraw amounts">
                      {quickAmounts.map((v) => (
                        <MiniBtn
                          key={v}
                          type="button"
                          onClick={() => {
                            const next = parseAmountText(amountText) + v;
                            setAmountText(normalizeAmount(String(next)));
                          }}
                        >
                          {(v / 10_000).toLocaleString('ko-KR')}만원
                        </MiniBtn>
                      ))}
                      <MiniBtn type="button" $tone="gray" onClick={() => setAmountText('0')}>
                        지우기
                      </MiniBtn>
                    </AmountGrid>
                  </div>
                </FormRow>

                <FormRow>
                  <FormLabel>환전 비밀번호</FormLabel>
                  <FieldShort
                    value={withdrawPassword}
                    onChange={(e) => setWithdrawPassword(e.target.value)}
                    placeholder=""
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                  />
                </FormRow>

                <FormRow>
                  <FormLabel>은행명</FormLabel>
                  <FieldShort
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder=""
                    autoComplete="off"
                  />
                </FormRow>

                <FormRow>
                  <FormLabel>예금주</FormLabel>
                  <FieldShort
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder=""
                    autoComplete="off"
                  />
                </FormRow>

                <FormRow>
                  <FormLabel>계좌번호</FormLabel>
                  <Field
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder=""
                    inputMode="numeric"
                    autoComplete="off"
                  />
                </FormRow>
              </FormTable>

              <SubmitWrap>
                <SubmitBtn
                  type="button"
                  onClick={() => {
                    const amountValue = parseAmountText(amountText);
                    if (!amountValue) {
                      window.alert('출금금액을 입력해주세요.');
                      return;
                    }
                    if (!withdrawPassword.trim()) {
                      window.alert('환전 비밀번호를 입력해주세요.');
                      return;
                    }
                    if (!bankName.trim()) {
                      window.alert('은행명을 입력해주세요.');
                      return;
                    }
                    if (!accountHolder.trim()) {
                      window.alert('예금주를 입력해주세요.');
                      return;
                    }
                    if (!accountNumber.trim()) {
                      window.alert('계좌번호를 입력해주세요.');
                      return;
                    }

                    window.alert(
                      `환전신청(데모)\n- 환전금액: ${formatWon(amountValue)}\n- 은행: ${bankName}\n- 예금주: ${accountHolder}`
                    );
                  }}
                >
                  환전신청
                </SubmitBtn>
              </SubmitWrap>

              <HistoryTitle>출금내역</HistoryTitle>
              <HistoryTable aria-label="withdraw history">
                <HistoryScroll data-scroll={withdrawHistory.length > 5 ? 'true' : 'false'}>
                  <HistoryHead>
                    <div>출금자명</div>
                    <div style={{ textAlign: 'center' }}>신청금액</div>
                    <div className="requested">신청일자</div>
                    <div className="processed">처리일자</div>
                    <div style={{ textAlign: 'center' }}>진행결과</div>
                    <div style={{ textAlign: 'center' }}>삭제</div>
                  </HistoryHead>
                  <HistoryBody>
                    {withdrawHistory.map((x) => (
                      <HistoryRow key={`${x.withdrawer}-${x.requestedAt}-${x.amount}`}>
                        <div>{x.withdrawer}</div>
                        <div className="amount">{x.amount.toLocaleString('ko-KR')} 원</div>
                        <div className="requested">{x.requestedAt}</div>
                        <div className="processed">{x.processedAt ?? '-'}</div>
                        <Badge>{x.result}</Badge>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <MiniBtn
                            type="button"
                            $tone="gray"
                            onClick={() =>
                              setWithdrawHistory((prev) =>
                                prev.filter(
                                  (row) =>
                                    !(
                                      row.withdrawer === x.withdrawer &&
                                      row.requestedAt === x.requestedAt &&
                                      row.amount === x.amount
                                    )
                                )
                              )
                            }
                          >
                            삭제
                          </MiniBtn>
                        </div>
                      </HistoryRow>
                    ))}
                  </HistoryBody>
                </HistoryScroll>
              </HistoryTable>
            </DepositInner>
          </DepositPanel>
        </Wrap>
      </>
    );
  }

  if (menuKey === 'deposit') {
    const balance = 2346;
    const quickAmounts = [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000];

    return (
      <>
        <ClientSiteHeader />
        <Wrap>
          <DepositPanel aria-label="deposit">
            <DepositInner>
              <FormTable aria-label="deposit form">
                <FormRow>
                  <FormLabel>보유머니</FormLabel>
                  <ValueText>{balance.toLocaleString('ko-KR')}원</ValueText>
                </FormRow>

                <FormRow>
                  <FormLabel>입금계좌안내</FormLabel>
                  <Inline>
                    <MiniBtn
                      type="button"
                      $tone="gold"
                      onClick={() =>
                        navigate('/client/menu/support', {
                          state: { from: 'deposit', title: '계좌문의' },
                        })
                      }
                    >
                      계좌문의
                    </MiniBtn>
                    <Hint>*계좌를 먼저 확인해주세요</Hint>
                  </Inline>
                </FormRow>

                <FormRow>
                  <FormLabel>출금비밀번호</FormLabel>
                  <FieldShort
                    value={withdrawPassword}
                    onChange={(e) => setWithdrawPassword(e.target.value)}
                    placeholder=""
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                  />
                </FormRow>

                <FormRow>
                  <FormLabel>입금액</FormLabel>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <FieldAmount
                      value={amountText}
                      onChange={(e) => setAmountText(normalizeAmount(e.target.value))}
                      placeholder=""
                      inputMode="numeric"
                      autoComplete="off"
                    />
                    <AmountGrid aria-label="quick amounts">
                      {quickAmounts.map((v) => (
                        <MiniBtn
                          key={v}
                          type="button"
                          onClick={() => {
                            const next = parseAmountText(amountText) + v;
                            setAmountText(normalizeAmount(String(next)));
                          }}
                        >
                          {(v / 10_000).toLocaleString('ko-KR')}만원
                        </MiniBtn>
                      ))}
                      <MiniBtn type="button" $tone="gray" onClick={() => setAmountText('0')}>
                        지우기
                      </MiniBtn>
                    </AmountGrid>
                  </div>
                </FormRow>

                <FormRow>
                  <FormLabel>입금자명</FormLabel>
                  <Inline>
                    <FieldShort
                      value={depositorName}
                      onChange={(e) => setDepositorName(e.target.value)}
                      placeholder=""
                      autoComplete="off"
                    />
                    <Hint>
                      * 확인한 계좌번호로 선입금 후 입금하신 금액을 정확히 입력하고 신청하기 버튼을
                      눌러주세요.
                    </Hint>
                  </Inline>
                </FormRow>
              </FormTable>

              <SubmitWrap>
                <SubmitBtn
                  type="button"
                  onClick={() => {
                    const amountValue = Number(amountText.replace(/[^0-9]/g, ''));
                    if (!withdrawPassword.trim()) {
                      window.alert('출금비밀번호를 입력해주세요.');
                      return;
                    }
                    if (!amountValue) {
                      window.alert('입금액을 입력해주세요.');
                      return;
                    }
                    if (!depositorName.trim()) {
                      window.alert('입금자명을 입력해주세요.');
                      return;
                    }
                    window.alert(
                      `충전신청(데모)\n- 충전액: ${formatWon(amountValue)}\n- 입금자명: ${depositorName}`
                    );
                  }}
                >
                  충전신청
                </SubmitBtn>
              </SubmitWrap>

              <HistoryTitle>입금내역</HistoryTitle>
              <HistoryTable aria-label="deposit history">
                <HistoryScroll data-scroll={depositHistory.length > 5 ? 'true' : 'false'}>
                  <HistoryHead>
                    <div>입금자명</div>
                    <div style={{ textAlign: 'center' }}>신청금액</div>
                    <div className="requested">신청일자</div>
                    <div className="processed">처리일자</div>
                    <div style={{ textAlign: 'center' }}>진행결과</div>
                    <div style={{ textAlign: 'center' }}>삭제</div>
                  </HistoryHead>
                  <HistoryBody>
                    {depositHistory.map((x) => (
                      <HistoryRow key={`${x.depositor}-${x.requestedAt}-${x.amount}`}>
                        <div>{x.depositor}</div>
                        <div className="amount">{x.amount.toLocaleString('ko-KR')} 원</div>
                        <div className="requested">{x.requestedAt}</div>
                        <div className="processed">{x.processedAt ?? '-'}</div>
                        <Badge>{x.result}</Badge>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <MiniBtn
                            type="button"
                            $tone="gray"
                            onClick={() =>
                              setDepositHistory((prev) =>
                                prev.filter(
                                  (row) =>
                                    !(
                                      row.depositor === x.depositor &&
                                      row.requestedAt === x.requestedAt &&
                                      row.amount === x.amount
                                    )
                                )
                              )
                            }
                          >
                            삭제
                          </MiniBtn>
                        </div>
                      </HistoryRow>
                    ))}
                  </HistoryBody>
                </HistoryScroll>
              </HistoryTable>
            </DepositInner>
          </DepositPanel>
        </Wrap>
      </>
    );
  }

  return (
    <>
      <ClientSiteHeader />
      <Wrap>
        <Layout>
          <Left aria-label="menu left image">
            <img src={leftImageSrc} alt="menu" />
            <div className="caption">
              {menu.title}
              <small>{menu.subtitle}</small>
            </div>
          </Left>

          <Right>
            <Heading>{menu.heading}</Heading>
            <Grid aria-label="menu items">
              {FALLBACK_ITEMS.map((x, idx) => (
                <Tile
                  key={x.name}
                  $bg={useTileBanners ? casinoBanners[idx % casinoBanners.length] : undefined}
                  type="button"
                  onClick={() => window.alert(`${menu.title} > ${x.name}(데모)`)}
                >
                  <div className="label">
                    {x.name}
                    <span>{x.sub}</span>
                  </div>
                </Tile>
              ))}
            </Grid>
          </Right>
        </Layout>
      </Wrap>
    </>
  );
};

export default ClientMenuPage;
