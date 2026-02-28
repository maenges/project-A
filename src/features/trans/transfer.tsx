import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Box } from '@mui/material';
import { searchForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { transStatusOptions } from '@models/common/CommonSelectCodes';
import { callApi, Method } from '@utils/ApiUtil';
import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';
import { EtsButton } from '@/components/EtsCommon';
import EtsCheckButton2 from '@/components/EtsCommon/EtsCheckButton2';
import {
  EtsInputComponent,
  EtsDatePickerComponent,
  EtsSelectComponent,
} from '@/components/EtsComponents';
import { useAdminDashboardStore } from '@/store/adminDashboard';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTransType = searchParams.get('transType') || '';
  const gridRef = useRef<EtsGridRef<Customer>>(null);
  const { toast, confirm } = useNotify();
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

  const updateTransPermission = async (row: Customer, permission: boolean) => {
    const ok = await confirm(permission ? '승인 처리하시겠습니까?' : '거절 처리하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/trans-record/transPermission',
      method: Method.PATCH,
      params: {
        bodyParams: {
          trans_permission: permission,
          trans_key: row?.trans_key,
          user_key: row?.user_key,
          trans_type: row?.trans_type_original || row?.trans_type,
          trans_amount: row?.trans_amount,
          trans_before_amount: row?.trans_before_amount,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }
    toast.success(permission ? '승인 처리되었습니다.' : '거절 처리되었습니다.');

    // 승인 또는 거절 시 MainHeader 건수 차감
    const transType = row?.trans_type_original || row?.trans_type;
    if (transType === 'RECHARGE') {
      // 충전 건수 차감
      useAdminDashboardStore.getState().decrementDepositCount();
    } else if (transType === 'EXCHANGE') {
      // 환전 건수 차감
      useAdminDashboardStore.getState().decrementWithdrawCount();
    }

    if (selectedGroupKey) fetchCustomerListByGroupKey(selectedGroupKey);
  };

  const getStoreNameByRow = (row: any) => {
    const raw = row?.group_name;
    if (!Array.isArray(raw)) return '';
    const match = raw.find((x: any) => String(x?.group_key) === String(row?.group_key));
    const store = match ?? raw.find((x: any) => x?.level === 1) ?? raw[0];
    return store?.group_name ?? store?.groupName ?? '';
  };

  const getGroupNameOptionsByRow = (row: any) => {
    const raw = row?.group_name;
    if (!Array.isArray(raw)) return [];

    const toLevel = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : -1;
    };

    // level: 1(하위) ~ 4(상위) => 역순(상위 -> 하위)
    const sorted = [...raw].sort((a: any, b: any) => toLevel(b?.level) - toLevel(a?.level));
    return sorted
      .map((x: any) => ({
        name: x?.group_name ?? x?.groupName,
        level: toLevel(x?.level),
      }))
      .filter((x: any) => Boolean(x?.name))
      .map((x: any) => {
        const name = String(x.name);
        const level = typeof x.level === 'number' ? x.level : undefined;
        const prefix = level ? `[L${level}]` : '';
        return {
          value: name,
          label: prefix ? `${prefix} ${name}` : name,
        };
      });
  };

  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.IdPreset({
      field: 'no',
      headerName: 'No',
      width: 30,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_key',
      headerName: '유저 키',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'trans_type',
      headerName: '거래 유형',
      width: 100,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_id',
      headerName: '회원 ID',
      width: 150,
    }),
    EtsColumnPreset.SelectPreset({
      field: 'group_name',
      headerName: '소속',
      width: 100,
      editable: true,
      valueGetter: (p: any) => getStoreNameByRow(p?.data),
      valueSetter: () => {
        // 보기용 콤보: 선택해도 rowData(group_name 배열)는 변경하지 않음
        return false;
      },
      cellEditorParams: (p: any) => ({
        ...p,
        options: getGroupNameOptionsByRow(p?.data),
      }),
      context: {
        // renderer는 value만 보여주면 되므로 빈 options
        options: [],
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'trans_amount',
      headerName: '충전(환전) 금액',
      width: 100,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'trans_before_amount',
      headerName: '이전 금액',
      width: 100,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'trans_bank_won',
      headerName: '예금주',
      width: 60,
    }),
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '요청일시',
      width: 160,
    }),
    EtsColumnPreset.TextPreset({
      field: 'updated',
      headerName: '처리일시',
      width: 160,
    }),
    {
      headerName: '처리현황',
      colId: 'trans_permission',
      width: 160,
      suppressMovable: true,
      cellRenderer: (rendererParams: any) => {
        const raw = rendererParams?.data?.trans_permission;
        const value =
          raw === true || raw === false
            ? raw
            : typeof raw === 'string'
              ? raw.toLowerCase() === 'true'
                ? true
                : raw.toLowerCase() === 'false'
                  ? false
                  : undefined
              : undefined;

        if (value === true) {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                fontWeight: 700,
                color: 'success.main',
              }}
            >
              승인
            </Box>
          );
        }

        if (value === false) {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                fontWeight: 700,
                color: 'error.main',
              }}
            >
              거절
            </Box>
          );
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <EtsCheckButton2
              label="승인"
              onClick={() => {
                updateTransPermission(rendererParams?.data ?? {}, true);
              }}
            />
            <EtsCheckButton2
              label="거절"
              onClick={() => {
                updateTransPermission(rendererParams?.data ?? {}, false);
              }}
            />
          </Box>
        );
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'trans_count',
      headerName: '요청 횟수',
      width: 60,
    }),
    EtsColumnPreset.TextPreset({
      field: 'trans_total',
      headerName: '요청 합계',
      width: 100,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
  ];

  const validTransTypes = ['ALL', 'RECHARGE', 'EXCHANGE'];
  const initialTransType = validTransTypes.includes(urlTransType)
    ? urlTransType
    : (transStatusOptions[0]?.value ?? '');

  const { control, handleSubmit, getValues, setValue } = useForm<FormValues>({
    defaultValues: {
      startDate: dayjs().subtract(7, 'day').format('YYYYMMDD'),
      endDate: dayjs().format('YYYYMMDD'),
      transType: initialTransType,
      userId: '',
    },
    mode: 'onChange',
  });

  // URL transType 파라미터 변경 시 폼 값 동기화
  useEffect(() => {
    if (urlTransType && validTransTypes.includes(urlTransType)) {
      setValue('transType', urlTransType);
      // URL 파라미터 소비 후 제거 (뒤로가기 시 재적용 방지)
      searchParams.delete('transType');
      setSearchParams(searchParams, { replace: true });
      // 트리 선택이 되어 있으면 자동 조회
      if (selectedGroupKey) {
        setTimeout(() => fetchCustomerListByGroupKey(selectedGroupKey), 0);
      }
    }
  }, [urlTransType]);

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
      url: '/api/trans-record/transInfo',
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
      const data = Array.isArray(res.data) ? res.data : [];
      const mapped = data.map((row: any) => ({
        ...row,
        trans_type_original: row?.trans_type, // 원본 값 보존
        trans_type: getLabelByValue(transStatusOptions, row?.trans_type),
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
            label="거래 유형"
            options={transStatusOptions}
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
        title="충전/환전"
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
