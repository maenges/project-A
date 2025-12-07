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

export type NoticeNewModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  startDate: string;
  endDate: string;
  partner: string;
  title: string;
};

// const PartnerOptions = [
//   { value: 'all', label: '전체' },
//   { value: 'PARTNER', label: '파트너' },
//   { value: 'CUSTOMER', label: '고객' },
// ];

const NoticeNewModal = ({ open, onClose }: NoticeNewModalProps) => {
  const theme = useTheme();
  const [content, setContent] = useState('<p>내용입력</p>');
  // const [isEditable, setIsEditable] = useState(false);
  // const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  // const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());

  const { control } = useForm<FormValues>({
    defaultValues: {
      // startDate: dayjs().startOf('month').format('YYYYMMDD'),
      // endDate: endRangeDate?.format('YYYYMMDD'),
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
          />
        </searchForm.Col>
        <searchForm.Col>
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
      {/* <Typography variant="subtitle2" sx={{ mb: 1 }}>
          내용
        </Typography> */}
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
        title="공지사항 등록"
      />
    </Fragment>
  );
};
export default NoticeNewModal;
