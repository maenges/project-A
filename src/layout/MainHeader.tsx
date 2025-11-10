import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  background-color: white;
  color: white;
  position: fixed;
  top: 0;
  left: ${({ isSidebarOpen }) => (isSidebarOpen ? '280px' : '0')};
  right: 0;
  z-index: 1000;
  transition: left 0.3s ease-in-out;

  @media (max-width: 1200px) {
    left: 0;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled(IconButton)`
  color: white !important;
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
  transition: background-color 0.5s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.div`
  font-size: 12px;
  /* color: ${(props) => props.theme.colors.text.secondary}; */
  color: #2c2c2cff;
  margin-bottom: 4px;
  font-weight: 500;
`;

const CardValue = styled.div`
  color: #2c2c2cff;
  font-size: 18px;
  font-weight: 700;
`;

interface MainHeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const blinkingColor = blink ? '#e4c57a' : undefined;

  return (
    <HeaderContainer isSidebarOpen={isSidebarOpen}>
      <HeaderLeft>
        <MenuButton onClick={toggleSidebar}>
          <MenuIcon />
        </MenuButton>
      </HeaderLeft>
      <HeaderRight>
        <InfoCard>
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
        <InfoCard>
          <CardTitle style={{ fontWeight: 'bold' }}>접속자수</CardTitle>
          <CardValue>0명</CardValue>
        </InfoCard>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default MainHeader;
