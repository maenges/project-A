import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { ClientBottomNav, ClientFooter } from '@/features/client/components';

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

const ClientLayout: React.FC = () => {
  return (
    <Container>
      <Main>
        <Outlet />
      </Main>
      <ClientBottomNav />
      <ClientFooter />
    </Container>
  );
};

export default ClientLayout;
