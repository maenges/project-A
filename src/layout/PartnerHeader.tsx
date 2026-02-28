import React, { useState, useEffect, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Button } from '@mui/material';
import { usePartnerDashboardStore } from '@/store/partnerDashboard';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import PartnerDepositModal from '@/features/partner/PartnerDepositModal';
import PartnerWithdrawModal from '@/features/partner/PartnerWithdrawModal';
import PartnerRollingModal from '@/features/partner/PartnerRollingModal';
import PartnerInboxModal from '@/features/partner/PartnerInboxModal';
import PartnerSupportModal from '@/features/partner/PartnerSupportModal';
import { PartnerDashboardAddEventListeners } from '@/utils/partnerDashboardEventBus';
import { useUnreadInboxStore } from '@/store/unreadInbox';
import { useUnreadSupportStore } from '@/store/unreadSupport';
import { InboxMessageAddEventListeners } from '@/utils/inboxMessageEventBus';
import { SupportAnswerAddEventListeners } from '@/utils/supportAnswerEventBus';

/* ===== Styled Components ===== */

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
  gap: 8px;
  flex-shrink: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
  flex-shrink: 0;
`;

const MenuButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.text.primary} !important;
  display: none !important;
  @media (max-width: 1200px) {
    display: inline-flex !important;
  }
`;

const ActionButton = styled(Button)`
  border-radius: 20px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  padding: 6px 16px !important;
  white-space: nowrap !important;
`;

// hex color + alpha(0~1) -> 8-digit hex (#RRGGBBAA)
const withAlpha = (hex: string, a: number) => {
  const alpha = Math.round(Math.min(Math.max(a, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${alpha}`;
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

/* ===== Component ===== */

interface PartnerHeaderProps {
  toggleSidebar: () => void;
  $isSidebarOpen: boolean;
}

const PartnerHeader: React.FC<PartnerHeaderProps> = ({ toggleSidebar, $isSidebarOpen }) => {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [rollingOpen, setRollingOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [blink, setBlink] = useState(false);
  const theme = useTheme() as any;

  const money = usePartnerDashboardStore((s) => s.money);
  const rollingMoney = usePartnerDashboardStore((s) => s.rollingMoney);
  const slotRollingPercent = usePartnerDashboardStore((s) => s.slotRollingPercent);
  const casinoRollingPercent = usePartnerDashboardStore((s) => s.casinoRollingPercent);

  const inboxCount = useUnreadInboxStore((s) => s.unreadCount);
  const supportCount = useUnreadSupportStore((s) => s.unreadCount);

  // 파트너 헤더 데이터 조회 (보유머니 + 롤링금 + 롤링%)
  const fetchHeaderStats = useCallback(async () => {
    const { setMoney, setRollingMoney, setSlotRollingPercent, setCasinoRollingPercent } =
      usePartnerDashboardStore.getState();
    try {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/menu/partnerHeaderInfo',
        method: Method.GET,
        config: { isLoading: false },
      });
      if (res.successOrNot === 'Y' && res.data) {
        const d = Array.isArray(res.data) ? res.data[0] : res.data;
        if (d) {
          setMoney(Number(d.user_money) || 0);
          setRollingMoney(Number(d.user_rolling_money) || 0);
          setSlotRollingPercent(Number(d.user_rolling_s) || 0);
          setCasinoRollingPercent(Number(d.user_rolling_c) || 0);
        }
      }
    } catch {
      // API가 아직 없을 수 있음
    }
  }, []);

  useEffect(() => {
    void fetchHeaderStats();
  }, [fetchHeaderStats]);

  // 안읽은 쪽지/문의 건수 초기 조회
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const inboxRes = await callApi({
          service: Service.POSTMAN,
          url: '/api/client/messageList',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        });
        if (inboxRes.successOrNot === 'Y') {
          const unread = (inboxRes.data ?? []).filter((item: any) => !item.notice_recive).length;
          useUnreadInboxStore.getState().setUnreadCount(unread);
        }
      } catch {
        /* ignore */
      }

      try {
        const supportRes = await callApi({
          service: Service.POSTMAN,
          url: '/api/client/answerList',
          method: Method.GET,
          params: {},
          config: { isLoading: false },
        });
        if (supportRes.successOrNot === 'Y') {
          const unread = (supportRes.data ?? []).filter(
            (item: any) => item.notice_process === true && item.notice_recive === false
          ).length;
          useUnreadSupportStore.getState().setUnreadCount(unread);
        }
      } catch {
        /* ignore */
      }
    };
    fetchUnreadCounts();
  }, []);

  // 소켓 이벤트 구독
  useEffect(() => {
    const unsubscribe = PartnerDashboardAddEventListeners((eventName) => {
      if (eventName === 'balance_update') {
        // 잔액 변동 → 헤더 데이터 재조회
        void fetchHeaderStats();
      }
    });
    return () => {
      unsubscribe();
    };
  }, [fetchHeaderStats]);

  // 쪽지/문의 소켓 이벤트 구독
  useEffect(() => {
    const unsubInbox = InboxMessageAddEventListeners((eventName) => {
      if (eventName === 'message_received') {
        // store는 소켓 핸들러에서 이미 업데이트됨 → 별도 처리 불필요
      }
    });
    const unsubSupport = SupportAnswerAddEventListeners((eventName) => {
      if (eventName === 'answer_completed') {
        // store는 소켓 핸들러에서 이미 업데이트됨
      }
    });
    return () => {
      unsubInbox();
      unsubSupport();
    };
  }, []);

  // 깜박임 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // 안읽은 쪽지/문의가 있으면 10초마다 알림 음성 반복 재생
  useEffect(() => {
    if (inboxCount <= 0 && supportCount <= 0) return;

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
  }, [inboxCount, supportCount]);

  // 깜박임 색상
  const themedSoft = withAlpha(theme?.colors?.primary?.main ?? '#00AB55', 0.16);
  const blinkingColor = blink ? '#e4c57a' : themedSoft;
  const inboxBgColor = inboxCount > 0 ? blinkingColor : themedSoft;
  const supportBgColor = supportCount > 0 ? blinkingColor : themedSoft;

  /* 버튼 핸들러 */
  // const handleMoneyHistory = () => {
  // };
  const handleDepositRequest = () => {
    setDepositOpen(true);
  };
  const handleWithdrawRequest = () => {
    setWithdrawOpen(true);
  };
  const handleRollingConvert = () => {
    setRollingOpen(true);
  };
  // const handleInquiry = () => {
  //     setSupportOpen(true);
  // };

  return (
    <HeaderContainer $isSidebarOpen={$isSidebarOpen}>
      {/* 좌측: 햄버거(모바일) + 액션 버튼 */}
      <HeaderLeft>
        <MenuButton onClick={toggleSidebar}>
          <MenuIcon />
        </MenuButton>
        {/* <ActionButton variant="contained" color="error" onClick={handleMoneyHistory}>
                    보유머니 변동내역
                </ActionButton> */}
        <ActionButton variant="contained" color="primary" onClick={handleDepositRequest}>
          충전 신청
        </ActionButton>
        <ActionButton variant="contained" color="success" onClick={handleWithdrawRequest}>
          환전 신청
        </ActionButton>
        <ActionButton variant="contained" color="warning" onClick={handleRollingConvert}>
          롤링 전환
        </ActionButton>
        {/* <ActionButton variant="contained" color="info" onClick={handleInquiry}>
                    1:1 문의
                </ActionButton> */}
      </HeaderLeft>

      {/* 우측: 정보 카드 */}
      <HeaderRight>
        <InfoCard bgcolor={themedSoft}>
          <CardTitle style={{ fontWeight: 'bold' }}>보유 금액</CardTitle>
          <CardValue>{money.toLocaleString('ko-KR')}</CardValue>
        </InfoCard>
        <InfoCard bgcolor={themedSoft}>
          <CardTitle style={{ fontWeight: 'bold' }}>보유 롤링 금액</CardTitle>
          <CardValue>{rollingMoney.toLocaleString('ko-KR')}</CardValue>
        </InfoCard>
        <InfoCard bgcolor={themedSoft}>
          <CardTitle style={{ fontWeight: 'bold' }}>슬롯 롤링(%)</CardTitle>
          <CardValue>{slotRollingPercent}%</CardValue>
        </InfoCard>
        <InfoCard bgcolor={themedSoft}>
          <CardTitle style={{ fontWeight: 'bold' }}>카지노 롤링(%)</CardTitle>
          <CardValue>{casinoRollingPercent}%</CardValue>
        </InfoCard>
        <InfoCard bgcolor={inboxBgColor} $clickable onClick={() => setInboxOpen(true)}>
          <CardTitle style={{ fontWeight: 'bold' }}>받은 쪽지함</CardTitle>
          <CardValue>{inboxCount}건</CardValue>
        </InfoCard>
        <InfoCard bgcolor={supportBgColor} $clickable onClick={() => setSupportOpen(true)}>
          <CardTitle style={{ fontWeight: 'bold' }}>문의함</CardTitle>
          <CardValue>{supportCount}건</CardValue>
        </InfoCard>
      </HeaderRight>

      {/* 충전/환전/롤링 팝업 */}
      <PartnerDepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
      <PartnerWithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
      <PartnerRollingModal open={rollingOpen} onClose={() => setRollingOpen(false)} />

      {/* 쪽지함/문의함 팝업 */}
      <PartnerInboxModal open={inboxOpen} onClose={() => setInboxOpen(false)} />
      <PartnerSupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </HeaderContainer>
  );
};

export default PartnerHeader;
