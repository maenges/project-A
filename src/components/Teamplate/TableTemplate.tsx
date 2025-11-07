import React from 'react';
import { Dialog, DialogTitle, IconButton, Typography, Container, Box, Stack } from '@mui/material';
import { tableForm } from '@/assets/style';
import closeIcon from '@/assets/images/ic-close.svg';
import chevronRight from '@/assets/images/chevron-right.svg';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SearchPanel from './SearchPanel';

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

export interface TableTemplateProps {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  component?: React.ReactNode;
  bodySize?: number | string;
  isModal?: boolean;
  searchComponent?: React.ReactNode;
  buttonComponent?: React.ReactNode;
}

export const TableTemplate: React.FC<TableTemplateProps> = ({
  open = true,
  onClose,
  title,
  subTitle,
  component,
  bodySize,
  isModal = true,
  searchComponent,
  buttonComponent,
}) => {
  const { pathname } = useLocation();

  const handleClose = (_event: {}) => {
    onClose?.();
  };

  // 메뉴에서 현재 경로에 맞는 타이틀 찾기
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
    const navigationItems = ['Home'];

    pathSegments.forEach((segment, index) => {
      const currentPath = '/' + pathSegments.slice(0, index + 1).join('/');

      if (index === pathSegments.length - 1) {
        const menuTitle = getMenuTitle(currentPath);
        if (menuTitle) {
          navigationItems.push(menuTitle);
          return;
        } else if (title && typeof title === 'string') {
          navigationItems.push(title);
          return;
        }
      }

      let formattedSegment = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .replace(/\B\w+/g, (l) => l.toLowerCase());

      formattedSegment = formattedSegment.replace(/\b\w{1,2}\b/g, (word) => word.toUpperCase());

      navigationItems.push(formattedSegment);
    });

    return navigationItems;
  };

  // 모달 모드
  if (isModal) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        fullWidth={false}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiDialog-paper': {
            display: 'flex',
            width: '1300px',
            height: bodySize,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: '880px',
            margin: 0,
            padding: 'var(--spacing-0, 0) 0',
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderRadius: '16px',
            background: 'var(--color-background-base-white, #FFF)',
            boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.15), 0 0 20px 0 rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            '@media (max-width: 1340px)': {
              width: 'calc(100vw - 40px)',
              height: '880px',
              maxHeight: 'calc(100vh - 40px)',
            },
            '@media (max-width: 768px)': {
              width: 'calc(100vw - 32px)',
              height: 'auto',
              maxHeight: 'calc(100vh - 32px)',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            padding: 'var(--spacing-16, 16px) 40px',
            height: '68px',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: '16px 16px 0 0',
            background: 'var(--color-background-base-white, #FFF)',
            '@media (max-width: 1340px)': {
              padding: 'var(--spacing-16, 16px) 20px',
            },
            '@media (max-width: 768px)': {
              padding: 'var(--spacing-16, 16px) 16px',
              height: 'auto',
              minHeight: '68px',
            },
          }}
        >
          <tableForm.HeaderContent>
            <Typography className="label-modal-title-lg">{title}</Typography>
            {subTitle && <Typography className="label-modal-title-sm">{subTitle}</Typography>}
          </tableForm.HeaderContent>
          <IconButton onClick={onClose} sx={{ padding: 0, width: 28, height: 28 }}>
            <img src={closeIcon} alt="Close" style={{ width: 28, height: 28 }} />
          </IconButton>
        </DialogTitle>
        <tableForm.BodyDiv>{component}</tableForm.BodyDiv>
      </Dialog>
    );
  }

  // 페이지 모드
  const navigationItems = createNavigation();

  return (
    <Container maxWidth={false} disableGutters sx={{ width: '100%', mx: 0 }}>
      <HeaderArea direction={'row'}>
        {title && (
          <Typography className="label-lg" component="h1" sx={{ mt: 3 }}>
            {title}
          </Typography>
        )}
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

      {buttonComponent && <Box sx={{ mb: 2 }}>{buttonComponent}</Box>}

      <Box sx={{ width: '100%', flex: 1 }}>{component}</Box>
    </Container>
  );
};
