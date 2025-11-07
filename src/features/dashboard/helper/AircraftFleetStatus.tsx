import { styled } from 'styled-components';
import { useRef, useState, useLayoutEffect, useCallback } from 'react';
import icArrowLeft from '@/assets/images/ic-arrow-left.svg';
import icArrowRight from '@/assets/images/ic-arrow-right.svg';
import { Stack } from '@mui/system';

const dummyArr = [
  { acType: '223', quantity: 10 },
  { acType: '32Q', quantity: 16 },
  { acType: '333', quantity: 19 },
  { acType: '359', quantity: 2 },
  { acType: '388', quantity: 6 },
  { acType: '739', quantity: 9 },
  { acType: '73H', quantity: 2 },
  { acType: '73J', quantity: 6 },
  { acType: '73W', quantity: 1 },
  { acType: '74H', quantity: 5 },
  { acType: '74N', quantity: 7 },
  { acType: '74Y', quantity: 4 },
  { acType: '772', quantity: 5 },
  { acType: '773', quantity: 4 },
  { acType: '77W', quantity: 25 },
  { acType: '223', quantity: 10 },
  { acType: '32Q', quantity: 16 },
  { acType: '333', quantity: 19 },
  { acType: '359', quantity: 2 },
  { acType: '388', quantity: 6 },
  { acType: '739', quantity: 9 },
  { acType: '73H', quantity: 2 },
  { acType: '73J', quantity: 6 },
  { acType: '73W', quantity: 1 },
  { acType: '74H', quantity: 5 },
  { acType: '74N', quantity: 7 },
  { acType: '74Y', quantity: 4 },
  { acType: '772', quantity: 5 },
  { acType: '773', quantity: 4 },
  { acType: '77W', quantity: 25 },
];

const AcTypeArea = styled(Stack)`
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem; /* 8px */
  padding: 0.5rem 0.375rem; /* 8px 6px */
  min-width: 3rem; /* 48px */
  min-height: 2.25rem; /* 36px */
  font-size: 0.875rem; /* 14px */
  font-weight: 700;
  justify-content: center;
  align-items: center;

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    padding: 0.375rem 0.25rem; /* 6px 4px */
    min-width: 2.5rem; /* 40px */
    min-height: 1.875rem; /* 30px */
    font-size: 0.75rem; /* 12px */
    border-radius: 0.375rem;
  }

  @media (max-height: 700px) {
    padding: 0.25rem 0.125rem; /* 4px 2px */
    min-width: 2rem; /* 32px */
    min-height: 1.5rem; /* 24px */
    font-size: 0.625rem; /* 10px */
    border-radius: 0.25rem;
  }

  @media (max-height: 600px) {
    padding: 0.125rem 0.0625rem; /* 2px 1px */
    min-width: 1.5rem; /* 24px */
    min-height: 1.125rem; /* 18px */
    font-size: 0.5rem; /* 8px */
    border-radius: 0.125rem;
  }
`;

const CommonBox = styled(Stack)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ListBar = styled.div`
  border: 0.5px solid #d9d9d9;
  height: 66%;
  margin: 0 0.5rem 0 0.625rem; /* 8px 10px */

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    margin: 0 0.375rem 0 0.5rem; /* 6px 8px */
  }

  @media (max-height: 700px) {
    margin: 0 0.25rem 0 0.375rem; /* 4px 6px */
  }

  @media (max-height: 600px) {
    margin: 0 0.125rem 0 0.25rem; /* 2px 4px */
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 0.625rem; /* 10px */
  overflow-x: auto;
  scroll-behavior: smooth;
  width: 100%;
  will-change: scroll-position;

  /* Hide scrollbar */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    gap: 0.5rem; /* 8px */
  }

  @media (max-height: 700px) {
    gap: 0.375rem; /* 6px */
  }

  @media (max-height: 600px) {
    gap: 0.25rem; /* 4px */
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem; /* 10px */
  width: 100%;
  position: relative;

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    gap: 0.5rem; /* 8px */
  }

  @media (max-height: 700px) {
    gap: 0.375rem; /* 6px */
  }

  @media (max-height: 600px) {
    gap: 0.25rem; /* 4px */
  }
`;

const ScrollWrapper = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;

  /* 왼쪽 그라데이션 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: clamp(1rem, 2.5vw, 1.25rem); /* 반응형 그라데이션 너비 */
    height: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: 1;
    pointer-events: none;
    opacity: var(--show-left-fade, 0);
    transition: opacity 0.2s ease;
  }

  /* 오른쪽 그라데이션 */
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: clamp(1rem, 2.5vw, 1.25rem); /* 반응형 그라데이션 너비 */
    height: 100%;
    background: linear-gradient(to left, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: 1;
    pointer-events: none;
    opacity: var(--show-right-fade, 0);
    transition: opacity 0.2s ease;
  }
`;

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem; /* 40px */
  height: 2.5rem; /* 40px */
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    transform: scale(0.95);
  }

  img {
    width: 100%;
    height: 100%;
    filter: brightness(0) saturate(100%) invert(6%) sepia(98%) saturate(7084%) hue-rotate(237deg)
      brightness(91%) contrast(123%);
  }

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    width: 2rem; /* 32px */
    height: 2rem; /* 32px */
  }

  @media (max-height: 700px) {
    width: 1.5rem; /* 24px */
    height: 1.5rem; /* 24px */
  }

  @media (max-height: 600px) {
    width: 1.25rem; /* 20px */
    height: 1.25rem; /* 20px */
  }
`;

export default function AircraftFleetStatus() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  // 디바운싱으로 성능 최적화
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    const wrapper = wrapperRef.current;
    if (!element || !wrapper) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;
    const maxScroll = scrollWidth - clientWidth;
    const threshold = 1;

    const hasLeftScroll = scrollLeft > threshold;
    const hasRightScroll = scrollLeft < maxScroll - threshold;

    // 상태 업데이트
    setCanScrollLeft(hasLeftScroll);
    setCanScrollRight(hasRightScroll);

    // 그라데이션 CSS 변수 업데이트
    wrapper.style.setProperty('--show-left-fade', hasLeftScroll ? '1' : '0');
    wrapper.style.setProperty('--show-right-fade', hasRightScroll ? '1' : '0');
  }, []);

  const debouncedUpdate = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(updateScrollState, 10);
  }, [updateScrollState]);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    // 간단한 초기화
    const initScroll = () => {
      requestAnimationFrame(updateScrollState);
    };

    initScroll();

    // 스크롤 이벤트만 등록 (디바운싱 적용)
    element.addEventListener('scroll', debouncedUpdate, { passive: true });

    return () => {
      element.removeEventListener('scroll', debouncedUpdate);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [debouncedUpdate, updateScrollState]);

  const scrollToEnd = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTo({
      left: element.scrollWidth,
      behavior: 'smooth',
    });
  }, []);

  const scrollToStart = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  const acTypeSet = useCallback(
    (
      { acType, quantity, isLast }: { acType: string; quantity: number; isLast: boolean },
      index: number
    ) => {
      return (
        <Stack
          display={'flex'}
          flexDirection={'row'}
          key={`${acType}-${index}`}
          alignItems={'center'}
        >
          <CommonBox
            direction={'row'}
            gap={'0.5rem'} /* 8px */
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              '@media (max-height: 1050px)': {
                fontSize: '0.75rem',
                gap: '0.375rem',
              },
              '@media (max-height: 700px)': {
                fontSize: '0.625rem',
                gap: '0.25rem',
              },
              '@media (max-height: 600px)': {
                fontSize: '0.5rem',
                gap: '0.125rem',
              },
            }} /* 14px */
            flexShrink={0}
          >
            <AcTypeArea>{acType}</AcTypeArea>
            <CommonBox
              sx={{
                fontSize: '0.875rem',
                fontWeight: 700,
                '@media (max-height: 1050px)': {
                  fontSize: '0.75rem',
                },
                '@media (max-height: 700px)': {
                  fontSize: '0.625rem',
                },
                '@media (max-height: 600px)': {
                  fontSize: '0.5rem',
                },
              }}
            >
              {quantity}
            </CommonBox>
          </CommonBox>
          {isLast ? null : <ListBar />}
        </Stack>
      );
    },
    []
  );

  return (
    <NavigationContainer>
      {canScrollLeft && (
        <ArrowButton onClick={scrollToStart}>
          <img src={icArrowLeft} alt="left arrow" />
        </ArrowButton>
      )}

      <ScrollWrapper ref={wrapperRef}>
        <ScrollContainer ref={scrollRef}>
          {dummyArr.map((v, index) =>
            acTypeSet({ ...v, isLast: index === dummyArr.length - 1 }, index)
          )}
        </ScrollContainer>
      </ScrollWrapper>

      {canScrollRight && (
        <ArrowButton onClick={scrollToEnd}>
          <img src={icArrowRight} alt="right arrow" />
        </ArrowButton>
      )}
    </NavigationContainer>
  );
}
