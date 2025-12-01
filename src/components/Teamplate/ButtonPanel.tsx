import React from 'react';
import { Box, Fade, Collapse } from '@mui/material';

export interface ButtonPanelProps {
  buttonComponent: React.ReactNode;
  /** 전체 패널 표시 여부 */
  open?: boolean;
  /** 패널 확장 기준 (right면 오른쪽에서 왼쪽으로 펼침) */
  expandFrom?: 'left' | 'right';
  /** 단일 버튼 페이드 시간(ms) */
  timeout?: number;
  /** 버튼 순차 페이드 사용 여부 */
  stagger?: boolean;
  /** 버튼간 지연 간격(ms) */
  staggerInterval?: number;
  /** 지연 시작 기준 (right: 오른쪽 버튼 먼저) */
  staggerFrom?: 'left' | 'right';
}

const ButtonPanel: React.FC<ButtonPanelProps> = ({
  buttonComponent,
  open = true,
  expandFrom = 'right',
  timeout = 200,
  stagger = true,
  staggerInterval = 80,
  staggerFrom = 'right',
}) => {
  const childrenArray = React.Children.toArray(buttonComponent);
  const ordered = staggerFrom === 'right' ? [...childrenArray].reverse() : childrenArray;

  return (
    <Collapse
      in={open}
      orientation="horizontal"
      mountOnEnter
      unmountOnExit
      appear
      style={{ transformOrigin: expandFrom === 'right' ? 'right center' : 'left center' }}
    >
      <Box sx={{ display: 'flex' }}>
        {childrenArray.map((child, originalIndex) => {
          if (!stagger) {
            return (
              <Fade in={open} timeout={timeout} key={originalIndex} appear unmountOnExit>
                <Box sx={{ display: 'inline-flex' }}>{child}</Box>
              </Fade>
            );
          }
          // 계산: 오른쪽 기준이면 reverse 순서의 인덱스를 찾는다.
          const reversedIndex = ordered.indexOf(child);
          const delayIndex = staggerFrom === 'right' ? reversedIndex : originalIndex;
          const delay = open ? delayIndex * staggerInterval : 0;
          return (
            <Fade
              in={open}
              timeout={timeout}
              key={originalIndex}
              style={{ transitionDelay: `${delay}ms` }}
              appear
              unmountOnExit
            >
              <Box sx={{ display: 'inline-flex' }}>{child}</Box>
            </Fade>
          );
        })}
      </Box>
    </Collapse>
  );
};

export default ButtonPanel;
