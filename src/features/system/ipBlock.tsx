import React from 'react';

import { useState, useRef, useEffect } from 'react';
import { ColDef, IRowNode } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
import dayjs from 'dayjs';

import { EtsButton } from '@/components/EtsCommon';

type BlockProps = {
  [key: string]: any;
};

const Block: React.FC = () => {
  const [isEditable, setIsEditable] = useState(false);
  const gridRef = useRef<EtsGridRef<BlockProps>>(null);
  const { toast, confirm } = useNotify();
  const [rowData, setRowData] = useState<BlockProps[]>([]);
  const [_, setNewRowNodes] = useState<IRowNode<BlockProps>[]>([]);
  const [selectedRowCount, setSelectedRowCount] = useState(0);

  const columnDefs: ColDef<BlockProps>[] = [
    EtsColumnPreset.SelectionBoxPreset({
      headerName: '',
      width: 60,
      headerCheckboxSelection: true,
    }),
    EtsColumnPreset.IdPreset({
      field: 'no',
      headerName: 'No',
      width: 60,
    }),
    EtsColumnPreset.TextPreset({
      field: 'block_key',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'block_ip',
      headerName: '차단 IP',
      width: 150,
      flex: 1,
      editable: (rendererParams: any) => isEditable && !!rendererParams?.data?.isNew,
      context: {
        inputProps: {
          placeholder: 'IP 혹은 0으로 끝나는 대역을 입력하세요.',
        },
        required: true,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '차단일시',
      width: 200,
      flex: 1,
    }),
    EtsColumnPreset.CheckButtonPreset({
      field: 'block_status',
      headerName: '차단 여부',
      width: 150,
      editable: (rendererParams: any) => isEditable && !rendererParams?.data?.isNew,
      flex: 1,
      context: {
        checkButtonProps: {
          checkedLabel: '차단해제',
          uncheckedLabel: '차단하기',
        },
      },
    }),
  ];

  useEffect(() => {
    onSearch();
  }, []);

  const onSearch = () => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/block/ipBlock',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }
      const mapped = (res.data || []).map((row: any) => {
        const raw = row?.block_status;
        const normalized = raw === 'BLOCKED' ? true : raw === 'UNBLOCKED' ? false : Boolean(raw);
        return {
          ...row,
          block_status: normalized,
        };
      });

      setRowData(mapped);
    });
  };

  const handleAddRow = () => {
    const lastRowIndex = gridRef.current?.api.getDisplayedRowCount() ?? 0;
    gridRef.current?.addRow({
      block_ip: '',
      created: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      block_status: true,
      isNew: true,
    });

    const newNode = gridRef.current?.api.getDisplayedRowAtIndex(lastRowIndex);
    if (newNode) {
      setNewRowNodes((prevNodes) => [...prevNodes, newNode]);
    }
  };

  const handleDeleteRow = () => {
    gridRef.current?.deleteBySelectedRows();
  };

  const handleSelectionChanged = () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];
    setSelectedRowCount(selectedNodes.length);
  };

  // GridRow 저장 버튼
  const handleSave = async () => {
    if (gridRef.current) {
      gridRef.current.api.stopEditing();
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    const changedRows: any[] = [];

    gridRef.current?.api.forEachNode((node) => {
      const status = String(node?.data?.rowStatus ?? '').toUpperCase();
      if (status !== 'I' && status !== 'U' && status !== 'D') return;
      if (!node?.data) return;

      const { originData, ...rest } = node.data as any;
      const payloadRow: any = {
        ...rest,
        rowStatus: status,
        block_status: rest.block_status ? 'BLOCKED' : 'UNBLOCKED',
      };

      changedRows.push(payloadRow);
    });

    if (changedRows.length === 0) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/block/ipBlockBatch',
      method: Method.POST,
      params: {
        bodyParams: changedRows,
      },
      config: { isLoading: true },
    });

    if (res?.successOrNot !== 'Y') {
      toast.error(res?.HeaderMsg ?? '저장에 실패했습니다.');
      return;
    }

    toast.success('저장되었습니다.');
    onSearch();
    setIsEditable(false);
  };

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        {isEditable ? (
          <>
            <EtsButton
              type="grey"
              onClick={() => {
                if (gridRef.current) {
                  handleAddRow();
                }
              }}
            >
              추가
            </EtsButton>
            {selectedRowCount > 0 && (
              <EtsButton
                type="grey"
                onClick={() => {
                  if (gridRef.current) {
                    handleDeleteRow();
                  }
                }}
              >
                줄삭제
              </EtsButton>
            )}
            <EtsButton
              type="grey"
              onClick={() => {
                if (gridRef.current) {
                  gridRef.current.api.stopEditing();
                }
                onSearch();
                setIsEditable(false);
              }}
            >
              취소
            </EtsButton>
            <EtsButton
              type="blue"
              onClick={() => {
                handleSave();
              }}
            >
              저장
            </EtsButton>
          </>
        ) : (
          <>
            <EtsButton
              type="grey"
              onClick={async () => {
                setIsEditable(true);
              }}
            >
              편집
            </EtsButton>
          </>
        )}
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <>
      <PageTemplate
        title="IP 차단 관리"
        gridRef={gridRef}
        columnDefs={columnDefs}
        buttonComponent={buttonComponent}
        rowData={rowData}
        isRowSelectable={() => isEditable}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
        onSelectionChanged={handleSelectionChanged}
        size="no-search"
      />
    </>
  );
};

export default Block;
