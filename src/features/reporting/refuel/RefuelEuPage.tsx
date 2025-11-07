import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, callApiForFile, Method } from '@utils/ApiUtil';
import { useCommonOptionsStore } from '@/store/commonCodes';
import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';
import { useActivate } from 'react-activation';

import {
  EtsButton,
  EtsExport,
  EtsExportButton,
  EtsExportButtonOption,
} from '@/components/EtsCommon';
import {
  EtsAutoCompleteComponent,
  EtsDatePickerComponent,
  EtsYearSelectComponent,
} from '@/components/EtsComponents';

type RefuelEu = {
  id: number;
  etsYear: number;
  airport: string;
  depIcao: string;
  fltCnt: number;
  fltTime: number;
  fuelReqYr: number;
  fuelUpliftYr: number;
  nonTankQYr: number;
  tankQYr: number;
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  year: string;
  dep: string;
};

const RefuelEuPage = () => {
  const columnDefs: ColDef[] = [
    EtsColumnPreset.IdPreset({
      field: 'id',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'etsYear',
      headerName: 'ETS Year',
      width: 196,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'airport',
      headerName: 'Airport',
      width: 250,
    }),
    EtsColumnPreset.TextPreset({
      field: 'depIcao',
      headerName: 'Dep ICAO',
      headerClass: 'bg-orange',
      width: 196,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fltCnt',
      headerName: 'FLT Count',
      width: 196,
      flex: 1,
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fltTime',
      headerName: 'FLT Time',
      width: 196,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelReqYr',
      headerName: 'Fuel Req Yr (t)',
      width: 196,
      flex: 1,
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelUpliftYr',
      headerName: 'Fuel Uplift Yr (t)',
      width: 196,
      flex: 1,
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'nonTankQYr',
      headerName: 'Non-Tank Q Yr (t)',
      width: 196,
      flex: 1,
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'tankQYr',
      headerName: 'Tank Q Yr (t)',
      width: 196,
      flex: 1,
      context: {
        formatType: 'number',
      },
    }),
  ];

  const getQueryParams = () => {
    const sendParams = {
      startDate: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
      endDate: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
      etsYear: watch('year') === 'ALL' ? '' : watch('year'),
      stnfr: watch('dep') === 'ALL' ? '' : watch('dep'),
    };

    return sendParams;
  };

  /**
   * @description RowData Excel 다운로드
   */
  const handleExport = () => {
    const queryParams = getQueryParams();

    callApiForFile({
      service: Service.POSTMAN,
      url: '/api/v1/reporting/refuel-eu/export',
      method: Method.GET,
      params: {
        queryParams,
      },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error('다운로드에 실패하였습니다. 잠시 후 다시 시도해주세요');
        return;
      }

      // S3 URL에서 파일 다운로드
      if (res.data) {
        const link = document.createElement('a');
        link.href = res.data;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const gridRef = useRef<EtsGridRef<RefuelEu>>(null);
  const { toast } = useNotify();
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs()); // 오늘 날짜로 초기화
  const [rowData, setRowData] = useState<RefuelEu[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  // const [selectedYear, setSelectedYear] = useState(dayjs().format('YYYY'));
  const [airportEtsYears, setAirportEtsYears] = useState([]);
  const airportOptions = useCommonOptionsStore((s) => s.airportOptions).filter(
    (item) => item.value !== '183'
  );

  useActivate(() => {
    // 데이터가 있으면 재조회 실행
    if (rowData && rowData.length > 0) {
      handleSubmit(onSearch)();
    }
  });

  // useEffect(() => {
  //   // year 값이 바뀌면 start/endRangeDate도 해당 연도로 맞춰줌
  //   setStartRangeDate(dayjs(`${selectedYear}-01-01`));
  //   setEndRangeDate(dayjs(`${selectedYear}-12-31`));
  // }, [selectedYear]);

  const exportOptions: EtsExportButtonOption[] = [
    {
      value: 'summary',
      label: 'Summary',
      onClick: () => {
        const currentDate = dayjs().format('YYYYMMDD');
        const fileName = `${currentDate}_refuel_eu_summary.xlsx`;
        EtsExport({
          gridRef,
          fileName,
        });
      },
    },
    {
      value: 'rawdata',
      label: 'Raw Data',
      onClick: handleExport,
    },
  ];

  useEffect(() => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/common/airport-ets-years',
      method: Method.GET,
      params: {},
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }
      setAirportEtsYears(res.data);
    });
  }, []);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      startDate: dayjs().startOf('month').format('YYYYMMDD'),
      endDate: endRangeDate?.format('YYYYMMDD'),
      year: dayjs().format('YYYY'),
      dep: 'ALL',
    },
  });

  const onSearch: SubmitHandler<FormValues> = async () => {
    const sendParams = getQueryParams();

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/reporting/refuel-eu',
      method: Method.GET,
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

  const searchComponent = (
    <form onSubmit={handleSubmit(onSearch)}>
      <searchForm.Container>
        <searchForm.Row>
          <EtsYearSelectComponent
            control={control}
            name="year"
            label="ETS Year"
            onChange={(event, field) => {
              const value = event.target.value;
              field.onChange(value);
              // setSelectedYear(value);
            }}
            list={airportEtsYears}
          />
          <EtsDatePickerComponent
            control={control}
            startDate={startRangeDate}
            endDate={endRangeDate}
            setStartDate={setStartRangeDate}
            setEndDate={setEndRangeDate}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="dep"
            label="Dep"
            options={airportOptions}
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
        <EtsExportButton options={exportOptions}>Export</EtsExportButton>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <PageTemplate
      title="ReFuelEU"
      gridRef={gridRef}
      columnDefs={columnDefs}
      searchComponent={searchComponent}
      buttonComponent={buttonComponent}
      rowData={rowData}
      totalCount={totalCount}
    />
  );
};
export default RefuelEuPage;
