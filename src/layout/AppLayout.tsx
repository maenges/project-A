import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Sidebar from './Sidebar';
import MainHeader from './MainHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

// Styled Components
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #e0e0e0;
`;

const ContentWrapper = styled.div<{ isSidebarOpen: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '280px' : '72px')};
  transition: margin-left 0.3s ease-in-out;

  /* @media (max-width: 1200px) {
    margin-left: 0;
  } */
`;

const FloatingToggle = styled.button<{ isOpen: boolean }>`
  position: fixed;
  top: 72px; /* 헤더 아래쪽 위치 */
  left: ${({ isOpen }) => (isOpen ? '268px' : '60px')}; /* 접힘(72px) 기준 위치 */
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
      <FloatingToggle isOpen={isSidebarOpen} onClick={toggleSidebar} aria-label="toggle sidebar">
        {isSidebarOpen ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
      </FloatingToggle>
      <ContentWrapper isSidebarOpen={isSidebarOpen}>
        <MainHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <MainContent>{children}</MainContent>
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default AppLayout;
