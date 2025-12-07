import { Fragment } from 'react';
import { searchForm } from '@/assets/style';
import { useForm } from 'react-hook-form';
import { EtsButton } from '@/components/EtsCommon';
import { PageModalTemplate } from '@/components/Teamplate';
import { EtsInputComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { AccountKeyOptions } from '@/models/common/CommonSelectCodes';

export type AccountNewModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  bankKey: string;
  account: string;
  won: string;
};

const AccountNewModal = ({ open, onClose }: AccountNewModalProps) => {
  const { control } = useForm<FormValues>({
    defaultValues: {
      bankKey: AccountKeyOptions.filter((o) => o.value !== 'all')[0].value,
      account: '',
      won: '',
    },
    mode: 'onChange',
  });

  const searchComponent = (
    <searchForm.Container>
      <searchForm.Row>
        <searchForm.Col>
          <EtsSelectComponent
            control={control}
            name="bankKey"
            label="은행명"
            options={AccountKeyOptions.filter((o) => o.value !== 'all')}
          />
          <EtsInputComponent
            control={control}
            name="account"
            label="계좌번호"
            placeholder="계좌번호를 입력해주세요."
          />
          <EtsInputComponent
            control={control}
            name="won"
            label="예금주"
            placeholder="예금주를 입력해주세요."
          />
          <EtsButton type="blue" onClick={async () => {}}>
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
