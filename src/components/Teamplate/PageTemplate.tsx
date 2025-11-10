import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Stack } from '@mui/material';
import { ColDef, IDatasource, GridReadyEvent } from 'ag-grid-community';
import SearchPanel from './SearchPanel';
import ButtonPanel from './ButtonPanel';
import { EtsGrid } from '../EtsGrid';
// import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
// import chevronRight from '@/assets/images/chevron-right.svg';

const HeaderArea = styled(Stack)`
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

// const NavigationItem = styled(Typography)`
//   color: var(--color-brand-darkblue-100, #051766);
//   font-weight: 700;
//   font-size: 12px !important;
//   line-height: 24px;
// `;

export interface PageTemplateProps {
  title?: string;
  description?: string;
  searchComponent?: React.ReactNode;
  buttonComponent?: React.ReactNode;
  tabComponent?: React.ReactNode;
  columnDefs?: ColDef[];
  rowData?: any[];
  onCellValueChanged?: (_params: any) => void;
  onCellClicked?: (_params: any) => void;
  gridRef?: React.Ref<any>;
  defaultColDef?: ColDef;
  isInfiniteScroll?: boolean;
  suppressRowTransform?: boolean;
  showPinnedBottom?: boolean;
  subSelect?: React.ReactNode;
  totalCount?: number;
  dataSource?: IDatasource;
  cacheBlockSize?: number;
  cacheOverflowSize?: number;
  maxConcurrentDatasourceRequests?: number;
  infiniteInitialRowCount?: number;
  maxBlocksInCache?: number;
  rowSelection?: 'single' | 'multiple';
  rowMultiSelectWithClick?: boolean;
  suppressRowClickSelection?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'sm-two-header';
  loading?: boolean;
  onGridReady?: (params: GridReadyEvent) => void;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  // description,
  searchComponent,
  buttonComponent,
  tabComponent,
  columnDefs,
  rowData = [],
  onCellValueChanged,
  onCellClicked,
  gridRef,
  isInfiniteScroll,
  suppressRowTransform = true,
  showPinnedBottom,
  subSelect,
  totalCount,
  dataSource,
  cacheBlockSize,
  cacheOverflowSize,
  maxConcurrentDatasourceRequests,
  infiniteInitialRowCount,
  maxBlocksInCache,
  rowSelection,
  rowMultiSelectWithClick,
  suppressRowClickSelection,
  size = 'sm',
  onGridReady,
}) => {
  // --- size prop에 따라 그리드 높이를 결정하는 로직 ---
  const gridHeight = useMemo(() => {
    switch (size) {
      case 'sm-two-header':
        return 'calc(100vh - 420px)';
      case 'md':
        return 'calc(100vh - 470px)';
      case 'lg':
        return 'calc(100vh - 520px)';
      default:
        return 'calc(100vh - 430px)';
    }
  }, [size]);

  // Total row 데이터 계산
  const totalRowData = useMemo(() => {
    if (!showPinnedBottom || !columnDefs || !rowData || rowData.length === 0) return null;

    // 재귀적으로 모든 컬럼(그룹 내 하위 컬럼 포함) 수집
    const getAllColumns = (cols: ColDef[]): ColDef[] => {
      const result: ColDef[] = [];
      cols.forEach((col) => {
        if ('children' in col && col.children) {
          // 그룹 헤더인 경우 하위 컬럼들을 재귀적으로 처리
          result.push(...getAllColumns(col.children as ColDef[]));
        } else if (col.field) {
          // 일반 컬럼인 경우
          result.push(col);
        }
      });
      return result;
    };

    const allColumns = getAllColumns(columnDefs);
    const totalRow: Record<string, any> = {};

    // 첫 번째 컬럼에 'Total' 텍스트 설정
    const firstField = allColumns[0]?.field;
    if (firstField) totalRow[firstField] = 'Total';

    // 각 컬럼별 합계 계산
    allColumns.forEach((col) => {
      const field = col.field;
      if (!field) return;
      const isNumberCol = col.cellDataType === 'number';
      if (isNumberCol) {
        let sum = 0;
        for (const r of rowData) {
          const v = r?.[field];
          if (typeof v === 'number' && !isNaN(v)) sum += v;
        }
        // 소수점 3자리까지 반올림
        totalRow[field] = Math.round(sum * 1000) / 1000;
      } else if (field !== firstField) {
        totalRow[field] = '';
      }
    });

    return totalRow;
  }, [showPinnedBottom, rowData]);

  // 스크롤 감지 상태
  const [hasScroll, setHasScroll] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // 스크롤 감지 함수
  useEffect(() => {
    const checkScroll = () => {
      if (gridContainerRef.current) {
        const container = gridContainerRef.current;
        const agBodyViewport = container.querySelector('.ag-body-viewport') as HTMLElement;

        if (agBodyViewport) {
          const hasVerticalScroll = agBodyViewport.scrollHeight > agBodyViewport.clientHeight;
          // console.log('스크롤 체크:', {
          //   scrollHeight: agBodyViewport.scrollHeight,
          //   clientHeight: agBodyViewport.clientHeight,
          //   hasScroll: hasVerticalScroll,
          // });
          setHasScroll(hasVerticalScroll);
        }
      }
    };

    // 초기 체크
    const timer = setTimeout(checkScroll, 500);

    // MutationObserver로 DOM 변화 감지
    let observer: MutationObserver;
    if (gridContainerRef.current) {
      observer = new MutationObserver(checkScroll);
      observer.observe(gridContainerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [rowData]);

  // pinnedBottom 또는 일반 rowData에 추가할지 결정
  const pinnedBottomRowData = useMemo(() => {
    return totalRowData && hasScroll ? [totalRowData] : [];
  }, [totalRowData, hasScroll]);

  const enhancedRowData = useMemo(() => {
    if (!totalRowData || hasScroll || !rowData) return rowData;

    // 스크롤이 없을 때는 rowData에 Total을 추가
    return [...rowData, { ...totalRowData, isTotal: true }];
  }, [rowData, totalRowData, hasScroll]);

  // 편집 가능한 컬럼에 대해 헤더 스타일 적용
  const editColumnDefs = columnDefs?.map((col) => col);

  // const { pathname } = useLocation();

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
  //   const navigationItems = ['Home']; // 항상 Home으로 시작

  //   // 각 path segment를 처리하여 네비게이션 아이템 생성
  //   pathSegments.forEach((segment, index) => {
  //     // 현재까지의 경로 구성
  //     const currentPath = '/' + pathSegments.slice(0, index + 1).join('/');

  //     // 마지막 세그먼트인 경우 메뉴 타이틀 -> prop title -> 포맷팅된 세그먼트 순으로 시도
  //     if (index === pathSegments.length - 1) {
  //       const menuTitle = getMenuTitle(currentPath);
  //       if (menuTitle) {
  //         navigationItems.push(menuTitle);
  //         return;
  //       } else if (title) {
  //         navigationItems.push(title);
  //         return;
  //       }
  //     }

  //     // 중간 세그먼트이거나 메뉴/prop title이 없는 경우 포맷팅된 세그먼트 사용
  //     let formattedSegment = segment
  //       .replace(/-/g, ' ') // '-'를 ' '로 치환
  //       .replace(/\b\w/g, (l) => l.toUpperCase()) // 각 단어의 첫 글자를 대문자로
  //       .replace(/\B\w+/g, (l) => l.toLowerCase()); // 첫 글자를 제외한 나머지를 소문자로

  //     // 2자리 이하 단어는 모두 대문자로 변환
  //     formattedSegment = formattedSegment.replace(/\b\w{1,2}\b/g, (word) => word.toUpperCase());

  //     navigationItems.push(formattedSegment);
  //   });

  //   return navigationItems;
  // };

  // const navigationItems = createNavigation();

  return (
    <Container maxWidth={false} disableGutters sx={{ width: '100%', mx: 0 }}>
      <HeaderArea direction={'row'}>
        {/* 페이지 제목 */}
        {title && (
          <Typography className="label-lg" component="h1">
            {title}
          </Typography>
        )}
        {/* 네비게이션 영역 */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        </Box> */}
      </HeaderArea>

      {/* 검색/필터 영역 */}
      {searchComponent && (
        <Box sx={{ mt: 3, mb: 3 }}>
          <SearchPanel searchComponent={searchComponent} />
        </Box>
      )}

      {/* 탭 영역 (공통) */}
      {tabComponent && <Box sx={{ mb: 2 }}>{tabComponent}</Box>}

      <Box
        sx={{
          display: 'flex',
          paddingBottom: '12px',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          alignSelf: 'stretch',
        }}
      >
        {subSelect ? (
          subSelect
        ) : (
          <Typography className="label">Total: {Number(totalCount).toLocaleString()}</Typography>
        )}
        {buttonComponent && <ButtonPanel buttonComponent={buttonComponent} />}
      </Box>

      <Box
        ref={gridContainerRef}
        sx={{
          width: '100%',
          flex: 1,
        }}
      >
        <EtsGrid
          height={gridHeight}
          isInfiniteScroll={isInfiniteScroll}
          ref={gridRef}
          columnDefs={editColumnDefs}
          rowData={enhancedRowData}
          onCellValueChanged={onCellValueChanged}
          onCellClicked={onCellClicked}
          onGridReady={onGridReady}
          suppressRowTransform={suppressRowTransform}
          suppressRowClickSelection={suppressRowClickSelection}
          pinnedBottomRowData={pinnedBottomRowData}
          domLayout="normal" // pinnedBottom row가 항상 표시되도록 normal 사용
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
    </Container>
  );
};

export default PageTemplate;
