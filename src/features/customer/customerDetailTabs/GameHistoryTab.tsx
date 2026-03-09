import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ColDef } from 'ag-grid-community';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { EtsButton, EtsSelect, EtsInput } from '@/components/EtsCommon';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { gameSortOptions, sortOptions } from '@models/common/CommonSelectCodes';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';

type GameHistoryRecord = {
  [key: string]: any;
};

interface GameHistoryTabProps {
  userId?: string;
  groupKey?: string;
}

const GameHistoryTab: React.FC<GameHistoryTabProps> = ({ userId: userIdProp, groupKey }) => {
  const gridRef = useRef<EtsGridRef<GameHistoryRecord>>(null);
  const { toast } = useNotify();
  const location = useLocation();
  const [rowData, setRowData] = useState<GameHistoryRecord[]>([]);

  // 검색 조건 state
  const [gameType, setGameType] = useState<string>('ALL');
  const [gameSort, setGameSort] = useState<string>('ALL');
  const [searchUserId, setSearchUserId] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');

  const userId =
    userIdProp ??
    ((location.state as any)?.userId as string | undefined) ??
    ((location.state as any)?.user_id as string | undefined) ??
    undefined;
  const resolvedGroupKey =
    groupKey ??
    ((location.state as any)?.groupKey as string | undefined) ??
    ((location.state as any)?.group_key as string | undefined) ??
    undefined;

  const columnDefs: ColDef[] = useMemo(
    () => [
      EtsColumnPreset.IdPreset({
        field: 'no',
        headerName: 'No',
        width: 60,
        valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
      }),
      ...(!userId
        ? [
            EtsColumnPreset.TextPreset({
              field: 'user_id',
              headerName: '회원 ID',
              width: 120,
            }),
          ]
        : []),
      EtsColumnPreset.TextPreset({
        field: 'sort',
        headerName: '게임구분',
        width: 80,
        valueGetter: (params) => {
          const v = params.data?.sort;
          if (v === 'BET') return '베팅';
          if (v === 'WIN') return '당첨';
          return v ?? '';
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'vendor',
        headerName: '게임사',
        width: 150,
      }),
      EtsColumnPreset.TextPreset({
        field: 'game_type',
        headerName: '게임명',
        width: 150,
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'round_id',
        headerName: '라운드 ID',
        width: 150,
      }),
      EtsColumnPreset.TextPreset({
        field: 'game_sort',
        headerName: '게임분류',
        width: 80,
        valueGetter: (params) => {
          const v = params.data?.game_sort;
          if (v === 'slot') return '슬롯';
          if (v === 'casino') return '카지노';
          return v ?? '';
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'amount',
        headerName: '베팅(당첨)금액',
        width: 100,
        flex: 1,
        context: {
          formatType: 'number',
          decimalPlaces: 0,
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'balance',
        headerName: '보유금액',
        width: 100,
        flex: 1,
        context: {
          formatType: 'number',
          decimalPlaces: 0,
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'created',
        headerName: '베팅일시',
        width: 180,
      }),
    ],
    [userId]
  );

  const fetchGameHistory = useCallback(
    async (overrides?: {
      gameType?: string;
      gameSort?: string;
      userId?: string;
      minAmount?: string;
    }) => {
      if (!resolvedGroupKey) {
        setRowData([]);
        return;
      }

      const gt = overrides?.gameType ?? gameType;
      const gs = overrides?.gameSort ?? gameSort;
      const uid = overrides?.userId ?? searchUserId;
      const min = overrides?.minAmount ?? minAmount;

      const queryParams: any = {
        groupKey: resolvedGroupKey,
      };

      // 고객 뷰: prop으로 받은 userId 우선, 아니면 검색 입력값
      if (userId) {
        queryParams.userId = userId;
      } else if (uid.trim()) {
        queryParams.userId = uid.trim();
      }

      if (gt && gt !== 'ALL') queryParams.sort = gt;
      if (gs && gs !== 'ALL') queryParams.gameSort = gs;
      if (uid.trim()) queryParams.userId = uid.trim();
      if (min.replace(/,/g, '').trim()) queryParams.minAmount = Number(min.replace(/,/g, '')) || 0;

      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/game-stat/customer-game-history',
        method: Method.GET,
        params: { queryParams },
        config: { isLoading: true },
      });

      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowData([]);
        return;
      }

      const data: GameHistoryRecord[] = Array.isArray(res.data) ? res.data : [];
      setRowData(data);
    },
    [resolvedGroupKey, userId, gameType, gameSort, searchUserId, minAmount, toast]
  );

  // 초기 로드
  useEffect(() => {
    fetchGameHistory();
  }, [resolvedGroupKey, userId]);

  const handleSearch = () => {
    fetchGameHistory();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if ((e.nativeEvent as any)?.isComposing) return;
    e.preventDefault();
    handleSearch();
  };

  const buttonComponent = (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
      }}
    >
      <EtsSelect
        value={gameType}
        onChange={(e) => setGameType(e.target.value as string)}
        options={sortOptions}
        placeholder="게임종류"
        width={130}
      />
      <EtsSelect
        value={gameSort}
        onChange={(e) => setGameSort(e.target.value as string)}
        options={gameSortOptions}
        placeholder="게임분류"
        width={130}
      />
      {!userId && (
        <EtsInput
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          placeholder="유저 ID"
          width={160}
          onKeyDown={handleKeyDown}
        />
      )}
      <EtsInput
        value={minAmount}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, '');
          if (!raw) {
            setMinAmount('');
            return;
          }
          setMinAmount(Number(raw).toLocaleString());
        }}
        placeholder="최소 베팅(당첨)금액"
        width={180}
        onKeyDown={handleKeyDown}
      />
      <EtsButton type="blue" onClick={handleSearch}>
        검색
      </EtsButton>
    </Box>
  );

  return (
    <PageTemplate
      gridRef={gridRef}
      columnDefs={columnDefs}
      rowData={rowData}
      size="no-search-one-button"
      buttonComponent={buttonComponent}
      alwaysShowHorizontalScroll={true}
      defaultColDef={{
        autoHeaderHeight: false,
        wrapHeaderText: false,
      }}
    />
  );
};

export default GameHistoryTab;
