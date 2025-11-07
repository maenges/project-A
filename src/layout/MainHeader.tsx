import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import logo from '../assets/images/logo.svg';
import initialsIcon from '../assets/images/ic-Initials.svg';
import { Link, useLocation } from 'react-router-dom';
import { Stack } from '@mui/system';
import CommonButton from '@/components/EtsCommon/EtsButton';
import { logout } from '@/services/auth/auth.api';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeaderContainer = styled.header`
  display: flex;
  height: 84px !important;
  padding: ${({ theme }) => theme.spacing.xl} 30px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  min-height: 84px;
`;

const LogoLink = styled(Link)`
  margin-right: 80px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoImg = styled.img`
  width: 185px;
  height: 48px;
  object-fit: contain;
`;

const MenuBar = styled.div`
  display: flex;
  align-items: center;
  height: 26px;
  flex-shrink: 0;
`;

const MenuContainer = styled.div`
  position: relative;
  margin-right: 40px;
  display: inline-block;
  height: 26px;
  flex-shrink: 0;
`;

const MenuLink = styled(Link)<{ $isActive?: boolean }>`
  color: var(--color-text-primary-darkblue, #051766);
  font-family: 'Hanjin Group Sans';
  font-size: var(--font-size-label-lg, 16px);
  font-style: normal;
  font-weight: var(--font-weight-bold, 700);
  line-height: 150%; /* 24px */
  cursor: pointer;
  position: relative;
  /* padding: 0 4px; */
  transition: color 0.2s;
  text-decoration: none;
  display: inline-block;
  height: 26px;

  &:hover {
    opacity: 0.8;
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-border-primary-darkblue, #051766);
      border-radius: 2px;
    }
    `}
`;

const SubMenu = styled.div<{ $isVisible?: boolean; $hasInteracted?: boolean }>`
  position: fixed;
  top: 84px;
  left: 0;
  width: 100vw;
  background: #fff;
  padding: 32px 0 48px 0;
  padding-left: 293px;
  padding-right: 30px;
  box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.15);
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 50px;

  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
  transform: ${({ $isVisible }) => ($isVisible ? 'translateY(0)' : 'translateY(-20px)')};

  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out,
    visibility 0.3s ease-out;
`;

const SubMenuItem = styled(Link)<{ $hasSubMenu?: boolean }>`
  display: inline-block;
  /* padding: 12px 20px; */
  font-size: ${({ theme }) => theme.fonts.size.lg};
  color: #1a2340;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  user-select: none;
  text-decoration: none;
  border-radius: 8px;
  white-space: nowrap;

  color: var(--color-text-primary-darkblue, #051766);
  font-family: 'Hanjin Group Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
`;

const UserIcon = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f3f6fb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
`;

const UserMenu = styled(Stack)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 300px;
  background: #fff;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-radius: 12px;
  /* padding: 12px 0; */
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  animation: ${fadeIn} 0.2s ease-out;
  padding: 20px 16px;
`;

const UserMenuTopArea = styled(Stack)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserMenuTopName = styled.div`
  font-size: 14px;
  font-weight: 700;
  line-height: 150%;
`;
const UserMenuTopEmail = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 150%;
`;
const UserMenuTopAuth = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
`;

const MainHeader: React.FC = () => {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [clickedMenu, setClickedMenu] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 페이지가 이동하면 열려있던 메뉴를 닫습니다.
    if (clickedMenu) {
      setClickedMenu(null);
    }
  }, [location.pathname]); // 의존성 배열에 location.pathname만 넣습니다.

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [userMenuOpen]);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!clickedMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setClickedMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [clickedMenu]);

  const handleLogout = async () => {
    await logout();
  };

  // path 기반 메뉴 데이터 (API로 받아올 예정)
  type MenuItem = {
    path: string;
    label: string;
    hasSubmenu: boolean;
    allowed: boolean;
    active: boolean;
    submenuItems: { path: string; label: string; allowed: boolean; active: boolean }[];
  };

  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  // 메뉴 변환 함수
  function convertMenus(rawMenus: any[]) {
    const parents = rawMenus.filter((m: any) => m.parentMenuId === null);
    return parents.map((parent: any): MenuItem => {
      const submenuItems = rawMenus
        .filter((m: any) => m.parentMenuId === parent.menuId)
        .map((child: any) => ({
          path: child.menuPath,
          label: child.menuName,
          allowed: child.allowed,
          active: child.active,
        }));
      return {
        path: submenuItems.length > 0 ? submenuItems[0].path.split('/').slice(0, 2).join('/') : '#',
        label: parent.menuName,
        hasSubmenu: submenuItems.length > 0,
        allowed: parent.allowed,
        active: parent.active,
        submenuItems,
      };
    });
  }

  useEffect(() => {
    async function fetchMenus() {
      const rawMenus = JSON.parse(sessionStorage.getItem('userMenus') || '[]');
      setMenuList(convertMenus(rawMenus));
    }
    fetchMenus();
  }, []);

  // 현재 경로가 메뉴 경로와 일치하는지 확인하는 함수
  const isMenuActive = (menuPath: string) => {
    if (menuPath === '#') return false;
    return location.pathname.startsWith(menuPath);
  };

  // 메뉴 클릭 핸들러
  const handleMenuClick = (menuLabel: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      setHasInteracted(true);
      // 클릭한 메뉴가 이미 열려있으면 닫고, 아니면 엽니다.
      setClickedMenu(clickedMenu === menuLabel ? null : menuLabel);
    } else {
      // 서브메뉴가 없는 메뉴 클릭 시, 열려있던 다른 메뉴를 닫습니다.
      setClickedMenu(null);
    }
  };

  // 클릭 시 아무것도 하지 않고, Link의 기본 동작(URL 변경)만 수행합니다.
  // URL이 변경되면 위에서 추가한 useEffect가 메뉴를 닫아줍니다.
  const handleSubMenuClick = () => {};

  const activeMenuFromPath = menuList.find((menu) => isMenuActive(menu.path));
  const highlightedMenuLabel =
    clickedMenu || (activeMenuFromPath ? activeMenuFromPath.label : null);

  return (
    <HeaderContainer>
      <LeftSection>
        <LogoLink to="/" aria-label="Logo">
          <LogoImg src={logo} alt="ETS-OMS Logo" />
        </LogoLink>
        <MenuBar ref={menuBarRef}>
          {menuList
            .filter((menu) => (menu as any).allowed && (menu as any).active)
            .map((menu) => (
              <MenuContainer key={menu.label}>
                <MenuLink
                  to={menu.path}
                  $isActive={highlightedMenuLabel === menu.label}
                  onClick={(e) => {
                    if (menu.hasSubmenu && menu.submenuItems.length > 0) {
                      e.preventDefault();
                    }
                    // 모든 메뉴 클릭 시 handleMenuClick 호출
                    handleMenuClick(menu.label, menu.hasSubmenu && menu.submenuItems.length > 0);
                  }}
                >
                  {menu.label}
                </MenuLink>
                {menu.hasSubmenu && menu.submenuItems && (
                  <SubMenu $isVisible={clickedMenu === menu.label} $hasInteracted={hasInteracted}>
                    {menu.submenuItems.map((child: any) => {
                      // 중첩 서브메뉴가 있는 경우, 각 항목을 평면화해서 표시
                      if (child.hasSubmenu && child.submenuItems) {
                        return child.submenuItems.map((sub: any) => (
                          <SubMenuItem
                            key={`${child.label}-${sub.label}`}
                            to={sub.path}
                            onClick={handleSubMenuClick}
                          >
                            {`${child.label} - ${sub.label}`}
                          </SubMenuItem>
                        ));
                      }
                      // 일반 서브메뉴 항목
                      return (
                        <SubMenuItem key={child.label} to={child.path} onClick={handleSubMenuClick}>
                          {child.label}
                        </SubMenuItem>
                      );
                    })}
                  </SubMenu>
                )}
              </MenuContainer>
            ))}
        </MenuBar>
      </LeftSection>
      <RightSection>
        <UserIcon src={initialsIcon} alt="Initials" onClick={() => setUserMenuOpen((v) => !v)} />
        {userMenuOpen && (
          <UserMenu ref={userMenuRef}>
            <UserMenuTopArea gap={'4px'}>
              <UserMenuTopName>{sessionStorage.getItem('userName') || ''}</UserMenuTopName>
              <UserMenuTopEmail>{sessionStorage.getItem('userEmail') || ''} </UserMenuTopEmail>
              <UserMenuTopAuth>{sessionStorage.getItem('userGroup') || ''}</UserMenuTopAuth>
            </UserMenuTopArea>
            <CommonButton
              type="blue"
              onClick={handleLogout}
              sx={{
                styled: {
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '150%',
                },
              }}
            >
              Logout
            </CommonButton>
          </UserMenu>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

export default MainHeader;
