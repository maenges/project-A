import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Stack, TextField } from '@mui/material';
import { ColDef, IDatasource, GridReadyEvent } from 'ag-grid-community';
import SearchPanel from './SearchPanel';
import ButtonPanel from './ButtonPanel';
import { EtsGrid } from '../EtsGrid';
import styled from 'styled-components';
import EtsLeftTree, { EtsTreeNode } from '@/components/EtsCommon/EtsLeftTree';

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
  /** 좌측 조직 트리 표시 여부 (기본: false) */
  tree?: boolean;
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
  tree = false,
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

  // 조직 계층 트리 (본사 > 부본사 > 지사 > 총판 > 매장)
  const treeItems: EtsTreeNode[] = [
    {
      id: 'hq',
      label: '본사',
      children: [
        {
          id: 'sub-hq-1',
          label: '부본사 A',
          children: [
            {
              id: 'branch-1',
              label: '지사 1',
              children: [
                {
                  id: 'dealer-1',
                  label: '총판 1',
                  children: [
                    { id: 'store-1', label: '매장 1' },
                    { id: 'store-2', label: '매장 2' },
                  ],
                },
              ],
            },
            {
              id: 'branch-2',
              label: '지사 2',
              children: [
                {
                  id: 'dealer-2',
                  label: '총판 2',
                  children: [
                    { id: 'store-3', label: '매장 3' },
                    { id: 'store-4', label: '매장 4' },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'sub-hq-2',
          label: '부본사 B',
          children: [
            {
              id: 'branch-3',
              label: '지사 3',
              children: [
                {
                  id: 'dealer-3',
                  label: '총판 3',
                  children: [
                    { id: 'store-5', label: '매장 5' },
                    { id: 'store-6', label: '매장 6' },
                    { id: 'store-7', label: '매장 7' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // 현재 페이지 로직과 직접 연결되지 않는 별도 선택 로직 (향후 연동 가능)
  const [selectedOrgId, setSelectedOrgId] = useState<string>('hq');
  const [orgQuery, setOrgQuery] = useState<string>('');

  // 트리 필터링 유틸
  const filterTree = (nodes: EtsTreeNode[], q: string): EtsTreeNode[] => {
    const query = q.trim().toLowerCase();
    if (!query) return nodes;
    const walk = (node: EtsTreeNode): EtsTreeNode | null => {
      const labelMatch = node.label.toLowerCase().includes(query);
      const children = node.children?.map(walk).filter((n): n is EtsTreeNode => !!n) || [];
      if (labelMatch || children.length > 0) {
        return { ...node, children };
      }
      return null;
    };
    return nodes.map(walk).filter((n): n is EtsTreeNode => !!n);
  };

  const findFirstMatchId = (nodes: EtsTreeNode[], q: string): string | null => {
    const query = q.trim().toLowerCase();
    if (!query) return null;
    const stack: EtsTreeNode[] = [...nodes];
    while (stack.length) {
      const n = stack.shift()!;
      if (n.label.toLowerCase().includes(query)) return n.id;
      if (n.children) stack.unshift(...n.children);
    }
    return null;
  };

  const filteredTreeItems = useMemo(() => filterTree(treeItems, orgQuery), [treeItems, orgQuery]);

  useEffect(() => {
    if (!orgQuery) return; // 쿼리 없으면 선택 유지
    const firstId = findFirstMatchId(treeItems, orgQuery);
    if (firstId) setSelectedOrgId(firstId);
  }, [orgQuery]);

  const handleTreeSelect = (id: string) => {
    setSelectedOrgId(id);
    // TODO: 선택된 조직 id 기반 데이터 재조회 로직 연결 가능
  };

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
        {tree && (
          <Box
            sx={{
              mt: 3,
              width: 240,
              minWidth: 240,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              // 좌측 패널 자체의 높이를 뷰포트 기준으로 고정하여 내부 스크롤만 발생하도록 처리
              maxHeight: 'calc(100vh - 220px)',
              overflow: 'hidden',
            }}
          >
            <TextField
              size="small"
              placeholder="조직명 검색"
              value={orgQuery}
              onChange={(e) => setOrgQuery(e.target.value)}
              variant="outlined"
              sx={(theme) => ({
                '& .MuiOutlinedInput-root': {
                  height: '36px !important',
                  minHeight: '36px',
                  maxHeight: '36px',
                  boxSizing: 'border-box',
                  borderRadius: 8,
                  backgroundColor:
                    theme.palette.mode === 'light' ? '#FFFFFF' : theme.palette.background.paper,
                  '& fieldset': {
                    border: `1px solid ${theme.palette.divider}`,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '1px',
                  },
                  '& input': {
                    padding: '7px 12px',
                    height: '20px !important',
                  },
                },
              })}
            />
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <EtsLeftTree
                items={filteredTreeItems}
                selectedId={selectedOrgId}
                width={'100%'}
                onSelect={handleTreeSelect}
                sx={{ flexShrink: 0 }}
              />
            </Box>
          </Box>
        )}

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
              paddingBottom: '12px',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              alignSelf: 'stretch',
              flexShrink: 0,
            }}
          >
            {subSelect ? (
              subSelect
            ) : (
              <Typography className="label">
                Total: {Number(totalCount).toLocaleString()}
              </Typography>
            )}
            {buttonComponent && <ButtonPanel buttonComponent={buttonComponent} />}
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
