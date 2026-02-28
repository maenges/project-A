import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './clientStyleTokens';
import { ensureClientLoggedIn } from '@/utils/clientAuthGuard';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import dayjs from 'dayjs';

type SimpleItem = {
  key?: string;
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
        getKey={(item, idx) => item.key ?? `${item.title}-${idx}`}
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

  const [noticeItems, setNoticeItems] = useState<SimpleItem[]>([]);
  const [inquiryItems, setInquiryItems] = useState<SimpleItem[]>([]);
  const [deposits, setDeposits] = useState<TxItem[]>([]);
  const [withdraws, setWithdraws] = useState<TxItem[]>([]);

  // 유저ID 마스킹: 앞 2~3글자 + '***'
  const maskUserId = (id: string): string => {
    if (!id) return '***';
    const show = id.length <= 3 ? 1 : id.length <= 5 ? 2 : 3;
    return id.slice(0, show) + '***';
  };

  useEffect(() => {
    // 공지사항 목록 조회
    callApi({
      service: Service.POSTMAN,
      url: '/api/client/noticeList',
      method: Method.GET,
      params: {
        queryParams: { noticeTargetType: 'CUSTOMER' },
      },
      config: { isLoading: false },
    }).then((res) => {
      if (res.successOrNot === 'Y' && Array.isArray(res.data)) {
        setNoticeItems(
          res.data.map((item: any) => ({
            key: item.notice_key,
            title: item.notice_title ?? '',
          }))
        );
      }
    });

    // 문의 목록 조회
    callApi({
      service: Service.POSTMAN,
      url: '/api/client/answerList',
      method: Method.GET,
      params: {},
      config: { isLoading: false },
    }).then((res) => {
      if (res.successOrNot === 'Y' && Array.isArray(res.data)) {
        setInquiryItems(
          res.data.map((item: any) => ({
            key: item.notice_key,
            title: item.notice_title ?? '',
          }))
        );
      }
    });

    // 실시간 입출금 조회 (서버에서 승인 건만 반환)
    callApi({
      service: Service.POSTMAN,
      url: '/api/client/transferList',
      method: Method.GET,
      params: {},
      config: { isLoading: false },
    }).then((res) => {
      if (res.successOrNot === 'Y' && Array.isArray(res.data)) {
        const dep: TxItem[] = [];
        const wit: TxItem[] = [];

        res.data.forEach((row: any) => {
          const item: TxItem = {
            kind: row.trans_type === 'RECHARGE' ? '입금' : '출금',
            amount: `${Number(row.trans_amount ?? 0).toLocaleString('ko-KR')}원`,
            user: maskUserId(row.trans_bank_won ?? ''),
            date: row.created ? dayjs(row.created).format('YYYY-MM-DD') : '',
          };

          if (row.trans_type === 'RECHARGE') {
            dep.push(item);
          } else if (row.trans_type === 'EXCHANGE') {
            wit.push(item);
          }
        });

        setDeposits(dep);
        setWithdraws(wit);
      }
    });
  }, []);

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
