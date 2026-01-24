import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { isMenuKey, menuConfig, type MenuInfo, type MenuKey } from './ClientMenu.types';
import ClientCasinoPage from './menu/ClientCasinoPage';
import ClientDepositPage from './menu/ClientDepositPage';
import ClientInboxPage from './menu/ClientInboxPage';
import ClientNoticePage from './menu/ClientNoticePage';
import ClientSlotPage from './menu/ClientSlotPage';
import ClientSupportPage from './menu/ClientSupportPage';
import ClientWithdrawPage from './menu/ClientWithdrawPage';
import { ensureClientLoggedIn } from '@/utils/clientAuthGuard';

type MenuPageProps = {
  menuKey: MenuKey;
  menu: MenuInfo;
};

const MENU_PAGE_MAP: Record<MenuKey, ComponentType<MenuPageProps>> = {
  casino: ClientCasinoPage,
  slot: ClientSlotPage,
  deposit: ClientDepositPage,
  withdraw: ClientWithdrawPage,
  notice: ClientNoticePage,
  support: ClientSupportPage,
  inbox: ClientInboxPage,
};

const ClientMenuPage = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const authCheckedByCaller = useMemo(() => {
    const state = location.state as any;
    return !!state?.clientAuthChecked;
  }, [location.state]);

  useEffect(() => {
    if (isMenuKey(key)) return;
    navigate('/client', { replace: true });
  }, [key, navigate]);

  useEffect(() => {
    if (!isMenuKey(key)) return;

    let cancelled = false;
    // 클릭 시점에서 이미 인증 체크를 통과한 네비게이션이면,
    // 여기서 다시 비동기 체크를 돌리며 화면을 비우지 않습니다.
    if (authCheckedByCaller) {
      setChecked(true);
      setAllowed(true);
      return;
    }

    setChecked(false);
    setAllowed(false);

    (async () => {
      const ok = await ensureClientLoggedIn({ openModal: true });
      if (cancelled) return;

      setChecked(true);
      setAllowed(ok);

      if (!ok) {
        navigate('/client', { replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key, navigate]);

  if (!isMenuKey(key)) return null;
  if (!checked || !allowed) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.72)',
          fontWeight: 800,
          letterSpacing: '-0.2px',
        }}
      >
        로딩 중...
      </div>
    );
  }

  const menuKey = key;
  const menu = menuConfig[menuKey];
  const Page = MENU_PAGE_MAP[menuKey];

  return <Page menuKey={menuKey} menu={menu} />;
};

export default ClientMenuPage;
