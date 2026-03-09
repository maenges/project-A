import React from 'react';
import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Box } from '@mui/material';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { hourOptions, gameSortOptions, sortOptions } from '@/models/common/CommonSelectCodes';
import dayjs from 'dayjs';
import { useNotify } from '@hooks/useNotify';

import { EtsButton } from '@/components/EtsCommon';
import {
  EtsSelectComponent,
  EtsInputComponent,
  EtsSingleDatePickerComponent,
} from '@/components/EtsComponents';

type GameTransactionProps = {
  [key: string]: any;
};

type FormValues = {
  searchDate: string;
  hour: string;
  gameSort: string;
  sort: string;
  userId: string;
  minAmount: string;
};

const GameRecordOriginPage: React.FC = () => {
  const gridRef = useRef<EtsGridRef<GameTransactionProps>>(null);
  const { toast } = useNotify();
  const [rowData, setRowData] = useState<GameTransactionProps[]>([]);

  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.IdPreset({
      field: 'no',
      headerName: 'No',
      width: 60,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'game_tx_key',
      headerName: 'TX Key',
      width: 150,
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'transaction_id',
      headerName: '트랜잭션 ID',
      width: 180,
    }),
    EtsColumnPreset.TextPreset({
      field: 'command',
      headerName: '커맨드',
      width: 100,
    }),
    EtsColumnPreset.TextPreset({
      field: 'sort',
      headerName: '처리유형',
      width: 80,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_id',
      headerName: '회원 ID',
      width: 120,
    }),
    EtsColumnPreset.TextPreset({
      field: 'game_id',
      headerName: '게임 ID',
      width: 120,
    }),
    EtsColumnPreset.TextPreset({
      field: 'game',
      headerName: '게임명',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'round_id',
      headerName: '라운드 ID',
      width: 120,
    }),
    EtsColumnPreset.TextPreset({
      field: 'game_type',
      headerName: '게임타입',
      width: 100,
    }),
    EtsColumnPreset.TextPreset({
      field: 'game_sort',
      headerName: '게임분류',
      width: 80,
    }),
    EtsColumnPreset.TextPreset({
      field: 'vendor',
      headerName: '게임사',
      width: 100,
    }),
    EtsColumnPreset.TextPreset({
      field: 'amount',
      headerName: '베팅(당첨)금액',
      width: 120,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'balance',
      headerName: '보유금액',
      width: 120,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'result',
      headerName: '결과',
      width: 80,
    }),
    EtsColumnPreset.TextPreset({
      field: 'status',
      headerName: '상태',
      width: 80,
    }),
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '베팅(당첨)일시',
      width: 180,
    }),
  ];

  const { control, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: {
      searchDate: dayjs().format('YYYY-MM-DD'),
      hour: '00',
      gameSort: 'casino',
      sort: 'ALL',
      userId: '',
      minAmount: '',
    },
    mode: 'onChange',
  });

  const onSearch: SubmitHandler<FormValues> = () => {
    const { searchDate, hour, gameSort, sort, userId, minAmount } = getValues();
    const rawMin = minAmount?.replace(/,/g, '').trim();

    callApi({
      service: Service.POSTMAN,
      url: '/api/game-record/origin',
      method: Method.GET,
      params: {
        queryParams: {
          searchDate,
          hour,
          type: gameSort,
          ...(sort && sort !== 'ALL' ? { sort } : {}),
          userId: userId?.trim() || '',
          ...(rawMin ? { minAmount: Number(rawMin) || 0 } : {}),
        },
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowData([]);
        return;
      }
      const mapped: GameTransactionProps[] = Array.isArray(res.data) ? res.data : [];
      setRowData(mapped);
    });
  };

  const searchComponent = (
    <form onSubmit={handleSubmit(onSearch)}>
      <searchForm.Container>
        <searchForm.Row>
          <EtsSingleDatePickerComponent control={control} name="searchDate" label="조회일자" />
          <EtsSelectComponent control={control} name="hour" label="시간" options={hourOptions} />
          <EtsSelectComponent
            control={control}
            name="gameSort"
            label="게임분류"
            options={gameSortOptions.filter((o) => o.value !== 'ALL')}
          />
          <EtsSelectComponent
            control={control}
            name="sort"
            label="처리유형"
            options={sortOptions}
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
          <EtsInputComponent
            control={control}
            name="minAmount"
            label="최소 베팅(당첨)금액"
            placeholder="금액을 입력해 주세요."
            sx={{ width: 250 }}
            formatValue={(val: string) => {
              const raw = val.replace(/[^0-9]/g, '');
              return raw ? Number(raw).toLocaleString() : '';
            }}
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

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>{/* 추가 버튼 필요 시 여기에 */}</buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <PageTemplate
      title="원본 정산"
      gridRef={gridRef}
      columnDefs={columnDefs}
      searchComponent={searchComponent}
      buttonComponent={buttonComponent}
      rowData={rowData}
      rowSelection="single"
      size="one-search"
    />
  );
};

export default GameRecordOriginPage;
