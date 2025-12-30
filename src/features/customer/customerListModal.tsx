// import { useTheme } from '@mui/material';
import { Fragment } from 'react';
import { buttonForm, searchForm } from '@/assets/style';
import { useForm } from 'react-hook-form';
// import dayjs, { Dayjs } from 'dayjs';
import { EtsButton } from '@/components/EtsCommon';
// import CustomEditor from '@/components/Teamplate/CustomEditor';
import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent } from '@/components/EtsComponents';
// import { rollingCasinoOptions } from '@/models/common/CommonSelectCodes';

export type NoticeNewModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  userId: string;
  nickName: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  rollingCasino: number;
  rollingSlot: number;
  bonusCasino: number;
  bonusSlot: number;
  userBankKey: string;
  bankAccount: string;
  bankWon: string;
};

const NoticeNewModal = ({ open, onClose }: NoticeNewModalProps) => {
  //   const theme = useTheme();
  // const [isEditable, setIsEditable] = useState(false);
  // const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  // const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());

  const { control } = useForm<FormValues>({
    defaultValues: {
      userId: '',
      nickName: '',
      password: '',
      passwordConfirm: '',
      phone: '',
      rollingCasino: 0,
      rollingSlot: 0,
      bonusCasino: 0,
      bonusSlot: 0,
      userBankKey: '',
      bankAccount: '',
      bankWon: '',
    },
    mode: 'onChange',
  });

  {
    /* <EtsSelectComponent
          control={control}
          name="nickName"
          label="닉네임"
          placeholder="닉네임을 입력해주세요."
          options={PartnerOptions}
          width={400}
        /> */
  }

  const searchComponent = (
    // <searchForm.Container>
    //   <searchForm.Row>
    //     <EtsInputComponent
    //       control={control}
    //       name="userId"
    //       label="접속 ID"
    //       placeholder="아이디를 입력해주세요."
    //       width={400}
    //     />
    //   </searchForm.Row>
    //   <searchForm.Row>
    //     <EtsInputComponent
    //       control={control}
    //       name="nickName"
    //       label="닉네임"
    //       placeholder="닉네임을 입력해주세요."
    //       width={400}
    //     />
    //   </searchForm.Row>
    //   <searchForm.Row>
    //     <EtsInputComponent
    //       control={control}
    //       name="password"
    //       label="비밀번호"
    //       placeholder="비밀번호를 입력해주세요."
    //       width={400}
    //     />
    //   </searchForm.Row>
    //   <searchForm.Row>
    //     <EtsInputComponent
    //       control={control}
    //       name="passwordConfirm"
    //       label="재확인"
    //       placeholder="비밀번호를 다시 입력해주세요."
    //       width={400}
    //     />
    //   </searchForm.Row>
    //   <searchForm.Row>
    //     <EtsInputComponent
    //       control={control}
    //       name="phone"
    //       label="휴대폰 번호"
    //       placeholder="휴대폰 번호를 입력해주세요."
    //       width={400}
    //     />
    //   </searchForm.Row>
    //   <searchForm.Row>
    //     <EtsSelectComponent
    //       control={control}
    //       name="rollingCasino"
    //       label="롤링 수수료(카지노)"
    //       width={400}
    //       options={rollingCasinoOptions}
    //     />
    //   </searchForm.Row>
    //   <searchForm.Row>
    //     <EtsSelectComponent
    //       control={control}
    //       name="rollingSlot"
    //       label="롤링 수수료(슬롯)"
    //       width={400}
    //       options={rollingCasinoOptions}
    //     />
    //   </searchForm.Row>
    // </searchForm.Container>
    <searchForm.Container>
      <searchForm.Row>
        <EtsInputComponent
          control={control}
          name="userId"
          label="회원 ID"
          placeholder="아이디를 입력해주세요."
          width={400}
        />
      </searchForm.Row>
    </searchForm.Container>
  );
  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <>
          <EtsButton type="blue" onClick={async () => {}}>
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
        title="공지사항 등록"
        width={800}
        // bodySize={900}
      />
    </Fragment>
  );
};
export default NoticeNewModal;
