/**
 * ComposedBarLineChart.tsx
 *
 * Bar + Line 혼용 차트 공통 컴포넌트
 * - 다중 바 차트와 라인 차트를 동시에 표시
 * - 패턴 지원 (마지막 항목만 실색, 나머지는 패턴)
 * - 커스텀 라벨 지원
 * - 유연한 툴팁 설정
 */

import { Stack } from '@mui/system';
import styled from 'styled-components';
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

// 차트 컨테이너 스타일링
const ChartContainer = styled(Stack)`
  min-height: 12vh; /* 더 작은 최소 높이 */
  height: 100%;
  flex: 1;
  position: relative;
  overflow: hidden; /* 컨텐츠 오버플로 방지 */

  /* 차트 클릭 시 테두리 제거 */
  * {
    outline: none !important;
  }

  /* Recharts 컴포넌트의 포커스 아웃라인 제거 */
  .recharts-wrapper {
    outline: none !important;
  }
`;

// 패턴 정의 타입
export interface ChartPattern {
  id: string;
  fill: string;
  strokeColor: string;
}

// 바 설정 타입
export interface BarConfig {
  dataKey: string;
  fill: string;
  pattern?: ChartPattern;
  solidFill?: string; // 마지막 항목용 실색
  name?: string;
  radius?: [number, number, number, number];
}

// 라인 설정 타입
export interface LineConfig {
  dataKey: string;
  stroke: string;
  strokeWidth?: number;
  dot?: any;
  activeDot?: any;
  connectNulls?: boolean;
}

// 차트 컨테이너 props 타입
export interface ChartContainerProps {
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  barCategoryGap?: string;
}

// 라벨 설정 타입
export interface LabelConfig {
  show: boolean;
  formatter?: (value: any) => string;
  background?: string;
  color?: string;
  fontSize?: number;
}

// 메인 컴포넌트 props 타입
export interface ComposedBarLineChartProps {
  data: any[];
  bars: BarConfig[];
  line?: LineConfig;
  onBarHover?: (data: any, dataKey: string, event: any) => void;
  onBarLeave?: () => void;
  labels?: LabelConfig;
  patterns?: ChartPattern[];
  containerProps?: ChartContainerProps;
  isLastItemSolid?: (item: any, index: number) => boolean; // 마지막 항목 판별 함수
  xAxisKey?: string;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

// 기본 패턴들
const defaultPatterns: ChartPattern[] = [
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

// 패턴 정의 컴포넌트
const ChartPatterns = ({ patterns }: { patterns: ChartPattern[] }) => (
  <defs>
    {patterns.map((pattern) => (
      <pattern
        key={pattern.id}
        id={pattern.id}
        patternUnits="userSpaceOnUse"
        width="4"
        height="4"
        patternTransform="rotate(45)"
      >
        <rect width="4" height="4" fill={pattern.fill} />
        <rect width="1" height="4" fill={pattern.strokeColor} />
      </pattern>
    ))}
  </defs>
);

// 커스텀 라벨 컴포넌트
const CustomLabel = ({ x, y, width, value, config }: any) => {
  if (!config?.show) return null;

  const labelText = config.formatter ? config.formatter(value) : Math.round(value / 1000);
  const labelX = x + width / 2;
  const labelY = y - 5;

  return (
    <g>
      {/* 배경 사각형 */}
      <rect
        x={labelX - 16}
        y={labelY - 22}
        width="32px"
        height="21px"
        fill={config.background || '#EEF8FD'}
        rx={2}
      />
      {/* 라벨 텍스트 */}
      <text
        x={labelX}
        y={labelY - 8}
        fill={config.color || '#051766'}
        textAnchor="middle"
        fontSize={config.fontSize || 10}
        fontWeight="500"
      >
        {labelText}
      </text>
    </g>
  );
};

// 바 색상 결정 함수
const getBarFill = (barConfig: BarConfig, isLastItem: boolean) => {
  if (isLastItem && barConfig.solidFill) {
    return barConfig.solidFill;
  } else if (barConfig.pattern) {
    return `url(#${barConfig.pattern.id})`;
  }
  return barConfig.fill;
};

// 메인 컴포넌트
export default function ComposedBarLineChart({
  data,
  bars,
  line,
  onBarHover,
  onBarLeave,
  labels,
  patterns = defaultPatterns,
  containerProps = {},
  isLastItemSolid = (_, index) => index === data.length - 1,
  xAxisKey = 'month',
  showXAxis = true,
  showYAxis = false,
}: ComposedBarLineChartProps) {
  const { margin = { top: 40, right: 15, bottom: 12, left: 10 }, barCategoryGap = '15%' } =
    /* 더 작은 기본값 */
    containerProps;

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={margin} barCategoryGap={barCategoryGap}>
          {/* 차트 패턴 정의 */}
          <ChartPatterns patterns={patterns} />

          {/* X축 설정 */}
          {showXAxis && (
            <XAxis
              dataKey={xAxisKey}
              axisLine={true}
              tickLine={false}
              tick={{ fontSize: '0.625rem', fill: '#666' }} /* 10px */
              tickMargin={10} /* 더 작은 마진 */
            />
          )}

          {/* Y축 설정 */}
          {showYAxis ? <YAxis /> : <YAxis hide />}

          {/* 바 차트들 */}
          {bars.map((barConfig, barIndex) => (
            <Bar
              key={`bar-${barIndex}-${barConfig.dataKey}`}
              dataKey={barConfig.dataKey}
              fill={barConfig.fill}
              width={24}
              barSize={24}
              radius={barConfig.radius || [4, 4, 0, 0]}
              label={labels?.show ? <CustomLabel config={labels} /> : undefined}
              onMouseEnter={
                onBarHover ? (data, event) => onBarHover(data, barConfig.dataKey, event) : undefined
              }
              onMouseLeave={onBarLeave}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${barConfig.dataKey}-cell-${index}`}
                  fill={getBarFill(barConfig, isLastItemSolid(entry, index))}
                />
              ))}
            </Bar>
          ))}

          {/* 라인 차트 */}
          {line && (
            <Line
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth || 1}
              dot={line.dot || { fill: line.stroke, strokeWidth: 1, r: 3 }}
              activeDot={line.activeDot || false}
              connectNulls={line.connectNulls || false}
              tooltipType="none"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
