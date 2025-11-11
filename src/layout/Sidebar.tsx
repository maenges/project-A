import React, { useState } from 'react';
import { useThemeMode } from '@/contexts/ThemeContext';
import styled, { useTheme } from 'styled-components';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
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
} from '@mui/icons-material';

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: 280px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-280px')};
  transition: left 0.3s ease-in-out;
  z-index: 1100;
  padding: 20px 0 20px 20px; /* 오른쪽 패딩 제거 */
  box-sizing: border-box;
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[30]};

  @media (max-width: 1200px) {
    left: ${({ isOpen }) => (isOpen ? '0' : '-280px')};
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  padding: 20px 0;
`;

const LogoText = styled.span`
  font-size: 22px;
  font-weight: bold;
  /* 브랜드 컬러 대신 모드에 따른 기본 텍스트 컬러 사용 */
  color: ${({ theme }) => theme.colors.text.primary};
  margin-left: 12px;
`;

const Logo: React.FC = () => {
  const theme = useTheme() as any;
  const main = theme?.colors?.primary?.main ?? '#00AB55';
  const dark = theme?.colors?.primary?.dark ?? main;
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: main, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: dark, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M50 5 L61.2 35.5 L95 35.5 L68.5 58 L79.7 88.5 L50 67 L20.3 88.5 L31.5 58 L5 35.5 L38.8 35.5 Z"
        fill="url(#starGradient)"
        transform="rotate(10 50 50)"
      />
    </svg>
  );
};

// hex color + alpha(0~1) -> 8-digit hex (#RRGGBBAA)
const withAlpha = (hex: string, alpha: number) => {
  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};

const MenuList = styled(List)`
  flex-grow: 1; /* 메뉴 리스트가 남은 공간을 모두 차지하도록 설정 */
  overflow-y: auto; /* 내용이 넘칠 경우 자동으로 스크롤바 생성 */
  scrollbar-gutter: stable;

  /* 스크롤바 디자인 (선택 사항) */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent; /* 기본적으로 투명 처리 */
    border-radius: 3px;
    transition: background 0.3s ease; /* 부드러운 전환 효과 */
  }

  /* 스크롤 중일 때 스크롤바 보이게 */
  &.scrolling::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[30]};
  }

  /* 호버 시에도 보이게 (선택적) */
  &:hover::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[30]};
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
    margin-right: 14px; /* 메뉴 아이템 오른쪽에 마진 추가 */

    .MuiListItemIcon-root {
      color: ${({ theme }) => theme.colors.text.secondary};
      min-width: 40px;
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
`;

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  // '활성화'된 항목을 추적하는 단일 상태 (부모 또는 자식 메뉴의 텍스트)
  const [activeItem, setActiveItem] = useState<string>('');
  // 열려있는 부모 메뉴들을 추적하는 상태
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  // 부모 메뉴 클릭 핸들러: 메뉴를 열고 닫는 역할만 수행
  const handleParentClick = (text: string) => {
    setOpen((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  // 하위 메뉴 또는 단일 메뉴 클릭 핸들러
  const handleItemClick = (text: string) => {
    // 해당 항목을 '활성' 항목으로 설정합니다.
    setActiveItem(text);
  };

  const menuItems = [
    {
      text: '시스템',
      icon: <AdminPanelSettings />,
      children: [
        { text: '공지사항', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: '입금계좌', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: '문구', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: 'IP차단', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: '로그인 기록', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
      ],
    },
    {
      text: '충/환전',
      icon: <CurrencyExchange />,
      children: [
        { text: '충전', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: '환전', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: '자금이동', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
      ],
    },
    {
      text: '파트너',
      icon: <Handshake />,
      children: [
        { text: '파트너 목록', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: '알 이동', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
      ],
    },
    {
      text: '회원',
      icon: <Group />,
      children: [
        { text: '회원 목록', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: '승인대기', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: '현재 접속자', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
      ],
    },
    {
      text: '베팅',
      icon: <SportsEsports />,
      children: [
        { text: '베팅 목록', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: '로스 조정', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
        { text: '로스 복구', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> },
      ],
    },
    {
      text: '게임 기록',
      icon: <History />,
      children: [{ text: '통계', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> }],
    },
    {
      text: '정산',
      icon: <Calculate />,
      children: [{ text: '루징', icon: <FiberManualRecord sx={{ fontSize: 6 }} /> }],
    },
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <LogoContainer>
        <Logo />
        <LogoText>스타솔루션</LogoText>
      </LogoContainer>
      <MenuList>
        {menuItems.map((item) => {
          // 현재 활성화된 항목이 이 부모 메뉴의 자식인지 확인
          const isChildActive = item.children?.some((child) => child.text === activeItem) ?? false;

          return (
            <React.Fragment key={item.text}>
              <ListItemButton
                onClick={() =>
                  item.children ? handleParentClick(item.text) : handleItemClick(item.text)
                }
                // 자식 메뉴가 활성화된 경우에만 부모가 녹색('Mui-selected')이 됩니다.
                selected={isChildActive}
                // 메뉴가 열려 있고, 자식 메뉴가 활성화되지 않았을 때 회색('child-selected')으로 표시합니다.
                className={
                  item.children && open[item.text] && !isChildActive ? 'child-selected' : ''
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.children ? (
                  open[item.text] ? (
                    <ExpandMore />
                  ) : (
                    <ChevronRight />
                  )
                ) : (
                  <ChevronRight />
                )}
              </ListItemButton>
              {item.children && (
                <Collapse in={open[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.text}
                        sx={{ pl: 4 }}
                        onClick={() => handleItemClick(child.text)}
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
        {/* Dark mode toggle button area */}
        <DarkModeToggle />
        {/* Brand color switcher */}
        <BrandSwitcher />
      </MenuList>
    </SidebarContainer>
  );
};

// Toggle button component (placed here to access hook without prop drilling)
const ToggleButtonContainer = styled.div`
  margin: 12px 14px 0 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background.default}; /* 사이드바 배경과 동일 */
  border: none; /* 박스 경계 제거로 자연스럽게 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.neutral[20]};
  }
`;

const DarkModeToggle: React.FC = () => {
  const { mode, toggle } = useThemeMode();
  return (
    <ToggleButtonContainer onClick={toggle}>
      <span>{mode === 'light' ? '🌙 다크 모드' : '☀️ 라이트 모드'}</span>
    </ToggleButtonContainer>
  );
};

// Brand color switcher
const BrandRow = styled.div`
  margin: 8px 14px 0 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background.default}; /* 사이드바와 동일 */
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BrandLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: 6px;
`;

const ColorDot = styled.button<{ $color: string; $active?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: ${({ $active, theme }) =>
    $active ? `2px solid ${theme.colors.text.base}` : '2px solid transparent'};
  box-shadow: ${({ $active }) => ($active ? '0 0 0 2px rgba(0,0,0,0.08)' : 'none')};
  cursor: pointer;
`;

const BrandSwitcher: React.FC = () => {
  const { brand, setBrand } = useThemeMode();
  const palette = {
    green: '#00AB55',
    blue: '#1976d2',
    purple: '#7C09CE',
  } as const;

  return (
    <BrandRow>
      <BrandLabel>Theme color</BrandLabel>
      {Object.entries(palette).map(([key, color]) => (
        <ColorDot
          key={key}
          aria-label={`set ${key} theme`}
          $color={color}
          $active={brand === (key as any)}
          onClick={() => setBrand(key as any)}
        />
      ))}
    </BrandRow>
  );
};

export default Sidebar;
