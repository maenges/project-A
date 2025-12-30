import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Stack } from '@mui/material';
import { ColDef, IDatasource, GridReadyEvent, IRowNode } from 'ag-grid-community';
import SearchPanel from './SearchPanel';
import ButtonPanel, { ButtonPanelProps } from './ButtonPanel';
import { EtsGrid } from '../EtsGrid';
import styled from 'styled-components';
import EtsLeftTree, { type EtsLeftTreeProps } from '@/components/EtsCommon/EtsLeftTree';

const HeaderArea = styled(Stack)`
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

export interface PageTemplateProps {
  title?: string;
  description?: string;
  searchComponent?: React.ReactNode;
  buttonComponent?: React.ReactNode;
  buttonPanelProps?: Partial<ButtonPanelProps>;
  tabComponent?: React.ReactNode;
  tree?: boolean;
  /** tree=true 일 때 좌측 트리(EtsLeftTree) props 전달용 */
  leftTreeProps?: Partial<EtsLeftTreeProps>;
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
  size?: 'sm' | 'md' | 'lg' | 'sm-two-header' | 'no-search';
  loading?: boolean;
  onGridReady?: (params: GridReadyEvent) => void;
  /** 행 선택 가능 여부 제어 (체크박스 비활성화에 사용) */
  isRowSelectable?: (node: IRowNode) => boolean;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  // description,
  searchComponent,
  buttonComponent,
  buttonPanelProps,
  tabComponent,
  columnDefs,
  rowData = [],
  onCellValueChanged,
  onCellClicked,
  gridRef,
  isInfiniteScroll,
  suppressRowTransform = true,
  showPinnedBottom,
  // subSelect,
  // totalCount,
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
  tree = false,
  leftTreeProps,
  isRowSelectable,
}) => {
  // --- size prop에 따라 그리드 높이를 결정하는 로직 ---
  const gridHeight = useMemo(() => {
    switch (size) {
      case 'no-search':
        return 'calc(100vh - 250px)';
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

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={(theme) => ({
        width: '100%',
        mx: 0,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: '100%',
      })}
    >
      <HeaderArea direction={'row'}>
        {/* 페이지 제목 */}
        {title && (
          <Typography className="label-lg" component="h1">
            {title}
          </Typography>
        )}
      </HeaderArea>

      {/* Left Tree Sidebar with Search (tree=true 일 때만 표시) */}
      <Box sx={{ display: 'flex', width: '100%', gap: 2, alignItems: 'stretch' }}>
        {tree && <EtsLeftTree {...leftTreeProps} />}

        {/* Right Content Area */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            // 우측 전체 영역이 뷰 높이에 맞게 확장되고 내부 스크롤은 그리드/리스트가 담당
            maxHeight: 'calc(100vh - 160px)',
          }}
        >
          {/* 검색/필터 영역 */}
          {searchComponent && (
            <Box sx={{ mt: 3, mb: 3, flexShrink: 0 }}>
              <SearchPanel searchComponent={searchComponent} />
            </Box>
          )}

          {/* 탭 영역 (공통) */}
          {tabComponent && <Box sx={{ mb: 2, flexShrink: 0 }}>{tabComponent}</Box>}

          <Box
            sx={{
              display: 'flex',
              marginTop: '24px',
              paddingBottom: '12px',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              alignSelf: 'stretch',
              flexShrink: 0,
            }}
          >
            <Typography className="label">
              {/* 데이터 수 : {Number(totalCount).toLocaleString()} */}
              {`데이터 수 : ${rowData.length}건`}
            </Typography>
            {buttonComponent && (
              <ButtonPanel buttonComponent={buttonComponent} {...buttonPanelProps} />
            )}
          </Box>

          <Box
            ref={gridContainerRef}
            sx={{
              width: '100%',
              flex: 1,
              minHeight: 0,
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
              isRowSelectable={isRowSelectable}
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
        </Box>
      </Box>
    </Container>
  );
};

export default PageTemplate;
