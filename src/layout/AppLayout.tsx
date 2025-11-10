import React, { useEffect } from 'react';
import styled from 'styled-components';
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
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '280px' : '0')};
  transition: margin-left 0.3s ease-in-out;

  /* @media (max-width: 1200px) {
    margin-left: 0;
  } */
`;

const MainContent = styled.main`
  flex: 1;
  padding: 104px 50px 20px; /* 헤더 높이(84px) + 상단 여백(20px) */
  /* background-color: #d6d6d6; */
  border-top-left-radius: 24px;
  background-color: #ffffff;
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
      <ContentWrapper isSidebarOpen={isSidebarOpen}>
        <MainHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <MainContent>{children}</MainContent>
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default AppLayout;
