import { Fragment, useEffect } from 'react';
import { searchForm } from '@/assets/style';
import { FieldErrors, useForm } from 'react-hook-form';
import { EtsButton } from '@/components/EtsCommon';
import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { AccountKeyOptions } from '@/models/common/CommonSelectCodes';
import { useNotify } from '@/hooks/useNotify';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@/utils/ApiUtil';

export type AccountNewModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

type FormValues = {
  user_bank_key: string;
  user_bank_account: string;
  user_bank_won: string;
};

const AccountNewModal = ({ open, onClose, onSaved }: AccountNewModalProps) => {
  const { toast, confirm } = useNotify();
  const { control, handleSubmit, setFocus, reset } = useForm<FormValues>({
    defaultValues: {
      user_bank_key: AccountKeyOptions.filter((o) => o.value !== 'ALL')[0].value,
      user_bank_account: '',
      user_bank_won: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    callApi({
      service: Service.POSTMAN,
      url: '/api/account-record/myInfo',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    })
      .then((res) => {
        if (cancelled) return;
        if (res.successOrNot !== 'Y') {
          toast.error(res.HeaderMsg);
          return;
        }

        const data = res.data ?? {};
        reset(
          {
            user_bank_key:
              data?.user_bank_key ?? AccountKeyOptions.filter((o) => o.value !== 'ALL')[0].value,
            user_bank_account: data?.user_bank_account ?? '',
            user_bank_won: data?.user_bank_won ?? '',
          },
          { keepDefaultValues: true }
        );
      })
      .catch(() => {
        // ignore
      });

    return () => {
      cancelled = true;
    };
  }, [open, reset, toast]);

  const onInvalid = (errors: FieldErrors<FormValues>) => {
    const errorKeys = Object.keys(errors) as Array<keyof FormValues>;
    const firstErrorField = errorKeys[0];
    if (firstErrorField) setFocus(firstErrorField);
  };

  const onSave = async (values: FormValues) => {
    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/account-record',
      method: Method.POST,
      params: {
        bodyParams: {
          user_bank_key: values.user_bank_key,
          user_bank_account: values.user_bank_account,
          user_bank_won: values.user_bank_won,
        },
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
          <EtsSelectComponent
            control={control}
            name="user_bank_key"
            label="은행명"
            options={AccountKeyOptions.filter((o) => o.value !== 'ALL')}
          />
          <EtsInputComponent
            control={control}
            name="user_bank_account"
            label="계좌번호"
            placeholder="계좌번호를 입력해주세요."
          />
          <EtsInputComponent
            control={control}
            name="user_bank_won"
            label="예금주"
            placeholder="예금주를 입력해주세요."
            required={true}
          />
          <EtsButton
            type="blue"
            onClick={async () => {
              await handleSubmit(onSave, onInvalid)();
            }}
          >
            저장
          </EtsButton>
        </searchForm.Col>
      </searchForm.Row>
    </searchForm.Container>
  );
  return (
    <Fragment>
      <PageModalTemplate
        open={open}
        onClose={onClose || (() => {})}
        searchComponent={searchComponent}
        title="계좌 변경"
        width={1150}
      />
    </Fragment>
  );
};
export default AccountNewModal;
