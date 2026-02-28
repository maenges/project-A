import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Stack, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled, useTheme as useMuiTheme } from '@mui/material/styles';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';

// ─── 데이터 타입 ───────────────────────────────────────────────────────

interface DailyData {
  deposit: number;
  withdraw: number;
  alGive: number;
  alTake: number;
  betting: number;
  winning: number;
}

interface FundData {
  partnerBalance: number;
  partnerRollingBalance: number;
  customerBalance: number;
  customerRollingBalance: number;
}

interface MonthData {
  deposit: number;
  withdraw: number;
  alGive: number;
  alTake: number;
  betting: number;
  winning: number;
}

interface WeeklyDayRecord {
  date: string; // 표시용 MM/DD
  fullDate: string; // API용 YYYY-MM-DD
  deposit: number;
  withdraw: number;
  alGive: number;
  alTake: number;
  betting: number;
  winning: number;
}

const EMPTY_DAILY: DailyData = {
  deposit: 0,
  withdraw: 0,
  alGive: 0,
  alTake: 0,
  betting: 0,
  winning: 0,
};

const EMPTY_FUND: FundData = {
  partnerBalance: 0,
  partnerRollingBalance: 0,
  customerBalance: 0,
  customerRollingBalance: 0,
};

const EMPTY_MONTH: MonthData = {
  deposit: 0,
  withdraw: 0,
  alGive: 0,
  alTake: 0,
  betting: 0,
  winning: 0,
};

// ─── 유틸리티 ──────────────────────────────────────────────────────────

const formatKRW = (value: number): string => {
  if (value === 0) return '0원';

  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(Math.round(value));

  const man = Math.floor(abs / 10_000);
  const remainder = abs % 10_000;
  const cheon = Math.floor(remainder / 1_000);
  const rest = remainder % 1_000;

  let result = sign;
  if (man > 0) result += man.toLocaleString('ko-KR') + '만';
  if (cheon > 0) result += cheon + '천';
  if (rest > 0) result += rest.toLocaleString('ko-KR');
  result += '원';
  return result;
};

const formatShort = (value: number): string => {
  if (value >= 100_000_000) return (value / 100_000_000).toFixed(1) + '억';
  if (value >= 10_000) return (value / 10_000).toFixed(0) + '만';
  return value.toLocaleString('ko-KR');
};

// ─── 색상 ──────────────────────────────────────────────────────────────

const CHART_COLORS = {
  deposit: '#3b82f6',
  withdraw: '#ef4444',
  alGive: '#22c55e',
  alTake: '#f97316',
  betting: '#8b5cf6',
  winning: '#eab308',
};

// ─── Styled Components ─────────────────────────────────────────────────

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '0px',
  minHeight: 'calc(100vh - 140px)',
  color: theme.palette.text.primary,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: '12px',
  borderLeft: `3px solid ${theme.palette.primary.main}`,
  paddingInlineStart: '8px',
}));

const CardGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  '@media (max-width: 1200px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const ChartCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  padding: '20px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
  boxShadow:
    theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
}));

const FundCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  padding: '24px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
  boxShadow:
    theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));

const FundRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  borderRadius: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    fontSize: '13px',
    fontWeight: 600,
    padding: '4px 16px',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const SummaryValue = styled(Typography)<{ $color?: string }>(({ $color }) => ({
  fontSize: '20px',
  fontWeight: 700,
  color: $color || 'inherit',
  letterSpacing: '-0.5px',
}));

const SummaryLabel = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

// const ChartCardTitle = styled(Typography)(({ theme }) => ({
//   fontSize: '15px',
//   fontWeight: 600,
//   color: theme.palette.text.primary,
//   marginBottom: '4px',
// }));

// ─── 커스텀 Tooltip ────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomBarTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  const theme = useMuiTheme();
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: '13px', mb: 0.5 }}>{label}</Typography>
      {payload.map((entry: any, index: number) => (
        <Typography key={index} sx={{ fontSize: '12px', color: entry.color }}>
          {entry.name}: {formatKRW(entry.value)}
        </Typography>
      ))}
    </Box>
  );
};

const CustomPieTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  const theme = useMuiTheme();
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <Typography sx={{ fontSize: '12px', color: entry.payload.fill, fontWeight: 600 }}>
        {entry.name}: {formatKRW(entry.value)}
      </Typography>
    </Box>
  );
};

// ─── 금일 데이터 카드 컴포넌트 ─────────────────────────────────────────

interface TodayCardProps {
  title: string;
  value1Label: string;
  value1: number;
  value1Color: string;
  value2Label: string;
  value2: number;
  value2Color: string;
}

const TodayCard: React.FC<TodayCardProps> = ({
  // title,
  value1Label,
  value1,
  value1Color,
  value2Label,
  value2,
  value2Color,
}) => {
  const pieData = [
    { name: value1Label, value: value1 },
    { name: value2Label, value: value2 },
  ];
  const colors = [value1Color, value2Color];
  const diff = value1 - value2;

  return (
    <ChartCard>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Stack direction="row" gap={3}>
          <Stack>
            <SummaryLabel>{value1Label}</SummaryLabel>
            <SummaryValue $color={value1Color}>{formatKRW(value1)}</SummaryValue>
          </Stack>
          <Stack>
            <SummaryLabel>{value2Label}</SummaryLabel>
            <SummaryValue $color={value2Color}>{formatKRW(value2)}</SummaryValue>
          </Stack>
        </Stack>
        <Stack alignItems="flex-end">
          <SummaryLabel>차액</SummaryLabel>
          <SummaryValue $color={diff >= 0 ? '#22c55e' : '#ef4444'}>
            {diff >= 0 ? '+' : ''}
            {formatKRW(diff)}
          </SummaryValue>
        </Stack>
      </Stack>
      <Box sx={{ width: '100%', height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              dataKey="value"
              stroke="none"
              paddingAngle={3}
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={28}
              formatter={(value: string) => (
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  );
};

// ─── 일별 데이터 차트 컴포넌트 ─────────────────────────────────────────

type DailyTab = 'trans' | 'alTrans' | 'betWin';

const DAILY_TAB_CONFIG: Record<
  DailyTab,
  {
    label: string;
    key1: string;
    key1Label: string;
    color1: string;
    key2: string;
    key2Label: string;
    color2: string;
  }
> = {
  trans: {
    label: '충전/환전',
    key1: 'deposit',
    key1Label: '충전',
    color1: CHART_COLORS.deposit,
    key2: 'withdraw',
    key2Label: '환전',
    color2: CHART_COLORS.withdraw,
  },
  alTrans: {
    label: '알지급/알회수',
    key1: 'alGive',
    key1Label: '알지급',
    color1: CHART_COLORS.alGive,
    key2: 'alTake',
    key2Label: '알회수',
    color2: CHART_COLORS.alTake,
  },
  betWin: {
    label: '베팅/당첨',
    key1: 'betting',
    key1Label: '베팅',
    color1: CHART_COLORS.betting,
    key2: 'winning',
    key2Label: '당첨',
    color2: CHART_COLORS.winning,
  },
};

interface DailySectionProps {
  weeklyData: WeeklyDayRecord[];
}

const DailySection: React.FC<DailySectionProps> = ({ weeklyData }) => {
  const theme = useMuiTheme();
  const [dailyTab, setDailyTab] = useState<DailyTab>('trans');
  const cfg = DAILY_TAB_CONFIG[dailyTab];

  const barData = useMemo(
    () =>
      weeklyData.map((d) => ({
        name: d.date,
        [cfg.key1Label]: (d as any)[cfg.key1],
        [cfg.key2Label]: (d as any)[cfg.key2],
      })),
    [weeklyData, cfg]
  );

  return (
    <ChartCard>
      <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
        <StyledToggleButtonGroup
          value={dailyTab}
          exclusive
          onChange={(_, v) => v && setDailyTab(v)}
          size="small"
        >
          <ToggleButton value="trans">충전/환전</ToggleButton>
          <ToggleButton value="alTrans">알지급/알회수</ToggleButton>
          <ToggleButton value="betWin">베팅/당첨</ToggleButton>
        </StyledToggleButtonGroup>
      </Stack>

      <Box sx={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatShort}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={false} />
            <Legend
              formatter={(value: string) => (
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{value}</span>
              )}
            />
            <Bar dataKey={cfg.key1Label} fill={cfg.color1} radius={[4, 4, 0, 0]} barSize={28} />
            <Bar dataKey={cfg.key2Label} fill={cfg.color2} radius={[4, 4, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  );
};

// ─── 월별 데이터 차트 컴포넌트 ─────────────────────────────────────────

type MonthTab = 'thisMonth' | 'lastMonth';

interface MonthlySectionProps {
  thisMonth: MonthData;
  lastMonth: MonthData;
}

const MonthlySection: React.FC<MonthlySectionProps> = ({ thisMonth, lastMonth }) => {
  const theme = useMuiTheme();
  const [monthTab, setMonthTab] = useState<MonthTab>('thisMonth');

  const monthData = monthTab === 'thisMonth' ? thisMonth : lastMonth;

  const barData = useMemo(
    () => [
      { name: '충전/환전', 충전: monthData.deposit, 환전: monthData.withdraw },
      { name: '알지급/알회수', 알지급: monthData.alGive, 알회수: monthData.alTake },
      { name: '베팅/당첨', 베팅: monthData.betting, 당첨: monthData.winning },
    ],
    [monthData]
  );

  return (
    <ChartCard>
      <Stack direction="row" alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Stack direction="row" gap={2} sx={{ flexWrap: 'wrap' }}>
          <Stack>
            <SummaryLabel>충전</SummaryLabel>
            <SummaryValue $color={CHART_COLORS.deposit} sx={{ fontSize: '16px' }}>
              {formatKRW(monthData.deposit)}
            </SummaryValue>
          </Stack>
          <Stack>
            <SummaryLabel>환전</SummaryLabel>
            <SummaryValue $color={CHART_COLORS.withdraw} sx={{ fontSize: '16px' }}>
              {formatKRW(monthData.withdraw)}
            </SummaryValue>
          </Stack>
          <Stack>
            <SummaryLabel>알지급</SummaryLabel>
            <SummaryValue $color={CHART_COLORS.alGive} sx={{ fontSize: '16px' }}>
              {formatKRW(monthData.alGive)}
            </SummaryValue>
          </Stack>
          <Stack>
            <SummaryLabel>알회수</SummaryLabel>
            <SummaryValue $color={CHART_COLORS.alTake} sx={{ fontSize: '16px' }}>
              {formatKRW(monthData.alTake)}
            </SummaryValue>
          </Stack>
          <Stack>
            <SummaryLabel>베팅</SummaryLabel>
            <SummaryValue $color={CHART_COLORS.betting} sx={{ fontSize: '16px' }}>
              {formatKRW(monthData.betting)}
            </SummaryValue>
          </Stack>
          <Stack>
            <SummaryLabel>당첨</SummaryLabel>
            <SummaryValue $color={CHART_COLORS.winning} sx={{ fontSize: '16px' }}>
              {formatKRW(monthData.winning)}
            </SummaryValue>
          </Stack>
        </Stack>
        <Box sx={{ flex: 1 }} />
        <StyledToggleButtonGroup
          value={monthTab}
          exclusive
          onChange={(_, v) => v && setMonthTab(v)}
          size="small"
        >
          <ToggleButton value="thisMonth">이번달</ToggleButton>
          <ToggleButton value="lastMonth">이전달</ToggleButton>
        </StyledToggleButtonGroup>
      </Stack>

      {/* 바 차트 */}
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} barCategoryGap="25%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatShort}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={false} />
            <Legend
              formatter={(value: string) => (
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{value}</span>
              )}
            />
            <Bar dataKey="충전" fill={CHART_COLORS.deposit} radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="환전" fill={CHART_COLORS.withdraw} radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="알지급" fill={CHART_COLORS.alGive} radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="알회수" fill={CHART_COLORS.alTake} radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="베팅" fill={CHART_COLORS.betting} radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="당첨" fill={CHART_COLORS.winning} radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  );
};

// ─── 파트너 & 고객 자금정보 컴포넌트 ──────────────────────────────────

interface FundInfoSectionProps {
  partnerBalance: number;
  partnerRollingBalance: number;
  customerBalance: number;
  customerRollingBalance: number;
}

const FundInfoSection: React.FC<FundInfoSectionProps> = ({
  partnerBalance,
  partnerRollingBalance,
  customerBalance,
  customerRollingBalance,
}) => {
  const theme = useMuiTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        '@media (max-width: 900px)': { gridTemplateColumns: '1fr' },
      }}
    >
      {/* 파트너 자금정보 */}
      <FundCard>
        <Stack direction="row" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
            }}
          />
          <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>파트너 자금정보</Typography>
        </Stack>
        <FundRow>
          <Typography sx={{ fontSize: '14px', color: theme.palette.text.secondary }}>
            보유금
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 700, color: CHART_COLORS.deposit }}>
            {formatKRW(partnerBalance)}
          </Typography>
        </FundRow>
        <FundRow>
          <Typography sx={{ fontSize: '14px', color: theme.palette.text.secondary }}>
            롤링보유금
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 700, color: CHART_COLORS.alGive }}>
            {formatKRW(partnerRollingBalance)}
          </Typography>
        </FundRow>
        <FundRow>
          <Typography sx={{ fontSize: '14px', color: theme.palette.text.secondary }}>
            합계
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 700, color: theme.palette.text.primary }}>
            {formatKRW(partnerBalance + partnerRollingBalance)}
          </Typography>
        </FundRow>
      </FundCard>

      {/* 고객 자금정보 */}
      <FundCard>
        <Stack direction="row" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: CHART_COLORS.winning,
            }}
          />
          <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>고객 자금정보</Typography>
        </Stack>
        <FundRow>
          <Typography sx={{ fontSize: '14px', color: theme.palette.text.secondary }}>
            보유금
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 700, color: CHART_COLORS.deposit }}>
            {formatKRW(customerBalance)}
          </Typography>
        </FundRow>
        <FundRow>
          <Typography sx={{ fontSize: '14px', color: theme.palette.text.secondary }}>
            롤링보유금
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 700, color: CHART_COLORS.alGive }}>
            {formatKRW(customerRollingBalance)}
          </Typography>
        </FundRow>
        <FundRow>
          <Typography sx={{ fontSize: '14px', color: theme.palette.text.secondary }}>
            합계
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 700, color: theme.palette.text.primary }}>
            {formatKRW(customerBalance + customerRollingBalance)}
          </Typography>
        </FundRow>
      </FundCard>
    </Box>
  );
};

// ─── 메인 대시보드 페이지 ──────────────────────────────────────────────

// ─── 날짜 유틸 ─────────────────────────────────────────────────────────

const getWeekDates = (): { display: string; full: string }[] => {
  const result: { display: string; full: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    result.push({
      display: `${d.getMonth() + 1}/${d.getDate()}`,
      full: `${d.getFullYear()}-${mm}-${dd}`,
    });
  }
  return result;
};

const DashboardPage: React.FC = () => {
  const [dailyData, setDailyData] = useState<DailyData>(EMPTY_DAILY);
  const [thisMonthData, setThisMonthData] = useState<MonthData>(EMPTY_MONTH);
  const [lastMonthData, setLastMonthData] = useState<MonthData>(EMPTY_MONTH);
  const [weeklyData, setWeeklyData] = useState<WeeklyDayRecord[]>([]);
  const [fundData, setFundData] = useState<FundData>(EMPTY_FUND);

  const fetchDashboard = useCallback(async () => {
    try {
      const weekDates = getWeekDates();

      // 9개 API 병렬 호출 (금일 3개 + 일별 3개 + 자금 2개 + monthly 1개)
      const [
        partnerFundsRes,
        customerFundsRes,
        transRes,
        alTransRes,
        betWinRes,
        weekTransRes,
        weekAlTransRes,
        weekBetWinRes,
        monthlyRes,
      ] = await Promise.all([
        callApi({
          service: Service.POSTMAN,
          url: '/api/game-stat/partner-funds',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        }),
        callApi({
          service: Service.POSTMAN,
          url: '/api/game-stat/customer-funds',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        }),
        callApi({
          service: Service.POSTMAN,
          url: '/api/game-stat/trans',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        }),
        callApi({
          service: Service.POSTMAN,
          url: '/api/game-stat/al-trans',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        }),
        callApi({
          service: Service.POSTMAN,
          url: '/api/game-stat/bet-win',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        }),
        callApi({
          service: Service.POSTMAN,
          url: '/api/game-stat/trans-daily',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        }),
        callApi({
          service: Service.POSTMAN,
          url: '/api/game-stat/al-trans-daily',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        }),
        callApi({
          service: Service.POSTMAN,
          url: '/api/game-stat/bet-win-daily',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        }),
        callApi({
          service: Service.POSTMAN,
          url: '/api/game-stat/monthly',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        }),
      ]);

      // ── 일별 데이터 조합 ──
      const weekMap = new Map<string, WeeklyDayRecord>();
      weekDates.forEach(({ display, full }) => {
        weekMap.set(full, {
          date: display,
          fullDate: full,
          deposit: 0,
          withdraw: 0,
          alGive: 0,
          alTake: 0,
          betting: 0,
          winning: 0,
        });
      });

      // trans 일별
      if (weekTransRes.successOrNot === 'Y' && Array.isArray(weekTransRes.data)) {
        weekTransRes.data.forEach((item: any) => {
          const dateKey = item.stat_date ?? item.date ?? item.reg_date;
          const rec = weekMap.get(dateKey);
          if (rec) {
            rec.deposit = Number(item.total_recharge ?? 0);
            rec.withdraw = Number(item.total_exchange ?? 0);
          }
        });
      }
      // al-trans 일별
      if (weekAlTransRes.successOrNot === 'Y' && Array.isArray(weekAlTransRes.data)) {
        weekAlTransRes.data.forEach((item: any) => {
          const dateKey = item.stat_date ?? item.date ?? item.reg_date;
          const rec = weekMap.get(dateKey);
          if (rec) {
            rec.alGive = Number(item.total_payout ?? 0);
            rec.alTake = Number(item.total_recovery ?? 0);
          }
        });
      }
      // bet-win 일별
      if (weekBetWinRes.successOrNot === 'Y' && Array.isArray(weekBetWinRes.data)) {
        weekBetWinRes.data.forEach((item: any) => {
          const dateKey = item.stat_date ?? item.date ?? item.reg_date;
          const rec = weekMap.get(dateKey);
          if (rec) {
            rec.betting = Number(item.total_bet ?? 0);
            rec.winning = Number(item.total_win ?? 0);
          }
        });
      }
      setWeeklyData(weekDates.map(({ full }) => weekMap.get(full)!));

      // /api/game-stat/trans → 충전(total_recharge) / 환전(total_exchange)
      if (transRes.successOrNot === 'Y' && transRes.data) {
        const t = transRes.data;
        setDailyData((prev) => ({
          ...prev,
          deposit: Number(t.total_recharge ?? 0),
          withdraw: Number(t.total_exchange ?? 0),
        }));
      }

      // /api/game-stat/al-trans → 알지급(total_payout) / 알회수(total_recovery)
      if (alTransRes.successOrNot === 'Y' && alTransRes.data) {
        const a = alTransRes.data;
        setDailyData((prev) => ({
          ...prev,
          alGive: Number(a.total_payout ?? 0),
          alTake: Number(a.total_recovery ?? 0),
        }));
      }

      // /api/game-stat/bet-win → 베팅(total_bet) / 당첨(total_win)
      if (betWinRes.successOrNot === 'Y' && betWinRes.data) {
        const b = betWinRes.data;
        setDailyData((prev) => ({
          ...prev,
          betting: Number(b.total_bet ?? 0),
          winning: Number(b.total_win ?? 0),
        }));
      }

      // /api/game-stat/partner-funds + customer-funds → 자금정보
      const newFund: FundData = { ...EMPTY_FUND };
      if (partnerFundsRes.successOrNot === 'Y' && partnerFundsRes.data) {
        const p = partnerFundsRes.data;
        newFund.partnerBalance = Number(p.total_money ?? 0);
        newFund.partnerRollingBalance = Number(p.total_rolling_money ?? 0);
      }
      if (customerFundsRes.successOrNot === 'Y' && customerFundsRes.data) {
        const c = customerFundsRes.data;
        newFund.customerBalance = Number(c.total_money ?? 0);
        newFund.customerRollingBalance = Number(c.total_rolling_money ?? 0);
      }
      setFundData(newFund);

      // /api/game-stat/monthly → 월별 데이터 (이번달 + 이전달)
      if (monthlyRes.successOrNot === 'Y' && monthlyRes.data) {
        const m = monthlyRes.data;
        if (m.thisMonth) {
          const tm = m.thisMonth;
          setThisMonthData({
            deposit: Number(tm.total_recharge ?? 0),
            withdraw: Number(tm.total_exchange ?? 0),
            alGive: Number(tm.total_payout ?? 0),
            alTake: Number(tm.total_recovery ?? 0),
            betting: Number(tm.total_bet ?? 0),
            winning: Number(tm.total_win ?? 0),
          });
        }
        if (m.lastMonth) {
          const lm = m.lastMonth;
          setLastMonthData({
            deposit: Number(lm.total_recharge ?? 0),
            withdraw: Number(lm.total_exchange ?? 0),
            alGive: Number(lm.total_payout ?? 0),
            alTake: Number(lm.total_recovery ?? 0),
            betting: Number(lm.total_bet ?? 0),
            winning: Number(lm.total_win ?? 0),
          });
        }
      }
    } catch {
      // 조용히 무시
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <PageContainer>
      {/* 금일 데이터 */}
      <Box>
        <SectionTitle>금일 데이터</SectionTitle>
        <CardGrid>
          <TodayCard
            title="충전 / 환전"
            value1Label="충전"
            value1={dailyData.deposit}
            value1Color={CHART_COLORS.deposit}
            value2Label="환전"
            value2={dailyData.withdraw}
            value2Color={CHART_COLORS.withdraw}
          />
          <TodayCard
            title="알지급 / 알회수"
            value1Label="알지급"
            value1={dailyData.alGive}
            value1Color={CHART_COLORS.alGive}
            value2Label="알회수"
            value2={dailyData.alTake}
            value2Color={CHART_COLORS.alTake}
          />
          <TodayCard
            title="베팅 / 당첨"
            value1Label="베팅"
            value1={dailyData.betting}
            value1Color={CHART_COLORS.betting}
            value2Label="당첨"
            value2={dailyData.winning}
            value2Color={CHART_COLORS.winning}
          />
        </CardGrid>
      </Box>

      {/* 일별 데이터 */}
      <Box>
        <SectionTitle>일별 데이터</SectionTitle>
        <DailySection weeklyData={weeklyData} />
      </Box>

      {/* 월별 데이터 */}
      <Box>
        <SectionTitle>월별 데이터</SectionTitle>
        <MonthlySection thisMonth={thisMonthData} lastMonth={lastMonthData} />
      </Box>

      {/* 파트너 & 고객 자금정보 */}
      <Box>
        <SectionTitle>파트너 &amp; 고객 자금정보</SectionTitle>
        <FundInfoSection
          partnerBalance={fundData.partnerBalance}
          partnerRollingBalance={fundData.partnerRollingBalance}
          customerBalance={fundData.customerBalance}
          customerRollingBalance={fundData.customerRollingBalance}
        />
      </Box>
    </PageContainer>
  );
};

export default DashboardPage;
