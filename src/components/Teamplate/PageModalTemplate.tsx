import React, { useEffect, useMemo } from 'react';
import { Dialog, DialogTitle, IconButton, Typography, Box } from '@mui/material';
import { tableForm } from '@/assets/style';
import closeIcon from '@/assets/images/ic-close.svg';
import { alpha, useTheme } from '@mui/material/styles';
// import chevronRight from '@/assets/images/chevron-right.svg';
// import { useLocation } from 'react-router-dom';
// import styled from 'styled-components';
import SearchPanel from './SearchPanel';
import ButtonPanel, { ButtonPanelProps } from './ButtonPanel';
import { EtsGrid } from '../EtsGrid';
import { ColDef, IDatasource } from 'ag-grid-community';
import EtsLeftTree from '@/components/EtsCommon/EtsLeftTree';

// const HeaderArea = styled(Stack)`
//   display: flex;
//   justify-content: space-between;
//   align-items: end;
// `;

// const NavigationItem = styled(Typography)`
//   color: var(--color-brand-darkblue-100, #051766);
//   font-weight: 700;
//   font-size: 12px !important;
//   line-height: 24px;
// `;

export interface PageModalTemplateProps {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  component?: React.ReactNode;
  bodySize?: number | string;
  isModal?: boolean;
  searchComponent?: React.ReactNode;
  buttonComponent?: React.ReactNode;
  buttonPanelProps?: Partial<ButtonPanelProps>;
  width?: number | string;
  tree?: boolean;
  // Grid props (optional)
  columnDefs?: ColDef[];
  rowData?: any[];
  onCellValueChanged?: (_params: any) => void;
  onCellClicked?: (_params: any) => void;
  gridRef?: React.Ref<any>;
  suppressRowTransform?: boolean;
  suppressRowClickSelection?: boolean;
  isRowSelectable?: (node: any) => boolean;
  dataSource?: IDatasource;
  cacheBlockSize?: number;
  cacheOverflowSize?: number;
  maxConcurrentDatasourceRequests?: number;
  infiniteInitialRowCount?: number;
  maxBlocksInCache?: number;
  rowSelection?: 'single' | 'multiple';
  rowMultiSelectWithClick?: boolean;
}

export const PageModalTemplate: React.FC<PageModalTemplateProps> = ({
  open = true,
  onClose,
  title,
  component,
  bodySize,
  isModal = true,
  searchComponent,
  buttonComponent,
  buttonPanelProps,
  width,
  tree = false,
  // Grid props
  columnDefs,
  rowData = [],
  onCellValueChanged,
  onCellClicked,
  gridRef,
  suppressRowTransform = true,
  suppressRowClickSelection,
  isRowSelectable,
  dataSource,
  cacheBlockSize,
  cacheOverflowSize,
  maxConcurrentDatasourceRequests,
  infiniteInitialRowCount,
  maxBlocksInCache,
  rowSelection,
  rowMultiSelectWithClick,
}) => {
  // const { pathname } = useLocation();
  const theme = useTheme();
  const gridHeight = useMemo(() => 'calc(100vh - 500px)', []);

  // Prevent body scroll flicker when opening/closing modal
  useEffect(() => {
    if (!isModal) return;
    if (open) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      const prevOverflow = document.body.style.overflow;
      const prevPaddingRight = document.body.style.paddingRight;
      document.body.setAttribute('data-prev-overflow', prevOverflow || '');
      document.body.setAttribute('data-prev-padding-right', prevPaddingRight || '');
      document.body.style.overflow = 'hidden';
      // Avoid layout shift due to missing scrollbar
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      return () => {
        document.body.style.overflow = document.body.getAttribute('data-prev-overflow') || '';
        document.body.style.paddingRight =
          document.body.getAttribute('data-prev-padding-right') || '';
        document.body.removeAttribute('data-prev-overflow');
        document.body.removeAttribute('data-prev-padding-right');
      };
    }
    return;
  }, [open, isModal]);

  const handleClose = (_event: {}) => {
    onClose?.();
  };

  // 메뉴에서 현재 경로에 맞는 타이틀 찾기
  // const getMenuTitle = (currentPath: string) => {
  //   try {
  //     const userMenus = JSON.parse(sessionStorage.getItem('userMenus') || '[]');
  //     const menu = userMenus.find((menu: any) => menu.menuPath === currentPath);
  //     return menu?.menuName || null;
  //   } catch {
  //     return null;
  //   }
  // };

  // pathname과 메뉴 정보를 기반으로 네비게이션 생성
  // const createNavigation = () => {
  //   const pathSegments = pathname.split('/').filter((segment) => segment.length > 0);
  //   const navigationItems = ['Home'];

  //   pathSegments.forEach((segment, index) => {
  //     const currentPath = '/' + pathSegments.slice(0, index + 1).join('/');

  //     if (index === pathSegments.length - 1) {
  //       const menuTitle = getMenuTitle(currentPath);
  //       if (menuTitle) {
  //         navigationItems.push(menuTitle);
  //         return;
  //       } else if (title && typeof title === 'string') {
  //         navigationItems.push(title);
  //         return;
  //       }
  //     }

  //     let formattedSegment = segment
  //       .replace(/-/g, ' ')
  //       .replace(/\b\w/g, (l) => l.toUpperCase())
  //       .replace(/\B\w+/g, (l) => l.toLowerCase());

  //     formattedSegment = formattedSegment.replace(/\b\w{1,2}\b/g, (word) => word.toUpperCase());

  //     navigationItems.push(formattedSegment);
  //   });

  //   return navigationItems;
  // };

  // 모달 모드
  if (isModal) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        disableEnforceFocus
        disableRestoreFocus
        keepMounted
        maxWidth={false}
        fullWidth={false}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiDialog-paper': (theme) => ({
            display: 'flex',
            width: width || '1000px',
            height: bodySize,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: '1000px',
            margin: 0,
            padding: 'var(--spacing-0, 0) 0',
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderRadius: '16px',
            background: theme.palette.background.paper,
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
          }),
        }}
      >
        {/* Ensure CKEditor dialogs appear above MUI modal */}
        <style>{`.cke_dialog{z-index:2000!important}`}</style>
        <DialogTitle
          sx={(theme) => ({
            display: 'flex',
            padding: 'var(--spacing-16, 16px) 40px',
            height: '68px',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: '16px 16px 0 0',
            background:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.primary.dark, 0.1)
                : alpha(theme.palette.primary.main, 0.1),
            '@media (max-width: 1340px)': {
              padding: 'var(--spacing-16, 16px) 20px',
            },
            '@media (max-width: 768px)': {
              padding: 'var(--spacing-16, 16px) 16px',
              height: 'auto',
              minHeight: '68px',
            },
          })}
        >
          <tableForm.HeaderContent>
            <Typography
              sx={(theme) => ({
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.common.white
                    : theme.palette.common.black,
              })}
            >
              {title}
            </Typography>
          </tableForm.HeaderContent>
          <IconButton onClick={onClose} sx={{ padding: 0, width: 28, height: 28 }}>
            <img
              src={closeIcon}
              alt="Close"
              style={{
                filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)',
                width: 28,
                height: 28,
              }}
            />
          </IconButton>
        </DialogTitle>
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'stretch', flex: 1, minHeight: 0 }}>
          {tree && (
            <Box
              sx={{
                ml: 2,
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                minHeight: 0,
              }}
            >
              <EtsLeftTree
                checkable
                sx={{
                  mt: 3,
                }}
              />
            </Box>
          )}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              // 우측 전체 영역이 뷰 높이에 맞게 확장되고 내부 스크롤은 그리드/리스트가 담당
              maxHeight: 'calc(100vh - 140px)',
            }}
          >
            <tableForm.BodyDiv>
              <>
                {searchComponent && (
                  <Box sx={{ mt: 7, mb: 3, flexShrink: 0 }}>
                    <SearchPanel searchComponent={searchComponent} />
                  </Box>
                )}
                {buttonComponent && (
                  <Box
                    sx={{
                      display: 'flex',
                      mt: '24px',
                      paddingBottom: '12px',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      alignSelf: 'stretch',
                      flexShrink: 0,
                    }}
                  >
                    <Typography className="label"></Typography>
                    <ButtonPanel buttonComponent={buttonComponent} {...buttonPanelProps} />
                  </Box>
                )}
                {columnDefs ? (
                  <>
                    <Box
                      sx={{
                        width: '100%',
                        flex: 1,
                        minHeight: 0,
                      }}
                    >
                      <EtsGrid
                        height={gridHeight}
                        ref={gridRef}
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onCellValueChanged={onCellValueChanged}
                        onCellClicked={onCellClicked}
                        suppressRowTransform={suppressRowTransform}
                        suppressRowClickSelection={suppressRowClickSelection}
                        isRowSelectable={isRowSelectable}
                        datasource={dataSource}
                        cacheBlockSize={cacheBlockSize}
                        cacheOverflowSize={cacheOverflowSize}
                        maxConcurrentDatasourceRequests={maxConcurrentDatasourceRequests}
                        infiniteInitialRowCount={infiniteInitialRowCount}
                        maxBlocksInCache={maxBlocksInCache}
                        rowSelection={rowSelection}
                        rowMultiSelectWithClick={rowMultiSelectWithClick}
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ width: '100%', flex: 1, minHeight: 0 }}>{component}</Box>
                  </>
                )}
              </>
            </tableForm.BodyDiv>
          </Box>
        </Box>
      </Dialog>
    );
  }

  // 페이지 모드
  // const navigationItems = createNavigation();
  // return (
  //   <Container maxWidth={false} disableGutters sx={{ width: '100%', mx: 0 }}>
  //     <HeaderArea direction={'row'}>
  //       {title && <Typography className="label-lg">{title}</Typography>}
  //       {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //         {navigationItems.map((item, index) => (
  //           <React.Fragment key={index}>
  //             <NavigationItem
  //               sx={{ fontWeight: index === navigationItems.length - 1 ? '700' : '500' }}
  //             >
  //               {item}
  //             </NavigationItem>
  //             {index < navigationItems.length - 1 && (
  //               <NavigationItem sx={{ display: 'flex', alignItems: 'end' }}>
  //                 <img src={chevronRight} alt="chevron-right" />
  //               </NavigationItem>
  //             )}
  //           </React.Fragment>
  //         ))}
  //       </Box> */}
  //     </HeaderArea>

  //     {/* {searchComponent && (
  //       <Box sx={{ mt: 3, mb: 3 }}>
  //         <SearchPanel searchComponent={searchComponent} />
  //       </Box>
  //     )}
  //        */}
  //     {/* {buttonComponent && <Box sx={{ mb: 2 }}>{buttonComponent}</Box>} */}

  //     <Box sx={{ width: '100%', flex: 1 }}>{component}</Box>
  //   </Container>
  // );
};
