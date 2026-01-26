// import { useTheme } from '@mui/material';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { buttonForm, searchForm } from '@/assets/style';
import { useForm, FieldErrors } from 'react-hook-form';
// import dayjs, { Dayjs } from 'dayjs';
import { EtsButton } from '@/components/EtsCommon';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';

import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { AccountKeyOptions } from '@/models/common/CommonSelectCodes';

export type NoticeNewModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  groupKey: string;
};

type FormValues = {
  group_key: string;
  user_id: string;
  user_type: string;
  user_password: string;
  user_password_confirm: string;
  user_nick: string;
  user_phone: string;
  user_bank_key: string;
  user_bank_account: string;
  user_bank_won: string;
  user_rolling_c: number;
  user_rolling_s: number;
  user_bonus_s: number;
  user_bonus_c: number;
  user_permission: boolean;
};

type MaxCapsResponse = {
  user_max_rolling_c?: number | string;
  user_max_rolling_s?: number | string;
  user_max_bonus_c?: number | string;
  user_max_bonus_s?: number | string;
};

const clampNumber = (value: unknown, min: number, max: number) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
};

const toScaledInt = (value: unknown, scale = 100) => {
  if (value === null || value === undefined) return NaN;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return NaN;
    return Math.round(value * scale);
  }

  const s = String(value).trim();
  if (!s) return NaN;

  // 숫자/소수 문자열을 scale 정수로 변환 (부동소수 오차 회피)
  // 예: "4.55" -> 455 (scale=100)
  const negative = s.startsWith('-');
  const raw = negative ? s.slice(1) : s;
  const [intPartRaw, fracRaw = ''] = raw.split('.');
  const intPart = intPartRaw.replace(/[^0-9]/g, '') || '0';
  const fracDigits = String(scale).length - 1; // 100 -> 2
  const fracPart = fracRaw
    .replace(/[^0-9]/g, '')
    .slice(0, fracDigits)
    .padEnd(fracDigits, '0');
  const scaled = Number(intPart) * scale + Number(fracPart || '0');
  return negative ? -scaled : scaled;
};

const buildStepOptions = (
  maxValue: unknown,
  stepValue = 0.05,
  currentValue?: unknown
): { value: number; label: string }[] => {
  const scale = 100;
  const stepScaled = toScaledInt(stepValue, scale);
  const maxScaledRaw = toScaledInt(maxValue, scale);
  const currentScaledRaw = currentValue !== undefined ? toScaledInt(currentValue, scale) : NaN;
  const safeMaxScaled = Number.isFinite(maxScaledRaw) ? Math.max(0, maxScaledRaw) : 0;
  const safeCurrentScaled = Number.isFinite(currentScaledRaw) ? Math.max(0, currentScaledRaw) : 0;
  const effectiveMaxScaled = Math.max(safeMaxScaled, safeCurrentScaled);

  const values = new Set<number>();
  values.add(0);
  values.add(effectiveMaxScaled);
  if (Number.isFinite(safeCurrentScaled)) values.add(safeCurrentScaled);

  if (stepScaled > 0) {
    for (let v = 0; v <= effectiveMaxScaled; v += stepScaled) {
      values.add(v);
    }
  }

  return Array.from(values)
    .sort((a, b) => a - b)
    .map((scaled) => {
      const num = scaled / scale;
      return { value: Number(num.toFixed(2)), label: `${num.toFixed(2)}%` };
    });
};

const NoticeNewModal = ({ open, onClose, onSaved, groupKey }: NoticeNewModalProps) => {
  const { toast, confirm } = useNotify();
  const bankKeyOptions = AccountKeyOptions.filter((o) => o.value !== 'ALL');

  const [maxCaps, setMaxCaps] = useState<MaxCapsResponse | null>(null);

  const { control, handleSubmit, setFocus, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      group_key: groupKey ?? '',
      user_id: '',
      user_password: '',
      user_password_confirm: '',
      user_nick: '',
      user_phone: '',
      user_bank_key: bankKeyOptions[0]?.value ?? '',
      user_bank_account: '',
      user_bank_won: '',
      user_rolling_c: 0,
      user_rolling_s: 0,
      user_bonus_c: 0,
      user_bonus_s: 0,
      user_permission: true,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    setValue('group_key', groupKey ?? '', { shouldValidate: true });
  }, [groupKey, setValue]);

  useEffect(() => {
    if (!open) return;
    if (!groupKey) {
      setMaxCaps(null);
      return;
    }

    (async () => {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/user/maxCaps',
        method: Method.GET,
        params: {
          queryParams: { groupKey },
        },
        config: { isLoading: true },
      });

      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setMaxCaps(null);
        return;
      }

      setMaxCaps((res.data ?? {}) as MaxCapsResponse);
    })();
  }, [open, groupKey, toast]);

  const rollingSOptions = useMemo(
    () => buildStepOptions(maxCaps?.user_max_rolling_s, 0.05, 0),
    [maxCaps?.user_max_rolling_s]
  );
  const rollingCOptions = useMemo(
    () => buildStepOptions(maxCaps?.user_max_rolling_c, 0.05, 0),
    [maxCaps?.user_max_rolling_c]
  );
  const bonusSOptions = useMemo(
    () => buildStepOptions(maxCaps?.user_max_bonus_s, 0.05, 0),
    [maxCaps?.user_max_bonus_s]
  );
  const bonusCOptions = useMemo(
    () => buildStepOptions(maxCaps?.user_max_bonus_c, 0.05, 0),
    [maxCaps?.user_max_bonus_c]
  );

  useEffect(() => {
    if (!open) return;
    // maxCaps가 갱신되면 현재 선택값이 max를 넘는지 체크해서 클램프
    const maxRollingS = clampNumber(maxCaps?.user_max_rolling_s, 0, 9999);
    const maxRollingC = clampNumber(maxCaps?.user_max_rolling_c, 0, 9999);
    const maxBonusS = clampNumber(maxCaps?.user_max_bonus_s, 0, 9999);
    const maxBonusC = clampNumber(maxCaps?.user_max_bonus_c, 0, 9999);

    const values = getValues();
    setValue('user_rolling_s', clampNumber(values.user_rolling_s, 0, maxRollingS));
    setValue('user_rolling_c', clampNumber(values.user_rolling_c, 0, maxRollingC));
    setValue('user_bonus_s', clampNumber(values.user_bonus_s, 0, maxBonusS));
    setValue('user_bonus_c', clampNumber(values.user_bonus_c, 0, maxBonusC));
  }, [open, maxCaps, setValue, getValues]);

  /**
   * @description 폼 유효성 검사 실패 시 첫 번째 에러 필드로 포커스를 이동시키는 함수
   */
  const onInvalid = (errors: FieldErrors<FormValues>) => {
    const errorKeys = Object.keys(errors) as Array<keyof FormValues>;
    const firstErrorField = errorKeys[0];

    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  };

  const onSave = async (values: FormValues) => {
    if (values.user_password !== values.user_password_confirm) {
      toast.error('비밀번호가 일치하지 않습니다.');
      setFocus('user_password_confirm');
      return false;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const { user_password_confirm: _user_password_confirm, ...payload } = values;
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/user/partner',
      method: Method.POST,
      params: {
        bodyParams: payload,
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return false;
    }

    toast.success('저장되었습니다.');
    onClose();
    onSaved?.();
    return true;
  };

  const searchComponent = (
    <searchForm.Container>
      <searchForm.Row>
        <searchForm.Col>
          <EtsInputComponent
            control={control}
            name="user_id"
            label="접속 ID"
            placeholder="아이디를 입력해주세요."
            width={200}
            required={true}
            maxLength={10}
            rules={{
              maxLength: { value: 10, message: '최대 10자까지 입력 가능합니다.' },
              pattern: { value: /^[a-z0-9]+$/, message: '소문자/숫자만 입력해주세요.' },
            }}
            autoComplete="off"
          />
          <EtsInputComponent
            control={control}
            name="user_nick"
            label="조직명"
            placeholder="조직명을 입력해주세요."
            width={200}
            required={true}
            maxLength={10}
            rules={{
              maxLength: { value: 10, message: '최대 10자까지 입력 가능합니다.' },
            }}
            autoComplete="off"
          />
        </searchForm.Col>
      </searchForm.Row>
      <searchForm.Row>
        <searchForm.Col>
          <EtsInputComponent
            control={control}
            name="user_password"
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요."
            width={200}
            required={true}
            autoComplete="off"
          />
          <EtsInputComponent
            control={control}
            name="user_password_confirm"
            label="재확인"
            placeholder="비밀번호를 다시 입력해주세요."
            width={200}
            required={true}
            autoComplete="off"
          />
        </searchForm.Col>
      </searchForm.Row>
      <searchForm.Row>
        <searchForm.Col>
          <EtsSelectComponent
            control={control}
            name="user_rolling_s"
            label="롤링(슬)"
            width={200}
            options={rollingSOptions}
          />
          <EtsSelectComponent
            control={control}
            name="user_rolling_c"
            label="롤링 (카)"
            width={200}
            options={rollingCOptions}
          />
        </searchForm.Col>
      </searchForm.Row>
      <searchForm.Row>
        <searchForm.Col>
          <EtsSelectComponent
            control={control}
            name="user_bonus_s"
            label="루징 (슬)"
            width={200}
            options={bonusSOptions}
          />
          <EtsSelectComponent
            control={control}
            name="user_bonus_c"
            label="루징 (카)"
            width={200}
            options={bonusCOptions}
          />
        </searchForm.Col>
      </searchForm.Row>
      <searchForm.Row>
        <EtsInputComponent
          control={control}
          name="user_phone"
          label="휴대폰 번호"
          placeholder="휴대폰 번호를 입력해주세요."
          width={400}
          onlyNumber={true}
          maxLength={11}
          autoComplete="off"
        />
      </searchForm.Row>
      <searchForm.Row>
        <EtsSelectComponent
          control={control}
          name="user_bank_key"
          label="은행명"
          width={400}
          options={bankKeyOptions}
        />
      </searchForm.Row>
      <searchForm.Row>
        <EtsInputComponent
          control={control}
          name="user_bank_won"
          label="입금자명"
          placeholder="입금자명을 입력해주세요."
          width={400}
          autoComplete="off"
        />
      </searchForm.Row>
      <searchForm.Row>
        <EtsInputComponent
          control={control}
          name="user_bank_account"
          label="계좌번호"
          placeholder="계좌번호를 입력해주세요."
          width={400}
          autoComplete="off"
        />
      </searchForm.Row>
    </searchForm.Container>
  );
  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <>
          <EtsButton
            type="blue"
            onClick={async () => {
              await handleSubmit(onSave, onInvalid)();
            }}
          >
            저장
          </EtsButton>
        </>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <Fragment>
      <PageModalTemplate
        open={open}
        onClose={onClose || (() => {})}
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        title="파트너 신규 등록"
        width={800}
        // bodySize={900}
      />
    </Fragment>
  );
};
export default NoticeNewModal;
