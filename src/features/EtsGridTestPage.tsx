import { useState, useRef } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { ColDef, ITooltipParams } from 'ag-grid-community';
import { EtsGrid, EtsGridRef } from '../components/EtsGrid';
import EtsTooltipComponent from '../components/EtsGrid/helper/EtsTooltipComponent';

interface TestData {
  id: number;
  name: string;
  age: number;
  email: string;
}

const EtsGridTestPage = () => {
  const gridRef = useRef<EtsGridRef<TestData>>(null);

  const [rowData, setRowData] = useState<TestData[]>([
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
    { id: 4, name: '김철수', age: 28, email: 'kim@naver.com' },
  ]);

  // 커스텀 툴팁 컴포넌트
  const CustomTooltipComponent = (props: ITooltipParams) => {
    return <EtsTooltipComponent content={props.value || ''} />;
  };

  const columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      headerClass: 'bg-orange',
      cellClass: 'bg-teal',
      filter: 'agTextColumnFilter',
      // 기본 브라우저 툴팁 (title 속성)
      tooltipField: 'id',
      headerTooltip: 'ID 컬럼입니다',
    },
    {
      field: 'name',
      headerName: '이름',
      width: 150,
      editable: true,
      headerClass: 'bg-red',
      cellClass: 'bg-orange',
      filter: 'agTextColumnFilter',
      // 커스텀 툴팁
      tooltipComponent: CustomTooltipComponent,
      tooltipValueGetter: (params) => `이름: ${params.value}\n클릭하여 편집할 수 있습니다`,
      headerTooltip: '사용자 이름 (편집 가능)',
    },
    {
      field: 'age',
      headerName: '나이',
      width: 100,
      editable: true,
      cellClass: 'bg-mint',
      // 나이에 따른 동적 툴팁 메시지
      tooltipComponent: (params: ITooltipParams) => {
        const age = params.value;
        let message = `나이: ${age}세\n`;
        if (age < 20) {
          message += '10대입니다';
        } else if (age >= 65) {
          message += '시니어입니다';
        } else if (age >= 40) {
          message += '중년입니다';
        } else {
          message += '젊은 나이입니다';
        }
        return <EtsTooltipComponent content={message} />;
      },
      headerTooltip: '나이 정보 (나이대별 다른 메시지)',
    },
    {
      field: 'email',
      headerName: '이메일',
      width: 200,
      editable: true,
      flex: 1,
      cellClass: 'bg-red',
      // 커스텀 툴팁 컴포넌트로 상세 정보 표시
      tooltipComponent: CustomTooltipComponent,
      tooltipValueGetter: (params) =>
        `이메일: ${params.value}: ${params.value?.split('@')[1] || ''}\n편집 가능한 필드입니다`,
      headerTooltip: '이메일 주소 (편집 가능)',
    },
  ];

  const handleAddRow = () => {
    const newId = Math.max(...rowData.map((r) => r.id)) + 1;
    gridRef.current?.addRow({
      id: newId,
      name: '',
      age: 0,
      email: '',
    });
  };

  const handleDeleteSelected = () => {
    gridRef.current?.deleteBySelectedRowsWithModal();
  };

  const handleShowModifiedData = () => {
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
    setRowData([
      { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
      { id: 4, name: '김철수', age: 28, email: 'kim@naver.com' },
      { id: 5, name: '이영희', age: 42, email: 'lee@gmail.com' },
      { id: 6, name: 'Alice Wonder', age: 22, email: 'alice@company.co.kr' },
    ]);
  };

  const handleLoadTooltipTestData = () => {
    setRowData([
      {
        id: 1,
        name: 'Very Long Name That Should Show Tooltip',
        age: 18,
        email: 'very.long.email.address@extremely.long.domain.name.com',
      },
      { id: 2, name: '아주 긴 한글 이름 툴팁 테스트', age: 45, email: 'test@한글도메인.kr' },
      { id: 3, name: 'Short', age: 65, email: 'a@b.c' },
    ]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
        <Button variant="contained" onClick={handleAddRow}>
          행 추가
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteSelected}>
          선택 삭제
        </Button>
        <Button variant="outlined" onClick={handleShowModifiedData}>
          수정된 데이터 확인
        </Button>
        <Button variant="outlined" onClick={handleGetAllData}>
          전체 데이터 확인
        </Button>
        <Button variant="outlined" color="warning" onClick={handleClearData}>
          데이터 지우기 (No Data 테스트)
        </Button>
        <Button variant="outlined" color="success" onClick={handleLoadSampleData}>
          샘플 데이터 로드
        </Button>
        <Button variant="outlined" color="info" onClick={handleLoadTooltipTestData}>
          툴팁 테스트 데이터
        </Button>
      </Stack>

      <Stack sx={{ height: 400, width: '100%' }}>
        <EtsGrid
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          animateRows={true}
          onCellValueChanged={(event) => {
            console.log('Cell value changed:', event);
          }}
        />
      </Stack>
    </Box>
  );
};

export default EtsGridTestPage;
