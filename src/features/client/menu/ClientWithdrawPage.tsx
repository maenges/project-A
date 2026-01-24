import { useState } from 'react';
import type { MenuInfo, MenuKey, WithdrawHistoryItem } from '../ClientMenu.types';
import { formatWon, normalizeAmount, parseAmountText } from '../ClientMenu.utils';
import {
  AmountGrid,
  Badge,
  DepositInner,
  DepositPanel,
  Field,
  FieldAmount,
  FieldShort,
  FormLabel,
  FormRow,
  FormTable,
  HistoryBody,
  HistoryHead,
  HistoryRow,
  HistoryScroll,
  HistoryTable,
  HistoryTitle,
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

const INITIAL_WITHDRAW_HISTORY: WithdrawHistoryItem[] = [
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
];

const ClientWithdrawPage = (_props: Props) => {
  const balance = 2346;
  const quickAmounts = [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000];

  const [withdrawHistory, setWithdrawHistory] =
    useState<WithdrawHistoryItem[]>(INITIAL_WITHDRAW_HISTORY);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [amountText, setAmountText] = useState('0');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  return (
    <>
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
};

export default ClientWithdrawPage;
