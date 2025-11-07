/**
 * CustomTooltip.tsx
 *
 * 차트용 공통 툴팁 훅 컴포넌트
 * - ref 기반으로 DOM 직접 조작하여 성능 최적화
 * - 마우스 위치를 실시간으로 추적
 * - 화면 경계를 고려한 자동 위치 조정
 */

import { useRef, useCallback, useEffect, RefObject, FC } from 'react';
import styled from 'styled-components';

// 커스텀 툴팁 DOM 엘리먼트 스타일링
const CustomTooltipDiv = styled.div`
  position: fixed;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  pointer-events: none;
  z-index: 1000;
  display: none;
  max-width: 250px;

  .tooltip-text {
    font-size: 11px;
    color: #666;
    margin-bottom: 2px;
    white-space: nowrap;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// 툴팁 데이터 타입
export interface TooltipData {
  label: string;
  value: string | number;
  color?: string;
  isHighlighted?: boolean;
}

// 툴팁 훅의 반환 타입
export interface UseCustomTooltipReturn {
  tooltipRef: RefObject<HTMLDivElement | null>;
  showTooltip: (data: TooltipData[], event: any) => void;
  hideTooltip: () => void;
  TooltipComponent: FC;
}

// 커스텀 툴팁 훅
export function useCustomTooltip(): UseCustomTooltipReturn {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mouseMoveHandlerRef = useRef<((event: MouseEvent) => void) | null>(null);

  // 마우스 움직임 이벤트 핸들러
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!tooltipRef.current || tooltipRef.current.style.display === 'none') return;

    // 윈도우 기준 마우스 위치
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // 툴팁 크기 계산
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width || 250; // 기본값
    const tooltipHeight = tooltipRect.height || 120; // 기본값

    // 윈도우 크기
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 툴팁 위치 계산 (화면 밖으로 나가지 않도록)
    let x = mouseX + 15; // 마우스 오른쪽에 15px 떨어져서
    let y = mouseY - tooltipHeight - 10; // 마우스 위쪽에 10px 떨어져서

    // 오른쪽 경계 체크
    if (x + tooltipWidth > windowWidth) {
      x = mouseX - tooltipWidth - 15; // 마우스 왼쪽으로
    }

    // 위쪽 경계 체크
    if (y < 0) {
      y = mouseY + 15; // 마우스 아래쪽으로
    }

    // 아래쪽 경계 체크
    if (y + tooltipHeight > windowHeight) {
      y = windowHeight - tooltipHeight - 10;
    }

    // 왼쪽 경계 체크
    if (x < 0) {
      x = 10;
    }

    tooltipRef.current.style.left = `${x}px`;
    tooltipRef.current.style.top = `${y}px`;
  }, []);

  // 툴팁 표시 함수
  const showTooltip = useCallback(
    (data: TooltipData[], event: any) => {
      if (!tooltipRef.current) return;

      // 툴팁 내용 생성
      const tooltipHTML = data
        .map((item) => {
          const style = item.isHighlighted
            ? `font-weight: bold; color: ${item.color || '#000'};`
            : '';

          return `<div class="tooltip-text" style="${style}">${item.label}: ${item.value}</div>`;
        })
        .join('');

      tooltipRef.current.innerHTML = tooltipHTML;
      tooltipRef.current.style.display = 'block';

      // 기존 이벤트 리스너 제거
      if (mouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      }

      // 새로운 마우스 움직임 이벤트 리스너 추가
      mouseMoveHandlerRef.current = handleMouseMove;
      document.addEventListener('mousemove', handleMouseMove);

      // 초기 위치 설정
      handleMouseMove(event.nativeEvent || event);
    },
    [handleMouseMove]
  );

  // 툴팁 숨김 함수
  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
      // 마우스 움직임 이벤트 리스너 제거
      if (mouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
        mouseMoveHandlerRef.current = null;
      }
    }
  }, []);

  // 컴포넌트 unmount 시 이벤트 리스너 정리
  useEffect(() => {
    return () => {
      if (mouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      }
    };
  }, []);

  // 툴팁 컴포넌트
  const TooltipComponent = () => <CustomTooltipDiv ref={tooltipRef} />;

  return {
    tooltipRef,
    showTooltip,
    hideTooltip,
    TooltipComponent,
  };
}
