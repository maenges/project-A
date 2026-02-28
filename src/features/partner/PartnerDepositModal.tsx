import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { buttonForm, searchForm } from '@/assets/style';
import { EtsButton } from '@/components/EtsCommon';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent } from '@/components/EtsComponents';
import { usePartnerDashboardStore } from '@/store/partnerDashboard';
import { PartnerDashboardAddEventListeners } from '@/utils/partnerDashboardEventBus';
import { Box, Typography, Button } from '@mui/material';

export type PartnerDepositModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  amount: string;
  depositor: string;
};

const quickAmounts = [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000];

const normalizeAmount = (raw: string) => {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return '0';
  return Number(digits).toLocaleString('ko-KR');
};

const parseAmountText = (raw: string) => {
  const n = Number(String(raw ?? '').replace(/[^0-9]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const PartnerDepositModal = ({ open, onClose }: PartnerDepositModalProps) => {
  const { toast, confirm } = useNotify();
  const money = usePartnerDashboardStore((s) => s.money);
  const [amountText, setAmountText] = useState('0');

  const { control, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      amount: '0',
      depositor: '',
    },
    mode: 'onChange',
  });

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (open) {
      reset({ amount: '0', depositor: '' });
      setAmountText('0');
    }
  }, [open, reset]);

  // 소켓 이벤트 구독 (충전 처리 완료 알림)
  useEffect(() => {
    if (!open) return;

    const unsubscribe = PartnerDashboardAddEventListeners((eventName, payload) => {
      if (eventName === 'balance_update') {
        // 잔액이 변동되면 충전 승인된 것이므로 토스트 표시
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
      toast.error('입금액을 입력해주세요.');
      return false;
    }
    if (!values.depositor.trim()) {
      toast.error('입금자명을 입력해주세요.');
      return false;
    }

    const ok = await confirm('충전 신청하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/charge',
      method: Method.POST,
      params: {
        bodyParams: {
          amount: amountValue,
          depositor: values.depositor,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg || '충전신청에 실패했습니다.');
      return false;
    }

    toast.success('충전신청이 완료되었습니다.');
    reset({ amount: '0', depositor: '' });
    setAmountText('0');
    onClose();
    return true;
  };

  const searchComponent = (
    <form onSubmit={handleSubmit(onSave)}>
      <searchForm.Container>
        {/* 보유머니 */}
        <searchForm.Row>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 72 }}>
              보유머니
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {money.toLocaleString('ko-KR')}원
            </Typography>
          </Box>
        </searchForm.Row>

        {/* 입금계좌안내 */}
        <searchForm.Row>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 72 }}>
              입금계좌안내
            </Typography>
            <Button
              variant="contained"
              size="small"
              color="warning"
              sx={{ borderRadius: '8px', fontWeight: 600 }}
            >
              계좌문의
            </Button>
            <Typography variant="caption" color="text.secondary">
              *계좌를 먼저 확인해주세요
            </Typography>
          </Box>
        </searchForm.Row>

        {/* 입금액 */}
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="amount"
            label="입금액"
            width={400}
            value={amountText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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

        {/* 입금자명 */}
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="depositor"
            label="입금자명"
            placeholder="입금자명을 입력해주세요."
            width={400}
            autoComplete="off"
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            * 확인한 계좌번호로 선입금 후 입금하신 금액을 정확히 입력하고 신청하기 버튼을
            눌러주세요.
          </Typography>
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
          충전신청
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
        title="충전 신청"
        width={680}
      />
    </Fragment>
  );
};

export default PartnerDepositModal;
