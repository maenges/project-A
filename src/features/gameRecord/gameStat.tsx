import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Box } from '@mui/material';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';
import { EtsButton } from '@/components/EtsCommon';
import { EtsDatePickerComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { gameSortOptions } from '@/models/common/CommonSelectCodes';

type GameStatRecord = {
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  gameSort: string;
};

const GameStatPage: React.FC = () => {
  const gridRef = useRef<EtsGridRef<GameStatRecord>>(null);
  const { toast } = useNotify();
  const [rowData, setRowData] = useState<GameStatRecord[]>([]);
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());

  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.IdPreset({
      field: 'no',
      headerName: 'No',
      width: 60,
      valueGetter: (params) => {
        if (params.node?.rowPinned === 'bottom') return '합계';
        return (params.node?.rowIndex ?? 0) + 1;
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'game_sort',
      headerName: '게임분류',
      width: 100,
    }),
    EtsColumnPreset.TextPreset({
      field: 'vendor',
      headerName: '공급사',
      width: 160,
    }),
    EtsColumnPreset.TextPreset({
      field: 'game_type',
      headerName: '게임명',
      width: 200,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'bet_count',
      headerName: '베팅건수',
      width: 80,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    // EtsColumnPreset.TextPreset({
    //   field: 'win_count',
    //   headerName: '당첨건수',
    //   width: 110,
    //   context: {
    //     formatType: 'number',
    //     decimalPlaces: 0,
    //   },
    // }),
    EtsColumnPreset.TextPreset({
      field: 'bet_amount',
      headerName: '베팅금액',
      width: 140,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'win_amount',
      headerName: '당첨금액',
      width: 140,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'net_amount',
      headerName: '베팅금액 - 당첨금액',
      width: 160,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'rolling_amount',
      headerName: '롤링금액',
      width: 140,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'net_after_rolling',
      headerName: '베팅손익',
      width: 140,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'rtp',
      headerName: 'RTP',
      width: 100,
      valueGetter: (params) => {
        const bet = Number(params.data?.bet_amount) || 0;
        const win = Number(params.data?.win_amount) || 0;
        if (bet === 0) return '-';
        return ((win / bet) * 100).toFixed(2) + '%';
      },
    }),
  ];

  const { control, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: {
      startDate: dayjs().subtract(7, 'day').format('YYYYMMDD'),
      endDate: dayjs().format('YYYYMMDD'),
      gameSort: 'ALL',
    },
    mode: 'onChange',
  });

  const onSearch = () => {
    const { startDate, endDate, gameSort } = getValues();

    callApi({
      service: Service.POSTMAN,
      url: '/api/game-stat/game',
      method: Method.GET,
      params: {
        queryParams: {
          startDate,
          endDate,
          gameSort: gameSort === 'ALL' ? '' : gameSort,
        },
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowData([]);
        return;
      }

      const mapped: GameStatRecord[] = Array.isArray(res.data) ? res.data : [];
      setRowData(mapped);
    });
  };

  useEffect(() => {
    onSearch();
  }, []);

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
            name="gameSort"
            label="게임종류"
            options={gameSortOptions}
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
      title="게임별 통계"
      columnDefs={columnDefs}
      rowData={rowData}
      searchComponent={searchComponent}
      buttonComponent={buttonComponent}
      gridRef={gridRef}
      alwaysShowHorizontalScroll={true}
      defaultColDef={{
        autoHeaderHeight: false,
        wrapHeaderText: false,
      }}
      rowSelection="single"
      size="one-search-no-button"
    />
  );
};

export default GameStatPage;
