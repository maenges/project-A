import { useTheme } from '@mui/material';
import { Fragment, useEffect, useState, type ReactElement } from 'react';
import { buttonForm, searchForm } from '@/assets/style';
import { useForm, FieldErrors } from 'react-hook-form';
// import dayjs, { Dayjs } from 'dayjs';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
import { EtsButton } from '@/components/EtsCommon';
import CustomEditor from '@/components/Teamplate/CustomEditor';
import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { PartnerOptions } from '@/models/common/CommonSelectCodes';

type FormValues = {
  notice_target_type: string;
  notice_title: string;
};

export type NoticeNewModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  mode?: 'create' | 'edit';
  noticeKey?: number;
  initialValues?: Partial<FormValues>;
  initialContent?: string;
};

const NoticeNewModal = ({
  open,
  onClose,
  onSaved,
  mode = 'create',
  noticeKey,
  initialValues,
  initialContent,
}: NoticeNewModalProps): ReactElement => {
  const theme = useTheme();
  const { toast } = useNotify();
  const [content, setContent] = useState('<p>내용입력</p>');

  const { control, handleSubmit, setFocus, reset } = useForm<FormValues>({
    defaultValues: {
      notice_target_type: initialValues?.notice_target_type ?? 'ALL',
      notice_title: initialValues?.notice_title ?? '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) return;
    reset({
      notice_target_type: initialValues?.notice_target_type ?? 'ALL',
      notice_title: initialValues?.notice_title ?? '',
    });
    setContent(initialContent ?? '<p>내용입력</p>');
  }, [open, reset, initialValues?.notice_target_type, initialValues?.notice_title, initialContent]);

  const onInvalid = (errors: FieldErrors<FormValues>) => {
    const errorKeys = Object.keys(errors) as Array<keyof FormValues>;
    const firstErrorField = errorKeys[0];

    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  };

  const onSave = async (values: FormValues) => {
    const isEditMode = mode === 'edit';
    if (isEditMode && (noticeKey === undefined || noticeKey === null)) {
      toast.error('수정할 공지 ID가 없습니다.');
      return false;
    }

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/notice',
      method: isEditMode ? Method.PATCH : Method.POST,
      params: {
        bodyParams: {
          ...(isEditMode ? { notice_key: noticeKey } : {}),
          ...values,
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
            name="notice_title"
            label="제목"
            placeholder="제목을 입력해주세요."
            width={250}
            required={true}
          />
          <EtsSelectComponent
            control={control}
            name="notice_target_type"
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
        title={mode === 'edit' ? '공지사항 수정' : '공지사항 등록'}
      />
    </Fragment>
  );
};
export default NoticeNewModal;
