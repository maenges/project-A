import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
// import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';

import { EtsButton } from '@/components/EtsCommon';
import { buttonForm } from '@/assets/style';
import NoticeNewModal from './noticeNewModal';

type Notices = {
  [key: string]: any;
};

const Notice: React.FC = () => {
  const [isEditable, setIsEditable] = useState(false);
  const gridRef = useRef<EtsGridRef<Notices>>(null);
  const { toast, confirm } = useNotify();
  const [rowData, setRowData] = useState<Notices[]>([]);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Notices | null>(null);

  const columnDefs: (ColDef | ColGroupDef)[] = [
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
      field: 'notice_key',
      headerName: 'ID',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'notice_target_type',
      headerName: '공지대상',
      width: 200,
      valueGetter: (params) => {
        const val = params.data?.notice_target_type;
        if (val === 'CUSTOMER') return '고객';
        if (val === 'PARTNER') return '파트너';
        return val ?? '';
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'notice_title',
      headerName: '제목',
      width: 200,
      flex: 1,
      context: {
        clickable: true,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'notice_order',
      headerName: '순번',
      width: 100,
    }),
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '등록일시',
      width: 200,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'notice_active',
      headerName: '보이기',
      width: 200,
      editable: isEditable,
    }),
  ];

  useEffect(() => {
    onSearch();
  }, []);

  const onSearch = () => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/notice',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }
      setRowData(res.data);
    });
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

      const { originData: _originData, ...rest } = node.data as any;
      const payloadRow: any = {
        ...rest,
        rowStatus: status,
      };

      delete payloadRow.no;
      delete payloadRow.created;

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
      url: '/api/notice/batch',
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

  const handleDeleteRow = () => {
    const selected = (gridRef.current?.getSelectedData() ?? []) as Notices[];
    const row = selected[0];
    if (!row) {
      toast.info('삭제할 항목을 선택하세요.');
      return;
    }
    gridRef.current?.deleteBySelectedRows();
  };

  const handleCellClicked = (params: any) => {
    const field = params?.colDef?.field;
    if (field !== 'notice_title') return;

    const row = params?.data as Notices | undefined;
    if (!row) return;

    if (gridRef.current) {
      gridRef.current.api.stopEditing();
    }

    setSelectedRow(row);
    setUpdateModalOpen(true);
  };

  const newModal = newModalOpen && (
    <NoticeNewModal
      open={newModalOpen}
      onClose={() => {
        setNewModalOpen(false);
      }}
      onSaved={onSearch}
    />
  );

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        {isEditable ? (
          <>
            <EtsButton
              type="grey"
              onClick={() => {
                if (gridRef.current) {
                  handleDeleteRow();
                }
              }}
            >
              삭제
            </EtsButton>
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
              onClick={() => {
                setNewModalOpen(true);
              }}
            >
              공지 등록
            </EtsButton>
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
      {newModal}
      {updateModalOpen && selectedRow && (
        <NoticeNewModal
          open={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedRow(null);
            setIsEditable(false);
            // 모달에서 저장하지 않고 닫은 경우에도, 그리드가 수정 중이던 값으로 남지 않도록 재조회
            if (gridRef.current) {
              gridRef.current.api.stopEditing();
            }
            onSearch();
          }}
          onSaved={() => {
            setUpdateModalOpen(false);
            setSelectedRow(null);
            onSearch();
            setIsEditable(false);
          }}
          mode="edit"
          noticeKey={selectedRow.notice_key}
          initialValues={{
            notice_target_type: selectedRow.notice_target_type,
            notice_title: selectedRow.notice_title,
            notice_order: selectedRow.notice_order,
          }}
          initialContent={selectedRow.notice_content ?? ''}
        />
      )}
      <PageTemplate
        title="공지사항"
        gridRef={gridRef}
        columnDefs={columnDefs}
        buttonComponent={buttonComponent}
        rowData={rowData}
        onCellClicked={handleCellClicked}
        isRowSelectable={() => isEditable}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
        size="no-search"
      />
    </>
  );
};
export default Notice;
