import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { ClientBottomNav, ClientFooter, ClientSiteHeader } from '@/features/client/components';
import { useGameFrameStore } from '@/store/gameFrame';

const Container = styled.div`
  min-height: 100vh;
  color: rgba(255, 255, 255, 0.9);
  background:
    radial-gradient(circle at 18% -10%, rgba(255, 205, 120, 0.16), transparent 46%),
    radial-gradient(circle at 78% 0%, rgba(255, 205, 120, 0.08), transparent 42%),
    radial-gradient(circle at 50% 120%, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.92) 55%),
    linear-gradient(180deg, #0c0b10 0%, #050507 100%);
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 0;

  /* 모바일 하단바에 컨텐츠가 가리지 않도록 여백 확보 */
  @media (max-width: 980px) {
    padding-bottom: calc(74px + env(safe-area-inset-bottom, 0px));
  }
`;

const GameOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #000;
`;

const GameFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const ClientLayout: React.FC = () => {
  const { gameUrl } = useGameFrameStore();

  // 뒤로가기(스와이프) 감지하여 게임 닫기
  useEffect(() => {
    const handlePopState = () => {
      // 게임이 열려있으면 닫기
      const { gameUrl } = useGameFrameStore.getState();
      if (gameUrl) {
        useGameFrameStore.getState().closeGame();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <Container>
      <ClientSiteHeader />
      <Main>
        <Outlet />
      </Main>
      <ClientBottomNav />
      <ClientFooter />

      {/* 모바일 게임 iframe 오버레이 */}
      {gameUrl && gameUrl.startsWith('http') && (
        <GameOverlay>
          <GameFrame src={gameUrl} allow="fullscreen" />
        </GameOverlay>
      )}
    </Container>
  );
};

export default ClientLayout;
