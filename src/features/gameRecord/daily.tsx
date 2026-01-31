import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
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
import { EtsInputComponent, EtsDatePickerComponent } from '@/components/EtsComponents';

type GameStatDaily = {
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  userId: string;
};

const DAILY_UI_STATE_KEY = 'gameRecordDaily.uiState';

type DailyUiState = {
  groupKey?: string;
  firstRow?: number;
};

const readDailyUiState = (): DailyUiState | null => {
  try {
    const raw = sessionStorage.getItem(DAILY_UI_STATE_KEY);
    return raw ? (JSON.parse(raw) as DailyUiState) : null;
  } catch {
    return null;
  }
};

const getInitialGroupKey = (): string | null => {
  try {
    const urlGroupKey = new URLSearchParams(window.location.search).get('groupKey');
    const saved = readDailyUiState();
    return urlGroupKey ?? saved?.groupKey ?? null;
  } catch {
    return null;
  }
};

const GameRecordDailyPage: React.FC = () => {
  const gridRef = useRef<EtsGridRef<GameStatDaily>>(null);
  const { toast } = useNotify();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowData, setRowData] = useState<GameStatDaily[]>([]);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(() => getInitialGroupKey());
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());

  // 복원할 스크롤 위치(첫 표시 row index)
  const restoreFirstRowRef = useRef<number | null>(null);

  const saveUiState = (patch: Partial<DailyUiState>) => {
    try {
      const raw = sessionStorage.getItem(DAILY_UI_STATE_KEY);
      const prev = raw ? (JSON.parse(raw) as DailyUiState) : {};
      sessionStorage.setItem(DAILY_UI_STATE_KEY, JSON.stringify({ ...prev, ...patch }));
    } catch {
      // ignore
    }
  };

  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.IdPreset({
      field: 'no',
      headerName: 'No',
      width: 60,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_id',
      headerName: '회원 ID',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'bet_amount',
      headerName: '베팅',
      width: 130,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'bet_count',
      headerName: '베팅건수',
      width: 100,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'win_amount',
      headerName: '당첨',
      width: 130,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'win_count',
      headerName: '당첨건수',
      width: 100,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'net_amount',
      headerName: '순수익',
      width: 130,
      flex: 1,
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
      userId: '',
    },
    mode: 'onChange',
  });

  const onSearch = () => {
    if (!selectedTreeId) {
      toast.info('좌측 트리를 선택해 주세요.');
      return;
    }

    saveUiState({ groupKey: selectedTreeId, firstRow: 0 });
    fetchDailyStatByGroupKey(selectedTreeId);
  };

  const fetchDailyStatByGroupKey = (groupKey: string) => {
    const { startDate, endDate, userId } = getValues();
    callApi({
      service: Service.POSTMAN,
      url: '/api/stat/daily',
      method: Method.GET,
      params: {
        queryParams: {
          groupKey,
          startDate,
          endDate,
          userId: userId?.trim() || '',
        },
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowData([]);
        return;
      }

      const mapped: GameStatDaily[] = Array.isArray(res.data) ? res.data : [];
      setRowData(mapped);

      // 데이터 세팅 후 스크롤 위치 복원(최초 1회)
      const restoreIndex = restoreFirstRowRef.current;
      if (typeof restoreIndex === 'number') {
        restoreFirstRowRef.current = null;
        const api = (gridRef.current as any)?.api;
        if (api?.ensureIndexVisible) {
          const safeIndex = Math.max(0, Math.min(restoreIndex, Math.max(0, mapped.length - 1)));
          requestAnimationFrame(() => {
            try {
              api.ensureIndexVisible(safeIndex, 'top');
            } catch {
              // ignore
            }
          });
        }
      }
    });
  };

  // URL 쿼리에서 groupKey 복원 및 자동 재조회
  useEffect(() => {
    const urlGroupKey = searchParams.get('groupKey');
    const saved = readDailyUiState();
    const groupKey = urlGroupKey ?? saved?.groupKey;
    if (!groupKey) return;

    setSelectedTreeId(groupKey);
    if (!urlGroupKey) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('groupKey', groupKey);
        return next;
      });
    }

    if (typeof saved?.firstRow === 'number') {
      restoreFirstRowRef.current = saved.firstRow;
    }

    fetchDailyStatByGroupKey(groupKey);
  }, []);

  // 트리 선택 시
  const handleTreeSelect = (id: string) => {
    saveUiState({ groupKey: id, firstRow: 0 });

    setSelectedTreeId(id);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('groupKey', id);
      return next;
    });
    fetchDailyStatByGroupKey(id);
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

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>{/* 추가 버튼 필요 시 여기에 */}</buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <PageTemplate
      title="일별 집계"
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
      tree={true}
      leftTreeProps={{
        onSelect: handleTreeSelect,
        selectedId: selectedTreeId ?? undefined,
      }}
      rowSelection="single"
      size="one-search-no-button"
    />
  );
};

export default GameRecordDailyPage;
