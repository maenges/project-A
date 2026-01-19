import React from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Box } from '@mui/material';
import { searchForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { MemberTypeOptions, transactionStatusOptions } from '@models/common/CommonSelectCodes';
import { callApi, Method } from '@utils/ApiUtil';
import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';
import { EtsButton } from '@/components/EtsCommon';
import {
  EtsInputComponent,
  EtsDatePickerComponent,
  EtsSelectComponent,
} from '@/components/EtsComponents';

type Customer = {
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  transType: string;
  userId: string;
};

const AlTransfer: React.FC = () => {
  const gridRef = useRef<EtsGridRef<Customer>>(null);
  const { toast } = useNotify();
  const [rowData, setRowData] = useState<Customer[]>([]);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string>('');
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());

  const getLabelByValue = (
    options: Array<{ value: any; label: string }>,
    value: unknown
  ): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);

    const exact = options.find((o) => String(o.value) === stringValue);
    if (exact) return exact.label;

    const lower = stringValue.toLowerCase();
    const caseInsensitive = options.find((o) => String(o.value).toLowerCase() === lower);
    return caseInsensitive?.label ?? stringValue;
  };

  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.IdPreset({
      field: 'no',
      headerName: 'No',
      width: 60,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_key',
      headerName: '보낸 유저 키',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'target_user_key',
      headerName: '받은 유저 키',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'al_trans_type',
      headerName: '알 이동 유형',
      width: 100,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_type',
      headerName: '회원 유형',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_id',
      headerName: '지급(회수) 회원',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'target_user_type',
      headerName: '대상 회원 유형',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'target_user_id',
      headerName: '대상 회원',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'al_trans_amount',
      headerName: '알 이동 금액',
      width: 150,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '등록일시',
      width: 200,
    }),
  ];

  const { control, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: {
      startDate: dayjs().subtract(7, 'day').format('YYYYMMDD'),
      endDate: dayjs().format('YYYYMMDD'),
      transType: transactionStatusOptions[0]?.value ?? '',
      userId: '',
    },
    mode: 'onChange',
  });

  const onSearch = () => {
    if (!selectedGroupKey) {
      toast.info('좌측 트리를 선택해 주세요.');
      return;
    }
    fetchCustomerListByGroupKey(selectedGroupKey);
  };

  const fetchCustomerListByGroupKey = (groupKey: string) => {
    const { startDate, endDate, transType, userId } = getValues();
    callApi({
      service: Service.POSTMAN,
      url: '/api/al-trans-record/alTransInfo',
      method: Method.GET,
      params: {
        queryParams: {
          groupKey,
          startDate,
          endDate,
          transType: transType === 'ALL' ? '' : transType,
          userId,
        },
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowData([]);
        return;
      }

      const data = (res.data ?? []) as Customer[];
      const mapped = data.map((row) => ({
        ...row,
        al_trans_type_code: row?.al_trans_type,
        user_type_code: row?.user_type,
        target_user_type_code: row?.target_user_type,
        al_trans_type: getLabelByValue(transactionStatusOptions, row?.al_trans_type),
        user_type: getLabelByValue(MemberTypeOptions, row?.user_type),
        target_user_type: getLabelByValue(MemberTypeOptions, row?.target_user_type),
      }));

      setRowData(mapped);
    });
  };

  const handleTreeSelect = (id: string) => {
    setSelectedGroupKey(id);
    fetchCustomerListByGroupKey(id);
  };

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
            name="transType"
            label="알 이동 유형"
            options={transactionStatusOptions}
          />
          <EtsInputComponent
            control={control}
            name="userId"
            label="회원 ID"
            placeholder="아이디를 입력해 주세요."
            sx={{ width: 250 }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key !== 'Enter') return;
              if ((e.nativeEvent as any)?.isComposing) return;
              e.preventDefault();
              handleSubmit(onSearch)();
            }}
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

  return (
    <>
      <PageTemplate
        title="알 이동"
        columnDefs={columnDefs}
        rowData={rowData}
        searchComponent={searchComponent}
        gridRef={gridRef}
        alwaysShowHorizontalScroll={true}
        defaultColDef={{
          autoHeaderHeight: false,
          wrapHeaderText: false,
        }}
        tree={true}
        leftTreeProps={{
          onSelect: handleTreeSelect,
        }}
        rowSelection="single"
      />
    </>
  );
};

export default AlTransfer;
