import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { CellClickedEvent } from 'ag-grid-community';
import { Typography } from '@mui/material';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Method, callApi } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useNotify } from '@hooks/useNotify';
import { useActivate } from 'react-activation';
import dayjs from 'dayjs';

import { EtsButton, EtsModal, EtsSelectOption } from '@/components/EtsCommon';
import { EtsSelectComponent, EtsYearSelectComponent } from '@/components/EtsComponents';

type CommonCodeData = {
  id: number;
  fuelSupplier: string;
  batchNumber: string;
  feedstock: string;
  amountPurchased: string;
  amountUnit: string;
  lifecycleEmission: string;
  fuelCategory: string;
  certType: string;
  certName: string;
  file: boolean;
};

type FormValues = {
  year: string;
  supplier: string;
};

const CommonCodeManagementPage = () => {
  const [isEditable, setIsEditable] = useState(false);

  const certiOptions: EtsSelectOption[] = [
    { label: 'Pos', value: 'POS' },
    { label: 'PoC', value: 'POC' },
    { label: 'PTD', value: 'PTD' },
    { label: 'Other', value: 'OTHER' },
  ];

  const categoryOptions: EtsSelectOption[] = [
    { label: 'HEFA', value: 'HEFA' },
    { label: 'FT', value: 'FT' },
    { label: 'ATJ', value: 'ATJ' },
    { label: 'Co-processed', value: 'CO-PROCESSED' },
    { label: 'Other', value: 'OTHER' },
  ];

  const unitOptions: EtsSelectOption[] = [
    { label: 't', value: 'T' },
    { label: 'm³', value: 'M' },
  ];

  const supplierOptions: EtsSelectOption[] = [
    { label: 'S-OIL', value: 'S-OIL' },
    { label: 'Airport Fuel Supply LLC.', value: 'AIRPORT' },
    { label: 'Air bp', value: 'AIR-BP' },
  ];

  const columnDefs: ColDef[] = [
    EtsColumnPreset.IdPreset({
      field: 'id',
      headerName: 'No',
      hide: true,
    }),
    EtsColumnPreset.SelectionBoxPreset({
      headerName: '',
      width: 60,
      headerCheckboxSelection: true,
      hide: !isEditable,
      flex: 1,
    }),
    EtsColumnPreset.IdWithNewLabelPreset({
      field: 'id',
      headerName: 'No',
      hide: true,
    }),
    EtsColumnPreset.SelectPreset({
      field: 'fuelSupplier',
      headerName: 'Supplier',
      width: 200,
      editable: isEditable,
      context: {
        options: supplierOptions,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'batchNumber',
      headerName: 'Batch No',
      width: 180,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
        },
      },
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'feedstock',
      headerName: 'Feedstock',
      width: 180,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
        },
      },
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'amountPurchased',
      headerName: 'Amount',
      width: 150,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
          type: 'numeric',
        },
      },
    }),
    EtsColumnPreset.SelectPreset({
      field: 'amountUnit',
      headerName: 'unit',
      width: 100,
      editable: isEditable,
      context: {
        options: unitOptions,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'lifecycleEmission',
      headerName: 'Lifecycle\nEmission\n(gCO₂eq/MJ)',
      width: 200,
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: '필수입력 항목 입니다.',
          type: 'numeric',
        },
      },
    }),
    EtsColumnPreset.SelectPreset({
      field: 'fuelCategory',
      headerName: 'Category',
      width: 180,
      editable: isEditable,
      context: {
        options: categoryOptions,
      },
    }),
    EtsColumnPreset.SelectPreset({
      field: 'certType',
      headerName: 'Certi',
      editable: isEditable,
      width: 60,
      flex: 1,
      context: {
        options: certiOptions,
      },
    }),
    EtsColumnPreset.FileLinkPreset({
      field: 'certName',
      headerName: 'Certificate',
      width: 363,
      flex: 1,
      context: {
        urlField: 'certUrl',
        isGridEditable: isEditable,
      },
    }),
    EtsColumnPreset.FileButtonPreset({
      field: 'file',
      headerName: 'File',
      width: 60,
      hide: !isEditable,
      editable: isEditable,
      context: {
        hasFile: (rowData) => !!rowData.certificate,
        onFileUpload: (params, file) => {
          const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
          params.node.setData({
            ...params.data,
            certName: fileNameWithoutExtension,
            certFile: file,
          });
          // params.node.setDataValue('certName', file.name);
        },
        onFileDelete: (params) => {
          // params.node.setDataValue('certName', '');
          params.node.setData({
            ...params.data,
            certName: '',
            certFile: null,
          });
        },
      },
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

  const gridRef = useRef<EtsGridRef<CommonCodeData>>(null);
  const [rowData, setRowData] = useState<CommonCodeData[]>([]);
  const [newSaveOpen, setNewSaveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [yearOptions, setYearOptions] = useState([]);
  const { toast } = useNotify();

  useEffect(() => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/common/operation-years',
      method: Method.GET,
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }
      setYearOptions(res.data);
    });
  }, []);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      year: dayjs().format('YYYY'),
      supplier: 'ALL',
    },
    mode: 'onChange',
  });

  const handleCellClicked = (event: CellClickedEvent) => {
    // 'certName' 컬럼을 클릭했고, 해당 행에 id와 파일 이름이 있을 때만 동작합니다.
    if (event.colDef.field === 'certName' && event.data?.id && event.data?.certName) {
      callApi({
        service: Service.POSTMAN,
        url: `/api/v1/library/saf-usage/${event.data.id}`,
        method: Method.GET,
        config: { isLoading: true },
      }).then((res) => {
        if (res.successOrNot !== 'Y' || !res.data) {
          return toast.error(res.HeaderMsg);
        }

        const s3Url = res.data as string;

        // 가상의 a 태그를 만들어 다운로드를 실행합니다.
        const link = document.createElement('a');
        link.href = s3Url; // API로 받은 S3 URL을 직접 href에 설정

        // 다운로드될 파일의 이름을 지정합니다. (certName을 사용)
        // 확장자가 없는 상태이므로, URL에서 확장자를 추정하거나 고정값을 사용할 수 있습니다.
        // 여기서는 우선 certName을 그대로 사용합니다.
        link.setAttribute('download', event.data.certName);

        // a 태그를 문서에 추가하고 클릭한 뒤, 다시 제거합니다.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const onSearch: SubmitHandler<FormValues> = async () => {
    const sendParams = {
      etsYear: watch('year'),
      fuelSupplier: watch('supplier') === 'ALL' ? '' : watch('supplier'),
    };
    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/library/saf-usage',
      method: Method.GET,
      config: { isLoading: true },
      params: {
        queryParams: sendParams,
      },
    }).then(async (res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      const processedData = res.data.map((item: CommonCodeData) => ({
        ...item,
        file: !!item.certName,
      }));

      setRowData(processedData);
    });
  };

  const handleAddRow = () => {
    gridRef.current?.addRow({
      fuelSupplier: String(supplierOptions[0].value),
      batchNumber: '',
      feedstock: '',
      amountPurchased: '',
      amountUnit: String(unitOptions[0].value),
      lifecycleEmission: '',
      fuelCategory: String(categoryOptions[0].value),
      certType: String(certiOptions[0].value),
      certName: '',
      file: false,
    });
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

    const createPayloadItem = (item: any, action: 'C' | 'U' | 'D') => {
      const { file, ...rest } = item; // 'file' 필드를 분리하고 나머지 속성만 'rest'에 담습니다.
      return { ...rest, action, etsYear: dayjs().year() };
    };

    const payload = [
      ...modifiedData.insert.map((item) => createPayloadItem(item, 'C')), // Create
      ...modifiedData.update.map((item) => createPayloadItem(item, 'U')), // Update
      ...modifiedData.delete.map((item) => createPayloadItem(item, 'D')), // Delete
    ];
    console.log(payload);
    // 변경된 데이터가 없으면 함수를 종료합니다.
    if (payload.length === 0) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    const body = { safUsageList: payload };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/library/saf-usage',
      method: Method.POST,
      config: { isLoading: true, isFile: true },
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
          <EtsYearSelectComponent
            control={control}
            name="year"
            label="Year"
            minYear={yearOptions[yearOptions.length - 1]}
            maxYear={yearOptions[0]}
          />
          <EtsSelectComponent
            control={control}
            name="supplier"
            label="Supplier"
            options={[{ label: 'ALL', value: 'ALL' }, ...supplierOptions]}
          />
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
                  const selectedRows = gridRef.current?.api.getSelectedRows();
                  if (selectedRows && selectedRows.length > 0) {
                    setDeleteOpen(true);
                  }
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

  const deleteModal = (
    <>
      <EtsModal open={deleteOpen} size={420} onClose={() => setDeleteOpen(false)}>
        <EtsModal.Header onClose={() => setDeleteOpen(false)} />
        <EtsModal.Body>
          <Typography className="label-modal-sm" component="h1">
            Delete Code
          </Typography>
          <Typography className="modal-body-text" mt={3}>
            선택하신 정보를 삭제하시겠습니까?
          </Typography>
          <Typography className="modal-body-text-sub" mt={3}>
            ※ 삭제된 정보는 복구할 수 없습니다.
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
        title="SAF Usage"
        gridRef={gridRef}
        columnDefs={columnDefs}
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        rowData={rowData}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
        onCellClicked={handleCellClicked}
      />
    </>
  );
};

export default CommonCodeManagementPage;
