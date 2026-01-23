import React from 'react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './clientStyleTokens';

const AUTOPLAY_MS = 5000;

const Wrap = styled.section`
  max-width: ${CLIENT_MAX_WIDTH};
  margin: 12px auto 0;
  padding: 0 ${CLIENT_SIDE_PADDING};
`;

const Banner = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  position: relative;
`;

const Viewport = styled.div<{ $dragging: boolean }>`
  overflow: hidden;
  touch-action: pan-y;
  cursor: ${({ $dragging }) => ($dragging ? 'grabbing' : 'grab')};
  user-select: ${({ $dragging }) => ($dragging ? 'none' : 'auto')};
`;

const Track = styled.div<{ $dragging: boolean }>`
  display: flex;
  width: 100%;
  will-change: transform;
  transition: ${({ $dragging }) => ($dragging ? 'none' : 'transform 240ms ease')};
`;

const Slide = styled.div<{ $tone: 'blue' | 'gold' | 'teal' }>`
  height: clamp(280px, 28vw, 420px);
  position: relative;
  flex: 0 0 100%;
  display: grid;
  align-content: center;
  padding: clamp(22px, 2.4vw, 32px);
  background:
    radial-gradient(circle at 15% 35%, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0)),
    linear-gradient(
      120deg,
      ${({ $tone }) =>
        $tone === 'gold'
          ? 'rgba(80, 58, 18, 0.95)'
          : $tone === 'teal'
            ? 'rgba(14, 48, 48, 0.95)'
            : 'rgba(10, 28, 54, 0.95)'},
      rgba(12, 12, 12, 0.88)
    );

  @media (max-width: 900px) {
    padding: 22px;
  }
`;

const Title = styled.div`
  font-weight: 1000;
  letter-spacing: -1px;
  font-size: clamp(28px, 3.4vw, 48px);
  color: rgba(255, 255, 255, 0.96);
  text-shadow: 0 10px 40px rgba(0, 0, 0, 0.55);
`;

const Sub = styled.div`
  margin-top: 10px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.72);
  letter-spacing: -0.3px;
  font-size: clamp(13px, 1.1vw, 15px);
  max-width: 720px;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 0 10px;
  background: rgba(0, 0, 0, 0.22);
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: ${({ $active }) =>
    $active ? 'rgba(255, 205, 120, 0.92)' : 'rgba(255,255,255,0.18)'};
  cursor: pointer;
`;

const NavButton = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: calc(clamp(280px, 28vw, 420px) / 2);
  ${({ $side }) => ($side === 'left' ? 'left: 10px;' : 'right: 10px;')}
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(0, 0, 0, 0.35);
  color: rgba(255, 255, 255, 0.92);
  display: inline-grid;
  place-items: center;
  cursor: pointer;
  z-index: 2;
  backdrop-filter: blur(6px);
  transition:
    transform 160ms ease,
    background 160ms ease,
    border-color 160ms ease,
    opacity 160ms ease;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 205, 120, 0.28);
    transform: translateY(-50%) scale(1.03);
  }

  &:active {
    transform: translateY(-50%) scale(0.99);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 2px;
  }

  @media (max-width: 520px) {
    width: 40px;
    height: 40px;
    ${({ $side }) => ($side === 'left' ? 'left: 6px;' : 'right: 6px;')}
  }
`;

const ArrowIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d={dir === 'left' ? 'M15 6L9 12L15 18' : 'M9 6L15 12L9 18'}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const slides = [
  {
    tone: 'blue' as const,
    title: '출석 이벤트',
    sub: '배너 영역(이미지 연결 전) · 텍스트/이미지는 API 또는 CMS 연결 가능',
  },
  { tone: 'gold' as const, title: '카지노 & 슬롯', sub: '상단 네비 아래, 배너는 고정 위치로 구성' },
  { tone: 'teal' as const, title: '공지/이벤트', sub: '원하시면 버튼/도트/자동재생도 추가 가능' },
];

const ClientHeroBanner = () => {
  const [index, setIndex] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; pointerId: number; active: boolean }>({
    startX: 0,
    startY: 0,
    pointerId: -1,
    active: false,
  });

  const wrapIndex = (next: number) => {
    const len = slides.length;
    if (len <= 0) return 0;
    return ((next % len) + len) % len;
  };

  const goPrev = () => setIndex((i) => wrapIndex(i - 1));
  const goNext = () => setIndex((i) => wrapIndex(i + 1));

  useEffect(() => {
    if (slides.length <= 1) return;
    if (dragging) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setIndex((i) => wrapIndex(i + 1));
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [dragging]);

  useEffect(() => {
    // 인덱스 변화 시 남아있는 드래그 오프셋 정리
    setDragOffsetPx(0);
    setDragging(false);
    dragRef.current.active = false;
  }, [index]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    if (e.button != null && e.button !== 0) return; // 좌클릭만
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
      active: true,
    };
    setDragging(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    // 세로 스크롤 의도면 드래그 취소
    if (Math.abs(dy) > Math.abs(dx) * 1.2 && Math.abs(dy) > 8) {
      setDragging(false);
      setDragOffsetPx(0);
      dragRef.current.active = false;
      return;
    }

    setDragOffsetPx(dx);
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setDragging(false);

    const viewportWidth = viewportRef.current?.getBoundingClientRect().width ?? 0;
    const threshold = Math.max(60, viewportWidth * 0.18);
    const dx = e.clientX - dragRef.current.startX;

    setDragOffsetPx(0);

    if (dx <= -threshold) {
      setIndex((i) => wrapIndex(i + 1));
    } else if (dx >= threshold) {
      setIndex((i) => wrapIndex(i - 1));
    }
  };

  return (
    <Wrap>
      <Banner aria-label="hero banner">
        <NavButton type="button" $side="left" aria-label="previous banner" onClick={goPrev}>
          <ArrowIcon dir="left" />
        </NavButton>
        <NavButton type="button" $side="right" aria-label="next banner" onClick={goNext}>
          <ArrowIcon dir="right" />
        </NavButton>

        <Viewport
          ref={viewportRef}
          $dragging={dragging}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          aria-label="banner viewport"
        >
          <Track
            $dragging={dragging}
            style={{ transform: `translateX(calc(${-index * 100}% + ${dragOffsetPx}px))` }}
          >
            {slides.map((s, i) => (
              <Slide key={i} $tone={s.tone} aria-label={`banner ${i + 1}`}>
                <Title>{s.title}</Title>
                <Sub>{s.sub}</Sub>
              </Slide>
            ))}
          </Track>
        </Viewport>
        <Dots aria-label="banner dots">
          {slides.map((_, i) => (
            <Dot
              key={i}
              $active={i === index}
              aria-label={`go ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </Dots>
      </Banner>
    </Wrap>
  );
};

export default ClientHeroBanner;
