import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
// import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

const HeaderContainer = styled.header<{ isSidebarOpen: boolean }>`
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  /* background-color: #343a40; 사이드바 색상과 동일하게 변경 */
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  position: fixed;
  top: 0;
  left: ${({ isSidebarOpen }) => (isSidebarOpen ? '280px' : '0')};
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

const InfoCard = styled.div<{ bgcolor?: string }>`
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
    color 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid ${({ theme }) => theme.colors.neutral[30]};
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
  isSidebarOpen: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const [blink, setBlink] = useState(false);
  const theme = useTheme() as any;

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 300); // 0.3초 간격으로 깜박임
    return () => clearInterval(interval);
  }, []);
  // 테마 컬러(브랜드 프라이머리)를 옅게 적용한 배경색과 교차 깜박임
  const themedSoft = withAlpha(theme?.colors?.primary?.main ?? '#00AB55', 0.16);
  const blinkingColor = blink ? '#e4c57a' : themedSoft;

  return (
    <HeaderContainer isSidebarOpen={isSidebarOpen}>
      <HeaderLeft>
        <MenuButton onClick={toggleSidebar}>
          <MenuIcon />
        </MenuButton>
      </HeaderLeft>
      <HeaderRight>
        <InfoCard bgcolor={themedSoft}>
          <CardTitle style={{ fontWeight: 'bold' }}>보유금</CardTitle>
          <CardValue>-2,310,476,112,929</CardValue>
        </InfoCard>
        <InfoCard bgcolor={blinkingColor}>
          <CardTitle style={{ fontWeight: 'bold' }}>승인대기</CardTitle>
          <CardValue>1건</CardValue>
        </InfoCard>
        <InfoCard bgcolor={blinkingColor}>
          <CardTitle style={{ fontWeight: 'bold' }}>충전</CardTitle>
          <CardValue>3건</CardValue>
        </InfoCard>
        <InfoCard bgcolor={blinkingColor}>
          <CardTitle style={{ fontWeight: 'bold' }}>환전</CardTitle>
          <CardValue>0건</CardValue>
        </InfoCard>
        <InfoCard bgcolor={blinkingColor}>
          <CardTitle style={{ fontWeight: 'bold' }}>문의</CardTitle>
          <CardValue>12건</CardValue>
        </InfoCard>
        <InfoCard bgcolor={themedSoft}>
          <CardTitle style={{ fontWeight: 'bold' }}>접속자수</CardTitle>
          <CardValue>0명</CardValue>
        </InfoCard>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default MainHeader;
