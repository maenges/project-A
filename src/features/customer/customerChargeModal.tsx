import { Fragment, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { buttonForm, searchForm } from '@/assets/style';
import { FieldErrors, useForm } from 'react-hook-form';
import { EtsButton } from '@/components/EtsCommon';
import { useNotify } from '@hooks/useNotify';
import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent } from '@/components/EtsComponents';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';

export type CustomerChargeModalMode = 'PAYOUT' | 'RECOVERY';

export type CustomerChargeModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  mode: CustomerChargeModalMode;
  row?: any;
};

type FormValues = {
  user_id: string;
  user_nick: string;
  user_money: string;
  amount: string;
  withdraw_passcode: string;
};

const parseNumber = (value: unknown) => {
  const n = Number(String(value ?? '').replace(/[^0-9-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const formatNumber = (value: unknown) => {
  const n = parseNumber(value);
  return n.toLocaleString();
};

const CustomerChargeModal = ({ open, onClose, onSaved, mode, row }: CustomerChargeModalProps) => {
  const { toast } = useNotify();

  const [myBalance, setMyBalance] = useState<number>(0);
  const [myUserKey, setMyUserKey] = useState<string>('');

  const title = mode === 'PAYOUT' ? '지급' : '회수';
  const confirmLabel = mode === 'PAYOUT' ? '지급' : '회수';

  const userId = useMemo(() => String(row?.user_id ?? row?.userId ?? ''), [row]);
  const userNick = useMemo(() => String(row?.user_nick ?? row?.userNick ?? row?.nick ?? ''), [row]);
  const userMoney = useMemo(
    () => formatNumber(row?.user_money ?? row?.userMoney ?? row?.balance ?? 0),
    [row]
  );

  const availableLimit = useMemo(() => {
    if (mode === 'PAYOUT') return myBalance;
    return parseNumber(userMoney);
  }, [mode, myBalance, userMoney]);

  const availableLabel = useMemo(() => {
    if (mode === 'PAYOUT') return '충전 가능';
    return '회수 가능';
  }, [mode]);

  const { control, handleSubmit, setFocus, setValue, reset, getValues } = useForm<FormValues>({
    defaultValues: {
      user_id: '',
      user_nick: '',
      user_money: '',
      amount: '0',
      withdraw_passcode: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) return;
    reset({
      user_id: userId,
      user_nick: userNick,
      user_money: mode === 'PAYOUT' ? formatNumber(myBalance) : userMoney,
      amount: '0',
      withdraw_passcode: '',
    });
  }, [open, reset, userId, userNick, userMoney, mode, myBalance]);

  useEffect(() => {
    if (!open) return;

    (async () => {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/user/balance',
        method: Method.GET,
        params: { queryParams: {} },
        config: { isLoading: true },
      });

      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setMyBalance(0);
        setMyUserKey('');
        return;
      }

      const raw = (res.data ?? {}) as any;
      const key = raw?.user_key ?? raw?.userKey ?? raw?.user_key_id ?? '';
      setMyUserKey(key ? String(key) : '');

      const inferred =
        typeof raw === 'number'
          ? raw
          : (raw?.balance ?? raw?.user_balance ?? raw?.user_money ?? raw?.amount ?? 0);
      const numeric = Number(inferred);
      setMyBalance(Number.isFinite(numeric) ? numeric : 0);
    })();
  }, [open, toast]);

  const onInvalid = (errors: FieldErrors<FormValues>) => {
    const errorKeys = Object.keys(errors) as Array<keyof FormValues>;
    const firstErrorField = errorKeys[0];
    if (firstErrorField) setFocus(firstErrorField);
  };

  const adjustAmount = (delta: number) => {
    const current = parseNumber(getValues('amount'));
    const next = Math.max(0, current + delta);
    setValue('amount', String(next), { shouldValidate: true });
  };

  const onSave = async (values: FormValues) => {
    const amount = parseNumber(values.amount);
    if (amount <= 0) {
      toast.info('금액을 입력해 주세요.');
      setFocus('amount');
      return false;
    }

    if (!values.withdraw_passcode?.trim()) {
      toast.info('비밀번호를 입력해 주세요.');
      setFocus('withdraw_passcode');
      return false;
    }

    const targetUserKey = String(
      row?.user_key ?? row?.userKey ?? row?.target_user_key ?? row?.targetUserKey ?? ''
    );

    if (!myUserKey) {
      toast.error('로그인 사용자 키(user_key)를 가져오지 못했습니다.');
      return false;
    }
    if (!targetUserKey) {
      toast.error('대상 사용자 키(target_user_key)를 찾을 수 없습니다.');
      return false;
    }

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/al-trans-record',
      method: Method.PATCH,
      params: {
        bodyParams: {
          al_trans_type: mode,
          user_key: myUserKey,
          target_user_key: targetUserKey,
          al_trans_amount: amount,
          before_al_trans_amount: myBalance,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return false;
    }

    toast.success('처리되었습니다.');
    onClose();
    onSaved?.();
    return true;
  };

  const searchComponent = (
    <form onSubmit={handleSubmit(onSave, onInvalid)} autoComplete="off">
      {/*
                Chrome password manager may ignore autoComplete on certain forms.
                Adding hidden dummy username/password fields helps prevent the
                real field from being detected as a login password.
            */}
      <div
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <input type="text" name="username" autoComplete="username" tabIndex={-1} />
        <input type="password" name="password" autoComplete="new-password" tabIndex={-1} />
      </div>
      <searchForm.Container>
        <searchForm.Row>
          <EtsInputComponent control={control} name="user_id" label="회원ID" width={400} disabled />
        </searchForm.Row>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="user_nick"
            label="닉네임"
            width={400}
            disabled
          />
        </searchForm.Row>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="user_money"
            label={availableLabel}
            width={400}
            disabled
          />
        </searchForm.Row>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="amount"
            label={`${title} 금액`}
            placeholder="금액을 입력해 주세요."
            width={400}
            onlyNumber
            required
            rules={{
              validate: (v: unknown) => {
                const numericValue = parseNumber(v);
                if (numericValue <= 0) return '금액을 입력해 주세요.';
                if (availableLimit > 0 && numericValue > availableLimit) {
                  return `${availableLabel}을 초과했습니다.`;
                }
                return true;
              },
            }}
          />
        </searchForm.Row>
        <searchForm.Row>
          <Box sx={{ width: 400, display: 'flex', gap: 1, flexWrap: 'wrap', marginLeft: '94px' }}>
            <EtsButton type="grey" onClick={() => adjustAmount(1_000_000)}>
              +100만
            </EtsButton>
            <EtsButton type="grey" onClick={() => adjustAmount(500_000)}>
              +50만
            </EtsButton>
            <EtsButton type="grey" onClick={() => adjustAmount(100_000)}>
              +10만
            </EtsButton>
            <EtsButton type="grey" onClick={() => adjustAmount(50_000)}>
              +5만
            </EtsButton>
            <EtsButton type="grey" onClick={() => adjustAmount(10_000)}>
              +1만
            </EtsButton>
            <EtsButton
              type="outlined"
              onClick={() => setValue('amount', '0', { shouldValidate: true })}
            >
              정정
            </EtsButton>
          </Box>
        </searchForm.Row>

        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="withdraw_passcode"
            label="비밀번호"
            placeholder="비밀번호를 입력해 주세요."
            width={400}
            type="password"
            autoComplete="one-time-code"
            inputProps={{ autoComplete: 'one-time-code' }}
            required
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
            await handleSubmit(onSave, onInvalid)();
          }}
        >
          {confirmLabel}
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
        title={`알 ${title}`}
        width={680}
      />
    </Fragment>
  );
};

export default CustomerChargeModal;
