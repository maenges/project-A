import React, { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { PageTemplate } from '@/components/Teamplate';
import { Circle } from '@mui/icons-material';

export function formatDate(dateString?: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  );
}

type AccessorUser = {
  user_key: string;
  user_id: string;
  user_nick: string;
  user_money: number;
  casino_bet: number;
  casino_win: number;
  slot_bet: number;
  slot_win: number;
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
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 소켓 연결
  useEffect(() => {
    // 이미 연결된 소켓이 있으면 재사용
    if (socketRef.current?.connected) {
      setIsConnected(true);
      return;
    }

    // ApiUtil처럼 상대 경로 사용 → CloudFront를 통해 요청 → 쿠키 자동 전송
    // CloudFront에서 /socket.io/* 경로를 API Gateway로 프록시해야 함
    const socket = io('/user-status', {
      withCredentials: true,
      transports: ['websocket', 'polling'], // WebSocket 우선, 실패 시 polling fallback
      upgrade: true, // polling에서 websocket으로 업그레이드 허용
      // 재연결 설정 (백엔드 3초 Grace Period에 맞춤)
      reconnection: true,
      reconnectionAttempts: 5, // 5회 재시도
      reconnectionDelay: 1000, // 1초 후 재연결 시도
      reconnectionDelayMax: 3000, // 최대 3초까지 증가
      timeout: 20000, // 연결 타임아웃 20초
      forceNew: false, // 기존 연결 재사용 허용
    });

    socketRef.current = socket;

    // 연결 성공
    socket.on('connect', () => {
      console.log('소켓 연결됨');
      setIsConnected(true);
    });

    // 재연결 시도 중
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`재연결 시도 중... (${attemptNumber}번째)`);
    });

    // 재연결 성공
    socket.on('reconnect', (attemptNumber) => {
      console.log(`재연결 성공 (${attemptNumber}번째 시도)`);
      setIsConnected(true);
    });

    // 재연결 에러
    socket.on('reconnect_error', (err) => {
      console.error('재연결 에러:', err);
    });

    // 모든 재연결 시도 실패
    socket.on('reconnect_failed', () => {
      console.error('재연결 실패 (모든 시도 소진)');
      setIsConnected(false);
    });

    // 5초마다 데이터 수신
    socket.on('userStatus', (data: UserStatusData) => {
      console.log('userStatus 수신:', data);
      // last_activity 날짜 포맷 변환
      const formattedUsers = (data.users || []).map((user) => ({
        ...user,
        last_activity: formatDate(user.last_activity),
      }));
      setRowData(formattedUsers);
      setOnlineCount(data.online || 0);
      setLastUpdated(formatDate(data.timestamp));
    });

    // 에러 처리
    socket.on('error', (err) => {
      console.error('소켓 에러:', err);
    });

    // 연결 에러 (초기 연결 실패)
    socket.on('connect_error', (err) => {
      console.error('연결 에러:', err);
      setIsConnected(false);
    });

    // 연결 해제
    socket.on('disconnect', (reason) => {
      console.log('소켓 연결 해제:', reason);
      setIsConnected(false);
      // 서버에서 끊은 경우 수동 재연결
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    // 컴포넌트 언마운트 시 소켓 정리
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const columnDefs: (ColDef | ColGroupDef)[] = [
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
        console.log('is_online:', params.value);
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
    {
      headerName: '카지노',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'casino_bet_amount',
          headerName: '베팅',
          width: 120,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'casino_win_amount',
          headerName: '당첨',
          width: 120,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
      ],
    },
    {
      headerName: '슬롯',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'slot_bet_amount',
          headerName: '베팅',
          width: 120,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'slot_win_amount',
          headerName: '당첨',
          width: 120,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
      ],
    },
    {
      field: 'last_game_sort',
      headerName: '게임종류',
      width: 100,
      valueGetter: (params) => {
        const value = params.data?.last_game_sort;
        if (value === 'casino') return '카지노';
        if (value === 'slot') return '슬롯';
        return value || '-';
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'last_vendor',
      headerName: '벤더',
      width: 150,
    }),
    EtsColumnPreset.TextPreset({
      field: 'last_game_type',
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
        return formatDate(params.value);
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
