import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DepositHistoryItem, MenuInfo, MenuKey } from '../ClientMenu.types';
import { normalizeAmount, parseAmountText } from '../ClientMenu.utils';
import { useClientBalanceStore } from '@/store/clientBalance';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { TransactionAddEventListeners } from '@/utils/transactionEventBus';
import {
  AlertBtn,
  AlertContainer,
  AlertIcon,
  AlertMessage,
  AlertOverlay,
  AmountGrid,
  DepositInner,
  DepositPanel,
  FieldAmount,
  FieldShort,
  FormLabel,
  FormRow,
  FormTable,
  Hint,
  Inline,
  MiniBtn,
  SubmitBtn,
  SubmitWrap,
  ValueText,
  Wrap,
  HistoryBody,
  HistoryHead,
  HistoryRow,
  HistoryScroll,
  HistoryTable,
  HistoryTitle,
  Badge,
} from '../ClientMenu.styles';

type Props = {
  menuKey: MenuKey;
  menu: MenuInfo;
};

type AlertState = {
  open: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
};

const ClientDepositPage = (_props: Props) => {
  const { balance: clientBalance } = useClientBalanceStore();
  const balance = clientBalance?.money ?? 0;
  const navigate = useNavigate();

  const quickAmounts = [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000];

  const [amountText, setAmountText] = useState('0');
  const [depositorName, setDepositorName] = useState('');
  const [depositHistory, setDepositHistory] = useState<DepositHistoryItem[]>([]);
  const [alert, setAlert] = useState<AlertState>({ open: false, type: 'info', message: '' });

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ open: true, type, message });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const fetchChargeList = async () => {
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/chargeList',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      showAlert('error', res.HeaderMsg || '조회에 실패했습니다.');
      return;
    }

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const data = res.data ?? [];
    const mappedData = (Array.isArray(data) ? data : []).map((item: any) => ({
      depositor: item.trans_bank_won || '-',
      amount: Number(item.trans_amount) || 0,
      requestedAt: item.created ? formatDate(item.created) : '-',
      processedAt:
        item.trans_permission !== null && item.updated ? formatDate(item.updated) : undefined,
      result:
        item.trans_permission === null
          ? '처리중'
          : item.trans_permission === true
            ? '처리완료'
            : '승인거절',
    }));
    setDepositHistory(mappedData);
  };

  useEffect(() => {
    fetchChargeList();

    // 충전/환전 처리 완료 알림 구독
    const unsubscribe = TransactionAddEventListeners((eventName, payload) => {
      console.log('💬 [Client] 거래 이벤트 수신:', eventName, payload);
      if (eventName === 'transaction_processed' && payload.type === 'RECHARGE') {
        // 충전 처리 완료 시
        const message = payload.approved
          ? `충전이 승인되었습니다. (${payload.amount.toLocaleString('ko-KR')}원)`
          : `충전이 거절되었습니다. (${payload.amount.toLocaleString('ko-KR')}원)`;

        showAlert(payload.approved ? 'success' : 'error', message);

        // 목록 새로고침
        fetchChargeList();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <>
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
                        state: { clientAuthChecked: true, from: 'deposit', title: '계좌문의' },
                      })
                    }
                  >
                    계좌문의
                  </MiniBtn>
                  <Hint>*계좌를 먼저 확인해주세요</Hint>
                </Inline>
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
                $tone="gold"
                onClick={async () => {
                  const amountValue = parseAmountText(amountText);
                  if (!amountValue) {
                    showAlert('error', '입금액을 입력해주세요.');
                    return;
                  }
                  if (!depositorName.trim()) {
                    showAlert('error', '입금자명을 입력해주세요.');
                    return;
                  }

                  const res = await callApi({
                    service: Service.POSTMAN,
                    url: '/api/client/charge',
                    method: Method.POST,
                    params: {
                      bodyParams: {
                        amount: amountValue,
                        depositor: depositorName,
                      },
                    },
                    config: { isLoading: true },
                  });

                  if (res.successOrNot !== 'Y') {
                    showAlert('error', res.HeaderMsg || '충전신청에 실패했습니다.');
                    return;
                  }

                  showAlert('success', '충전신청이 완료되었습니다.');
                  setAmountText('0');
                  setDepositorName('');
                  fetchChargeList();
                }}
              >
                충전신청
              </SubmitBtn>
            </SubmitWrap>

            <HistoryTitle>충전내역</HistoryTitle>
            <HistoryTable aria-label="deposit history">
              <HistoryScroll data-scroll={depositHistory.length > 5 ? 'true' : 'false'}>
                <HistoryHead>
                  <div>입금자명</div>
                  <div style={{ textAlign: 'center' }}>충전금액</div>
                  <div className="requested">신청일자</div>
                  <div className="processed">처리일자</div>
                  <div style={{ textAlign: 'center' }}>진행결과</div>
                </HistoryHead>
                <HistoryBody>
                  {depositHistory.map((x) => (
                    <HistoryRow key={`${x.depositor}-${x.requestedAt}-${x.amount}`}>
                      <div>{x.depositor}</div>
                      <div className="amount">{x.amount.toLocaleString('ko-KR')} 원</div>
                      <div className="requested">{x.requestedAt}</div>
                      <div className="processed">{x.processedAt ?? '-'}</div>
                      <Badge>{x.result}</Badge>
                    </HistoryRow>
                  ))}
                </HistoryBody>
              </HistoryScroll>
            </HistoryTable>
          </DepositInner>
        </DepositPanel>
      </Wrap>

      {alert.open && (
        <AlertOverlay onClick={closeAlert}>
          <AlertContainer $type={alert.type} onClick={(e) => e.stopPropagation()}>
            <AlertIcon $type={alert.type}>
              {alert.type === 'success' ? '✓' : alert.type === 'error' ? '!' : 'i'}
            </AlertIcon>
            <AlertMessage>{alert.message}</AlertMessage>
            <AlertBtn $type={alert.type} onClick={closeAlert}>
              확인
            </AlertBtn>
          </AlertContainer>
        </AlertOverlay>
      )}
    </>
  );
};

export default ClientDepositPage;
