/**
 * EmissionStatus.tsx
 *
 * 배출량 현황 차트 컴포넌트 (년도별)
 * - 공통 ComposedBarLineChart 컴포넌트 사용
 * - 2023, 2024, 2025 년도별 배출량 표시
 * - 마지막 년도(2025)만 실색으로, 나머지는 패턴으로 표현
 */

import { useCustomTooltip, TooltipData } from '../../../components/EtsCommon/EtsCustomTooltip';
import ComposedBarLineChart, {
  BarConfig,
  LineConfig,
  ChartPattern,
} from '../../../components/EtsCommon/EtsComposedBarLineChart';

// 년도별 배출량 데이터
const yearlyData = [
  { year: '2023', domestic: 5200000, international: 3400000 },
  { year: '2024', domestic: 5500000, international: 3600000 },
  { year: '2025', domestic: 5800000, international: 3800000 },
].map((item) => ({
  ...item,
  total: item.domestic + item.international,
  average: (item.domestic + item.international) / 2,
}));

// 차트 패턴 정의
const chartPatterns: ChartPattern[] = [
  {
    id: 'internationalPatternYear',
    fill: '#E6E7EF',
    strokeColor: '#081c78',
  },
  {
    id: 'domesticPatternYear',
    fill: '#E6E7EF',
    strokeColor: '#3cb4ec',
  },
];

// 바 설정
const barConfigs: BarConfig[] = [
  {
    dataKey: 'international',
    fill: 'url(#internationalPatternYear)',
    solidFill: '#1177a7',
    pattern: chartPatterns[1],
  },
  {
    dataKey: 'domestic',
    fill: 'url(#domesticPatternYear)',
    solidFill: '#051766',
    pattern: chartPatterns[0],
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

export default function EmissionStatus() {
  const { showTooltip, hideTooltip, TooltipComponent } = useCustomTooltip();

  // 툴팁 데이터 포맷터
  const formatTooltipData = (data: any, dataKey: string): TooltipData[] => {
    const domestic = data.domestic || 0;
    const international = data.international || 0;
    const total = domestic + international;
    const isInternational = dataKey === 'international';

    return [
      { label: 'Year', value: data.year },
      { label: 'Total', value: total.toLocaleString() },
      { label: 'Domestic', value: domestic.toLocaleString() },
      { label: 'International', value: international.toLocaleString() },
      {
        label: 'Hovered',
        value: `${isInternational ? 'International' : 'Domestic'} (${(isInternational ? international : domestic).toLocaleString()})`,
        color: isInternational ? '#C53030' : '#2B6CB0',
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
        data={yearlyData}
        bars={barConfigs}
        line={lineConfig}
        patterns={chartPatterns}
        onBarHover={handleBarHover}
        onBarLeave={hideTooltip}
        labels={{
          show: true,
          formatter: (value) => Math.round(value / 1000000).toString() + 'M',
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
