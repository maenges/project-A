import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef, IRowNode } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Typography } from '@mui/material';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
import { useActivate } from 'react-activation';
// import dayjs, { Dayjs } from 'dayjs';

import { EtsButton, EtsModal } from '@/components/EtsCommon';
import { EtsSelectComponent, EtsInputComponent } from '@/components/EtsComponents';

type CommonCodeData = {
  id: number;
  groupCode: string;
  codeName: string;
  codeValue: string;
  relatedGroupCode: string;
  relatedValue: string;
  description: string;
  useYn: boolean;
  isNew: boolean;
};

type FormValues = {
  groupCode: string;
  codeName: string;
  codeValue: string;
  useYn: string | boolean;
};

const CommonCodeManagementPage = () => {
  const [isEditable, setIsEditable] = useState(false);

  const columnDefs: ColDef[] = [
    EtsColumnPreset.SelectionBoxPreset({
      headerName: '',
      width: 60,
      headerCheckboxSelection: true,
      hide: !isEditable,
    }),
    EtsColumnPreset.IdWithNewLabelPreset({
      field: 'id',
      headerName: 'No',
      width: 100,
    }),
    EtsColumnPreset.TextPreset({
      field: 'groupCode',
      headerName: 'Group Code',
      width: 263,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
        },
        required: true,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'codeName',
      headerName: 'Name',
      width: 263,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
        },
        required: true,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'codeValue',
      headerName: 'Value',
      width: 263,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
        },
        required: true,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'description',
      headerName: 'Description',
      width: 263,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
        },
        required: true,
      },
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'relatedGroupCode',
      headerName: 'Related group code',
      width: 263,
      editable: isEditable,
    }),
    EtsColumnPreset.TextPreset({
      field: 'relatedValue',
      headerName: 'Related value',
      width: 263,
      editable: isEditable,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'useYn',
      headerName: 'Use',
      cellDataType: 'boolean',
      width: 140,
      editable: isEditable,
    }),
  ];

  useActivate(() => {
    // 편집 상태 초기화
    if (isEditable) {
      setIsEditable(false);
    }
    if (rowData && rowData.length > 0) {
      handleSubmit(onSearch)();
    }
  });

  const [rowData, setRowData] = useState<CommonCodeData[]>([]);
  const [newSaveOpen, setNewSaveOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  // const [deleteOpen, setDeleteOpen] = useState(false);

  const gridRef = useRef<EtsGridRef<CommonCodeData>>(null);
  const [_, setNewRowNodes] = useState<IRowNode<CommonCodeData>[]>([]);
  const { toast } = useNotify();

  const useYnOptions = [
    { label: 'ALL', value: 'ALL' },
    { label: 'Y', value: true },
    { label: 'N', value: false },
  ];

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      groupCode: '',
      codeName: '',
      codeValue: '',
      useYn: useYnOptions[0].value,
    },
    mode: 'onChange',
  });

  const onSearch: SubmitHandler<FormValues> = async () => {
    const sendParams = {
      groupCode: watch('groupCode'),
      codeName: watch('codeName'),
      codeValue: watch('codeValue'),
      useYn: watch('useYn') === 'ALL' ? '' : watch('useYn'),
    };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/admin/common-code',
      method: Method.GET,
      config: { isLoading: true },
      params: {
        queryParams: sendParams,
      },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      setRowData(res.data);
      setTotalCount(res.ItemCount ?? 0);
    });
  };

  const handleAddRow = () => {
    const lastRowIndex = gridRef.current?.api.getDisplayedRowCount() ?? 0;
    // 2. 행을 추가합니다.
    gridRef.current?.addRow({
      groupCode: '',
      codeName: '',
      codeValue: '',
      relatedGroupCode: '',
      relatedValue: '',
      description: '',
      useYn: false,
      isNew: true,
    });

    // 3. 행 추가 후, 마지막 인덱스의 RowNode를 가져옵니다.
    const newNode = gridRef.current?.api.getDisplayedRowAtIndex(lastRowIndex);

    // 4. 가져온 노드가 존재하면 state에 추가합니다.
    if (newNode) {
      setNewRowNodes((prevNodes) => [...prevNodes, newNode]);
    }
  };

  const handleDeleteRow = () => {
    gridRef.current?.deleteBySelectedRows();
  };

  const handleGetModifiedData = async () => {
    const modifiedData = gridRef.current?.getRowsByStatus();
    if (!modifiedData) return;

    const requiredColumns = columnDefs.filter((col) => col.context?.required);

    let isValidation = false;

    gridRef.current?.api.forEachNodeAfterFilterAndSort((rowNode) => {
      // 이미 유효성 검사에 실패했다면 더 이상 검사하지 않습니다.
      if (isValidation) return;

      if (rowNode.data) {
        const rowData = rowNode.data;

        const firstEmptyField = requiredColumns.find((col) => {
          const field = col.field as keyof typeof rowData;
          return !rowData[field];
        });

        // 비어있는 필수 필드를 찾으면, 포커스를 이동시키고 검사를 중단합니다.
        if (firstEmptyField) {
          toast.error('필수 입력 항목을 모두 채워주세요.');
          gridRef.current?.api.startEditingCell({
            rowIndex: rowNode.rowIndex!,
            colKey: firstEmptyField.field!,
          });
          isValidation = true; // 플래그를 설정합니다.
        }
      }
    });

    if (isValidation) {
      return;
    }

    // 1. insert, update, delete 배열을 하나의 배열로 합치고 action 필드를 추가합니다.
    const payload = [
      ...modifiedData.insert.map((item) => ({ ...item, action: 'C' })), // Create
      ...modifiedData.update.map((item) => ({ ...item, action: 'U' })), // Update
      ...modifiedData.delete.map((item) => ({ ...item, action: 'D' })), // Delete
    ];

    // 변경된 데이터가 없으면 함수를 종료합니다.
    if (payload.length === 0) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    const body = { commonCodeList: payload };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/admin/common-code',
      method: Method.POST,
      config: { isLoading: true },
      params: {
        bodyParams: body,
      },
    }).then(async (res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        return;
      }
      toast.success('저장되었습니다.');
      await handleSubmit(onSearch)();
      setIsEditable(false);
    });
  };

  const searchComponent = (
    <form onSubmit={handleSubmit(onSearch)}>
      <searchForm.Container>
        <searchForm.Row>
          <EtsInputComponent
            control={control}
            name="groupCode"
            label="GroupCode"
            placeholder="검색어를 입력해주세요."
          />
          <EtsInputComponent
            control={control}
            name="codeName"
            label="Name"
            placeholder="검색어를 입력해주세요."
          />
          <EtsInputComponent
            control={control}
            name="codeValue"
            label="Value"
            placeholder="검색어를 입력해주세요."
          />
          <EtsSelectComponent control={control} name="useYn" label="Use" options={useYnOptions} />
        </searchForm.Row>
      </searchForm.Container>
      {/* Search */}
      <searchForm.ButtonContainer>
        <searchForm.Row sx={{ justifyContent: 'flex-end' }}>
          <EtsButton
            type="blue"
            onClick={() => {
              handleSubmit(onSearch)();
            }}
          >
            Search
          </EtsButton>
        </searchForm.Row>
      </searchForm.ButtonContainer>
    </form>
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
                  // const selectedRows = gridRef.current?.api.getSelectedRows();
                  // if (selectedRows && selectedRows.length > 0) {
                  //   setDeleteOpen(true);
                  // }
                  handleDeleteRow();
                  // setDeleteOpen(false);
                }
              }}
            >
              Delete
            </EtsButton>
            <EtsButton
              type="grey"
              onClick={() => {
                handleAddRow();
              }}
            >
              New
            </EtsButton>
            <EtsButton
              type="grey"
              onClick={() => {
                if (gridRef.current) {
                  gridRef.current.api.stopEditing();
                }
                handleSubmit(onSearch)();
                setIsEditable(false);
              }}
            >
              Cancel
            </EtsButton>
            <EtsButton
              type="blue"
              onClick={async () => {
                if (gridRef.current) {
                  gridRef.current.api.stopEditing();
                }
                setNewSaveOpen(true);
              }}
            >
              Save
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
              Edit
            </EtsButton>
          </>
        )}
      </buttonForm.Row>
    </buttonForm.Container>
  );

  const newSaveModal = (
    <>
      <EtsModal open={newSaveOpen} size={420} onClose={() => setNewSaveOpen(false)}>
        <EtsModal.Header onClose={() => setNewSaveOpen(false)} />
        <EtsModal.Body>
          <Typography className="label-modal-sm" component="h1">
            Save Code
          </Typography>
          <Typography className="modal-body-text" mt={2}>
            변경된 설정을 저장하시겠습니까?
          </Typography>
        </EtsModal.Body>
        <EtsModal.Footer>
          <>
            <EtsButton
              className="modal-foot-text-cancel"
              type="outlined"
              variant="outlined"
              onClick={() => setNewSaveOpen(false)}
            >
              Cancel
            </EtsButton>
            <EtsButton
              className="modal-foot-text-cancel"
              type="contained"
              variant="contained"
              onClick={async () => {
                await handleGetModifiedData();
                setNewSaveOpen(false);
              }}
            >
              Save
            </EtsButton>
          </>
        </EtsModal.Footer>
      </EtsModal>
    </>
  );

  // const deleteModal = (
  //   <>
  //     <EtsModal open={deleteOpen} size={420} onClose={() => setDeleteOpen(false)}>
  //       <EtsModal.Header onClose={() => setDeleteOpen(false)} />
  //       <EtsModal.Body>
  //         <Typography className="label-modal-sm" component="h1">
  //           Delete Code
  //         </Typography>
  //         <Typography className="modal-body-text" mt={3}>
  //           선택하신 정보를 삭제하시겠습니까?
  //         </Typography>
  //         <Typography className="modal-body-text-sub" mt={3}>
  //           ※ 삭제된 정보는 복구할 수 없습니다.
  //         </Typography>
  //       </EtsModal.Body>
  //       <EtsModal.Footer>
  //         <>
  //           <EtsButton
  //             className="modal-foot-text-cancel"
  //             type="outlined"
  //             variant="outlined"
  //             onClick={() => setDeleteOpen(false)}
  //           >
  //             Cancel
  //           </EtsButton>
  //           <EtsButton
  //             className="modal-foot-text-cancel"
  //             type="contained"
  //             variant="contained"
  //             onClick={async () => {
  //               handleDeleteRow();
  //               setDeleteOpen(false);
  //             }}
  //           >
  //             Save
  //           </EtsButton>
  //         </>
  //       </EtsModal.Footer>
  //     </EtsModal>
  //   </>
  // );

  return (
    <>
      {newSaveModal}
      {/* {deleteModal} */}
      <PageTemplate
        title="Common Code Management"
        gridRef={gridRef}
        columnDefs={columnDefs}
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        rowData={rowData}
        totalCount={totalCount}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
      />
    </>
  );
};

export default CommonCodeManagementPage;
