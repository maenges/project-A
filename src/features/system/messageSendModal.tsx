import { useTheme } from '@mui/material';
import { Fragment, useState } from 'react';
import { buttonForm, searchForm } from '@/assets/style';
import { useForm } from 'react-hook-form';
// import dayjs, { Dayjs } from 'dayjs';
import { EtsButton } from '@/components/EtsCommon';
import CustomEditor from '@/components/Teamplate/CustomEditor';
import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { PartnerOptions } from '@/models/common/CommonSelectCodes';

export type MessageSendModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  startDate: string;
  endDate: string;
  partner: string;
  title: string;
};

const MessageSendModal = ({ open, onClose }: MessageSendModalProps) => {
  const theme = useTheme();
  const [content, setContent] = useState('<p>내용입력</p>');

  const { control } = useForm<FormValues>({
    defaultValues: {
      partner: 'all',
      title: '',
    },
    mode: 'onChange',
  });

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
          <EtsButton type="blue" onClick={async () => {}}>
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
        width={1200}
        title="메세지 보내기"
      />
    </Fragment>
  );
};
export default MessageSendModal;
