import React, { useMemo } from 'react';
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
import {
  EtsInputComponent,
  EtsDatePickerComponent,
  EtsSelectComponent,
} from '@/components/EtsComponents';
import { gameSortOptions } from '@/models/common/CommonSelectCodes';

type GameStatDaily = {
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  userId: string;
  gameSort: string;
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
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().subtract(3, 'day'));
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
      valueGetter: (params) => {
        // pinnedBottomRow (합계 행)인 경우 '합계' 표시
        if (params.node?.rowPinned === 'bottom') return '합계';
        return (params.node?.rowIndex ?? 0) + 1;
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'stat_date',
      headerName: '날짜',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_id',
      headerName: '회원 ID',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'bet_amount',
      headerName: '베팅금액',
      width: 130,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'win_amount',
      headerName: '당첨금액',
      width: 130,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'net_amount',
      headerName: '베팅금액 - 당첨금액',
      width: 160,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'rolling_amount',
      headerName: '롤링금액',
      width: 130,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'net_after_rolling',
      headerName: '베팅손익',
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
        const rtp = params.data?.rtp;
        if (!rtp || rtp === '-') return '-';
        return String(rtp).includes('%') ? rtp : rtp + '%';
      },
    }),
  ];

  // 총합 행 데이터 계산
  const customTotalRowData = useMemo(() => {
    if (!rowData || rowData.length === 0) return undefined;

    const totals = {
      no: '합계',
      stat_date: '',
      user_id: '',
      bet_amount: 0,
      win_amount: 0,
      net_amount: 0,
      rolling_amount: 0,
      net_after_rolling: 0,
      rtp: '-',
    };

    // 숫자 필드 합계 계산
    for (const row of rowData) {
      totals.bet_amount += Number(row.bet_amount) || 0;
      totals.win_amount += Number(row.win_amount) || 0;
      totals.net_amount += Number(row.net_amount) || 0;
      totals.rolling_amount += Number(row.rolling_amount) || 0;
      totals.net_after_rolling += Number(row.net_after_rolling) || 0;
    }

    // RTP 계산: 총 당첨 / 총 베팅 * 100
    if (totals.bet_amount > 0) {
      totals.rtp = ((totals.win_amount / totals.bet_amount) * 100).toFixed(2) + '%';
    }

    return totals;
  }, [rowData]);

  const { control, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: {
      startDate: dayjs().subtract(3, 'day').format('YYYYMMDD'),
      endDate: dayjs().format('YYYYMMDD'),
      userId: '',
      gameSort: 'ALL',
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
    const { startDate, endDate, userId, gameSort } = getValues();
    callApi({
      service: Service.POSTMAN,
      url: '/api/game-stat/daily',
      method: Method.GET,
      params: {
        queryParams: {
          groupKey,
          startDate,
          endDate,
          userId: userId?.trim() || '',
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
          <EtsSelectComponent
            control={control}
            name="gameSort"
            label="게임종류"
            options={gameSortOptions}
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
      title="날짜별 기록"
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
      size="two-search"
      customTotalRowData={customTotalRowData}
    />
  );
};

export default GameRecordDailyPage;
