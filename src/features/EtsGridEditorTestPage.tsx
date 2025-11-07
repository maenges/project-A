import { useState, useRef } from 'react';
import { ColDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '../components/EtsGrid';
import type { EtsAutoCompleteOption } from '../components/EtsGrid';
import type { EtsSelectOption } from '../components/EtsCommon/EtsSelect';
import PageTemplate from '../components/Teamplate/PageTemplate';
import ButtonPanel from '../components/Teamplate/ButtonPanel';
import CommonButton from '../components/EtsCommon/EtsButton';

interface TestData {
  id: number;
  name: string;
  name2: number;
  status: string;
  category: string;
  createdAt: string;
  score: number;
  isActive: boolean;
  isCompleted: boolean;
}

const EtsGridEditorTestPage = () => {
  const gridRef = useRef<EtsGridRef<TestData>>(null);

  const [rowData, setRowData] = useState<TestData[]>([
    {
      id: 1,
      name: '테스트 항목 1',
      name2: 11,
      status: 'active',
      category: 'A',
      createdAt: '2024-01-15',
      score: 85,
      isActive: true,
      isCompleted: false,
    },
    {
      id: 2,
      name: '테스트 항목 2',
      name2: 11,
      status: 'inactive',
      category: 'B',
      createdAt: '2024-01-16',
      score: 92,
      isActive: false,
      isCompleted: true,
    },
    {
      id: 3,
      name: '테스트 항목 3',
      name2: 11,
      status: 'pending',
      category: 'C',
      createdAt: '2024-01-17',
      score: 78,
      isActive: true,
      isCompleted: false,
    },
  ]);

  // Select 옵션들
  const statusOptions: EtsSelectOption[] = [
    { label: '활성', value: 'active' },
    { label: '비활성', value: 'inactive' },
    { label: '대기중', value: 'pending' },
  ];

  // Autocomplete 옵션들
  const categoryOptions: EtsAutoCompleteOption[] = [
    { label: '카테고리 A', value: 'A' },
    { label: '카테고리 B', value: 'B' },
    { label: '카테고리 C', value: 'C' },
    { label: '카테고리 D', value: 'D' },
  ];

  const columnDefs: ColDef[] = [
    // ID 컬럼 (편집 불가)
    EtsColumnPreset.IdPreset({
      field: 'id',
      headerName: 'ID',
      minWidth: 100,
      flex: 1,
    }),

    // 텍스트 에디터 컬럼
    EtsColumnPreset.TextPreset({
      field: 'name',

      headerName: '이름',
      // cellEditorPopup: false,
      editable: true,
      width: 200,
      context: {
        inputProps: {
          placeholder: '이름을 입력하세요',
        },
      },
    }),
    // 텍스트 에디터 칼럼 (Number)
    EtsColumnPreset.TextPreset({
      field: 'name2',

      headerName: '숫자',
      // cellEditorPopup: false,
      editable: true,
      width: 200,
      context: {
        inputProps: {
          placeholder: '이름을 입력하세요',
          // type: 'number',
          type: 'decimal',
        },
      },
      cellDataType: 'number',
    }),

    // Select 에디터 컬럼
    EtsColumnPreset.SelectPreset({
      field: 'status',
      headerName: '상태',
      width: 150,
      editable: true, // 테스트를 위해 false로 설정
      context: {
        options: statusOptions,
        selectProps: {
          placeholder: '상태를 선택하세요',
        },
      },
    }),

    // Autocomplete 에디터 컬럼
    EtsColumnPreset.AutocompletePreset({
      field: 'category',
      headerName: '카테고리',
      width: 150,
      editable: true, // 테스트를 위해 false로 설정
      context: {
        options: categoryOptions,
        autoCompleteProps: {
          placeholder: '카테고리를 검색하세요',
        },
      },
    }),

    // 날짜 에디터 컬럼
    EtsColumnPreset.DatePreset({
      field: 'createdAt',
      headerName: '생성일',
      width: 150,
      editable: true,
      context: {
        dateFormat: 'YYYY-MM-DD',
        datePickerProps: {
          placeholder: '날짜를 선택하세요',
        },
      },
    }),

    // 숫자 텍스트 에디터 컬럼
    EtsColumnPreset.TextPreset({
      field: 'score',
      headerName: '점수',
      width: 100,
      editable: true,
      context: {
        inputProps: {
          inputMode: 'numeric' as const,
          placeholder: '점수를 입력하세요',
        },
      },
    }),

    // 체크박스 에디터 컬럼 (편집 가능)
    EtsColumnPreset.CheckBoxPreset({
      field: 'isActive',
      headerName: '활성화',
      width: 100,
      editable: true,
      context: {
        checkBoxProps: {
          width: '16px',
          height: '16px',
        },
      },
    }),

    // 체크박스 렌더러 컬럼 (편집 가능하지만 readOnly)
    EtsColumnPreset.CheckBoxPreset({
      field: 'isCompleted',
      headerName: '완료됨 (ReadOnly)',
      width: 140,
      editable: false,
    }),
  ];

  const handleAddRow = () => {
    // const newId = Math.max(...rowData.map((r) => r.id)) + 1;
    // const newRow: TestData = {
    //   id: newId,
    //   name: '',
    //   status: 'pending',
    //   category: '',
    //   createdAt: new Date().toISOString().split('T')[0],
    //   score: 0,
    //   isActive: false,
    //   isCompleted: false,
    // };
    // gridRef.current?.addRow(newRow);
  };

  const handleDeleteSelected = () => {
    gridRef.current?.deleteBySelectedRowsWithModal();
  };

  const handleGetModifiedData = () => {
    const modifiedData = gridRef.current?.getRowsByStatus();
    console.log('Modified Data:', modifiedData);
    alert(`수정된 데이터:\n${JSON.stringify(modifiedData, null, 2)}`);
  };

  const handleGetAllData = () => {
    const allData = gridRef.current?.getRows();
    console.log('All Data:', allData);
    alert(`전체 데이터:\n${JSON.stringify(allData, null, 2)}`);
  };

  const handleClearData = () => {
    setRowData([]);
  };

  const handleLoadSampleData = () => {
    // setRowData([
    //   {
    //     id: 1,
    //     name: '샘플 데이터 1',
    //     status: 'active',
    //     category: 'A',
    //     createdAt: '2024-01-15',
    //     score: 95,
    //     isActive: true,
    //     isCompleted: false,
    //   },
    //   {
    //     id: 2,
    //     name: '샘플 데이터 2',
    //     status: 'inactive',
    //     category: 'B',
    //     createdAt: '2024-01-16',
    //     score: 87,
    //     isActive: false,
    //     isCompleted: true,
    //   },
    //   {
    //     id: 3,
    //     name: '샘플 데이터 3',
    //     status: 'pending',
    //     category: 'C',
    //     createdAt: '2024-01-17',
    //     score: 92,
    //     isActive: true,
    //     isCompleted: false,
    //   },
    // ]);
  };

  const buttonConfig = [
    {
      label: '행 추가',
      variant: 'contained' as const,
      color: 'primary' as const,
      onClick: handleAddRow,
    },
    {
      label: '선택 삭제',
      variant: 'outlined' as const,
      color: 'error' as const,
      onClick: handleDeleteSelected,
    },
    {
      label: '수정된 데이터 보기',
      variant: 'outlined' as const,
      color: 'info' as const,
      onClick: handleGetModifiedData,
    },
    {
      label: '전체 데이터 보기',
      variant: 'outlined' as const,
      color: 'secondary' as const,
      onClick: handleGetAllData,
    },
    {
      label: '데이터 지우기',
      variant: 'outlined' as const,
      color: 'warning' as const,
      onClick: handleClearData,
    },
    {
      label: '샘플 데이터 로드',
      variant: 'contained' as const,
      color: 'success' as const,
      onClick: handleLoadSampleData,
    },
  ];

  return (
    <PageTemplate
      title="EtsGridEditor 테스트 페이지"
      buttonComponent={
        <ButtonPanel
          buttonComponent={
            <>
              {buttonConfig.map((config, index) => (
                <CommonButton key={index} {...config} type="blue">
                  {config.label}
                </CommonButton>
              ))}
            </>
          }
        />
      }
      columnDefs={columnDefs}
      rowData={rowData}
      gridRef={gridRef}
      defaultColDef={{
        sortable: true,
        filter: true,
        resizable: true,
      }}
      onCellValueChanged={(params) => {
        console.log('Cell value changed:', params);
      }}
    />
  );
};

export default EtsGridEditorTestPage;
