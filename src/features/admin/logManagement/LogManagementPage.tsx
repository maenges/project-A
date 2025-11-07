import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import PageTemplate from '@/components/Teamplate/PageTemplate';
import dayjs, { Dayjs } from 'dayjs';
import { useRef, useState } from 'react';
import { useActivate } from 'react-activation';
import { useCommonOptionsStore } from '@/store/commonCodes';
import { useNotify } from '@/hooks/useNotify';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { ColDef } from 'ag-grid-community';
import { EtsButton } from '@/components/EtsCommon';
import { searchForm } from '@/assets/style';
import { callApi, Method } from '@/utils';
import { Service } from '@/models/common/Service';
import {
  EtsAutoCompleteComponent,
  EtsDatePickerComponent,
  EtsInputComponent,
  EtsSelectComponent,
} from '@/components/EtsComponents';
import { TYPE } from '@/models/common/CommonSelectCodes';

// 타입 정의
type FormValues = {
  startDate: string;
  endDate: string;
  fltNo: string;
  dep: string;
  type: string;
  userId: string;
};

interface LogData {
  fltId: string;
  schDepDt: string;
  schArvDt: string;
  actDepDt: string;
  actArvDt: string;
  fltNum: string;
  stnfr: string;
  stnto: string;
  sactyp: string;
  regno: string;
  cleansingType: string;
  fieldName: string;
  originalValue: string;
  cleanedValue: string;
  userId: string;
  createdAt: string;
  rowNum?: number;
}

const LogManagementPage = () => {
  const [rowData, setRowData] = useState<LogData[]>([]);
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());
  const [totalCount, setTotalCount] = useState(0);

  const gridRef = useRef<EtsGridRef<LogData>>(null);

  const { toast } = useNotify();

  const airportData = useCommonOptionsStore((s) => s.airportOptions);

  const typeData = TYPE;

  // useForm
  const { control, handleSubmit, watch, setFocus } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      startDate: dayjs().startOf('month').format('YYYYMMDD'),
      endDate: endRangeDate?.format('YYYYMMDD'),
      fltNo: '',
      dep: 'ALL',
      type: TYPE[0].value,
      userId: '',
    },
  });

  const getAirportLabel = (value: string) => {
    if (value === 'ALL') return '';
    const option = airportData.find((opt) => opt.value === value);
    return option?.label || '';
  };

  // KeepAlive 페이지 활성화 시 상태 초기화
  useActivate(() => {
    // 데이터가 있으면 재조회 실행
    if (rowData.length > 0) {
      handleSubmit(onSubmit)();
    }
  });

  // onSubmit - 데이터 직접 fetch 및 rowData 설정
  const onSubmit: SubmitHandler<FormValues> = async () => {
    const queryParams = {
      startDate: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
      endDate: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
      fltNum: watch('fltNo') === '' ? '' : watch('fltNo'),
      stnfr: getAirportLabel(watch('dep')) === 'ALL' ? '' : getAirportLabel(watch('dep')),
      stnto: '',
      cleansingType: watch('type') === 'all' ? '' : watch('type'),
      userId: watch('userId') === '' ? '' : watch('userId'),
    };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/admin/cleansing-log',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        return;
      }
      // 행 번호를 추가한 데이터 설정
      const dataWithRowNum = res.data.map((item: LogData, index: number) => ({
        ...item,
        rowNum: index + 1,
      }));
      setRowData(dataWithRowNum);

      // Total count
      const totalCount = res.ItemCount ?? 0;
      setTotalCount(totalCount);
    });
  };

  /**
   * @description 폼 유효성 검사 실패 시 첫 번째 에러 필드로 포커스를 이동시키는 함수 (setFocus 사용)
   */
  const onInvalid = (errors: FieldErrors<FormValues>) => {
    const errorKeys = Object.keys(errors) as Array<keyof FormValues>;
    const firstErrorField = errorKeys[0];

    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  };

  const columnDefs: ColDef[] = [
    EtsColumnPreset.TextPreset({
      field: 'rowNum',
      headerName: 'No',
      cellDataType: 'number',
      width: 100,
    }),
    {
      field: 'actDepDt',
      headerName: 'ATD',
      cellDataType: 'text',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY-MM-DD');
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'fltNum',
      headerName: 'FLT No',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'stnfr',
      headerName: 'DEP',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'cleansingType',
      headerName: 'Type',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fieldName',
      headerName: 'Field',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'originalValue',
      headerName: 'Before',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'cleanedValue',
      headerName: 'After',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'userId',
      headerName: 'User ID',
      flex: 1,
    }),
    {
      field: 'createdAt',
      headerName: 'Create At',
      cellDataType: 'text',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  const searchComponent = (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <searchForm.Container>
        {/* first */}
        <searchForm.Row>
          <EtsDatePickerComponent
            control={control}
            startDate={startRangeDate}
            endDate={endRangeDate}
            setStartDate={setStartRangeDate}
            setEndDate={setEndRangeDate}
          />
          <EtsInputComponent
            control={control}
            name="fltNo"
            label="FLT No"
            placeholder="검색어를 입력해주세요."
            onlyNumber
            maxLength={4}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="dep"
            label="Dep"
            options={airportData}
          />
          <EtsSelectComponent control={control} name="type" label="Type" options={typeData} />
          <EtsInputComponent
            control={control}
            name="userId"
            label="User ID"
            placeholder="검색어를 입력해주세요."
          />
        </searchForm.Row>
      </searchForm.Container>
      {/* Search */}
      <searchForm.ButtonContainer>
        <searchForm.Row sx={{ justifyContent: 'flex-end' }}>
          <EtsButton
            type="blue"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Search
          </EtsButton>
        </searchForm.Row>
      </searchForm.ButtonContainer>
    </form>
  );

  return (
    <>
      <PageTemplate
        title="Log Management"
        searchComponent={searchComponent}
        columnDefs={columnDefs}
        rowData={rowData}
        totalCount={totalCount}
        gridRef={gridRef}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
      />
    </>
  );
};

export default LogManagementPage;
