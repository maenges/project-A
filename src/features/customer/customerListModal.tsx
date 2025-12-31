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

const NoticeNewModal = ({ open, onClose, groupKey }: NoticeNewModalProps) => {
  const { toast } = useNotify();
  const bankKeyOptions = AccountKeyOptions.filter((o) => o.value !== 'all');

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

    const { user_password_confirm: _user_password_confirm, ...payload } = values;
    console.log(payload);
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
          />
        </searchForm.Row>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="user_bank_account"
            label="계좌번호"
            placeholder="계좌번호를 입력해주세요."
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
