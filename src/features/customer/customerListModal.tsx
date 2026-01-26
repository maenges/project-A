// import { useTheme } from '@mui/material';
import { Fragment, useEffect } from 'react';
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
};

const NoticeNewModal = ({ open, onClose, onSaved, groupKey }: NoticeNewModalProps) => {
  const { toast, confirm } = useNotify();
  const bankKeyOptions = AccountKeyOptions.filter((o) => o.value !== 'ALL');

  const { control, handleSubmit, setFocus, setValue } = useForm<FormValues>({
    defaultValues: {
      group_key: groupKey ?? '',
      user_id: '',
      user_type: 'CU',
      user_password: '',
      user_password_confirm: '',
      user_nick: '',
      user_phone: '',
      user_bank_key: bankKeyOptions[0]?.value ?? '',
      user_bank_account: '',
      user_bank_won: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    setValue('group_key', groupKey ?? '', { shouldValidate: true });
  }, [groupKey, setValue]);

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

  // 검색 핸들러
  const onSearch = async () => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/customer',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        return;
      }
    });
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
      url: '/api/user',
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
    <form onSubmit={handleSubmit(onSearch, onInvalid)}>
      <searchForm.Container>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="user_id"
            label="접속 ID"
            placeholder="아이디를 입력해주세요."
            width={400}
            required={true}
            maxLength={10}
            rules={{
              maxLength: { value: 10, message: '최대 10자까지 입력 가능합니다.' },
              pattern: { value: /^[a-z0-9]+$/, message: '소문자/숫자만 입력해주세요.' },
            }}
            autoComplete="off"
          />
        </searchForm.Row>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="user_nick"
            label="닉네임"
            placeholder="닉네임을 입력해주세요."
            width={400}
            required={true}
            maxLength={10}
            rules={{
              maxLength: { value: 10, message: '최대 10자까지 입력 가능합니다.' },
            }}
            autoComplete="off"
          />
        </searchForm.Row>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="user_password"
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요."
            width={400}
            required={true}
            inputProps={{ style: { WebkitTextSecurity: 'disc' } }}
            autoComplete="off"
          />
        </searchForm.Row>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="user_password_confirm"
            label="재확인"
            placeholder="비밀번호를 다시 입력해주세요."
            width={400}
            required={true}
            inputProps={{ style: { WebkitTextSecurity: 'disc' } }}
            autoComplete="off"
          />
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
            autoComplete="off"
          />
        </searchForm.Row>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="user_bank_won"
            label="입금자명"
            placeholder="입금자명을 입력해주세요."
            autoComplete="off"
            width={400}
          />
        </searchForm.Row>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="user_bank_account"
            label="계좌번호"
            placeholder="계좌번호를 입력해주세요."
            autoComplete="off"
            width={400}
          />
        </searchForm.Row>
      </searchForm.Container>
    </form>
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
        title="회원 신규 등록"
        width={680}
        // bodySize={900}
      />
    </Fragment>
  );
};
export default NoticeNewModal;
