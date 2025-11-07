import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef, ColumnState } from 'ag-grid-community';
import { Box } from '@mui/material';
import { useCommonOptionsStore } from '@/store/commonCodes';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
import { DOM_INT, PAX_CGO } from '@/models/common/CommonSelectCodes';
import {
  EtsButton,
  EtsButtonTabs,
  EtsExport,
  EtsExportButton,
  EtsExportButtonOption,
} from '@/components/EtsCommon';
import {
  EtsInputComponent,
  EtsSelectComponent,
  EtsAutoCompleteComponent,
  EtsDatePickerComponent,
} from '@/components/EtsComponents';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import dayjs, { Dayjs } from 'dayjs';
import { useActivate } from 'react-activation';

type Statistics = {
  groupId: number;
  itemName: string;
  unit: string;
  jan: number | null;
  feb: number | null;
  mar: number | null;
  apr: number | null;
  may: number | null;
  jun: number | null;
  jul: number | null;
  aug: number | null;
  sep: number | null;
  oct: number | null;
  nov: number | null;
  dec: number | null;
  mean: number | null;
  total: number | null;
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  domInt: string;
  region: string;
  dep: string;
  arr: string;
  acType: string;
  fltType: string;
  fltNo: string;
  acReg: string;
  tab: string;
};

const StatisticsPage = () => {
  const columnDefs: ColDef[] = [
    EtsColumnPreset.TextPreset({
      field: 'itemName',
      headerName: 'Division',
      width: 200,
      sortable: false,
      colSpan: (params: any) => {
        const maxCol = params.api.getColumnDefs().length;
        switch (params.data.groupId) {
          case 1:
            return params.data.itemName === '' ? maxCol : 1;
          case 2:
            return params.data.itemName === '' ? maxCol : 1;
          case 3:
            return params.data.itemName === '' ? maxCol : 1;
          default:
            return 1;
        }
      },
      cellClass: (params: any) => {
        let base = 'statistics-grid-font';
        switch (params.data.groupId) {
          case 1:
            return `${base} bg-orange`;
          case 2:
            return `${base} bg-red`;
          case 3:
            return `${base} bg-light-green`;
          default:
            return base;
        }
      },
      cellRenderer: (params: any) => {
        switch (params.data.groupId) {
          case 1:
            return params.data.itemName === '' ? <b>FLT</b> : params.value;
          case 2:
            return params.data.itemName === '' ? <b>Emission</b> : params.value;
          case 3:
            return params.data.itemName === '' ? <b>TK</b> : params.value;
          default:
            return;
        }
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'unit',
      headerName: '단위',
      width: 60,
      cellClass: 'statistics-grid-font',
      sortable: false,
    }),
    EtsColumnPreset.TextPreset({
      field: 'jan',
      headerName: '1월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'feb',
      headerName: '2월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'mar',
      headerName: '3월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'apr',
      headerName: '4월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'may',
      headerName: '5월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'jun',
      headerName: '6월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'jul',
      headerName: '7월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'aug',
      headerName: '8월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'sep',
      headerName: '9월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'oct',
      headerName: '10월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'nov',
      headerName: '11월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'dec',
      headerName: '12월',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'mean',
      headerName: 'Mean',
      width: 110,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
      cellClass: ['ag-right-aligned-cell', 'statistics-grid-font'],
    }),
    EtsColumnPreset.TextPreset({
      field: 'total',
      headerName: 'Total',
      cellClass: ['bg-green', 'ag-right-aligned-cell', 'statistics-grid-font', 'bold-cell'],
      width: 120,
      flex: 1,
      sortable: false,
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
  ];

  const gridRef = useRef<EtsGridRef<Statistics>>(null);
  const [rowData, setRowData] = useState<Statistics[]>([]);
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs()); // 오늘 날짜로 초기화
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs()); // 오늘 날짜로 초기화
  const [activeTab, setActiveTab] = useState<string>('ICAO');
  const { toast } = useNotify();

  const regionAllOptions = useCommonOptionsStore((s) => s.regionAllOptions);
  const actypeOptions = useCommonOptionsStore((s) => s.acTypeOptions);
  const airportOptions = useCommonOptionsStore((s) => s.airportOptions).filter(
    (item) => item.value !== '183'
  );

  useActivate(() => {
    // 데이터가 있으면 재조회 실행
    if (rowData.length > 0) {
      handleSubmit(onSearch)();
    }
  });

  const tkTabs = [
    { label: 'ICAO', value: 'ICAO' },
    { label: 'EU-ETS', value: 'EU-ETS' },
  ];

  const exportOptions: EtsExportButtonOption[] = [
    {
      value: 'summary',
      label: 'Summary',
      onClick: () => {
        const currentDate = dayjs().format('YYYYMMDD');
        const fileName = `${currentDate}_statistics_summary.xlsx`;
        EtsExport({
          gridRef,
          fileName,
        });
      },
    },
  ];

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      startDate: startRangeDate?.format('YYYYMM'),
      endDate: endRangeDate?.format('YYYYMM'),
      domInt: DOM_INT[0].value,
      region: regionAllOptions[0].value,
      dep: airportOptions[0].value,
      arr: airportOptions[0].value,
      acType: actypeOptions[0].value,
      fltType: PAX_CGO[0].value,
      fltNo: '',
      acReg: '',
      tab: activeTab,
    },
  });

  const applyActiveMonthColumns = () => {
    const months = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];
    const activeMonths = new Set<string>();

    if (startRangeDate && endRangeDate) {
      let current = startRangeDate.clone();
      while (current.isBefore(endRangeDate) || current.isSame(endRangeDate, 'month')) {
        activeMonths.add(months[current.month()]);
        current = current.add(1, 'month');
      }
    }

    // 2. 새로운 Column Definitions 생성
    const newColumnDefs = columnDefs.map((colDef) => {
      const field = colDef.field;
      // field가 월(month) 목록에 포함되는지 확인
      if (field && months.includes(field)) {
        // 활성화 목록에 있으면 보여주고, 없으면 숨김
        return { ...colDef, hide: !activeMonths.has(field) };
      }
      return colDef;
    });

    const columnState = newColumnDefs
      .map((colDef) => ({
        colId: colDef.field,
        hide: colDef.hide,
      }))
      .filter((state) => state.colId !== undefined) as ColumnState[];
    gridRef.current?.api.applyColumnState({ state: columnState, applyOrder: true });
  };

  const handleGridReady = () => {
    // 재조회시
    if (rowData.length > 0) {
      // 커스텀 컬럼헤더
      applyActiveMonthColumns();
    }
  };
  const onSearch: SubmitHandler<FormValues> = async () => {
    applyActiveMonthColumns();

    const getLabel = (value: string) => {
      if (value === 'ALL') return '';
      const option = airportOptions.find((opt) => opt.value === value);
      return option?.label || '';
    };

    // 조회 API 호출
    const sendParams = {
      startDate: startRangeDate ? startRangeDate.format('YYYYMM') : '',
      endDate: endRangeDate ? endRangeDate.format('YYYYMM') : '',
      domInt: watch('domInt') === 'all' ? '' : watch('domInt'),
      region: watch('region') === 'ALL' ? '' : Number(watch('region')),
      stnfr: getLabel(watch('arr')) === 'ALL' ? '' : getLabel(watch('arr')),
      stnto: getLabel(watch('dep')) === 'ALL' ? '' : getLabel(watch('dep')),
      sactyp: watch('acType') === 'ALL' ? '' : watch('acType'),
      fltType: watch('fltType') === 'all' ? '' : watch('fltType'),
      fltNo: watch('fltNo'),
      acReg: watch('acReg'),
      type: watch('tab'),
    };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/statistics',
      method: Method.GET,
      params: {
        queryParams: sendParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        return;
      }

      const rawData = res.data?.statisticsItems || [];
      // 1. 데이터를 groupId 별로 그룹화합니다.
      const groupedData = rawData.reduce(
        (acc: { [key: number]: Statistics[] }, current: Statistics) => {
          const groupId = current.groupId;
          if (!acc[groupId]) {
            acc[groupId] = [];
          }
          acc[groupId].push(current);
          return acc;
        },
        {}
      );

      // 2. 각 그룹에 헤더 행을 추가하고 하나의 배열로 합칩니다.
      const processedData = Object.values(groupedData as { [key: number]: Statistics[] }).flatMap(
        (group: Statistics[]) => {
          if (group.length > 0) {
            const headerRow: Statistics = {
              groupId: group[0].groupId,
              itemName: '', // cellRenderer에서 'FLT', 'Emission' 등으로 변환됩니다.
              unit: '',
              jan: null,
              feb: null,
              mar: null,
              apr: null,
              may: null,
              jun: null,
              jul: null,
              aug: null,
              sep: null,
              oct: null,
              nov: null,
              dec: null,
              mean: null,
              total: null,
            };
            return [headerRow, ...group];
          }
          return [];
        }
      );
      setRowData(processedData);
    });
  };

  const handleTabClick = async (tabType: string) => {
    setActiveTab(tabType);
    setValue('tab', tabType);

    // 검색된 데이터가 있을 때만 다시 검색
    if (rowData.length !== 0) {
      handleSubmit(onSearch)(); // 새 탭으로 다시 검색
    }
  };

  const searchComponent = (
    <form onSubmit={handleSubmit(onSearch)}>
      <searchForm.Container>
        <searchForm.Row>
          <EtsDatePickerComponent
            control={control}
            startDate={startRangeDate}
            endDate={endRangeDate}
            setStartDate={setStartRangeDate}
            setEndDate={setEndRangeDate}
            format="YYYY.MM"
            views={['year', 'month']}
            type="currentYear"
          />
          <EtsSelectComponent control={control} name="domInt" label="Dom/Int" options={DOM_INT} />
          <EtsSelectComponent
            control={control}
            name="region"
            label="Region"
            options={regionAllOptions}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="dep"
            label="Dep"
            options={airportOptions}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="arr"
            label="Arr"
            options={airportOptions}
          />
          <EtsSelectComponent
            control={control}
            name="acType"
            label="A/C type"
            options={actypeOptions}
          />
          <EtsSelectComponent control={control} name="fltType" label="FLT type" options={PAX_CGO} />
          <EtsInputComponent
            control={control}
            name="fltNo"
            label="FLT No"
            placeholder="검색어를 입력해주세요."
            onlyNumber
            maxLength={4}
          />
          <EtsInputComponent
            control={control}
            name="acReg"
            label="A/C Reg"
            placeholder="검색어를 입력해주세요."
            onlyNumber
            maxLength={4}
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
        <buttonForm.Frame>
          <EtsButtonTabs activeTab={activeTab} onTabClick={handleTabClick} tabs={tkTabs} />
          <EtsExportButton options={exportOptions} disabled={rowData.length === 0}>
            Export
          </EtsExportButton>
        </buttonForm.Frame>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  const subSelect = <Box />;

  return (
    <PageTemplate
      title="Statistics"
      searchComponent={searchComponent}
      buttonComponent={buttonComponent}
      columnDefs={columnDefs}
      rowData={rowData}
      gridRef={gridRef}
      subSelect={subSelect}
      onGridReady={handleGridReady}
      size="md"
    />
  );
};

export default StatisticsPage;
