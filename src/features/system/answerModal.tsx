import { Fragment, useEffect, useMemo, useState } from 'react';
import { searchForm } from '@/assets/style';
import { useForm, useWatch } from 'react-hook-form';
import { EtsButton } from '@/components/EtsCommon';
import { PageModalTemplate } from '@/components/Teamplate';
import CustomEditor from '@/components/Teamplate/CustomEditor';
import { EtsInputComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { useTheme } from '@mui/material/styles';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';

export type AnswerModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  data?: {
    noticeKey?: string;
    userId?: string;
    nickName?: string;
    title?: string;
    content?: string;
    macroList?: any[];
  };
};

type FormValues = {
  noticeKey: string;
  user_id: string;
  user_nick: string;
  notice_title: string;
  notice_content: string;
  macro_title: string;
};

const AnswerModal = ({ open, onClose, onSaved, data }: AnswerModalProps) => {
  const theme = useTheme();
  const [content, setContent] = useState('');
  const { toast } = useNotify();
  const macroOptions = useMemo(() => {
    const base = (data?.macroList || []).map((m: any) => ({
      label: m?.label ?? m?.macro_title ?? String(m),
      value: m?.value ?? m?.macro_key ?? String(m),
      content: m?.macro_content ?? '',
    }));
    return [{ value: 'CUSTOM', label: '직접 입력', content: '' }, ...base];
  }, [data]);
  const { control, reset, getValues } = useForm<FormValues>({
    defaultValues: {
      noticeKey: '',
      user_id: '',
      user_nick: '',
      notice_title: '',
      notice_content: '',
      macro_title: (macroOptions[0]?.value as string) ?? '',
    },
    mode: 'onChange',
  });

  const selectedMacroValue = useWatch({ control, name: 'macro_title' });

  const isEditorReadOnly = selectedMacroValue !== 'CUSTOM';

  useEffect(() => {
    if (!data) return;
    reset((prev) => ({
      ...prev,
      noticeKey: data.noticeKey || '',
      user_id: data.userId || '',
      user_nick: data.nickName || '',
      notice_title: data.title || '',
      notice_content: data.content || '',
      macro_title: (macroOptions[0]?.value as string) ?? '',
    }));
    const initialMacroContent = macroOptions[0]?.content ?? '';
    setContent(initialMacroContent || '');
  }, [data]);

  useEffect(() => {
    if (!selectedMacroValue) return;
    const found = macroOptions.find((opt) => opt.value === selectedMacroValue);
    if (found) {
      setContent(found.content || '');
    }
  }, [selectedMacroValue, macroOptions]);

  const searchComponent = (
    <searchForm.Container>
      <searchForm.Row>
        <searchForm.Col>
          <EtsInputComponent control={control} name="user_id" label="회원 ID" readOnly />
          <EtsInputComponent control={control} name="user_nick" label="닉네임" readOnly />
        </searchForm.Col>
      </searchForm.Row>
      <searchForm.Row>
        <searchForm.Col>
          <EtsInputComponent
            control={control}
            name="notice_title"
            label="제목"
            width={480}
            readOnly
          />
        </searchForm.Col>
      </searchForm.Row>
      <searchForm.Row>
        <searchForm.Col>
          <EtsInputComponent
            control={control}
            name="notice_content"
            label="내용"
            width={480}
            readOnly
          />
        </searchForm.Col>
      </searchForm.Row>
      <searchForm.Row>
        <EtsSelectComponent
          control={control}
          name="macro_title"
          label="매크로"
          options={macroOptions}
          width={380}
        />
        <EtsButton
          type="blue"
          onClick={async () => {
            const notice_key = data?.noticeKey ?? getValues('noticeKey');
            if (!notice_key) {
              toast.error('notice_key가 없습니다.');
              return;
            }

            const isCustom = selectedMacroValue === 'CUSTOM';
            const selectedMacro = macroOptions.find((opt) => opt.value === selectedMacroValue);
            const macro_key = isCustom ? '' : String(selectedMacroValue ?? '');
            const macro_title = isCustom ? '' : (selectedMacro?.label ?? '');
            const macro_content = content ?? '';

            const res = await callApi({
              service: Service.POSTMAN,
              url: '/api/answer',
              method: Method.POST,
              params: {
                bodyParams: {
                  notice_key,
                  macro_key,
                  macro_title,
                  macro_content,
                },
              },
              config: { isLoading: true },
            });
            if (res.successOrNot !== 'Y') {
              toast.error(res.HeaderMsg);
              return;
            }

            toast.success('저장되었습니다.');
            onSaved?.();
            onClose();
          }}
        >
          저장
        </EtsButton>
      </searchForm.Row>
    </searchForm.Container>
  );
  const component = (
    <Fragment>
      <CustomEditor
        value={content}
        onChange={isEditorReadOnly ? undefined : setContent}
        isDarkMode={theme.palette.mode === 'dark'}
        height={350}
        readOnly={isEditorReadOnly}
      />
    </Fragment>
  );
  return (
    <Fragment>
      <PageModalTemplate
        open={open}
        onClose={onClose || (() => {})}
        searchComponent={searchComponent}
        component={component}
        title="답변 등록"
        width={800}
        bodySize={900}
      />
    </Fragment>
  );
};
export default AnswerModal;
