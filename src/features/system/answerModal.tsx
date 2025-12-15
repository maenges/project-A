import { Fragment, useEffect, useMemo, useState } from 'react';
import { searchForm } from '@/assets/style';
import { useForm, useWatch } from 'react-hook-form';
import { EtsButton } from '@/components/EtsCommon';
import { PageModalTemplate } from '@/components/Teamplate';
import CustomEditor from '@/components/Teamplate/CustomEditor';
import { EtsInputComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { AccountKeyOptions } from '@/models/common/CommonSelectCodes';
import { useTheme } from '@mui/material/styles';

export type AnswerModalProps = {
  open: boolean;
  onClose: () => void;
  data?: {
    userId?: string;
    nickName?: string;
    title?: string;
    content?: string;
    macroList?: any[];
  };
};

type FormValues = {
  user_id: string;
  user_nick: string;
  notice_title: string;
  notice_content: string;
  macro_title: string;
};

const AnswerModal = ({ open, onClose, data }: AnswerModalProps) => {
  const theme = useTheme();
  const [content, setContent] = useState('');
  // const macroOptions = useMemo(
  //   () =>
  //     (data?.macroList || []).map((m: any) => ({
  //       label: m?.label ?? m?.macro_title ?? String(m),
  //       value: m?.value ?? m?.macro_key ?? String(m),
  //       content: m?.macro_content ?? '',
  //     })),
  //   [data]
  // );
  const macroOptions = useMemo(() => {
    const base = (data?.macroList || []).map((m: any) => ({
      label: m?.label ?? m?.macro_title ?? String(m),
      value: m?.value ?? m?.macro_key ?? String(m),
      content: m?.macro_content ?? '',
    }));
    return [{ value: 'CUSTOM', label: '직접 입력', content: '' }, ...base];
  }, [data]);
  const { control, reset } = useForm<FormValues>({
    defaultValues: {
      user_id: '',
      user_nick: '',
      notice_title: '',
      notice_content: '',
      macro_title: (macroOptions[0]?.value as string) ?? '',
    },
    mode: 'onChange',
  });

  const selectedMacroValue = useWatch({ control, name: 'macro_title' });

  useEffect(() => {
    if (!data) return;
    reset((prev) => ({
      ...prev,
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
          options={
            macroOptions.length > 0
              ? macroOptions
              : AccountKeyOptions.filter((o) => o.value !== 'all')
          }
          width={380}
        />
        <EtsButton type="blue" onClick={async () => {}}>
          저장
        </EtsButton>
      </searchForm.Row>
    </searchForm.Container>
  );
  const component = (
    <Fragment>
      <CustomEditor
        value={content}
        onChange={setContent}
        isDarkMode={theme.palette.mode === 'dark'}
        height={200}
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
      />
    </Fragment>
  );
};
export default AnswerModal;
