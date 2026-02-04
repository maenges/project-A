import { useEffect, useState } from 'react';
import type { MenuInfo, MenuKey, WithdrawHistoryItem } from '../ClientMenu.types';
import { normalizeAmount, parseAmountText } from '../ClientMenu.utils';
import { useClientBalanceStore } from '@/store/clientBalance';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { AccountKeyOptions } from '@models/common/CommonSelectCodes';
import {
  AlertBtn,
  AlertContainer,
  AlertIcon,
  AlertMessage,
  AlertOverlay,
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
  SelectField,
  SubmitBtn,
  SubmitWrap,
  ValueText,
  Wrap,
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

const ClientWithdrawPage = (_props: Props) => {
  const { balance: clientBalance } = useClientBalanceStore();
  const balance = clientBalance?.money ?? 0;
  const quickAmounts = [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000];

  const [amountText, setAmountText] = useState('0');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawHistoryItem[]>([]);
  const [alert, setAlert] = useState<AlertState>({ open: false, type: 'info', message: '' });

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ open: true, type, message });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const fetchExchangeList = async () => {
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/exchangeList',
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
    const mappedData = (Array.isArray(data) ? data : []).map((item: any) => {
      const bankOption = AccountKeyOptions.find((opt) => opt.value === item.trans_bank_key);
      return {
        bankName: bankOption ? bankOption.label : item.trans_bank_key || '-',
        accountHolder: item.trans_bank_won || '-',
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
      };
    });
    setWithdrawHistory(mappedData);
  };

  useEffect(() => {
    fetchExchangeList();
  }, []);

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
                <FormLabel>은행명</FormLabel>
                <SelectField value={bankName} onChange={(e) => setBankName(e.target.value)}>
                  <option value="">선택</option>
                  {AccountKeyOptions.filter((opt) => opt.value !== 'ALL').map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </SelectField>
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
                $tone="gold"
                onClick={async () => {
                  const amountValue = parseAmountText(amountText);
                  if (!amountValue) {
                    showAlert('error', '출금금액을 입력해주세요.');
                    return;
                  }
                  if (amountValue > balance) {
                    showAlert('error', '출금가능금액을 초과했습니다.');
                    return;
                  }
                  if (!bankName.trim()) {
                    showAlert('error', '은행명을 입력해주세요.');
                    return;
                  }
                  if (!accountHolder.trim()) {
                    showAlert('error', '예금주를 입력해주세요.');
                    return;
                  }
                  if (!accountNumber.trim()) {
                    showAlert('error', '계좌번호를 입력해주세요.');
                    return;
                  }

                  const res = await callApi({
                    service: Service.POSTMAN,
                    url: '/api/client/exchange',
                    method: Method.POST,
                    params: {
                      bodyParams: {
                        amount: amountValue,
                        bankName: bankName,
                        accountHolder: accountHolder,
                        accountNumber: accountNumber,
                      },
                    },
                    config: { isLoading: true },
                  });

                  if (res.successOrNot !== 'Y') {
                    showAlert('error', res.HeaderMsg || '환전신청에 실패했습니다.');
                    return;
                  }

                  showAlert('success', '환전신청이 완료되었습니다.');
                  setAmountText('0');
                  setBankName('');
                  setAccountHolder('');
                  setAccountNumber('');
                  fetchExchangeList();
                }}
              >
                환전신청
              </SubmitBtn>
            </SubmitWrap>

            <HistoryTitle>환전내역</HistoryTitle>
            <HistoryTable aria-label="withdraw history">
              <HistoryScroll data-scroll={withdrawHistory.length > 5 ? 'true' : 'false'}>
                <HistoryHead>
                  <div>은행명</div>
                  <div>예금주</div>
                  <div style={{ textAlign: 'center' }}>환전금액</div>
                  <div className="requested">신청일자</div>
                  <div className="processed">처리일자</div>
                  <div style={{ textAlign: 'center' }}>진행결과</div>
                </HistoryHead>
                <HistoryBody>
                  {withdrawHistory.map((x, index) => (
                    <HistoryRow key={`${x.accountHolder}-${x.requestedAt}-${x.amount}-${index}`}>
                      <div>{x.bankName}</div>
                      <div>{x.accountHolder}</div>
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

export default ClientWithdrawPage;
