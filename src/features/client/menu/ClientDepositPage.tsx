import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DepositHistoryItem, MenuInfo, MenuKey } from '../ClientMenu.types';
import { formatWon, normalizeAmount, parseAmountText } from '../ClientMenu.utils';
import {
  AmountGrid,
  Badge,
  DepositInner,
  DepositPanel,
  FieldAmount,
  FieldShort,
  FormLabel,
  FormRow,
  FormTable,
  Hint,
  HistoryBody,
  HistoryHead,
  HistoryRow,
  HistoryScroll,
  HistoryTable,
  HistoryTitle,
  Inline,
  MiniBtn,
  SubmitBtn,
  SubmitWrap,
  ValueText,
  Wrap,
} from '../ClientMenu.styles';

type Props = {
  menuKey: MenuKey;
  menu: MenuInfo;
};

const INITIAL_DEPOSIT_HISTORY: DepositHistoryItem[] = [
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
];

const ClientDepositPage = (_props: Props) => {
  const navigate = useNavigate();

  const balance = 2346;
  const quickAmounts = [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000];

  const [depositHistory, setDepositHistory] =
    useState<DepositHistoryItem[]>(INITIAL_DEPOSIT_HISTORY);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [amountText, setAmountText] = useState('0');
  const [depositorName, setDepositorName] = useState('');

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
                  const amountValue = parseAmountText(amountText);
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
};

export default ClientDepositPage;
