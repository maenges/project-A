import { Fragment, useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { buttonForm, searchForm } from '@/assets/style';
import { EtsButton } from '@/components/EtsCommon';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { AccountKeyOptions } from '@/models/common/CommonSelectCodes';
import { usePartnerDashboardStore } from '@/store/partnerDashboard';
import { PartnerDashboardAddEventListeners } from '@/utils/partnerDashboardEventBus';
import { Box, Typography } from '@mui/material';

export type PartnerWithdrawModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  amount: string;
  bank_key: string;
  account_holder: string;
  account_number: string;
};

const quickAmounts = [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000];
const bankKeyOptions = AccountKeyOptions.filter((o) => o.value !== 'ALL');

const normalizeAmount = (raw: string) => {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return '0';
  return Number(digits).toLocaleString('ko-KR');
};

const parseAmountText = (raw: string) => {
  const n = Number(String(raw ?? '').replace(/[^0-9]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const PartnerWithdrawModal = ({ open, onClose }: PartnerWithdrawModalProps) => {
  const { toast, confirm } = useNotify();
  const money = usePartnerDashboardStore((s) => s.money);
  const [amountText, setAmountText] = useState('0');

  const { control, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      amount: '0',
      bank_key: bankKeyOptions[0]?.value ?? '',
      account_holder: '',
      account_number: '',
    },
    mode: 'onChange',
  });

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (open) {
      reset({
        amount: '0',
        bank_key: bankKeyOptions[0]?.value ?? '',
        account_holder: '',
        account_number: '',
      });
      setAmountText('0');
    }
  }, [open, reset]);

  // 소켓 이벤트 구독 (환전 처리 완료 알림)
  useEffect(() => {
    if (!open) return;

    const unsubscribe = PartnerDashboardAddEventListeners((eventName, payload) => {
      if (eventName === 'balance_update') {
        // 잔액이 변동되면 환전 승인된 것이므로 토스트 표시
        const data = payload as { money: number };
        toast.success(
          `잔액이 업데이트되었습니다. (보유머니: ${data.money.toLocaleString('ko-KR')}원)`
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, [open, toast]);

  const onSave = async (values: FormValues) => {
    const amountValue = parseAmountText(amountText);
    if (!amountValue) {
      toast.error('출금금액을 입력해주세요.');
      return false;
    }
    if (amountValue > money) {
      toast.error('출금가능금액을 초과했습니다.');
      return false;
    }
    if (!values.bank_key.trim()) {
      toast.error('은행명을 선택해주세요.');
      return false;
    }
    if (!values.account_holder.trim()) {
      toast.error('예금주를 입력해주세요.');
      return false;
    }
    if (!values.account_number.trim()) {
      toast.error('계좌번호를 입력해주세요.');
      return false;
    }

    const ok = await confirm('환전 신청하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/exchange',
      method: Method.POST,
      params: {
        bodyParams: {
          amount: amountValue,
          bankName: values.bank_key,
          accountHolder: values.account_holder,
          accountNumber: values.account_number,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg || '환전신청에 실패했습니다.');
      return false;
    }

    toast.success('환전신청이 완료되었습니다.');
    reset({
      amount: '0',
      bank_key: bankKeyOptions[0]?.value ?? '',
      account_holder: '',
      account_number: '',
    });
    setAmountText('0');
    onClose();
    return true;
  };

  const searchComponent = (
    <form onSubmit={handleSubmit(onSave)}>
      <searchForm.Container>
        {/* 출금가능금액 */}
        <searchForm.Row>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 72 }}>
              출금가능금액
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {money.toLocaleString('ko-KR')}원
            </Typography>
          </Box>
        </searchForm.Row>

        {/* 출금금액 */}
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="amount"
            label="출금금액"
            width={400}
            value={amountText}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const normalized = normalizeAmount(e.target.value);
              setAmountText(normalized);
              setValue('amount', normalized);
            }}
            autoComplete="off"
          />
        </searchForm.Row>

        {/* 퀵 금액 버튼 */}
        <searchForm.Row>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: '88px' }}>
            {quickAmounts.map((v) => (
              <EtsButton
                key={v}
                type="grey"
                onClick={() => {
                  const next = parseAmountText(amountText) + v;
                  const normalized = normalizeAmount(String(next));
                  setAmountText(normalized);
                  setValue('amount', normalized);
                }}
              >
                {(v / 10_000).toLocaleString('ko-KR')}만원
              </EtsButton>
            ))}
            <EtsButton
              type="grey"
              onClick={() => {
                setAmountText('0');
                setValue('amount', '0');
              }}
            >
              지우기
            </EtsButton>
          </Box>
        </searchForm.Row>

        {/* 은행명 */}
        <searchForm.Row>
          <EtsSelectComponent
            control={control}
            name="bank_key"
            label="은행명"
            width={400}
            options={bankKeyOptions}
          />
        </searchForm.Row>

        {/* 예금주 */}
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="account_holder"
            label="예금주"
            placeholder="예금주를 입력해주세요."
            width={400}
            autoComplete="off"
          />
        </searchForm.Row>

        {/* 계좌번호 */}
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="account_number"
            label="계좌번호"
            placeholder="계좌번호를 입력해주세요."
            width={400}
            autoComplete="off"
          />
        </searchForm.Row>
      </searchForm.Container>
    </form>
  );

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <EtsButton
          type="blue"
          onClick={async () => {
            await handleSubmit(onSave)();
          }}
        >
          환전신청
        </EtsButton>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <Fragment>
      <PageModalTemplate
        open={open}
        onClose={onClose}
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        title="환전 신청"
        width={680}
      />
    </Fragment>
  );
};

export default PartnerWithdrawModal;
