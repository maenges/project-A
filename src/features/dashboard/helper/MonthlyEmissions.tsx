/**
 * MonthlyEmissions.tsx
 *
 * 월별 배출량 현황 차트 컴포넌트
 * - 공통 ComposedBarLineChart 컴포넌트 사용
 * - 국내선과 국제선 배출량을 구분하여 표시
 * - 마지막 달(12월)만 실색으로, 나머지는 패턴으로 표현
 * - 바 차트에 마우스 호버 시 툴팁 표시
 * - 두 바의 평균값을 라인으로 연결
 */

import { useCustomTooltip, TooltipData } from '../../../components/EtsCommon/EtsCustomTooltip';
import ComposedBarLineChart, {
  BarConfig,
  LineConfig,
  ChartPattern,
} from '../../../components/EtsCommon/EtsComposedBarLineChart';

// 월별 배출량 데이터 - 국내선과 국제선 배출량 정보
const monthlyData = [
  { month: 'Jan', domestic: 420000, international: 280000 },
  { month: 'Feb', domestic: 380000, international: 290000 },
  { month: 'Mar', domestic: 450000, international: 310000 },
  { month: 'Apr', domestic: 390000, international: 270000 },
  { month: 'May', domestic: 440000, international: 300000 },
  { month: 'Jun', domestic: 410000, international: 285000 },
  { month: 'Jul', domestic: 460000, international: 320000 },
  { month: 'Aug', domestic: 430000, international: 295000 },
  { month: 'Sep', domestic: 425000, international: 285000 },
  { month: 'Oct', domestic: 465000, international: 315000 },
  { month: 'Nov', domestic: 445000, international: 305000 },
  { month: 'Dec', domestic: 475000, international: 330000 },
].map((item) => ({
  ...item,
  total: item.domestic + item.international, // 총 배출량 계산
  average: (item.domestic + item.international) / 2, // 평균값 계산 (라인 차트용)
}));

// 차트 패턴 정의
const chartPatterns: ChartPattern[] = [
  {
    id: 'internationalPattern',
    fill: '#E6E7EF',
    strokeColor: '#081c78',
  },
  {
    id: 'domesticPattern',
    fill: '#E6E7EF',
    strokeColor: '#3cb4ec',
  },
];

// 바 설정
const barConfigs: BarConfig[] = [
  {
    dataKey: 'international',
    fill: 'url(#internationalPattern)',
    solidFill: '#1177a7',
    pattern: chartPatterns[1],
  },
  {
    dataKey: 'domestic',
    fill: 'url(#domesticPattern)',
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

// 메인 컴포넌트 - 월별 배출량 현황 차트
export default function MonthlyEmissions() {
  const { showTooltip, hideTooltip, TooltipComponent } = useCustomTooltip();

  // 툴팁 데이터 포맷터
  const formatTooltipData = (data: any, dataKey: string): TooltipData[] => {
    const domestic = data.domestic || 0;
    const international = data.international || 0;
    const total = domestic + international;
    const isInternational = dataKey === 'international';

    return [
      { label: 'Month', value: data.month },
      { label: 'Total', value: total.toLocaleString() },
      { label: 'Pax', value: domestic.toLocaleString() },
      { label: 'Cgo', value: international.toLocaleString() },
      {
        label: 'Hovered',
        value: `${isInternational ? 'Cgo' : 'Pax'} (${(isInternational ? international : domestic).toLocaleString()})`,
        color: isInternational ? '#051766' : '#1177a7',
        isHighlighted: true,
      },
    ];
  };

  // 바 호버 이벤트 핸들러
  const handleBarHover = (data: any, dataKey: string, event: any) => {
    const tooltipData = formatTooltipData(data, dataKey);
    showTooltip(tooltipData, event);
  };

  // 12월(마지막 달) 판별 함수
  const isLastMonth = (item: any) => item.month === 'Dec';

  return (
    <>
      <TooltipComponent />
      <ComposedBarLineChart
        data={monthlyData}
        bars={barConfigs}
        line={lineConfig}
        patterns={chartPatterns}
        onBarHover={handleBarHover}
        onBarLeave={hideTooltip}
        labels={{
          show: true,
          formatter: (value) => Math.round(value / 1000).toString(),
        }}
        isLastItemSolid={isLastMonth}
        xAxisKey="month"
        containerProps={{
          margin: { top: 40, right: 15, bottom: 12, left: 10 } /* 더 작은 마진 */,
          barCategoryGap: '15%' /* 더 작은 간격 */,
        }}
      />
    </>
  );
}
