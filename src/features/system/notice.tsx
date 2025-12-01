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

type Notices = {
  id: number;
  seg: string;
  sactyp: string;
  fuelConsQ: string;
  unit: string;
  uncertainty: string;
  fltCnt: number;
  ltoCo2: number;
  ltoCh4: number;
  ltoN2o: number;
  ltoFactor: number;
  emissionCo2: number | null;
  emissionCh4: number | null;
  emissionN2o: number | null;
  [key: string]: any;
};

const Notice = () => {
  const [isEditable, setIsEditable] = useState(false);
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
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'notice_target_type',
      headerName: '공지구분',
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

  const gridRef = useRef<EtsGridRef<Notices>>(null);
  const { toast } = useNotify();
  const [rowData, setRowData] = useState<Notices[]>([]);
  const [totalCount, setTotalCount] = useState(0);
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
      setTotalCount(res.ItemCount ?? 0);
    });
  };
  // 순차 페이드 대상 버튼 그룹 (편집 모드에서만 표시)
  // const animatedButtons = (
  //   <>
  //     <EtsButton
  //       type="grey"
  //       onClick={() => {
  //         if (gridRef.current) {
  //           const selectedRows = gridRef.current?.api.getSelectedRows();
  //           if (selectedRows && selectedRows.length > 0) {
  //             setDeleteOpen(true);
  //           }
  //         }
  //       }}
  //     >
  //       Delete
  //     </EtsButton>
  //     <EtsButton
  //       type="grey"
  //       onClick={() => {
  //         if (gridRef.current) {
  //           gridRef.current.api.stopEditing();
  //         }
  //         onSearch();
  //         setIsEditable(false);
  //       }}
  //     >
  //       Cancel
  //     </EtsButton>
  //     <EtsButton
  //       type="blue"
  //       onClick={async () => {
  //         if (gridRef.current) {
  //           gridRef.current.api.stopEditing();
  //         }
  //         setSaveOpen(true);
  //       }}
  //     >
  //       Save
  //     </EtsButton>
  //   </>
  // );

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        {isEditable ? (
          <>
            <EtsButton type="grey" onClick={() => {}}>
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
    <PageTemplate
      title="공지사항"
      gridRef={gridRef}
      columnDefs={columnDefs}
      buttonComponent={buttonComponent}
      isRowSelectable={() => isEditable}
      rowData={rowData}
      totalCount={totalCount}
      rowSelection="multiple"
      rowMultiSelectWithClick={true}
      suppressRowClickSelection={true}
      size="no-search"
    />
  );
};
export default Notice;
