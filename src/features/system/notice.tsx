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
  notice_key: number;
  notice_target_type: string;
  notice_title: string;
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
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }
      setRowData(res.data);
    });
  };

  const handleDeleteRow = () => {
    gridRef.current?.deleteBySelectedRows();
  };

  const newModal = newModalOpen && (
    <NoticeNewModal
      open={newModalOpen}
      onClose={() => {
        setNewModalOpen(false);
      }}
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
            <EtsButton type="blue" onClick={async () => {}}>
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
      <PageTemplate
        title="공지사항"
        gridRef={gridRef}
        columnDefs={columnDefs}
        buttonComponent={buttonComponent}
        isRowSelectable={() => isEditable}
        rowData={rowData}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
        size="no-search"
      />
    </>
  );
};
export default Notice;
