import React, { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ColDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { PageTemplate } from '@/components/Teamplate';
import { Circle } from '@mui/icons-material';
import dayjs from 'dayjs';

type AccessorUser = {
  user_key: string;
  user_id: string;
  user_nick: string;
  user_money: number;
  user_rolling_money: number;
  user_bonus_money: number;
  is_online: boolean;
  last_game: string;
  last_vendor: string;
  last_game_sort: string;
  last_activity: string;
};

type UserStatusData = {
  timestamp: string;
  total: number;
  online: number;
  users: AccessorUser[];
};

const CustomerAccessorPage: React.FC = () => {
  const gridRef = useRef<EtsGridRef<AccessorUser>>(null);
  const socketRef = useRef<Socket | null>(null);
  const [rowData, setRowData] = useState<AccessorUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 소켓 연결
  useEffect(() => {
    // ApiUtil처럼 상대 경로 사용 → CloudFront를 통해 요청 → 쿠키 자동 전송
    // CloudFront에서 /socket.io/* 경로를 API Gateway로 프록시해야 함
    const socket = io('/user-status', {
      withCredentials: true,
    });

    socketRef.current = socket;

    // 연결 성공
    socket.on('connect', () => {
      console.log('소켓 연결됨');
      setIsConnected(true);
    });

    // 5초마다 데이터 수신
    socket.on('userStatus', (data: UserStatusData) => {
      console.log('userStatus 수신:', data);
      setRowData(data.users || []);
      setOnlineCount(data.online || 0);
      setTotalCount(data.total || 0);
      setLastUpdated(dayjs(data.timestamp).format('YYYY-MM-DD HH:mm:ss'));
    });

    // 에러 처리
    socket.on('error', (err) => {
      console.error('소켓 에러:', err);
    });

    // 연결 해제
    socket.on('disconnect', () => {
      console.log('소켓 연결 해제');
      setIsConnected(false);
    });

    // 컴포넌트 언마운트 시 소켓 정리
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const columnDefs: ColDef[] = [
    EtsColumnPreset.IdPreset({
      field: 'no',
      headerName: 'No',
      width: 70,
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
    }),
    {
      field: 'is_online',
      headerName: '상태',
      width: 80,
      cellRenderer: (params: any) => {
        const isOnline = params.value;
        return (
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
          >
            <Circle
              sx={{
                fontSize: 12,
                color: isOnline ? '#4CAF50' : '#9E9E9E',
              }}
            />
          </Box>
        );
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'user_id',
      headerName: '회원 ID',
      width: 120,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_nick',
      headerName: '닉네임',
      width: 120,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_money',
      headerName: '보유금액',
      width: 130,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_rolling_money',
      headerName: '롤링금액',
      width: 130,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_bonus_money',
      headerName: '보너스금액',
      width: 130,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'last_game_sort',
      headerName: '게임종류',
      width: 100,
      valueFormatter: (params) => {
        if (params.value === 'casino') return '카지노';
        if (params.value === 'slot') return '슬롯';
        return params.value || '-';
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'last_vendor',
      headerName: '벤더',
      width: 120,
    }),
    EtsColumnPreset.TextPreset({
      field: 'last_game',
      headerName: '최근 게임',
      width: 180,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'last_activity',
      headerName: '마지막 활동',
      width: 180,
      valueFormatter: (params) => {
        if (!params.value) return '-';
        return dayjs(params.value).format('YYYY-MM-DD HH:mm:ss');
      },
    }),
  ];

  const statusComponent = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          icon={<Circle sx={{ fontSize: '12px !important' }} />}
          label={isConnected ? '연결됨' : '연결 끊김'}
          color={isConnected ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      </Stack>
      <Typography variant="body2" color="text.secondary">
        총 회원: <strong>{totalCount}</strong>명
      </Typography>
      <Typography variant="body2" color="text.secondary">
        접속중: <strong style={{ color: '#4CAF50' }}>{onlineCount}</strong>명
      </Typography>
      {lastUpdated && (
        <Typography variant="body2" color="text.secondary">
          마지막 업데이트: {lastUpdated}
        </Typography>
      )}
    </Box>
  );

  return (
    <PageTemplate
      title="실시간 접속자"
      columnDefs={columnDefs}
      rowData={rowData}
      searchComponent={statusComponent}
      gridRef={gridRef}
      alwaysShowHorizontalScroll={true}
      defaultColDef={{
        autoHeaderHeight: false,
        wrapHeaderText: false,
      }}
      rowSelection="single"
      size="one-search"
    />
  );
};

export default CustomerAccessorPage;
