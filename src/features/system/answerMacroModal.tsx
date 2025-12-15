import { Fragment, useEffect, useRef, useState } from 'react';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { ColDef, IRowNode } from 'ag-grid-community';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
import { buttonForm } from '@/assets/style';
import { EtsButton } from '@/components/EtsCommon';
import { PageModalTemplate } from '@/components/Teamplate';
import dayjs from 'dayjs';

export type AnswerMacroModalProps = {
  open: boolean;
  onClose: () => void;
};

type Macro = {
  no: string;
  macro_key: string;
  macro_type: string;
  macro_title: string;
  macro_content: string;
  macro_active: boolean;
  created: string;
  [key: string]: any;
};

const AnswerMacroModal = ({ open, onClose }: AnswerMacroModalProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const gridRef = useRef<EtsGridRef<Macro>>(null);
  const [_, setNewRowNodes] = useState<IRowNode<Macro>[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const { toast } = useNotify();

  const columnDefs: ColDef[] = [
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
      field: 'macro_key',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'macro_title',
      headerName: '제목',
      width: 200,
      editable: isEditable,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'macro_content',
      headerName: '내용',
      width: 200,
      editable: isEditable,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '등록일시',
      width: 200,
      flex: 1,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'macro_active',
      headerName: '보이기',
      width: 100,
      editable: isEditable,
    }),
  ];

  useEffect(() => {
    onSearch();
  }, []);

  const onSearch = () => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/macro',
      method: Method.GET,
      params: {},
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }
      setRowData(res.data);
    });
  };

  const handleAddRow = () => {
    const lastRowIndex = gridRef.current?.api.getDisplayedRowCount() ?? 0;
    gridRef.current?.addRow({
      macro_type: 'MACRO',
      macro_title: '',
      macro_content: '',
      macro_active: false,
      created: dayjs().format('YYYY-MM-DD HH:mm:ss'),
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

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        {isEditable ? (
          <>
            <EtsButton
              type="grey"
              onClick={() => {
                handleAddRow();
              }}
            >
              추가
            </EtsButton>
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
    <Fragment>
      <PageModalTemplate
        open={open}
        onClose={onClose || (() => {})}
        gridRef={gridRef}
        columnDefs={columnDefs}
        rowData={rowData}
        isRowSelectable={() => isEditable}
        rowSelection="multiple"
        rowMultiSelectWithClick
        suppressRowClickSelection
        buttonComponent={buttonComponent}
        title="답변 등록"
        width={1000}
      />
    </Fragment>
  );
};
export default AnswerMacroModal;
