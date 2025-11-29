import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '@/contexts/ThemeContext';
import styled from 'styled-components';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Popper,
  Paper,
} from '@mui/material';
import {
  ChevronRight,
  AdminPanelSettings,
  CurrencyExchange,
  Handshake,
  Group,
  SportsEsports,
  History,
  Calculate,
  ExpandMore,
  FiberManualRecord,
  Star,
} from '@mui/icons-material';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@/utils/ApiUtil';

const RAIL_WIDTH = 72; // 접힘 상태 고정 폭
const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: ${({ isOpen }) => (isOpen ? '280px' : `${RAIL_WIDTH}px`)};
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s ease-in-out;
  z-index: 1100;
  padding: 20px 0 20px ${({ isOpen }) => (isOpen ? '12px' : '0')}; /* 접힘 시 좌측 패딩 제거로 아이콘 중앙 정렬 */
  box-sizing: border-box;
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[30]};

  @media (max-width: 1200px) {
    left: 0;
  }
`;

// 로고: 펼침 상태에서만 표시
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; /* 로고 가로 중앙 정렬 */
  gap: 10px;
  width: 100%;
  padding: 8px 12px 16px 12px; /* 좌우 동일 패딩으로 치우침 제거 */
  margin-top: 12px; /* 살짝 아래로 */
`;

const LogoText = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
`;

// hex color + alpha(0~1) -> 8-digit hex (#RRGGBBAA)
const withAlpha = (hex: string, alpha: number) => {
  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};

// ===== 모드 토글 & 브랜드 색상 스위처 (컴포넌트 먼저 선언: 타입 인식용) =====
const MenuSpacer = styled.div<{ $collapsed: boolean }>`
  height: ${({ $collapsed }) => ($collapsed ? '16px' : '80px')};
  width: 100%;
`;

const ToggleButtonContainer = styled.div<{ $collapsed: boolean }>`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background 0.2s;
  border-radius: ${({ $collapsed }) => ($collapsed ? '50%' : '8px')};
  background: ${({ theme }) => theme.colors.background.default};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  ${({ $collapsed }) =>
    $collapsed
      ? `
      width: ${RAIL_WIDTH}px;
      height: 44px;
      align-self: center;
      margin: 10px 0;
    `
      : `
      margin: 12px 14px 0 0;
      padding: 10px 12px;
      justify-content: flex-start; /* 펼침 모드: 왼쪽 정렬 */
    `}
  &:hover {
    background: ${({ theme }) => theme.colors.neutral[20]};
  }
  ${({ $collapsed }) =>
    $collapsed &&
    `
    &:hover { background: transparent; }
  `}
`;

interface ToggleProps {
  collapsed: boolean;
}
function DarkModeToggle({ collapsed }: ToggleProps) {
  const { mode, toggle } = useThemeMode();
  return (
    <ToggleButtonContainer $collapsed={collapsed} onClick={toggle} aria-label="toggle theme mode">
      <span role="img" aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>
        {mode === 'light' ? '🌙' : '☀️'}
      </span>
      {!collapsed && (
        <span style={{ fontWeight: 700 }}>{mode === 'light' ? '라이트모드' : '다크모드'}</span>
      )}
    </ToggleButtonContainer>
  );
}

const BrandRow = styled.div<{ $collapsed: boolean }>`
  margin-top: auto;
  padding: ${({ $collapsed }) => ($collapsed ? '12px 0 16px 0' : '12px 14px 16px 12px')};
  display: flex;
  flex-direction: ${({ $collapsed }) => ($collapsed ? 'column' : 'row')};
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: ${({ $collapsed }) => ($collapsed ? '12px' : '10px')};
  width: 100%;
  ${({ $collapsed }) =>
    $collapsed &&
    `
    width: ${RAIL_WIDTH}px;
    align-self: center;
  `}
`;

const ColorDot = styled.button<{ $color: string; $active?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: ${({ $active, theme }) =>
    $active ? `2px solid ${theme.colors.text.base}` : '2px solid transparent'};
  box-shadow: ${({ $active }) => ($active ? '0 0 0 2px rgba(0,0,0,0.08)' : 'none')};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface BrandSwitcherProps {
  collapsed: boolean;
}
function BrandSwitcher({ collapsed }: BrandSwitcherProps) {
  const { brand, setBrand } = useThemeMode();
  const palette = { green: '#00AB55', blue: '#1976d2', purple: '#7C09CE' } as const;
  return (
    <BrandRow $collapsed={collapsed}>
      {!collapsed && (
        <span style={{ fontSize: 12, color: 'inherit', opacity: 0.9 }}>Theme color</span>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: collapsed ? 'column' : 'row',
          gap: collapsed ? 12 : 10,
          alignItems: 'center',
        }}
      >
        {Object.entries(palette).map(([key, color]) => (
          <ColorDot
            key={key}
            aria-label={`set ${key} theme`}
            $color={color}
            $active={brand === (key as any)}
            onClick={() => setBrand(key as any)}
          />
        ))}
      </div>
    </BrandRow>
  );
}

const MenuList = styled(List)<{ $collapsed: boolean }>`
  /* 컨테이너 높이 변동을 막아 Collapse 전개 시 상단 '위로 밀림' 현상 제거 */
  flex: 0 0 auto; /* flex-grow 제거 */
  overflow-y: ${({ $collapsed }) => ($collapsed ? 'none' : 'auto')};
  scrollbar-gutter: stable both-edges; /* 스크롤바 너비 변동 억제 */
  margin-top: 0;
  box-sizing: border-box;
  padding-right: ${({ $collapsed }) => ($collapsed ? '0' : '14px')};
  padding-left: 0;
  /* 추후 실제 로고/토글/브랜드 영역 픽셀 측정 후 미세조정 가능 */
  height: ${({ $collapsed }) => ($collapsed ? 'calc(100vh - 160px)' : 'calc(100vh - 210px)')};
  max-height: ${({ $collapsed }) => ($collapsed ? 'calc(100vh - 160px)' : 'calc(100vh - 210px)')};
  overflow-anchor: none; /* 자동 앵커링 비활성화로 상단 기준 고정 */

  /* 카테고리(글로벌) 스타일과 동일하게 스크롤바 적용 */
  &::-webkit-scrollbar {
    width: 8px;
    background: ${({ theme }) => theme.colors.neutral[20]};
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[20]};
    border-radius: ${({ theme }) => theme.radius.md};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[50]};
    border-radius: ${({ theme }) => theme.radius.md};
    &:hover {
      background: ${({ theme }) => theme.colors.neutral[70]};
    }
  }

  .MuiListSubheader-root {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: ${({ theme }) => theme.fonts.weight.bold};
    font-size: 0.75rem;
    padding-left: 16px;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .MuiListItemButton-root {
    border-radius: 8px;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-right: 0; /* 레일에서는 오른쪽 마진 제거 */
    margin-left: 0; /* 레일에서는 왼쪽 마진 제거 */

    .MuiListItemIcon-root {
      color: ${({ theme }) => theme.colors.text.secondary};
      min-width: ${({ $collapsed }) => ($collapsed ? '48px' : '40px')};
      justify-content: center; /* 아이콘 중앙 정렬 */
    }

    /* 기본 선택 스타일 (녹색) - 부모 열림, 단일 메뉴 선택 */
    &.Mui-selected {
      background-color: ${({ theme }) => withAlpha(theme.colors.primary.main, 0.16)};
      color: ${({ theme }) => theme.colors.primary.main};
      font-weight: ${({ theme }) => theme.fonts.weight.bold};
      .MuiListItemIcon-root {
        color: ${({ theme }) => theme.colors.primary.main};
      }
      &:hover {
        /* 선택된 항목에 다시 호버 시 색 왜곡 방지를 위해 동일 톤 유지 */
        background-color: ${({ theme }) => withAlpha(theme.colors.primary.main, 0.16)} !important;
      }
    }

    /* 하위 메뉴 선택 스타일 (회색) */
    &.child-selected {
      background-color: ${({ theme }) => theme.colors.neutral[20]};
      color: ${({ theme }) => theme.colors.text.primary};
      font-weight: ${({ theme }) => theme.fonts.weight.bold};
      .MuiListItemIcon-root {
        color: ${({ theme }) => theme.colors.text.primary};
      }
      &:hover {
        /* 이미 선택된 하위 항목은 hover 시 배경 변화 억제 */
        background-color: ${({ theme }) => theme.colors.neutral[20]} !important;
      }
    }

    /* 기본 호버 */
    &:hover {
      background-color: ${({ theme }) => theme.colors.neutral[20]};
    }
  }

  /* 접힘 상태에서는 텍스트와 리스트 우측 화살표 숨김 */
  ${({ $collapsed }) =>
    $collapsed &&
    `
    .MuiListItemText-root { display: none; }
      .MuiListItemButton-root { padding-left: 0; padding-right: 0; width: ${RAIL_WIDTH}px; }
      .MuiListItemButton-root .MuiListItemIcon-root { min-width: ${RAIL_WIDTH}px; width: ${RAIL_WIDTH}px; }
    svg[data-role='chevron'] { display: none; }
  `}
`;

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  // '활성화'된 항목을 추적하는 단일 상태 (부모 또는 자식 메뉴의 텍스트)
  const [activeItem, setActiveItem] = useState<string>('');
  // 열려있는 부모 메뉴들을 추적하는 상태
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const collapsed = !isOpen;
  const [flyout, setFlyout] = useState<{
    anchorEl: HTMLElement | null;
    items: { text: string; icon?: React.ReactNode; path?: string }[];
    parentText: string;
  } | null>(null);
  const flyoutTimer = useRef<number | null>(null);

  const clearFlyoutTimer = () => {
    if (flyoutTimer.current) {
      clearTimeout(flyoutTimer.current);
      flyoutTimer.current = null;
    }
  };
  const scheduleFlyoutClose = (delay = 140) => {
    clearFlyoutTimer();
    flyoutTimer.current = window.setTimeout(() => setFlyout(null), delay);
  };

  // 부모 메뉴 클릭 핸들러: 메뉴를 열고 닫는 역할만 수행
  const handleParentClick = (text: string) => {
    if (collapsed) return;
    setOpen((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  // 하위 메뉴 또는 단일 메뉴 클릭 핸들러
  const handleItemClick = (text: string, path: string) => {
    // 해당 항목을 '활성' 항목으로 설정합니다.
    setActiveItem(text);
    if (path) navigate(path);
  };

  const [menuItems, setMenuItems] = useState<any[]>([]);

  // 메뉴 아이콘 매핑
  const getIcon = (menuName: string) => {
    switch (menuName) {
      case '시스템':
        return <AdminPanelSettings />;
      case '충환전':
        return <CurrencyExchange />;
      case '파트너':
        return <Handshake />;
      case '회원':
        return <Group />;
      case '베팅':
        return <SportsEsports />;
      case '게임기록':
        return <History />;
      case '정산':
        return <Calculate />;
      default:
        return <Star />;
    }
  };

  // API 데이터 변환 함수
  const transformMenuData = (data: any[]) => {
    const menuMap: { [key: string]: any } = {};
    const roots: any[] = [];

    data.forEach((item) => {
      const menuItem = {
        text: item.menu_name,
        icon: getIcon(item.menu_name),
        children: [],
        path: item.menu_url || '',
        menu_key: item.menu_key,
        parent_menu_key: item.parent_menu_key,
        level: item.level,
        menu_order: item.menu_order,
        sort_path: item.sort_path,
      };

      menuMap[item.menu_key] = menuItem;

      if (item.parent_menu_key === null) {
        roots.push(menuItem);
      } else {
        if (menuMap[item.parent_menu_key]) {
          menuMap[item.parent_menu_key].children.push({
            text: item.menu_name,
            icon: <FiberManualRecord sx={{ fontSize: 6 }} />,
            path: item.menu_url || '',
            menu_key: item.menu_key,
          });
        }
      }
    });

    // 정렬
    roots.sort((a, b) => a.menu_order - b.menu_order);
    roots.forEach((root) => {
      root.children.sort((a: any, b: any) => a.menu_order - b.menu_order);
    });

    return roots;
  };

  // 메뉴 데이터 로드
  const loadMenuData = async () => {
    try {
      const response = await callApi({
        service: Service.HOST,
        url: '/api/menu',
        method: Method.GET,
        params: {
          queryParams: { groupType: 'HQ' },
        },
      });
      if (response.successOrNot === 'Y') {
        const transformedData = transformMenuData(response.data);
        setMenuItems(transformedData);
      }
    } catch (error) {
      console.error('메뉴 데이터 로드 실패:', error);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  // 접힘으로 전환 시, 열림 상태는 모두 닫음 (요구5)
  useEffect(() => {
    if (collapsed) setOpen({});
  }, [collapsed]);

  return (
    <SidebarContainer isOpen={isOpen}>
      {/* 펼침 상태에서만 로고/텍스트 노출 */}
      {!collapsed && (
        <LogoContainer>
          <Star color="primary" sx={{ fontSize: 28 }} />
          <LogoText>스타솔루션</LogoText>
        </LogoContainer>
      )}
      <MenuSpacer $collapsed={collapsed} />
      <MenuList $collapsed={collapsed}>
        {menuItems.map((item) => {
          // 현재 활성화된 항목이 이 부모 메뉴의 자식인지 확인
          const isChildActive =
            item.children?.some((child: any) => child.text === activeItem) ?? false;

          return (
            <React.Fragment key={item.text}>
              <ListItemButton
                onClick={() =>
                  item.children
                    ? handleParentClick(item.text)
                    : handleItemClick(item.text, item.path)
                }
                onMouseEnter={(e) => {
                  if (collapsed && item.children) {
                    clearFlyoutTimer();
                    setFlyout({
                      anchorEl: e.currentTarget as HTMLElement,
                      items: item.children.map((child: any) => ({
                        text: child.text,
                        icon: child.icon,
                        path: child.path,
                      })),
                      parentText: item.text,
                    });
                  }
                }}
                onMouseLeave={() => {
                  if (collapsed) scheduleFlyoutClose(140);
                }}
                // 자식 메뉴가 활성화된 경우에만 부모가 녹색('Mui-selected')이 됩니다.
                selected={isChildActive}
                // 메뉴가 열려 있고, 자식 메뉴가 활성화되지 않았을 때 회색('child-selected') 표시 (접힘 시에는 제거)
                className={
                  !collapsed && item.children && open[item.text] && !isChildActive
                    ? 'child-selected'
                    : ''
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.children ? (
                  open[item.text] ? (
                    <ExpandMore data-role="chevron" />
                  ) : (
                    <ChevronRight data-role="chevron" />
                  )
                ) : (
                  <ChevronRight data-role="chevron" />
                )}
              </ListItemButton>
              {item.children && (
                <Collapse in={isOpen && open[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child: any) => (
                      <ListItemButton
                        key={child.text}
                        sx={{ pl: 4 }}
                        onClick={() => handleItemClick(child.text, child.path)}
                        // 현재 활성화된 항목일 때 회색('child-selected')으로 표시합니다.
                        className={activeItem === child.text ? 'child-selected' : ''}
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
        {/* Collapsed flyout submenu */}
        <Popper
          open={!isOpen && !!flyout}
          anchorEl={flyout?.anchorEl}
          placement="right-start"
          modifiers={[{ name: 'offset', options: { offset: [4, 8] } }]}
          style={{ zIndex: 1400 }}
          onMouseEnter={clearFlyoutTimer}
          onMouseLeave={() => setFlyout(null)}
        >
          <Paper elevation={6} sx={{ minWidth: 120, borderRadius: 1.5, overflow: 'hidden' }}>
            <List dense sx={{ py: 0.25 }}>
              {flyout?.items?.map((child) => (
                <ListItemButton
                  key={child.text}
                  onClick={() => {
                    setActiveItem(child.text);
                    if (child.path) navigate(child.path);
                    setFlyout(null);
                  }}
                  sx={{ py: 0.25, px: 1, minHeight: 26 }}
                >
                  {/* 접힘 모드 플라이아웃: 아이콘 제거, 작은 폰트 */}
                  <ListItemText primary={child.text} primaryTypographyProps={{ fontSize: 12 }} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Popper>
        {/* Dark mode toggle button area */}
        <DarkModeToggle collapsed={collapsed} />
        {/* Brand color switcher */}
        <BrandSwitcher collapsed={collapsed} />
      </MenuList>
    </SidebarContainer>
  );
};

export default Sidebar;
