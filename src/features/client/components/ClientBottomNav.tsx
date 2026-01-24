import React from 'react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './clientStyleTokens';
import deposit from '@/assets/images/icon/deposit.svg';
import withdraw from '@/assets/images/icon/withdraw.svg';
import { ensureClientLoggedIn } from '@/utils/clientAuthGuard';

type Item = {
  key: 'deposit' | 'withdraw' | 'home' | 'support' | 'inbox';
  label: string;
  to: string;
  icon: React.ReactNode;
  isHome?: boolean;
  isActive: (pathname: string) => boolean;
};

const Bar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 240;
  height: calc(74px + env(safe-area-inset-bottom, 0px));
  padding: 0 0 env(safe-area-inset-bottom, 0px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background:
    radial-gradient(circle at 50% -10%, rgba(255, 205, 120, 0.18), transparent 48%),
    rgba(12, 11, 16, 0.86);
  backdrop-filter: blur(10px);
  overflow: visible;
  display: none;

  @media (max-width: 980px) {
    display: block;
  }
`;

const Inner = styled.div`
  max-width: ${CLIENT_MAX_WIDTH};
  margin: 0 auto;
  padding: 0 ${CLIENT_SIDE_PADDING};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: 74px;
  align-items: center;
`;

const ItemBtn = styled.button<{ $active?: boolean; $home?: boolean }>`
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? 'rgba(255, 205, 120, 0.98)' : 'rgba(255, 255, 255, 0.78)')};
  cursor: pointer;
  padding: 8px 6px;
  display: grid;
  justify-items: center;
  gap: 6px;
  font-weight: 1000;
  font-size: 11px;
  letter-spacing: -0.2px;

  svg {
    font-size: ${({ $home }) => ($home ? '30px' : '24px')};
    filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.55));
  }

  ${({ $home, $active }) =>
    $home
      ? `
    transform: translateY(-3px);

    .homePill {
      width: 52px;
      height: 52px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      background: ${$active ? 'rgba(255, 205, 120, 0.98)' : 'rgba(255, 205, 120, 0.92)'};
      color: #121212;
      border: 1px solid rgba(255, 205, 120, 0.75);
      box-shadow: 0 22px 46px rgba(0, 0, 0, 0.65);
    }

    .homePill svg {
      filter: none;
      color: #121212;
    }

    .homeLabel {
      margin-top: 2px;
    }
  `
      : ''}

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.55);
    outline-offset: 3px;
    border-radius: 12px;
  }
`;

const DepositIcon = styled.span`
  width: 24px;
  height: 24px;
  display: inline-block;
  background: currentColor;
  opacity: 0.92;
  -webkit-mask: url(${deposit}) center / contain no-repeat;
  mask: url(${deposit}) center / contain no-repeat;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.55));
`;

const WithdrawIcon = styled.span`
  width: 24px;
  height: 24px;
  display: inline-block;
  background: currentColor;
  opacity: 0.92;
  -webkit-mask: url(${withdraw}) center / contain no-repeat;
  mask: url(${withdraw}) center / contain no-repeat;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.55));
`;

const ClientBottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = useMemo<Item[]>(
    () => [
      {
        key: 'deposit',
        label: '충전',
        to: '/client/menu/deposit',
        icon: <DepositIcon aria-hidden="true" />,
        isActive: (p) => p.startsWith('/client/menu/deposit'),
      },
      {
        key: 'withdraw',
        label: '환전',
        to: '/client/menu/withdraw',
        icon: <WithdrawIcon aria-hidden="true" />,
        isActive: (p) => p.startsWith('/client/menu/withdraw'),
      },
      {
        key: 'home',
        label: '홈',
        to: '/client',
        icon: <HomeRoundedIcon aria-hidden="true" />,
        isHome: true,
        isActive: (p) => p === '/client' || p === '/client/',
      },
      {
        key: 'support',
        label: '문의',
        to: '/client/menu/support',
        icon: <SupportAgentIcon aria-hidden="true" />,
        isActive: (p) => p.startsWith('/client/menu/support'),
      },
      {
        key: 'inbox',
        label: '쪽지함',
        to: '/client/menu/inbox',
        icon: <MailOutlineIcon aria-hidden="true" />,
        isActive: (p) => p.startsWith('/client/menu/inbox'),
      },
    ],
    []
  );

  return (
    <Bar aria-label="client bottom navigation">
      <Inner>
        <Grid>
          {items.map((x) => {
            const active = x.isActive(pathname);
            return (
              <ItemBtn
                key={x.key}
                type="button"
                $active={active}
                $home={x.isHome}
                aria-current={active ? 'page' : undefined}
                aria-label={x.isHome ? x.label : undefined}
                onClick={async () => {
                  if (x.isHome) {
                    navigate(x.to);
                    return;
                  }

                  const ok = await ensureClientLoggedIn({ openModal: true });
                  if (!ok) return;

                  navigate(x.to, { state: { clientAuthChecked: true } });
                }}
              >
                {x.isHome ? <span className="homePill">{x.icon}</span> : x.icon}
                {!x.isHome && <span>{x.label}</span>}
              </ItemBtn>
            );
          })}
        </Grid>
      </Inner>
    </Bar>
  );
};

export default ClientBottomNav;
