import { AgGridReact } from 'ag-grid-react';
import { IRowNode } from 'ag-grid-community';

export type scrollPositonType = 'top' | 'middle' | 'bottom';

// Insert Update Delete
export type RowStatus = 'I' | 'U' | 'D';

export type WithRowStatus<Data> = Data & { rowStatus: RowStatus };

export type GridRow<Data> = WithRowStatus<Data> & { originData: Data };

export type CustomGridApi<Data> = {
  getRowsByStatus: () => {
    delete: Data[];
    update: Data[];
    insert: Data[];
    all: Data[];
  };
  deleteRow: (rowData: Data | Data[]) => void;
  deleteBySelectedRows: () => void;
  deleteBySelectedRowsWithModal: () => void;
  addRow: (
    data: Partial<WithRowStatus<Data>> | Partial<WithRowStatus<Data>>[],
    addIndex?: number
  ) => void;

  getRows: () => Data[];
  getRowsWithRowStatus: () => Data[];
  getFilteredRows: () => Data[];
  getNodes: () => IRowNode<Data>[];

  isModify: () => boolean;
  getSelectedData: () => Data[];
};

export type EtsGridRef<Data = any> = AgGridReact<Data> & CustomGridApi<Data>;
