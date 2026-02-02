import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { useLocation } from 'react-router-dom';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import dayjs from 'dayjs';
import { useNotify } from '@hooks/useNotify';

type GameStatRecord = {
  [key: string]: any;
};

interface GameHistoryTabProps {
  userId?: string;
  groupKey?: string;
}

const GameHistoryTab: React.FC<GameHistoryTabProps> = ({ userId: userIdProp, groupKey }) => {
  const gridRef = useRef<EtsGridRef<GameStatRecord>>(null);
  const { toast } = useNotify();
  const location = useLocation();
  const [rowData, setRowData] = useState<GameStatRecord[]>([]);

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

  // userId가 없으면 파트너 뷰 (하위 전체 표시 + 합계), 있으면 고객 뷰 (특정 고객만 + 합계 없음)
  const isPartnerView = !userId;

  const columnDefs: ColDef[] = useMemo(
    () => [
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
          const rtp = params.data?.rtp;
          if (!rtp || rtp === '-') return '-';
          return String(rtp).includes('%') ? rtp : rtp + '%';
        },
      }),
    ],
    []
  );
  // 파트너 뷰일 때만 합계 행 계산
  const customTotalRowData = useMemo(() => {
    if (!isPartnerView || !rowData || rowData.length === 0) return undefined;

    const totals = {
      no: '합계',
      stat_date: '',
      user_id: '',
      bet_amount: 0,
      bet_count: 0,
      win_amount: 0,
      win_count: 0,
      net_amount: 0,
      rtp: '-',
    };

    // 숫자 필드 합계 계산
    for (const row of rowData) {
      totals.bet_amount += Number(row.bet_amount) || 0;
      totals.bet_count += Number(row.bet_count) || 0;
      totals.win_amount += Number(row.win_amount) || 0;
      totals.win_count += Number(row.win_count) || 0;
      totals.net_amount += Number(row.net_amount) || 0;
    }

    // RTP 계산: 총 당첨 / 총 베팅 * 100
    if (totals.bet_amount > 0) {
      totals.rtp = ((totals.win_amount / totals.bet_amount) * 100).toFixed(2) + '%';
    }

    return totals;
  }, [isPartnerView, rowData]);
  useEffect(() => {
    let cancelled = false;

    const fetchGameHistory = async () => {
      if (!resolvedGroupKey) {
        setRowData([]);
        return;
      }

      const startDate = dayjs().subtract(3, 'day').format('YYYYMMDD');
      const endDate = dayjs().format('YYYYMMDD');

      const queryParams: any = {
        groupKey: resolvedGroupKey,
        startDate,
        endDate,
      };

      // 고객 뷰일 때만 userId 추가
      if (userId) {
        queryParams.userId = userId;
      }

      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/game-stat/daily',
        method: Method.GET,
        params: {
          queryParams,
        },
        config: { isLoading: true },
      });

      if (cancelled) return;

      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowData([]);
        return;
      }

      const data: GameStatRecord[] = Array.isArray(res.data) ? res.data : [];
      // 최대 100개만 표시
      setRowData(data.slice(0, 100));
    };

    fetchGameHistory();

    return () => {
      cancelled = true;
    };
  }, [toast, userId, resolvedGroupKey]);

  return (
    <PageTemplate
      gridRef={gridRef}
      columnDefs={columnDefs}
      rowData={rowData}
      size="one-search"
      customTotalRowData={customTotalRowData}
      alwaysShowHorizontalScroll={true}
      defaultColDef={{
        autoHeaderHeight: false,
        wrapHeaderText: false,
      }}
    />
  );
};

export default GameHistoryTab;
