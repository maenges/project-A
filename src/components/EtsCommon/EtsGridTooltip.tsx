/**
 * EtsGridTooltip.tsx
 *
 * AG Grid용 커스텀 툴팁 컴포넌트
 * - 그리드 셀 호버 시 표시되는 툴팁
 * - 화살표가 있는 말풍선 형태
 * - 텍스트가 긴 경우 자동으로 표시
 */

import { useRef, useCallback, RefObject, FC, useState } from 'react';
import styled from 'styled-components';
import tooltipArrow from '@/assets/images/tooltip-arrow.svg';

// 툴팁 컨테이너 스타일링
const TooltipContainer = styled.div`
  position: absolute;
  z-index: 1000;
  display: none;
  pointer-events: none;
  flex-direction: column;
  align-items: center;
  width: 800px;
`;

// 바디 필드 스타일링 (화살표보다 먼저)
const BodyField = styled.div<{ $isAbove?: boolean }>`
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 0 20px 0 rgba(0, 0, 0, 0.15),
    20px 20px 36px 0 rgba(0, 0, 0, 0.2);
  width: 100%;
  order: ${(props) => (props.$isAbove ? 1 : 2)};
`;

// 화살표 필드 스타일링 (바디 위쪽에 위치)
const ArrowField = styled.div<{ $isAbove?: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: -1px;
  margin-right: 50px;
  width: 100%;
  order: ${(props) => (props.$isAbove ? 2 : 1)};

  img {
    width: 20px;
    height: 10px;
    transform: ${(props) => (props.$isAbove ? 'rotate(180deg)' : 'none')};
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0));
  }
`;

// 바디 콘텐츠 스타일링
const BodyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 100%;

  .modal-body-tooltip {
    color: var(--color-text-base, #252525) !important;
    font-family: 'Sans' !important;
    font-size: var(--font-size-body-ms, 14px) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-regular, 400) !important;
    line-height: 150% !important;
    word-break: break-word;
    text-align: left;
    width: 100%;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
`;

// 툴팁 데이터 타입
export interface GridTooltipData {
  content: string;
}

// 툴팁 훅의 반환 타입
export interface UseGridTooltipReturn {
  tooltipRef: RefObject<HTMLDivElement | null>;
  showTooltip: (data: GridTooltipData, x: number, y: number) => void;
  hideTooltip: () => void;
  TooltipComponent: FC;
}

// 그리드 툴팁 훅
export function useGridTooltip(): UseGridTooltipReturn {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isAbove, setIsAbove] = useState(false);

  // 툴팁 표시 함수
  const showTooltip = useCallback((data: GridTooltipData, x: number, y: number) => {
    if (!tooltipRef.current) return;

    // 툴팁 내용 설정
    const tooltipTextElement = tooltipRef.current.querySelector('.modal-body-tooltip');
    if (tooltipTextElement) {
      tooltipTextElement.textContent = data.content;
    }

    // 임시로 툴팁을 보이게 해서 실제 높이 측정
    tooltipRef.current.style.display = 'flex';
    tooltipRef.current.style.visibility = 'hidden';

    // 실제 툴팁 크기 측정
    const tooltipWidth = 800;
    const actualTooltipHeight = tooltipRef.current.offsetHeight;
    const windowHeight = window.innerHeight;

    // 툴팁을 아래쪽에 표시할 공간이 충분한지 확인
    const spaceBelow = windowHeight - y;
    const shouldShowAbove = spaceBelow < actualTooltipHeight + 50 || y > windowHeight / 2;

    setIsAbove(shouldShowAbove);

    // 위치 계산
    let left = x - tooltipWidth + 30;
    let top = shouldShowAbove ? y - actualTooltipHeight + 10 : y + 10;

    // 툴팁 표시 및 위치 설정
    tooltipRef.current.style.visibility = 'visible';
    tooltipRef.current.style.left = `${left}px`;
    tooltipRef.current.style.top = `${top}px`;
  }, []);

  // 툴팁 숨김 함수
  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
    }
  }, []);

  // 툴팁 컴포넌트
  const TooltipComponent = () => (
    <TooltipContainer ref={tooltipRef}>
      <ArrowField $isAbove={isAbove}>
        <img src={tooltipArrow} alt="tooltip arrow" />
      </ArrowField>
      <BodyField $isAbove={isAbove}>
        <BodyContent>
          <div className="modal-body-tooltip"></div>
        </BodyContent>
      </BodyField>
    </TooltipContainer>
  );

  return {
    tooltipRef,
    showTooltip,
    hideTooltip,
    TooltipComponent,
  };
}
