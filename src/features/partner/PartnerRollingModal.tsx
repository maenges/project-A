import { Fragment, useEffect, useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { buttonForm, searchForm } from '@/assets/style';
import { EtsButton } from '@/components/EtsCommon';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent } from '@/components/EtsComponents';
import { Box, Typography } from '@mui/material';
import { usePartnerDashboardStore } from '@/store/partnerDashboard';
import { PartnerDashboardAddEventListeners } from '@/utils/partnerDashboardEventBus';

export type PartnerRollingModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  amount: string;
};

const normalizeAmount = (raw: string) => {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return '0';
  return Number(digits).toLocaleString('ko-KR');
};

const parseAmountText = (raw: string) => {
  const n = Number(String(raw ?? '').replace(/[^0-9]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const PartnerRollingModal = ({ open, onClose }: PartnerRollingModalProps) => {
  const { toast, confirm } = useNotify();
  const rollingMoney = usePartnerDashboardStore((s) => s.rollingMoney);

  const [myUserKey, setMyUserKey] = useState<string>('');
  const [amountText, setAmountText] = useState('0');

  const { control, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      amount: '0',
    },
    mode: 'onChange',
  });

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (open) {
      reset({ amount: '0' });
      setAmountText('0');
    }
  }, [open, reset]);

  // user_key 조회
  useEffect(() => {
    if (!open) return;

    (async () => {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/user/balance',
        method: Method.GET,
        params: { queryParams: {} },
        config: { isLoading: false },
      });

      if (res.successOrNot !== 'Y') {
        setMyUserKey('');
        return;
      }

      const raw = (res.data ?? {}) as any;
      const key = raw?.user_key ?? raw?.userKey ?? raw?.user_key_id ?? '';
      setMyUserKey(key ? String(key) : '');
    })();
  }, [open]);

  // 소켓 이벤트 구독 (잔액 변동 알림)
  useEffect(() => {
    if (!open) return;

    const unsubscribe = PartnerDashboardAddEventListeners((eventName, payload) => {
      if (eventName === 'balance_update') {
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

  const onSave = async () => {
    const amount = parseAmountText(amountText);
    if (amount <= 0) {
      toast.info('전환 금액을 입력해 주세요.');
      return false;
    }

    if (amount > rollingMoney) {
      toast.info('전환 가능 금액을 초과했습니다.');
      return false;
    }

    if (!myUserKey) {
      toast.error('사용자 정보를 가져오지 못했습니다.');
      return false;
    }

    const ok = await confirm('롤링금을 전환하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/al-trans-record',
      method: Method.PATCH,
      params: {
        bodyParams: {
          al_trans_type: 'CONVERT',
          user_key: myUserKey,
          target_user_key: myUserKey,
          al_trans_amount: amount,
          al_trans_before_amount: rollingMoney,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg || '롤링금 전환에 실패했습니다.');
      return false;
    }

    toast.success('롤링금 전환이 완료되었습니다.');

    reset({ amount: '0' });
    setAmountText('0');
    onClose();
    return true;
  };

  const searchComponent = (
    <form onSubmit={handleSubmit(onSave)}>
      <searchForm.Container>
        {/* 변환 가능 금액 */}
        <searchForm.Row>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 72 }}>
              전환 가능 금액
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {rollingMoney.toLocaleString('ko-KR')}원
            </Typography>
          </Box>
        </searchForm.Row>

        {/* 변환 금액 */}
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="amount"
            label="전환 금액"
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
      </searchForm.Container>
    </form>
  );

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <EtsButton
          type="blue"
          onClick={async () => {
            await onSave();
          }}
        >
          전환
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
        title="롤링금 전환"
        width={680}
      />
    </Fragment>
  );
};

export default PartnerRollingModal;
