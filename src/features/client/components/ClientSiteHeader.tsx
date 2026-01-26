import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './clientStyleTokens';
import goldenLogoGif from '@/assets/images/logo/brand/golden7.png';
import deposit from '@/assets/images/icon/deposit.svg';
import withdraw from '@/assets/images/icon/withdraw.svg';
import ClientLoginModal from './ClientLoginModal';
import { ClientAuthAddEventListeners, ClientAuthEventDispatch } from '@/utils/clientAuthEventBus';
import { ClientBalanceAddEventListeners } from '@/utils/clientBalanceEventBus';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import LogoutIcon from '@mui/icons-material/Logout';
import { useClientBalanceStore, type ClientBalance } from '@/store/clientBalance';
import { ensureClientLoggedIn } from '@/utils/clientAuthGuard';

type MenuKey = 'deposit' | 'withdraw' | 'notice' | 'support' | 'inbox';
type MobileMenuKey = MenuKey | 'login';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 200;
  background: rgba(16, 15, 19);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Inner = styled.div`
  min-height: 96px;
  max-width: ${CLIENT_MAX_WIDTH};
  margin: 0 auto;
  padding: 0 ${CLIENT_SIDE_PADDING};
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  position: relative;

  @media (max-width: 980px) {
    height: auto;
    grid-template-columns: 1fr;
    justify-items: center;
    padding-top: 10px;
    padding-bottom: 12px;
    gap: 10px;
  }

  @media (max-width: 520px) {
    padding-right: calc(${CLIENT_SIDE_PADDING} + 10px);
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 980px) {
    width: 100%;
    justify-content: center;
  }

  .logo {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    line-height: 0;
    transform: translateY(6px);

    /* GIF 캔버스(투명 여백)가 커도 내용이 '좁쌀'처럼 보이지 않도록 뷰포트+스케일 */
    --logoH: 84px;
    --logoW: 320px;
    --logoScale: 3.6;
    height: var(--logoH);
    width: var(--logoW);
    overflow: hidden;
    position: relative;

    img {
      position: absolute;
      left: 50%;
      top: 50%;
      height: 100%;
      width: auto;
      display: block;
      transform: translate(-50%, -50%) scale(var(--logoScale));
      transform-origin: center;
    }

    &:focus-visible {
      outline: 2px solid rgba(255, 205, 120, 0.65);
      outline-offset: 3px;
      border-radius: 10px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;

  @media (max-width: 980px) {
    display: none;
  }
`;

const NavItem = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.82);
  font-weight: 900;
  font-size: 14px;
  letter-spacing: -0.2px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 205, 120, 0.22);
    color: rgba(255, 255, 255, 0.92);
  }

  svg {
    opacity: 0.9;
    color: rgba(255, 205, 120, 0.95);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 2px;
  }
`;

const DepositIcon = styled.img.attrs({ src: deposit, alt: '' })`
  width: 22px;
  height: 22px;
  display: inline-block;
  opacity: 0.95;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.45));
`;

const WithdrawIcon = styled.img.attrs({ src: withdraw, alt: '' })`
  width: 22px;
  height: 22px;
  display: inline-block;
  opacity: 0.95;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.45));
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  /* 모바일에선 메뉴 버튼을 플로팅으로 띄워 로고를 진짜 중앙에 맞춤 */
  @media (max-width: 980px) {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const DesktopUserInfo = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  max-width: min(46vw, 520px);
  overflow: hidden;

  .id {
    color: rgba(255, 255, 255, 0.92);
    font-weight: 1000;
    font-size: 14px;
    letter-spacing: -0.2px;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .money {
    color: rgba(255, 205, 120, 0.95);
    font-weight: 1000;
    font-size: 13px;
    letter-spacing: -0.2px;
    white-space: nowrap;
  }

  @media (max-width: 980px) {
    display: none;
  }
`;

const MobileQuickBar = styled.div`
  display: none;
  width: 100%;
  margin-top: 10px;
  gap: 10px;
  align-items: center;
  justify-content: center;

  @media (max-width: 980px) {
    display: flex;
  }
`;

const MobileUserInfo = styled.div`
  flex: 1 1 0;
  min-width: 0;
  min-height: 34px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  padding: 4px 8px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  line-height: 1.12;

  .id {
    max-width: 52%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgba(255, 255, 255, 0.92);
    font-weight: 1000;
    font-size: 13px;
    letter-spacing: -0.2px;
  }

  .money {
    color: rgba(255, 205, 120, 0.95);
    font-weight: 1000;
    font-size: 12px;
    letter-spacing: -0.2px;
    white-space: nowrap;
  }
`;

const Pill = styled.button<{ $tone?: 'gold' | 'light' | 'dark' }>`
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) =>
      $tone === 'gold'
        ? 'rgba(255, 205, 120, 0.75)'
        : $tone === 'light'
          ? 'rgba(255,255,255,0.26)'
          : 'rgba(255,255,255,0.16)'};
  background: ${({ $tone }) =>
    $tone === 'gold'
      ? 'rgba(255, 205, 120, 0.92)'
      : $tone === 'light'
        ? 'rgba(255,255,255,0.12)'
        : 'rgba(255,255,255,0.06)'};
  color: ${({ $tone }) => ($tone === 'gold' ? '#121212' : 'rgba(255,255,255,0.9)')};
  font-weight: 1000;
  font-size: 14px;
  letter-spacing: -0.2px;
  cursor: pointer;

  &:hover {
    filter: brightness(1.03);
  }

  @media (max-width: 980px) {
    display: none;
  }
`;

const MenuBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (max-width: 980px) {
    display: inline-flex;
  }

  @media (max-width: 520px) {
    margin-right: 0;
  }
`;

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 240;
  background: rgba(0, 0, 0, 0.66);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 0.18s ease;
`;

const Sheet = styled.div<{ $open: boolean }>`
  position: fixed;
  left: 50%;
  top: 112px;
  transform: translateX(-50%) translateY(${({ $open }) => ($open ? '0' : '-10px')});
  width: min(92vw, 520px);
  z-index: 260;
  background: rgba(18, 18, 18, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  padding: 14px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
`;

const SheetTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 1000;
`;

const MobileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  /* 구분선 색상 (grid gap으로 라인 생성) */
  background: rgba(255, 255, 255, 0.08);
`;

const MobileCell = styled.button`
  height: 86px;
  border: none;
  background: rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.86);
  cursor: pointer;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 8px;

  svg {
    opacity: 0.92;
    color: rgba(255, 205, 120, 0.95);
    font-size: 30px;
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.55));
  }

  ${DepositIcon} {
    width: 30px;
    height: 30px;
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.55));
  }

  ${WithdrawIcon} {
    width: 30px;
    height: 30px;
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.55));
  }

  span {
    font-weight: 1000;
    font-size: 12px;
    letter-spacing: -0.2px;
  }

  &:hover {
    background: rgba(255, 205, 120, 0.06);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: -2px;
  }
`;

const ClientSiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginShowVisual, setLoginShowVisual] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const navigate = useNavigate();

  const balance = useClientBalanceStore((s) => s.balance);
  const setBalance = useClientBalanceStore((s) => s.setBalance);
  const clearBalance = useClientBalanceStore((s) => s.clearBalance);

  const isLoggedIn = !!balance?.userId;

  const parseBalance = (raw: any): ClientBalance | null => {
    if (!raw || typeof raw !== 'object') return null;
    const userId = raw.user_id;
    const money = raw.user_money;

    const normalizedId = typeof userId === 'string' ? userId : String(userId ?? '').trim();
    const numericMoney = Number(
      typeof money === 'string' ? money.replace(/[^0-9-]/g, '') : (money as any)
    );
    if (!normalizedId) return null;

    return {
      userId: normalizedId,
      money: Number.isFinite(numericMoney) ? numericMoney : 0,
    };
  };

  const fetchBalance = async (opts?: { suppressAuthEvent?: boolean }) => {
    if (balanceLoading) return;
    setBalanceLoading(true);
    try {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/client/balance',
        method: Method.GET,
        redirect: false,
        suppressAuthEvent: opts?.suppressAuthEvent ?? false,
      });

      if (res.successOrNot !== 'Y') {
        // 페이지 이동 시 헤더가 리마운트되더라도, 요청 완료 전에는 기존 표시를 유지해 플리커를 막습니다.
        // (실제로 로그아웃/세션만료면 응답이 돌아온 뒤에만 상태가 바뀌도록)
        clearBalance();
        return;
      }

      const payload = res.data;
      const next = parseBalance(payload);
      setBalance(next);
    } finally {
      setBalanceLoading(false);
    }
  };

  const openLoginByViewport = () => {
    const showVisual = typeof window !== 'undefined' ? window.innerWidth > 860 : true;
    openLogin(showVisual);
  };

  const logout = async () => {
    try {
      await callApi({
        service: Service.POSTMAN,
        url: '/api/auth/logout',
        method: Method.POST,
        redirect: false,
        suppressAuthEvent: true,
      });
    } finally {
      void ClientAuthEventDispatch('logout', { source: 'client' });
      clearBalance();
    }
  };

  useEffect(() => {
    void fetchBalance({ suppressAuthEvent: true });
  }, []);

  useEffect(() => {
    return ClientAuthAddEventListeners('authRequired', () => {
      setOpen(false);
      setLoginShowVisual(true);
      setLoginOpen(true);
    });
  }, []);

  useEffect(() => {
    return ClientBalanceAddEventListeners('refreshBalance', () => {
      void fetchBalance({ suppressAuthEvent: true });
    });
  }, []);

  const getMenuIcon = (key: MobileMenuKey) => {
    switch (key) {
      case 'login':
        return isLoggedIn ? (
          <LogoutIcon fontSize="small" />
        ) : (
          <LoginOutlinedIcon fontSize="small" />
        );
      case 'deposit':
        return <DepositIcon aria-hidden="true" />;
      case 'withdraw':
        return <WithdrawIcon aria-hidden="true" />;
      case 'notice':
        return <NotificationsNoneIcon fontSize="small" />;
      case 'support':
        return <SupportAgentIcon fontSize="small" />;
      case 'inbox':
        return <MailOutlineIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const navItems = useMemo(
    () => [
      { key: 'deposit' as const, label: '충전신청' },
      { key: 'withdraw' as const, label: '환전신청' },
      { key: 'notice' as const, label: '공지사항' },
      { key: 'support' as const, label: '문의' },
      { key: 'inbox' as const, label: '쪽지함' },
    ],
    []
  );

  const mobileItems = useMemo(
    () => [{ key: 'login' as const, label: isLoggedIn ? '로그아웃' : '로그인' }, ...navItems],
    [navItems, isLoggedIn]
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const goMenu = async (key: MenuKey) => {
    setOpen(false);

    if (!isLoggedIn) {
      // 저장소 캐시 없이 쿠키 기반 인증 전제이므로,
      // 잔액 조회가 아직 끝나지 않았거나(unknown) 로그인 상태가 확실치 않을 때는
      // 서버에 조용히 확인한 뒤, 실패 시에만 우리가 정한 UX(로그인 모달)를 띄웁니다.
      const ok = await ensureClientLoggedIn({ openModal: false });
      if (!ok) {
        openLoginByViewport();
        return;
      }
    }

    navigate(`/client/menu/${key}`, { state: { clientAuthChecked: true } });
  };

  const goHome = () => {
    setOpen(false);
    navigate('/client');
  };

  const openLogin = (showVisual: boolean) => {
    setOpen(false);
    setLoginShowVisual(showVisual);
    setLoginOpen(true);
  };

  const goMobileMenu = (key: MobileMenuKey) => {
    if (key === 'login') {
      if (isLoggedIn) {
        void logout();
        return;
      }
      openLogin(false);
      return;
    }
    goMenu(key);
  };

  const openAuth = (showVisual: boolean) => {
    if (isLoggedIn) {
      void logout();
      return;
    }
    openLogin(showVisual);
  };

  return (
    <>
      <Bar>
        <Inner>
          <Brand>
            <button type="button" className="logo" aria-label="go home" onClick={goHome}>
              <img src={goldenLogoGif} alt="GOLDEN" />
            </button>
          </Brand>

          <Nav aria-label="main navigation">
            {navItems.map((x) => (
              <NavItem key={x.key} type="button" onClick={() => void goMenu(x.key)}>
                {getMenuIcon(x.key)}
                {x.label}
              </NavItem>
            ))}
          </Nav>

          <Right>
            {isLoggedIn && (
              <DesktopUserInfo aria-label="user info">
                <span className="id">{balance?.userId}</span>
                <span className="money">
                  보유머니 {Number(balance?.money ?? 0).toLocaleString('ko-KR')}원
                </span>
              </DesktopUserInfo>
            )}

            <Pill $tone="gold" onClick={() => openAuth(true)}>
              {isLoggedIn ? '로그아웃' : '로그인'}
            </Pill>

            <MenuBtn aria-label="menu" onClick={() => setOpen(true)}>
              <MenuIcon fontSize="small" />
            </MenuBtn>
          </Right>

          <MobileQuickBar aria-label="mobile quick bar">
            <MobileUserInfo aria-label="user info">
              {isLoggedIn ? (
                <>
                  <div className="id">{balance?.userId}</div>
                  <div className="money">
                    보유머니 {Number(balance?.money ?? 0).toLocaleString('ko-KR')}원
                  </div>
                </>
              ) : (
                <div className="id" style={{ opacity: 0.65 }}>
                  로그인 필요
                </div>
              )}
            </MobileUserInfo>
          </MobileQuickBar>
        </Inner>
      </Bar>

      <Backdrop $open={open} onClick={() => setOpen(false)} />
      <Sheet $open={open} role="dialog" aria-modal="true" aria-label="menu">
        <SheetTop>
          <span>메뉴</span>
          <MenuBtn
            aria-label="close"
            onClick={() => setOpen(false)}
            style={{ display: 'inline-flex' }}
          >
            <CloseIcon fontSize="small" />
          </MenuBtn>
        </SheetTop>

        <MobileGrid aria-label="mobile menu grid">
          {mobileItems.map((x) => (
            <MobileCell key={x.key} type="button" onClick={() => goMobileMenu(x.key)}>
              {getMenuIcon(x.key)}
              <span>{x.label}</span>
            </MobileCell>
          ))}
        </MobileGrid>
      </Sheet>

      <ClientLoginModal
        open={loginOpen}
        showVisual={loginShowVisual}
        onSuccess={() => {
          void fetchBalance({ suppressAuthEvent: true });
        }}
        onClose={() => {
          setLoginOpen(false);
          setLoginShowVisual(true);
        }}
      />
    </>
  );
};

export default ClientSiteHeader;
