import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './clientStyleTokens';
import { ensureClientLoggedIn } from '@/utils/clientAuthGuard';

type SimpleItem = {
  title: string;
};

type TxItem = {
  kind: '입금' | '출금';
  amount: string;
  user: string;
  date: string;
};

const VISIBLE_COUNT = 5;
const ROLL_INTERVAL_MS = 1800;

const Section = styled.section`
  max-width: ${CLIENT_MAX_WIDTH};
  margin: 18px auto 26px;
  padding: 0 ${CLIENT_SIDE_PADDING};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.section`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(255, 205, 120, 0.95),
      rgba(255, 205, 120, 0.55),
      rgba(255, 255, 255, 0)
    );
    pointer-events: none;
  }
`;

const CardInner = styled.div`
  padding: 16px 16px 14px;
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 1000;
  letter-spacing: -0.4px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 12px;

  .mark {
    width: 28px;
    height: 28px;
    border-radius: 10px;
    border: 1px solid rgba(255, 205, 120, 0.25);
    background:
      radial-gradient(circle at 30% 30%, rgba(255, 205, 120, 0.35), rgba(255, 255, 255, 0.02)),
      rgba(0, 0, 0, 0.25);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 2px;
`;

const ListRow = styled.li`
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: center;
  height: 44px;
  padding: 0 2px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.84);
  font-weight: 900;
  font-size: 13px;
  letter-spacing: -0.2px;

  &:first-child {
    border-top: none;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 205, 120, 0.72);
    box-shadow: 0 0 0 3px rgba(255, 205, 120, 0.1);
  }

  &:hover {
    color: rgba(255, 255, 255, 0.92);
  }
`;

const TxTable = styled.div`
  display: grid;
`;

const TxRow = styled.div`
  display: grid;
  grid-template-columns: 62px 1fr 1fr 110px;
  gap: 10px;
  align-items: center;
  height: 46px;
  padding: 0 2px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  &:first-child {
    border-top: none;
  }

  .kind {
    opacity: 0.8;
    font-weight: 1000;
    color: rgba(255, 255, 255, 0.72);
  }

  .amount {
    font-weight: 1000;
    color: rgba(255, 205, 120, 0.95);
    letter-spacing: -0.2px;
  }

  .user {
    font-weight: 1000;
    color: rgba(255, 255, 255, 0.86);
  }

  .date {
    text-align: right;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.62);
    font-size: 12px;
    letter-spacing: 0.1px;
  }

  @media (max-width: 520px) {
    grid-template-columns: 56px 1fr 92px;

    .user {
      display: none;
    }
  }
`;

const DemoLink = styled.button`
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
`;

const RollViewport = styled.div`
  overflow: hidden;
`;

const RollTrack = styled.div<{ $y: number; $animate: boolean }>`
  transform: translateY(${({ $y }) => $y}px);
  transition: ${({ $animate }) => ($animate ? 'transform 380ms ease' : 'none')};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

type RollingListProps<T> = {
  items: T[];
  visibleCount: number;
  rowHeight: number;
  getKey: (item: T, index: number) => string;
  renderRow: (item: T, index: number) => React.ReactNode;
  intervalMs?: number;
};

const RollingList = <T,>({
  items,
  visibleCount,
  rowHeight,
  getKey,
  renderRow,
  intervalMs = ROLL_INTERVAL_MS,
}: RollingListProps<T>) => {
  const [startIndex, setStartIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  useEffect(() => {
    setStartIndex(0);
    setAnimating(false);
  }, [items.length]);

  useEffect(() => {
    if (reduceMotion) return;
    if (items.length <= visibleCount) return;
    const id = window.setInterval(() => {
      setAnimating(true);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [items.length, visibleCount, intervalMs, reduceMotion]);

  const loopItems = useMemo(() => {
    if (items.length <= visibleCount) return items;
    return items.concat(items.slice(0, visibleCount));
  }, [items, visibleCount]);

  const windowItems = useMemo(() => {
    if (items.length <= visibleCount) return items;
    return loopItems.slice(startIndex, startIndex + visibleCount + 1);
  }, [items.length, visibleCount, loopItems, startIndex, items]);

  const viewportHeight = rowHeight * Math.min(visibleCount, Math.max(items.length, 1));

  return (
    <RollViewport style={{ height: viewportHeight }}>
      <RollTrack
        $y={animating ? -rowHeight : 0}
        $animate={animating && !reduceMotion}
        onTransitionEnd={() => {
          if (!animating) return;
          setAnimating(false);
          setStartIndex((prev) => {
            if (items.length <= visibleCount) return 0;
            return (prev + 1) % items.length;
          });
        }}
      >
        {windowItems.map((item, idx) => (
          <div key={getKey(item, idx)}>{renderRow(item, idx)}</div>
        ))}
      </RollTrack>
    </RollViewport>
  );
};

const renderSimpleList = (items: SimpleItem[], onItemClick: (item: SimpleItem) => void) => {
  return (
    <List>
      <RollingList
        items={items}
        visibleCount={VISIBLE_COUNT}
        rowHeight={44}
        getKey={(item) => item.title}
        renderRow={(x) => (
          <DemoLink type="button" onClick={() => onItemClick(x)}>
            <ListRow>
              <span className="dot" aria-hidden />
              <span>{x.title}</span>
            </ListRow>
          </DemoLink>
        )}
      />
    </List>
  );
};

const ClientHomeInfoGrid = () => {
  const navigate = useNavigate();

  const noticeItems: SimpleItem[] = [
    { title: '테더 사용 안내 (USDT)' },
    { title: '통합 배팅 한도 및 당첨 상한 규정' },
    { title: '이벤트/쿠폰 정책 안내' },
    { title: '입금 및 출금 규정 안내' },
    { title: '악성 배팅 근절 안내' },
  ];

  const inquiryItems: SimpleItem[] = [
    { title: '1:1 문의 접수 안내' },
    { title: '가입/로그인 문의' },
    { title: '입출금 문의' },
    { title: '게임 이용 문의' },
    { title: '기타 문의' },
  ];

  const deposits: TxItem[] = [
    { kind: '입금', amount: '10,000원', user: 'jjs***', date: '2026-01-22' },
    { kind: '입금', amount: '200,000원', user: 'an***', date: '2026-01-22' },
    { kind: '입금', amount: '130,000원', user: 'tm***', date: '2026-01-22' },
    { kind: '입금', amount: '500,000원', user: 'go***', date: '2026-01-22' },
    { kind: '입금', amount: '1,904,370원', user: 'wp***', date: '2026-01-22' },
    { kind: '입금', amount: '30,000원', user: 'joy***', date: '2026-01-22' },
    { kind: '입금', amount: '20,000원', user: 'm***', date: '2026-01-22' },
    { kind: '입금', amount: '700,000원', user: 'kim***', date: '2026-01-22' },
    { kind: '입금', amount: '4,577,048원', user: 'red***', date: '2026-01-22' },
    { kind: '입금', amount: '100,000원', user: 'C3***', date: '2026-01-22' },
  ];

  const withdraws: TxItem[] = [
    { kind: '출금', amount: '5,100,000원', user: 'rka***', date: '2026-01-22' },
    { kind: '출금', amount: '4,500,000원', user: 'kk***', date: '2026-01-22' },
    { kind: '출금', amount: '4,000,000원', user: 'kb***', date: '2026-01-22' },
    { kind: '출금', amount: '3,800,000원', user: 'po***', date: '2026-01-22' },
    { kind: '출금', amount: '3,400,000원', user: 'sw***', date: '2026-01-22' },
    { kind: '출금', amount: '1,200,000원', user: 'als***', date: '2026-01-22' },
    { kind: '출금', amount: '900,000원', user: 'pm***', date: '2026-01-22' },
    { kind: '출금', amount: '2,100,000원', user: 'dy***', date: '2026-01-22' },
    { kind: '출금', amount: '650,000원', user: 'lov***', date: '2026-01-22' },
    { kind: '출금', amount: '3,000,000원', user: 'nx***', date: '2026-01-22' },
  ];

  const goNoticePage = async (item: SimpleItem) => {
    const ok = await ensureClientLoggedIn({ openModal: true });
    if (!ok) return;

    navigate('/client/menu/notice', {
      state: {
        clientAuthChecked: true,
        from: 'home',
        title: item.title,
      },
    });
  };

  const goInquiryPage = async (item: SimpleItem) => {
    const ok = await ensureClientLoggedIn({ openModal: true });
    if (!ok) return;

    navigate('/client/menu/support', {
      state: {
        clientAuthChecked: true,
        from: 'home',
        title: item.title,
      },
    });
  };

  return (
    <Section aria-label="home info grid">
      <Grid>
        <Card aria-label="notice">
          <CardInner>
            <CardTitle>
              <span className="mark" aria-hidden />
              공지사항
            </CardTitle>
            {renderSimpleList(noticeItems, goNoticePage)}
          </CardInner>
        </Card>

        <Card aria-label="inquiry">
          <CardInner>
            <CardTitle>
              <span className="mark" aria-hidden />
              문의
            </CardTitle>
            {renderSimpleList(inquiryItems, goInquiryPage)}
          </CardInner>
        </Card>

        <Card aria-label="live deposit">
          <CardInner>
            <CardTitle>
              <span className="mark" aria-hidden />
              실시간 입금
            </CardTitle>
            <TxTable>
              <RollingList
                items={deposits}
                visibleCount={VISIBLE_COUNT}
                rowHeight={46}
                getKey={(item, idx) => `${item.user}-${item.amount}-${idx}`}
                renderRow={(x, idx) => (
                  <TxRow key={`${x.user}-${idx}`}>
                    <span className="kind">{x.kind}</span>
                    <span className="amount">{x.amount}</span>
                    <span className="user">{x.user}</span>
                    <span className="date">{x.date}</span>
                  </TxRow>
                )}
              />
            </TxTable>
          </CardInner>
        </Card>

        <Card aria-label="live withdraw">
          <CardInner>
            <CardTitle>
              <span className="mark" aria-hidden />
              실시간 출금
            </CardTitle>
            <TxTable>
              <RollingList
                items={withdraws}
                visibleCount={VISIBLE_COUNT}
                rowHeight={46}
                getKey={(item, idx) => `${item.user}-${item.amount}-${idx}`}
                renderRow={(x, idx) => (
                  <TxRow key={`${x.user}-${idx}`}>
                    <span className="kind">{x.kind}</span>
                    <span className="amount">{x.amount}</span>
                    <span className="user">{x.user}</span>
                    <span className="date">{x.date}</span>
                  </TxRow>
                )}
              />
            </TxTable>
          </CardInner>
        </Card>
      </Grid>
    </Section>
  );
};

export default ClientHomeInfoGrid;
