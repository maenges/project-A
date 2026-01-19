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
  const { toast, confirm } = useNotify();
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

  const handdleSave = async () => {
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
      url: '/api/macro/batch',
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
    const selected = (gridRef.current?.getSelectedData() ?? []) as Macro[];
    const row = selected[0];
    if (!row) {
      toast.info('삭제할 항목을 선택하세요.');
      return;
    }
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
            <EtsButton
              type="blue"
              onClick={() => {
                handdleSave();
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
