import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { CellValueChangedEvent, ColDef, IRowNode, IDatasource } from 'ag-grid-community';
import {
  ElementType,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

// ag-grid 모듈 등록
import { Box } from '@mui/material';
import { CustomGridApi, EtsGridRef, WithRowStatus } from './EtsGrid.interface';
import { useNotify } from '../../hooks/useNotify';
import EtsNoDataLayout from './helper/EtsNoDataLayout';
import { compare, isNull } from '@/utils';
import { StyledAgGridSelectionBox } from '@/assets/style';

export interface EtsGridProps extends AgGridReactProps {
  datasource?: IDatasource;
  isInfiniteScroll?: boolean;
  cacheBlockSize?: number;
  cacheOverflowSize?: number;
  maxConcurrentDatasourceRequests?: number;
  infiniteInitialRowCount?: number;
  maxBlocksInCache?: number;
  onCellClicked?: (_params: any) => void;
  height?: string;
}

export default forwardRef<EtsGridRef, EtsGridProps>(function EtsGrid(
  {
    defaultColDef,
    columnDefs,
    rowData,
    rowClassRules,
    onCellValueChanged,
    onCellClicked,
    noRowsOverlayComponentParams,
    datasource,
    isInfiniteScroll = false,
    cacheBlockSize = 100,
    cacheOverflowSize = 2,
    maxConcurrentDatasourceRequests = 1,
    infiniteInitialRowCount = 1000,
    maxBlocksInCache = 10,
    rowSelection = 'single',
    rowMultiSelectWithClick = false,
    suppressRowClickSelection = false,
    height,
    ...props
  },
  ref
) {
  type Data = ElementType<typeof rowData> & { originData?: any; rowStatus?: string };
  const gridRef = useRef<AgGridReact<Data>>(null);

  const { confirm, alert } = useNotify();

  const [rows, setRows] = useState<Data[]>([]);

  // columnDefs 에 rowStatus 컬럼 추가
  const _columnDefs = useMemo<ColDef[] | undefined>(() => {
    if (!columnDefs) return;

    return [
      ...(columnDefs ?? []).filter((col) => (col as ColDef).colId != 'rowStatus'),
      {
        field: 'rowStatus',
        editable: false,
        filter: 'agTextColumnFilter',
        hide: true,
        colId: 'rowStatus',
        suppressColumnsToolPanel: true,
      },
    ];
  }, [columnDefs]);

  // defaultColDef 공통 속성 부여
  const _defaultColDef = useMemo(() => {
    return {
      cellClass: 'center',
      singleClickEdit: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      ...defaultColDef,
      filterParams: {
        defaultJoinOperator: 'OR',
        // 전달받은 값 추가
        ...(defaultColDef?.filterParams ?? {}),
      },
    };
  }, [defaultColDef]);

  // 추가 색상 클래스 부여
  // 해당 클래스는 ag-grid에서 rowClassRules로 사용
  // 각각의 상태에 따른 aggrid css 추가 시 사용
  const _rowClassRules = useMemo(() => {
    return rowClassRules;
  }, [rowClassRules]);

  // 해당 row 변화시 rowStatus 변경
  const _onCellValueChanged = useCallback(
    (v: CellValueChangedEvent) => {
      const { originData, rowStatus: beforeStatus, ...currentData } = v.data;
      const rowStatus = ['D', 'I'].includes(beforeStatus!)
        ? v.data.rowStatus
        : compare(originData, currentData)
          ? undefined
          : 'U';
      Object.assign(v.data, { rowStatus });
      v.node.updateData(v.data);
      onCellValueChanged?.(v);
    },
    [onCellValueChanged]
  );

  useImperativeHandle(ref, () => {
    const customApi: CustomGridApi<Data> = {
      getRowsByStatus: () => {
        const rows: Record<'delete' | 'update' | 'insert' | 'all', Data[]> = {
          delete: [],
          insert: [],
          update: [],
          all: [],
        };
        gridRef.current?.api.forEachNode((node) => {
          if (!node.data) return;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { rowStatus, originData, ...data } = node.data;

          rowStatus && rows.all.push({ rowStatus, ...data } as Data);
          switch (rowStatus) {
            case 'D':
              rows.delete.push(data as Data);
              break;
            case 'I':
              rows.insert.push(data as Data);
              break;
            case 'U':
              rows.update.push(data as Data);
              break;
          }
        });
        return rows;
      },
      addRow: (
        row: Partial<WithRowStatus<Data>> | Partial<WithRowStatus<Data>>[],
        addIndex?: number
      ) => {
        const rows = [row].flat();
        gridRef.current?.api.applyTransaction({
          add: rows.map((v) => ({
            ...v,
            originData: { ...v },
            rowStatus: v?.rowStatus ?? 'I',
          })) as Data[],
          addIndex: addIndex ?? 0,
        });
      },
      isModify: () => {
        const rowByStatus = customApi.getRowsByStatus();
        return (
          !rowByStatus.delete.length && !rowByStatus.update.length && !rowByStatus.insert.length
        );
      },
      deleteRow: (rowData?: Data | Data[]) => {
        if (isNull(rowData) || !rowData.length) return;

        gridRef.current?.api.applyTransaction(
          [rowData].flat().reduce(
            (acc, cur: Data) => {
              if (cur.rowStatus == 'I') acc.remove.push(cur);
              else if (cur.rowStatus == 'D') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { rowStatus, originData, ...currentData } = cur;
                acc.update.push(
                  Object.assign(cur, {
                    rowStatus: !originData
                      ? undefined
                      : compare(originData, currentData)
                        ? undefined
                        : 'M',
                  })
                );
              } else acc.update.push(Object.assign(cur, { rowStatus: 'D' }));
              gridRef.current?.api.deselectAll();
              return acc;
            },
            {
              remove: [] as Data[],
              update: [] as Data[],
            }
          )
        );
      },
      deleteBySelectedRows: () => {
        const selectedNodes = gridRef.current?.api.getSelectedNodes();
        const rowData = selectedNodes
          ?.map((v) => v.data)
          .filter((data): data is Data => data !== undefined);
        if (rowData && rowData.length > 0) {
          customApi.deleteRow(rowData);
        }
      },
      deleteBySelectedRowsWithModal: async () => {
        // 1. 값이 있다면 모달을 띄운다
        // 2. 선택된 값들이 모두 빈값들이면 바로 삭제한다
        // 3. 복합선택이 된 경우에는 모달 (갯수포함)
        const selectedNodes = gridRef.current?.api.getSelectedNodes();
        const rowData = selectedNodes
          ?.map((v) => v.data)
          .filter((data): data is Data => data !== undefined);

        const nullCheck = !rowData?.every((v) =>
          Object.entries(v).every(
            ([key, value]) =>
              key === 'originData' ||
              key === 'rowStatus' ||
              value === '' ||
              value === null ||
              value === undefined ||
              (Array.isArray(value) && value.length === 0)
          )
        );
        if (rowData && rowData.length > 0) {
          //@read 넘겨주기 전 확인 모달 띄우기
          if (nullCheck) {
            const answer = await confirm({
              title: '삭제',
              message: `${rowData.length}개의 항목을 선택하였습니다.\n선택한 항목을 모두 삭제할까요?`,
              size: 'SM',
            });
            answer && customApi.deleteRow(rowData);
          } else {
            customApi.deleteRow(rowData);
          }
        } else {
          alert({ message: '선택한 항목이 없습니다.\n삭제할 항목을 선택해주세요.' });
        }
      },
      getNodes: () => {
        const nodes: IRowNode[] = [];
        gridRef.current?.api.forEachNode((node) => {
          if (!node) return;
          nodes.push(node);
        });
        return nodes;
      },

      getRows: () => {
        return customApi
          .getNodes()
          .map((node) => {
            if (!node.data) return;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { rowStatus, originData, ...data } = node.data;

            return data;
          })
          .filter(Boolean) as Data[];
      },
      getFilteredRows: () => {
        const list: Data[] = [];

        gridRef.current?.api.forEachNodeAfterFilter((node: any) => {
          if (!node.data) return;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { rowStatus, originData, ...data } = node.data;
          list.push(data);
        });
        return list;
      },
      getRowsWithRowStatus: () => {
        return customApi
          .getNodes()
          .map((node) => {
            if (!node.data) return;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { originData, ...data } = node.data;

            return data;
          })
          .filter(Boolean) as Data[];
      },
      getSelectedData() {
        const nodes = gridRef.current?.api.getSelectedNodes();
        const list: Data[] = [];
        nodes?.forEach((node) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { rowStatus, originData, ...data } = node.data as Data;

          list.push(data as Data);
        });
        return list;
      },
    };
    return Object.assign(gridRef.current!, customApi) as EtsGridRef<Data>;
  }, [alert, confirm]);

  useEffect(() => {
    // 무한 스크롤 모드가 아닐 때만 rowData를 처리
    if (isInfiniteScroll || !rowData) return;
    setRows(
      (rowData ?? []).map(({ rowStatus, ...v }) => ({
        ...v,
        rowStatus,
        originData: v,
      }))
    );
  }, [rowData, isInfiniteScroll]);

  return (
    <StyledAgGridSelectionBox>
      <Box
        className={'ag-theme-material'}
        style={{
          width: '100%',
          height: height ?? '100%',
          position: 'relative',
        }}
      >
        <AgGridReact
          {...props}
          ref={gridRef}
          // 무한 스크롤 모드일 때는 rowData 대신 datasource 사용
          rowData={isInfiniteScroll ? undefined : rows}
          datasource={isInfiniteScroll ? datasource : undefined}
          // 무한 스크롤 관련 설정
          rowModelType={isInfiniteScroll ? 'infinite' : 'clientSide'}
          cacheBlockSize={isInfiniteScroll ? cacheBlockSize : undefined}
          cacheOverflowSize={isInfiniteScroll ? cacheOverflowSize : undefined}
          maxConcurrentDatasourceRequests={
            isInfiniteScroll ? maxConcurrentDatasourceRequests : undefined
          }
          infiniteInitialRowCount={isInfiniteScroll ? infiniteInitialRowCount : undefined}
          maxBlocksInCache={isInfiniteScroll ? maxBlocksInCache : undefined}
          columnDefs={_columnDefs}
          className={
            !isInfiniteScroll && rows.length === 0
              ? 'ag-theme-material ag-no-rows'
              : 'ag-theme-material'
          }
          defaultColDef={_defaultColDef}
          rowClassRules={_rowClassRules}
          onCellValueChanged={_onCellValueChanged}
          suppressRowHoverHighlight={false}
          onFirstDataRendered={() => {
            // 무한 스크롤 모드가 아닐 때만 필터 설정
            if (!isInfiniteScroll) {
              gridRef.current?.api.setFilterModel({
                rowStatus: { filterType: 'text', type: 'notEqual', filter: 'D' },
              });
            }
          }}
          noRowsOverlayComponent={EtsNoDataLayout}
          noRowsOverlayComponentParams={{
            noRowsMessage: noRowsOverlayComponentParams?.noRowsMessage ?? 'No data found',
            pinnedBottomRowData: props.pinnedBottomRowData,
          }}
          tooltipHideDelay={99999}
          tooltipShowDelay={0}
          onCellClicked={onCellClicked}
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
          domLayout={'normal'}
          suppressDragLeaveHidesColumns
          rowSelection={rowSelection}
          rowMultiSelectWithClick={rowMultiSelectWithClick}
          suppressRowClickSelection={suppressRowClickSelection}
          {...props}
        />
      </Box>
    </StyledAgGridSelectionBox>
  );
});
