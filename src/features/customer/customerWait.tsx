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

type Customer = {
  [key: string]: any;
};

const CustomerWait: React.FC = () => {
  const [isEditable, setIsEditable] = useState(false);
  const gridRef = useRef<EtsGridRef<Customer>>(null);
  const { toast } = useNotify();
  const [rowData, setRowData] = useState<Customer[]>([]);

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
      field: 'user_key',
      headerName: 'ID',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_id',
      headerName: '회원 ID',
      width: 100,
      flex: 1,
    }),

    EtsColumnPreset.TextPreset({
      field: 'group_name',
      headerName: '소속',
      width: 200,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '가입일시',
      width: 200,
      flex: 1,
    }),
    EtsColumnPreset.CheckButtonPreset({
      field: 'user_permission',
      headerName: '승인 여부',
      width: 100,
      editable: isEditable,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_phone',
      headerName: '전화번호',
      width: 200,
    }),
  ];

  useEffect(() => {
    onSearch();
  }, []);

  const onSearch = () => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/user/wait',
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

    const updateNodes: any[] = [];
    const deleteNodes: any[] = [];

    gridRef.current?.api.forEachNode((node) => {
      const status = String(node?.data?.rowStatus ?? '').toUpperCase();
      if (status === 'U') updateNodes.push(node);
      if (status === 'D') deleteNodes.push(node);
    });

    // 업데이트는 키비교(diff) 없이, 변경된 로우 전체를 insert처럼 전송
    const updatePayload = updateNodes
      .map((node) => node?.data)
      .filter(Boolean)
      .map((row: any) => ({
        user_key: row?.user_key ?? '',
        user_id: row?.user_id ?? '',
        user_permission: row?.user_permission ?? false,
      }))
      .filter((row: any) => typeof row.user_key === 'string' && row.user_key.length > 0);

    const deletePayload = deleteNodes
      .map((node) => node?.data?.user_key)
      .filter((v): v is string => typeof v === 'string' && v.length > 0)
      .map((user_key) => ({ user_key }));

    if (updatePayload.length === 0 && deletePayload.length === 0) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    const requests: Array<Promise<any>> = [];

    if (updatePayload.length > 0) {
      requests.push(
        callApi({
          service: Service.POSTMAN,
          url: '/api/user/permission',
          method: Method.PATCH,
          params: {
            bodyParams: updatePayload,
          },
          config: { isLoading: true },
        })
      );
    }
    if (deletePayload.length > 0) {
      requests.push(
        callApi({
          service: Service.POSTMAN,
          url: '/api/user',
          method: Method.DELETE,
          params: {
            bodyParams: deletePayload,
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
    const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];
    if (selectedNodes.length === 0) {
      toast.info('삭제할 항목을 선택하세요.');
      return;
    }
    gridRef.current?.deleteBySelectedRows();
  };

  const handleUpdatedRow = async () => {
    if (gridRef.current) {
      gridRef.current.api.stopEditing();
    }
    // 승인 여부 컬럼 체크로 인하여 셀렉트 체크 로직 없음
    const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];

    selectedNodes.forEach((node) => {
      if (!node) return;
      node.setDataValue('user_permission', true);
    });
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
              승인
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
        title="승인대기"
        gridRef={gridRef}
        columnDefs={columnDefs}
        buttonComponent={buttonComponent}
        rowData={rowData}
        isRowSelectable={() => isEditable}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
        size="no-search"
      />
    </>
  );
};
export default CustomerWait;
