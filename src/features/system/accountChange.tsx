import React from 'react';

import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Box } from '@mui/material';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { MemberTypeOptions, AccountKeyOptions } from '@/models/common/CommonSelectCodes';
import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';
import AccountNewModal from './accountNewModal';

import { EtsButton } from '@/components/EtsCommon';
import { EtsSelectComponent, EtsDatePickerComponent } from '@/components/EtsComponents';

type AccountRecord = {
  no: number;
  account_key: string;
  before_key: string;
  before_account: string;
  before_won: string;
  new_key: string;
  new_account: string;
  new_won: string;
  updated: string;
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  userType: string;
};

const AccountChange: React.FC = () => {
  const gridRef = useRef<EtsGridRef<AccountRecord>>(null);
  const { toast } = useNotify();
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());
  const [rowData, setRowData] = useState<AccountRecord[]>([]);
  const [newModalOpen, setNewModalOpen] = useState(false);

  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.IdPreset({
      field: 'no',
      headerName: 'No',
      width: 60,
    }),
    EtsColumnPreset.TextPreset({
      field: 'account_key',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_id',
      headerName: '회원 ID',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_nick',
      headerName: '회원 닉네임',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_type',
      headerName: '회원 유형',
      width: 100,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'before_key',
      headerName: '이전-은행명',
      width: 100,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'before_account',
      headerName: '이전-계좌번호',
      width: 150,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'before_won',
      headerName: '이전-예금주명',
      width: 100,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'new_key',
      headerName: '은행명',
      width: 100,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'new_account',
      headerName: '계좌번호',
      width: 150,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'new_won',
      headerName: '예금주명',
      width: 100,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'updated',
      headerName: '변경일시',
      width: 200,
    }),
  ];

  useEffect(() => {
    handleSubmit(onSearch)();
  }, []);

  const { control, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: {
      startDate: dayjs().subtract(7, 'day').format('YYYYMMDD'),
      endDate: dayjs().format('YYYYMMDD'),
      userType: 'ALL',
    },
    mode: 'onChange',
  });

  const onSearch: SubmitHandler<FormValues> = () => {
    const { startDate, endDate, userType } = getValues();

    callApi({
      service: Service.POSTMAN,
      url: '/api/account-record',
      method: Method.GET,
      params: {
        queryParams: {
          startDate: startDate,
          endDate: endDate,
          type: userType === 'ALL' ? '' : userType,
        },
      },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      const keyLabelMap = new Map(AccountKeyOptions.map((opt) => [opt.value, opt.label]));
      const memberTypeLabelMap = new Map(MemberTypeOptions.map((opt) => [opt.value, opt.label]));
      const mapped = (res.data || []).map((row: any) => ({
        ...row,
        user_type: memberTypeLabelMap.get(row?.user_type) ?? row?.user_type ?? '',
        before_key: keyLabelMap.get(row?.before_key) ?? row?.before_key ?? '',
        new_key: keyLabelMap.get(row?.new_key) ?? row?.new_key ?? '',
      }));

      setRowData(mapped);
    });
  };

  const newModal = newModalOpen && (
    <AccountNewModal
      open={newModalOpen}
      onClose={() => {
        setNewModalOpen(false);
      }}
      onSaved={() => {
        handleSubmit(onSearch)();
      }}
    />
  );

  const searchComponent = (
    <form onSubmit={handleSubmit(onSearch)}>
      <searchForm.Container>
        <searchForm.Row>
          <EtsDatePickerComponent
            control={control}
            startDate={startRangeDate}
            endDate={endRangeDate}
            setStartDate={setStartRangeDate}
            setEndDate={setEndRangeDate}
          />
          <EtsSelectComponent
            control={control}
            name="userType"
            label="회원 유형"
            options={MemberTypeOptions}
          />
          <Box sx={{ marginLeft: 'auto' }}>
            <EtsButton
              type="blue"
              onClick={() => {
                handleSubmit(onSearch)();
              }}
            >
              검색
            </EtsButton>
          </Box>
        </searchForm.Row>
      </searchForm.Container>
    </form>
  );

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <EtsButton
          type="grey"
          onClick={() => {
            setNewModalOpen(true);
          }}
        >
          내계좌 변경
        </EtsButton>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <>
      {newModal}
      <PageTemplate
        title="계좌 변경 목록"
        gridRef={gridRef}
        columnDefs={columnDefs}
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        rowData={rowData}
      />
    </>
  );
};

export default AccountChange;
