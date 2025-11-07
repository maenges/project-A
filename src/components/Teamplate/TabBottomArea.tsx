import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Typography, Box } from '@mui/material';
import { ColDef, IDatasource } from 'ag-grid-community';
import { EtsGrid } from '../EtsGrid';
import ButtonPanel from './ButtonPanel';

export interface TabBottomAreaProps {
  buttonComponent?: React.ReactNode;
  tabComponent?: React.ReactNode;
  visible?: boolean;
  columnDefs?: ColDef[];
  rowData?: any[];
  onCellValueChanged?: (_params: any) => void;
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
  size?: 'sm' | 'md' | 'lg';
}

const TabBottomArea = ({
  buttonComponent,
  columnDefs,
  rowData = [],
  onCellValueChanged,
  gridRef,
  visible = true,
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
}: TabBottomAreaProps) => {
  // --- size prop에 따라 그리드 높이를 결정하는 로직 ---
  const gridHeight = useMemo(() => {
    // size 값에 따라 높이를 결정합니다.
    switch (size) {
      case 'md':
        return 'calc(100vh - 510px)';
      case 'lg':
        return 'calc(100vh - 545px)';
      default:
        return 'calc(100vh - 470px)';
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

  const editColumnDefs = columnDefs?.map((col) => col);

  return (
    <Box sx={{ display: visible ? 'flex' : 'none', flexDirection: 'column', flex: 1 }}>
      <Box
        sx={{
          display: 'flex',
          paddingBottom: '12px',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          alignSelf: 'stretch',
          // --- 이 영역은 높이가 늘어나지 않도록 설정합니다. ---
          flexShrink: 0,
        }}
      >
        {subSelect ? subSelect : <Typography className="label">Total: {totalCount}</Typography>}
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
          suppressRowTransform={suppressRowTransform}
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
          suppressRowClickSelection={suppressRowClickSelection}
          getRowStyle={(params) => {
            if (params.node.rowPinned) {
              return { background: '#D8FDE7', fontWeight: 700 };
            }
            // 일반 rowData에 포함된 Total row 스타일링
            if (params.data?.isTotal) {
              return { background: '#D8FDE7', fontWeight: 700 };
            }
            return undefined;
          }}
        />
      </Box>
    </Box>
  );
};

export default TabBottomArea;
