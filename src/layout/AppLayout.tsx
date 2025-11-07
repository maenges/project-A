import React from 'react';
import styled from 'styled-components';
import MainHeader from './MainHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

// Styled Components
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 50px;
  margin-right: 50px;
  min-height: calc(100vh - 84px); /* 헤더 높이 제외 */
`;

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <MainHeader />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default AppLayout;
