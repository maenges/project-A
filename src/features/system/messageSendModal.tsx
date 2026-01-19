import { useTheme } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { buttonForm, searchForm } from '@/assets/style';
import { FieldErrors, useForm } from 'react-hook-form';
// import dayjs, { Dayjs } from 'dayjs';
import { EtsButton } from '@/components/EtsCommon';
import CustomEditor from '@/components/Teamplate/CustomEditor';
import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { PartnerOptions } from '@/models/common/CommonSelectCodes';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@/utils/ApiUtil';
import { useNotify } from '@/hooks/useNotify';

export type MessageSendModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

type FormValues = {
  partner: string;
  title: string;
};

const MessageSendModal = ({ open, onClose, onSaved }: MessageSendModalProps) => {
  const theme = useTheme();
  const { toast, confirm } = useNotify();
  const [content, setContent] = useState('<p>내용입력</p>');
  const [checkedGroupKeys, setCheckedGroupKeys] = useState<string[]>([]);

  const { control, handleSubmit, setFocus, reset } = useForm<FormValues>({
    defaultValues: {
      partner: 'ALL',
      title: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) return;
    reset({ partner: 'ALL', title: '' });
    setContent('<p>내용입력</p>');
    setCheckedGroupKeys([]);
  }, [open, reset]);

  const onInvalid = (errors: FieldErrors<FormValues>) => {
    const errorKeys = Object.keys(errors) as Array<keyof FormValues>;
    const firstErrorField = errorKeys[0];
    if (firstErrorField) setFocus(firstErrorField);
  };

  const onSave = async (values: FormValues) => {
    if (!checkedGroupKeys.length) {
      toast.error('수신자(그룹)를 선택해주세요.');
      return false;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/message',
      method: Method.POST,
      params: {
        bodyParams: {
          groupKey: checkedGroupKeys,
          notice_title: values.title,
          notice_target_type: values.partner,
          notice_content: content,
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
          <EtsInputComponent
            control={control}
            name="title"
            label="제목"
            placeholder="제목을 입력해주세요."
            width={250}
            required={true}
          />
          <EtsSelectComponent
            control={control}
            name="partner"
            label="Partner"
            options={PartnerOptions}
          />
        </searchForm.Col>
      </searchForm.Row>
    </searchForm.Container>
  );
  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <>
          <EtsButton
            type="grey"
            onClick={() => {
              setContent('');
            }}
          >
            내용 초기화
          </EtsButton>
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
  const component = (
    <Fragment>
      <CustomEditor
        value={content}
        onChange={setContent}
        isDarkMode={theme.palette.mode === 'dark'}
      />
    </Fragment>
  );
  return (
    <Fragment>
      <PageModalTemplate
        open={open}
        onClose={onClose || (() => {})}
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        component={component}
        tree={true}
        leftTreeProps={{
          checkedIds: checkedGroupKeys,
          onCheckedIdsChange: setCheckedGroupKeys,
        }}
        width={1200}
        title="메세지 보내기"
      />
    </Fragment>
  );
};
export default MessageSendModal;
