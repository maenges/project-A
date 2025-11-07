import React from 'react';
import { Typography, Box, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SearchPanel from './SearchPanel';
import chevronRight from '@/assets/images/chevron-right.svg';

export interface TabSearchAreaProps {
  title?: string;
  description?: string;
  searchComponent?: React.ReactNode;
}

const HeaderArea = styled(Stack)`
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

const NavigationItem = styled(Typography)`
  color: var(--color-brand-darkblue-100, #051766);
  font-weight: 700;
  font-size: 12px !important;
  line-height: 24px;
`;

const TabSearchArea = ({ title, searchComponent }: TabSearchAreaProps) => {
  const { pathname } = useLocation();

  const getMenuTitle = (currentPath: string) => {
    try {
      const userMenus = JSON.parse(sessionStorage.getItem('userMenus') || '[]');
      const menu = userMenus.find((menu: any) => menu.menuPath === currentPath);
      return menu?.menuName || null;
    } catch {
      return null;
    }
  };

  // pathname과 메뉴 정보를 기반으로 네비게이션 생성
  const createNavigation = () => {
    const pathSegments = pathname.split('/').filter((segment) => segment.length > 0);
    const navigationItems = ['Home']; // 항상 Home으로 시작

    // 각 path segment를 처리하여 네비게이션 아이템 생성
    pathSegments.forEach((segment, index) => {
      // 현재까지의 경로 구성
      const currentPath = '/' + pathSegments.slice(0, index + 1).join('/');

      // 마지막 세그먼트인 경우 메뉴 타이틀 -> prop title -> 포맷팅된 세그먼트 순으로 시도
      if (index === pathSegments.length - 1) {
        const menuTitle = getMenuTitle(currentPath);
        if (menuTitle) {
          navigationItems.push(menuTitle);
          return;
        } else if (title) {
          navigationItems.push(title);
          return;
        }
      }

      // 중간 세그먼트이거나 메뉴/prop title이 없는 경우 포맷팅된 세그먼트 사용
      let formattedSegment = segment
        .replace(/-/g, ' ') // '-'를 ' '로 치환
        .replace(/\b\w/g, (l) => l.toUpperCase()) // 각 단어의 첫 글자를 대문자로
        .replace(/\B\w+/g, (l) => l.toLowerCase()); // 첫 글자를 제외한 나머지를 소문자로

      // 2자리 이하 단어는 모두 대문자로 변환
      formattedSegment = formattedSegment.replace(/\b\w{1,2}\b/g, (word) => word.toUpperCase());

      navigationItems.push(formattedSegment);
    });

    return navigationItems;
  };

  const navigationItems = createNavigation();
  return (
    <Box>
      <HeaderArea direction={'row'}>
        {/* 페이지 제목 */}
        {title && (
          <Typography className="label-lg" component="h1" sx={{ mt: 3 }}>
            {title}
          </Typography>
        )}
        {/* 네비게이션 영역 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {navigationItems.map((item, index) => (
            <React.Fragment key={index}>
              <NavigationItem
                sx={{ fontWeight: index === navigationItems.length - 1 ? '700' : '500' }}
              >
                {item}
              </NavigationItem>
              {index < navigationItems.length - 1 && (
                <NavigationItem sx={{ display: 'flex', alignItems: 'end' }}>
                  <img src={chevronRight} alt="chevron-right" />
                </NavigationItem>
              )}
            </React.Fragment>
          ))}
        </Box>
      </HeaderArea>

      {searchComponent && (
        <Box sx={{ mt: 3, mb: 3 }}>
          <SearchPanel searchComponent={searchComponent} />
        </Box>
      )}
    </Box>
  );
};

export default TabSearchArea;
