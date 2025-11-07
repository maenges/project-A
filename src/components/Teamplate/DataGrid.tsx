import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';

interface DataGridProps {
  columnDefs?: ColDef[];
  rowData?: any[];
  onCellValueChanged?: (event: any) => void;
  suppressRowTransform?: boolean; // rowSpan 시 권장
  gridHeight?: number; // autoHeight 제거 후 높이 지정
  pinnedBottomRowData?: any[];
}

const DataGrid = forwardRef<{ stopEditing: () => void }, DataGridProps>(
  (
    {
      columnDefs = [],
      rowData = [],
      onCellValueChanged,
      suppressRowTransform = true,
      pinnedBottomRowData,
    },
    ref
  ) => {
    const gridRef = useRef<any>(null);
    useImperativeHandle(ref, () => ({
      stopEditing: () => {
        gridRef.current?.api?.stopEditing();
      },
    }));

    const handleGridReady = (params: any) => {
      params.api.sizeColumnsToFit();
    };

    return (
      <Box className="ag-theme-material" sx={{ minHeight: 400 }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          singleClickEdit={true}
          suppressRowTransform={suppressRowTransform}
          onCellValueChanged={onCellValueChanged}
          onGridReady={handleGridReady}
          pinnedBottomRowData={pinnedBottomRowData}
          getRowStyle={(params) => {
            if (params.node.rowPinned) {
              return { background: 'var(--color-neutral-20, #F7F8FA)', fontWeight: 700 };
            }
            return undefined;
          }}
          domLayout="autoHeight"
        />
      </Box>
    );
  }
);

DataGrid.displayName = 'DataGrid';

export default DataGrid;
