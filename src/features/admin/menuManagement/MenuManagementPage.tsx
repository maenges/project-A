import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef, IRowNode } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Typography } from '@mui/material';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useNotify } from '@hooks/useNotify';
import { useActivate } from 'react-activation';
// import dayjs, { Dayjs } from 'dayjs';

import { EtsButton, EtsModal } from '@/components/EtsCommon';
import { EtsSelectComponent, EtsInputComponent } from '@/components/EtsComponents';

type MenuData = {
  id: number;
  parentMenuId: number;
  parentMenuCode: string;
  parentMenuName: string;
  menuId: number;
  menuCode: string;
  menuName: string;
  menuPath: string;
  menuOrder: string;
  adminIsAllowed: boolean;
  managerIsAllowed: boolean;
  userIsAllowed: boolean;
  active: boolean;
  isNew: boolean;
};

type FormValues = {
  parentId: string;
  menuId: string;
  useYn: string | boolean;
};

type parentMenu = {
  label: string;
  value: string;
};

const MenuManagementPage = () => {
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
      width: 60,
      // hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'parentMenuCode',
      headerName: 'Parent menu ID',
      width: 200,
      editable: isEditable,
    }),
    EtsColumnPreset.TextPreset({
      field: 'menuCode',
      headerName: 'Menu ID',
      width: 200,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
        },
        required: true,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'menuName',
      headerName: 'Menu name',
      width: 350,
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
      field: 'menuPath',
      headerName: 'URL',
      width: 350,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
        },
        required: true,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'menuOrder',
      headerName: 'Order',
      width: 100,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
          type: 'numeric',
        },
        required: true,
      },
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'active',
      headerName: 'Menu Use',
      cellDataType: 'boolean',
      width: 140,
      editable: isEditable,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'adminIsAllowed',
      headerName: 'Admin',
      cellDataType: 'boolean',
      width: 140,
      editable: isEditable,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'managerIsAllowed',
      headerName: 'Manager',
      cellDataType: 'boolean',
      width: 140,
      editable: isEditable,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'userIsAllowed',
      headerName: 'User',
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

  const [rowData, setRowData] = useState<MenuData[]>([]);
  const [newSaveOpen, setNewSaveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [parentMenuOptions, setParentMenuOptions] = useState<parentMenu[]>();
  const [totalCount, setTotalCount] = useState(0);
  const gridRef = useRef<EtsGridRef<MenuData>>(null);
  const [_, setNewRowNodes] = useState<IRowNode<MenuData>[]>([]);
  const { toast } = useNotify();

  useEffect(() => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/admin/menu-management/parent-menus',
      method: Method.GET,
      config: { isLoading: true },
      params: {},
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }
      const transformedData = res.data.map((item: { menuCode: string; menuName: string }) => ({
        label: item.menuName,
        value: item.menuName,
      }));
      setParentMenuOptions([{ label: 'ALL', value: 'ALL' }, ...transformedData]);
    });
  }, []);

  const useYnOptions = [
    { label: 'ALL', value: 'ALL' },
    { label: 'Y', value: true },
    { label: 'N', value: false },
  ];

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      parentId: '',
      menuId: '',
      useYn: useYnOptions[0].value,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (parentMenuOptions && parentMenuOptions.length > 0) {
      reset({
        parentId: parentMenuOptions[0].label,
        menuId: '',
        useYn: useYnOptions[0].value,
      });
    }
  }, [parentMenuOptions, reset]);

  const onSearch: SubmitHandler<FormValues> = async () => {
    const sendParams = {
      parentMenu: watch('parentId') === 'ALL' ? '' : watch('parentId'),
      menu: watch('menuId'),
      useYn: watch('useYn') === 'ALL' ? '' : watch('useYn'),
    };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/admin/menu-management',
      method: Method.GET,
      config: { isLoading: true },
      params: {
        queryParams: sendParams,
      },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      // const buildHierarchy = (items: MenuData[], parentCode: string | null = null): MenuData[] => {
      //   const result: MenuData[] = [];
      //   items
      //     // 1-1. 현재 깊이의 메뉴들(자식들)을 찾습니다.
      //     .filter((item) => (item.parentMenuCode || null) === parentCode)
      //     // 1-2. menuOrder를 기준으로 오름차순 정렬합니다.
      //     .sort((a, b) => Number(a.menuOrder) - Number(b.menuOrder))
      //     // 1-3. 정렬된 메뉴들을 순회합니다.
      //     .forEach((item) => {
      //       // 부모를 결과 배열에 추가합니다.
      //       result.push(item);
      //       // 해당 부모의 자식들을 재귀적으로 찾아 결과 배열에 추가합니다.
      //       const children = buildHierarchy(items, item.menuCode);
      //       result.push(...children);
      //     });
      //   return result;
      // };

      // const sortedData = buildHierarchy(res.data);

      const dataWithId = res.data.map((item: Omit<MenuData, 'id'>, index: number) => ({
        ...item,
        id: index + 1, // 1부터 시작하는 순번을 id로 부여합니다.
      }));

      setRowData(dataWithId);
      setTotalCount(res.ItemCount ?? 0);
    });
  };

  const handleAddRow = () => {
    const lastRowIndex = gridRef.current?.api.getDisplayedRowCount() ?? 0;
    gridRef.current?.addRow({
      parentMenuCode: '',
      menuCode: '',
      menuName: '',
      menuPath: '',
      menuOrder: '',
      active: false,
      adminIsAllowed: false,
      managerIsAllowed: false,
      userIsAllowed: false,
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

    const body = { menuManagementList: payload };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/admin/menu-management',
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
          <EtsSelectComponent
            control={control}
            name="parentId"
            label="Parent ID"
            options={parentMenuOptions}
          />
          <EtsInputComponent
            control={control}
            name="menuId"
            label="Menu"
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
                  handleDeleteRow();
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
            Save Menu
          </Typography>
          <Typography className="modal-body-text" mt={2}>
            변경된 메뉴별 권한 설정을 저장하시겠습니까?
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

  const deleteModal = (
    <>
      <EtsModal open={deleteOpen} size={420} onClose={() => setDeleteOpen(false)}>
        <EtsModal.Header onClose={() => setDeleteOpen(false)} />
        <EtsModal.Body>
          <Typography className="label-modal-sm" component="h1">
            Delete Menu
          </Typography>
          <Typography className="modal-body-text" mt={3}>
            선택하신 메뉴를 삭제하시겠습니까?
          </Typography>
          <Typography className="modal-body-text-sub" mt={3}>
            ※ 삭제된 메뉴는 복구할 수 없습니다.
          </Typography>
        </EtsModal.Body>
        <EtsModal.Footer>
          <>
            <EtsButton
              className="modal-foot-text-cancel"
              type="outlined"
              variant="outlined"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </EtsButton>
            <EtsButton
              className="modal-foot-text-cancel"
              type="contained"
              variant="contained"
              onClick={async () => {
                // await handleNewData();
                handleDeleteRow();
                setDeleteOpen(false);
              }}
            >
              Save
            </EtsButton>
          </>
        </EtsModal.Footer>
      </EtsModal>
    </>
  );

  return (
    <>
      {newSaveModal}
      {deleteModal}
      <PageTemplate
        title="Menu Management"
        gridRef={gridRef}
        columnDefs={columnDefs}
        totalCount={totalCount}
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        rowData={rowData}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
      />
    </>
  );
};

export default MenuManagementPage;
