import React, { useState, useEffect, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import { useAdminDashboardStore } from '@/store/adminDashboard';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';

interface ContentWrapperProps {
  $isSidebarOpen: boolean;
}

const HeaderContainer = styled.header<ContentWrapperProps>`
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  position: fixed;
  top: 0;
  left: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '260px' : '0')};
  right: 0;
  z-index: 1000;
  transition:
    left 0.3s ease-in-out,
    background-color 0.3s ease,
    color 0.3s ease;

  @media (max-width: 1200px) {
    left: 0;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.text.primary} !important;
  margin-right: 10px !important;
  display: none !important;

  @media (max-width: 1200px) {
    display: inline-flex !important;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
`;

// hex color + alpha(0~1) -> 8-digit hex (#RRGGBBAA)
const withAlpha = (hex: string, alpha: number) => {
  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};

const InfoCard = styled.div<{ bgcolor?: string; $clickable?: boolean }>`
  background-color: ${(props) => props.bgcolor || props.theme.colors.background.paper};
  color: ${(props) => props.theme.colors.text.primary};
  border-radius: 12px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 150px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.15s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid ${({ theme }) => theme.colors.neutral[30]};

  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }
    &:active {
      transform: translateY(0);
    }
  `}
`;

const CardTitle = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
  font-weight: 600;
`;

const CardValue = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: 700;
`;

interface MainHeaderProps {
  toggleSidebar: () => void;
  $isSidebarOpen: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = ({ toggleSidebar, $isSidebarOpen }) => {
  const [blink, setBlink] = useState(false);
  const theme = useTheme() as any;
  const navigate = useNavigate();

  // 관리자 대시보드 store 구독
  const balance = useAdminDashboardStore((state) => state.balance);
  const pendingApprovalCount = useAdminDashboardStore((state) => state.pendingApprovalCount);
  const depositCount = useAdminDashboardStore((state) => state.depositCount);
  const withdrawCount = useAdminDashboardStore((state) => state.withdrawCount);
  const supportCount = useAdminDashboardStore((state) => state.supportCount);
  const onlineCount = useAdminDashboardStore((state) => state.onlineCount);

  // 초기 데이터 로드
  const fetchInitialData = useCallback(async () => {
    const {
      setBalance,
      setPendingApprovalCount,
      setDepositCount,
      setWithdrawCount,
      setSupportCount,
      setOnlineCount,
    } = useAdminDashboardStore.getState();

    // 헤더 통계 데이터 한번에 조회
    try {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/menu/header-stats',
        method: Method.GET,
        config: { isLoading: false },
      });

      if (res.successOrNot === 'Y' && res.data) {
        const data = res.data;
        setBalance(data.user_money ?? 0);
        setPendingApprovalCount(data.pending_approval_count ?? 0);
        setDepositCount(data.pending_deposit_count ?? 0);
        setWithdrawCount(data.pending_withdraw_count ?? 0);
        setSupportCount(data.pending_support_count ?? 0);
        setOnlineCount(data.online_user_count ?? 0);
      }
    } catch {
      // 조용히 무시 - API가 아직 없을 수 있음
    }
  }, []);

  // 마운트 시 초기 데이터 로드
  useEffect(() => {
    void fetchInitialData();
  }, [fetchInitialData]);

  // 깜박임 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // 승인대기/충전/환전/문의가 있으면 10초마다 알림 음성 반복 재생
  useEffect(() => {
    if (pendingApprovalCount <= 0 && depositCount <= 0 && withdrawCount <= 0 && supportCount <= 0)
      return;

    const playAlarm = () => {
      try {
        const audio = new Audio('/voice/notification-alert.mp3');
        audio.play().catch(() => {});
      } catch {
        /* ignore */
      }
    };

    const interval = setInterval(playAlarm, 10000);
    return () => clearInterval(interval);
  }, [pendingApprovalCount, depositCount, withdrawCount, supportCount]);

  // 테마 컬러
  const themedSoft = withAlpha(theme?.colors?.primary?.main ?? '#00AB55', 0.16);
  const blinkingColor = blink ? '#e4c57a' : themedSoft;

  // 건수가 있으면 반짝임
  const approvalBgColor = pendingApprovalCount > 0 ? blinkingColor : themedSoft;
  const depositBgColor = depositCount > 0 ? blinkingColor : themedSoft;
  const withdrawBgColor = withdrawCount > 0 ? blinkingColor : themedSoft;
  const supportBgColor = supportCount > 0 ? blinkingColor : themedSoft;

  // 네비게이션 핸들러
  const handleGoToApproval = () => navigate('/customer/customerWait');
  const handleGoToDeposit = () => navigate('/trans/transfer?transType=RECHARGE');
  const handleGoToWithdraw = () => navigate('/trans/transfer?transType=EXCHANGE');
  const handleGoToSupport = () => navigate('/system/answer');
  const handleGoToOnline = () => navigate('/customer/accessor');

  return (
    <HeaderContainer $isSidebarOpen={$isSidebarOpen}>
      <HeaderLeft>
        <MenuButton onClick={toggleSidebar}>
          <MenuIcon />
        </MenuButton>
      </HeaderLeft>
      <HeaderRight>
        <InfoCard bgcolor={themedSoft}>
          <CardTitle style={{ fontWeight: 'bold' }}>보유 금액</CardTitle>
          <CardValue>{balance.toLocaleString('ko-KR')}</CardValue>
        </InfoCard>
        <InfoCard bgcolor={approvalBgColor} $clickable onClick={handleGoToApproval}>
          <CardTitle style={{ fontWeight: 'bold' }}>승인 대기</CardTitle>
          <CardValue>{pendingApprovalCount}건</CardValue>
        </InfoCard>
        <InfoCard bgcolor={depositBgColor} $clickable onClick={handleGoToDeposit}>
          <CardTitle style={{ fontWeight: 'bold' }}>충전</CardTitle>
          <CardValue>{depositCount}건</CardValue>
        </InfoCard>
        <InfoCard bgcolor={withdrawBgColor} $clickable onClick={handleGoToWithdraw}>
          <CardTitle style={{ fontWeight: 'bold' }}>환전</CardTitle>
          <CardValue>{withdrawCount}건</CardValue>
        </InfoCard>
        <InfoCard bgcolor={supportBgColor} $clickable onClick={handleGoToSupport}>
          <CardTitle style={{ fontWeight: 'bold' }}>문의</CardTitle>
          <CardValue>{supportCount}건</CardValue>
        </InfoCard>
        <InfoCard bgcolor={themedSoft} $clickable onClick={handleGoToOnline}>
          <CardTitle style={{ fontWeight: 'bold' }}>접속자 수</CardTitle>
          <CardValue>{onlineCount}명</CardValue>
        </InfoCard>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default MainHeader;
