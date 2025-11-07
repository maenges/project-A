/**
 * FlightFrequency.tsx
 *
 * 운항 빈도 차트 컴포넌트 (년도별)
 * - 공통 ComposedBarLineChart 컴포넌트 사용
 * - 2023, 2024, 2025 년도별 운항 빈도 표시
 * - 마지막 년도(2025)만 실색으로, 나머지는 패턴으로 표현
 */

import { useCustomTooltip, TooltipData } from '../../../components/EtsCommon/EtsCustomTooltip';
import ComposedBarLineChart, {
  BarConfig,
  LineConfig,
  ChartPattern,
} from '../../../components/EtsCommon/EtsComposedBarLineChart';

// 년도별 운항 빈도 데이터
const frequencyData = [
  { year: '2023', passenger: 4200, cargo: 1800 },
  { year: '2024', passenger: 4500, cargo: 1950 },
  { year: '2025', passenger: 4800, cargo: 2100 },
].map((item) => ({
  ...item,
  total: item.passenger + item.cargo,
  average: (item.passenger + item.cargo) / 2,
}));

// 차트 패턴 정의
const chartPatterns: ChartPattern[] = [
  {
    id: 'passengerPatternFreq',
    fill: '#e6e7ef',
    strokeColor: '#3cb4ec',
  },
  {
    id: 'cargoPatternFreq',
    fill: '#e6e7ef',
    strokeColor: '#081c78',
  },
];

// 바 설정
const barConfigs: BarConfig[] = [
  {
    dataKey: 'passenger',
    fill: 'url(#passengerPatternFreq)',
    solidFill: '#1177a7',
    pattern: chartPatterns[0],
  },
  {
    dataKey: 'cargo',
    fill: 'url(#cargoPatternFreq)',
    solidFill: '#051766',
    pattern: chartPatterns[1],
  },
];

// 라인 설정 - 더 작게 조정
const lineConfig: LineConfig = {
  dataKey: 'average',
  stroke: '#57BBEB',
  strokeWidth: 0.8 /* 더 얗c은 라인 */,
  dot: { fill: '#57BBEB', strokeWidth: 0.8, r: 2 } /* 더 작은 점 */,
  activeDot: false,
  connectNulls: false,
};

export default function FlightFrequency() {
  const { showTooltip, hideTooltip, TooltipComponent } = useCustomTooltip();

  // 툴팁 데이터 포맷터
  const formatTooltipData = (data: any, dataKey: string): TooltipData[] => {
    const passenger = data.passenger || 0;
    const cargo = data.cargo || 0;
    const total = passenger + cargo;
    const isCargo = dataKey === 'cargo';

    return [
      { label: 'Year', value: data.year },
      { label: 'Total Flights', value: total.toLocaleString() },
      { label: 'Passenger', value: passenger.toLocaleString() },
      { label: 'Cargo', value: cargo.toLocaleString() },
      {
        label: 'Hovered',
        value: `${isCargo ? 'Cargo' : 'Passenger'} (${(isCargo ? cargo : passenger).toLocaleString()})`,
        color: isCargo ? '#D69E2E' : '#319795',
        isHighlighted: true,
      },
    ];
  };

  // 바 호버 이벤트 핸들러
  const handleBarHover = (data: any, dataKey: string, event: any) => {
    const tooltipData = formatTooltipData(data, dataKey);
    showTooltip(tooltipData, event);
  };

  // 2025년(마지막 년도) 판별 함수
  const isLastYear = (item: any) => item.year === '2025';

  return (
    <>
      <TooltipComponent />
      <ComposedBarLineChart
        data={frequencyData}
        bars={barConfigs}
        line={lineConfig}
        patterns={chartPatterns}
        onBarHover={handleBarHover}
        onBarLeave={hideTooltip}
        labels={{
          show: true,
          formatter: (value) => (value / 1000).toFixed(1) + 'K',
        }}
        isLastItemSolid={isLastYear}
        xAxisKey="year"
        containerProps={{
          margin: { top: 35, right: 12, bottom: 10, left: 8 } /* 더 작은 마진 */,
          barCategoryGap: '20%' /* 더 작은 간격 */,
        }}
      />
    </>
  );
}
