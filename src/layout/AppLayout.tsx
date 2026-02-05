import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Sidebar from './Sidebar';
import MainHeader from './MainHeader';
import { connectAdminSocket, disconnectAdminSocket } from '@/utils/adminConnectionSocket';

interface AppLayoutProps {
  children: React.ReactNode;
}

interface StyledButtonProps {
  $isOpen: boolean;
}

interface ContentWrapperProps {
  $isSidebarOpen: boolean;
}

// Styled Components
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #e0e0e0;
`;

const ContentWrapper = styled.div<ContentWrapperProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '260px' : '72px')};
  transition: margin-left 0.3s ease-in-out;

  /* @media (max-width: 1200px) {
    margin-left: 0;
  } */
`;

const FloatingToggle = styled.button<StyledButtonProps>`
  position: fixed;
  top: 72px; /* 헤더 아래쪽 위치 */
  /* 사이드바 경계(OPEN: 260px, COLLAPSED: 72px)에 버튼(28px)이 살짝 걸치도록 배치 */
  left: ${({ $isOpen }) => ($isOpen ? '246px' : '58px')};
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.neutral[30]};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 1300; /* Sidebar(1100) 위에 */
  transition:
    left 0.3s ease-in-out,
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.neutral[20]};
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 104px 50px 20px; /* 헤더 높이(84px) + 상단 여백(20px) */
  /* background-color: #d6d6d6; */
  border-top-left-radius: 24px;
  background-color: ${({ theme }) => theme.colors.background.default};
  /* @media (max-width: 768px) {
    padding: 84px 20px 20px;
  } */
`;

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  // 관리자 WebSocket 연결
  useEffect(() => {
    connectAdminSocket();
    return () => {
      disconnectAdminSocket();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1200) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <LayoutContainer>
      <Sidebar isOpen={isSidebarOpen} />
      <FloatingToggle $isOpen={isSidebarOpen} onClick={toggleSidebar} aria-label="toggle sidebar">
        {isSidebarOpen ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
      </FloatingToggle>
      <ContentWrapper $isSidebarOpen={isSidebarOpen}>
        <MainHeader toggleSidebar={toggleSidebar} $isSidebarOpen={isSidebarOpen} />
        <MainContent>{children}</MainContent>
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default AppLayout;
