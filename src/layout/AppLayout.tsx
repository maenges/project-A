import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Sidebar from './Sidebar';
import MainHeader from './MainHeader';
import PartnerHeader from './PartnerHeader';
import { connectAdminSocket, disconnectAdminSocket } from '@/utils/adminConnectionSocket';
import { connectPartnerSocket, disconnectPartnerSocket } from '@/utils/partnerConnectionSocket';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { useGroupTypeStore } from '@/store/groupType';
import AdminNoticePopup from '@/components/AdminNoticePopup';

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

const MainContent = styled.main<{ $hasHeader: boolean }>`
  flex: 1;
  padding: ${({ $hasHeader }) => ($hasHeader ? '104px 50px 20px' : '20px 50px 20px')};
  border-top-left-radius: ${({ $hasHeader }) => ($hasHeader ? '24px' : '0')};
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const [groupType, setGroupType] = useState<string>('');

  // 쿠키 기반 인증 → API로 사용자 groupType 조회
  useEffect(() => {
    const fetchGroupType = async () => {
      try {
        const res = await callApi({
          service: Service.POSTMAN,
          url: '/api/menu/headerPermission',
          method: Method.GET,
          config: { isLoading: false },
          redirect: false,
          suppressAuthEvent: true,
        });
        if (res.successOrNot === 'Y' && res.data) {
          // 파트너: groupType 문자열 (예: "ST")
          setGroupType(res.data);
          useGroupTypeStore.getState().setGroupType(res.data);
        }
      } catch {
        // ignore
      }
    };
    fetchGroupType();
  }, []);

  // const isPartner = groupType !== '' && groupType !== 'HQ';

  // 관리자 WebSocket 연결 (HQ만)
  useEffect(() => {
    if (groupType === 'HQ') {
      connectAdminSocket();
      return () => {
        disconnectAdminSocket();
      };
    }
  }, [groupType]);

  // 파트너: 전용 WebSocket 연결 (balance_update, transaction_processed 수신)
  useEffect(() => {
    if (groupType !== '' && groupType !== 'HQ') {
      connectPartnerSocket();
      return () => {
        disconnectPartnerSocket();
      };
    }
  }, [groupType]);

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
        {groupType === 'HQ' && (
          <MainHeader toggleSidebar={toggleSidebar} $isSidebarOpen={isSidebarOpen} />
        )}
        {groupType !== '' && groupType !== 'HQ' && (
          <PartnerHeader toggleSidebar={toggleSidebar} $isSidebarOpen={isSidebarOpen} />
        )}
        {/* groupType === '' → API 미응답 시 헤더 없음 */}
        <MainContent $hasHeader={groupType !== ''}>{children}</MainContent>
      </ContentWrapper>
      {/* 공지사항 팝업 (HQ + 파트너 공통) */}
      <AdminNoticePopup groupType={groupType} />
    </LayoutContainer>
  );
};

export default AppLayout;
