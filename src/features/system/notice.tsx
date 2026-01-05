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
  no: string;
  notice_key: string;
  notice_target_type: string;
  notice_title: string;
  notice_content?: string;
  created: string;
  notice_active: boolean;
  [key: string]: any;
};

const Notice = () => {
  const [isEditable, setIsEditable] = useState(false);
  const gridRef = useRef<EtsGridRef<Notices>>(null);
  const { toast } = useNotify();
  const [rowData, setRowData] = useState<Notices[]>([]);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Notices | null>(null);

  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.SelectionBoxPreset({
      headerName: '',
      width: 60,
      headerCheckboxSelection: false,
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
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'notice_title',
      headerName: '제목',
      width: 200,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '등록일시',
      width: 200,
      flex: 1,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'notice_active',
      headerName: '보이기',
      width: 200,
      editable: isEditable,
    }),
  ];

  // const [_, setSaveOpen] = useState(false);
  // const [__, setDeleteOpen] = useState(false);

  useEffect(() => {
    onSearch();
  }, []);

  // useActivate(() => {
  //   // 데이터가 있으면 재조회 실행
  //   if (rowData && rowData.length > 0) {
  //     onSearch();
  //   }
  // });

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

    // stopEditing 이후 rowStatus 반영 타이밍 보장
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    const deleteNodes: any[] = [];
    const updateNodes: any[] = [];

    gridRef.current?.api.forEachNode((node) => {
      const status = String(node?.data?.rowStatus ?? '').toUpperCase();
      if (status === 'D') deleteNodes.push(node);
      if (status === 'U') updateNodes.push(node);
    });

    const deletePayload = deleteNodes
      .map((node) => node?.data?.notice_key)
      .filter((v): v is string => typeof v === 'string' && v.length > 0)
      .map((notice_key) => ({ notice_key }));

    if (updateNodes.length === 0 && deletePayload.length === 0) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    // 전값 비교 후 변경된 컬럼 값만 추출 (U)
    const updatePayload = updateNodes
      .map((node) => {
        if (!node.data) return null;

        const { originData, rowStatus, ...currentData } = node.data as any;
        const changedData: Record<string, any> = {
          notice_key: currentData.notice_key,
        };

        Object.keys(currentData).forEach((key) => {
          // no, created 필드는 제외
          if (key === 'no' || key === 'created') return;
          const currentValue = currentData[key];
          const originalValue = originData ? originData[key] : undefined;
          if (currentValue !== originalValue) {
            changedData[key] = currentValue;
          }
        });

        return Object.keys(changedData).length > 1 ? changedData : null;
      })
      .filter(Boolean) as Array<Record<string, any>>;

    if (updatePayload.length === 0 && deletePayload.length === 0) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    // 삭제(D) + 수정(U) 한번에 처리
    const requests: Array<Promise<any>> = [];
    if (deletePayload.length > 0) {
      requests.push(
        callApi({
          service: Service.POSTMAN,
          url: '/api/notice',
          method: Method.DELETE,
          params: {
            bodyParams: deletePayload,
          },
          config: { isLoading: true },
        })
      );
    }
    if (updatePayload.length > 0) {
      requests.push(
        callApi({
          service: Service.POSTMAN,
          url: '/api/notice',
          method: Method.PATCH,
          params: {
            bodyParams: updatePayload,
          },
          config: { isLoading: true },
        })
      );
    }

    const results = await Promise.all(requests);
    const failed = results.find((r) => r?.successOrNot !== 'Y');
    if (failed) {
      toast.error(failed.HeaderMsg);
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

  const handleUpdatedRow = async () => {
    const selected = (gridRef.current?.getSelectedData() ?? []) as Notices[];
    const row = selected[0];
    if (!row) {
      toast.info('수정할 항목을 선택하세요.');
      return;
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
              onClick={async () => {
                if (gridRef.current) {
                  await handleUpdatedRow();
                }
              }}
            >
              수정
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
        isRowSelectable={() => isEditable}
        rowSelection="single"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
        size="no-search"
      />
    </>
  );
};
export default Notice;
