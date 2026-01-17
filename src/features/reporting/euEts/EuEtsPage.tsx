import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import PageTemplate from '@/components/Teamplate/PageTemplate';
import { Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useActivate } from 'react-activation';
import styled from 'styled-components';
import { DOM_INT, PAX_CGO } from '@/models/common/CommonSelectCodes';
import { useCommonOptionsStore } from '@/store/commonCodes';
import { useNotify } from '@/hooks/useNotify';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { ColDef } from 'ag-grid-community';
import {
  EtsButton,
  EtsExport,
  EtsExportButton,
  EtsExportButtonOption,
} from '@/components/EtsCommon';
import { searchForm, buttonForm } from '@/assets/style';
import { callApi, callApiForFile, Method } from '@/utils';
import { Service } from '@/models/common/Service';
import {
  EtsAutoCompleteComponent,
  EtsDatePickerComponent,
  EtsSelectComponent,
  EtsYearSelectComponent,
} from '@/components/EtsComponents';

// ButtonFrame과 Tab 관련 스타일드 컴포넌트 (페이지별로 다를 수 있어서 남겨둠)
const ButtonFrame = styled(Box)`
  display: flex;
  align-items: flex-end;
  gap: 40px;
`;

// 타입 정의
type FormValues = {
  year: string;
  startDate: string;
  endDate: string;
  domInt: string;
  region: string;
  dep: string;
  arr: string;
  acType: string;
  fltType: string;
  country: string;
};

interface EuData {
  etsYear: string;
  sactyp: string;
  depIataPort: string;
  depIcaoPort: string;
  arrIataPort: string;
  arrIcaoPort: string;
  fltCnt: number;
  fltTime: number;
  gcdQ: number;
  fuelCons: number;
  emissionFactor: string;
  emission: number;
}

const EuEtsPage = () => {
  const [rowData, setRowData] = useState<EuData[]>([]);
  const [airportEtsYears, setAirportEtsYears] = useState([]);
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());
  const [totalCount, setTotalCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const gridRef = useRef<EtsGridRef<EuData>>(null);

  const { toast } = useNotify();

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

  const acTypeData = useCommonOptionsStore((s) => s.acTypeOptions);
  const regionData = useCommonOptionsStore((s) => s.regionAllOptions);
  const airportData = useCommonOptionsStore((s) => s.airportOptions);
  const countryData = useCommonOptionsStore((s) => s.countryOptions);

  // 누락된 옵션 변수들 정의
  const domInt = DOM_INT;
  const fltType = PAX_CGO;

  // useForm
  const { control, handleSubmit, watch, setValue, setFocus } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      year: dayjs().format('YYYY'),
      startDate: startRangeDate?.format('YYYYMMDD'),
      endDate: endRangeDate?.format('YYYYMMDD'),
      domInt: DOM_INT[0].value,
      region: 'ALL',
      dep: 'ALL',
      arr: 'ALL',
      acType: 'ALL',
      fltType: PAX_CGO[0].value,
      country: 'ALL',
    },
  });

  const regionValue = watch('region');

  const getAirportLabel = (value: string) => {
    if (value === 'ALL') return '';
    const option = airportData.find((opt) => opt.value === value);
    return option?.label || '';
  };

  // KeepAlive 페이지 활성화 시 상태 초기화
  useActivate(() => {
    // 데이터가 있으면 재조회 실행
    if (rowData && rowData.length > 0) {
      handleSubmit(onSubmit)();
    }
  });

  const getQueryParams = () => {
    const baseParams = {
      etsYear: watch('year'),
      startDate: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
      endDate: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
      domInt: watch('domInt') === 'all' ? '' : watch('domInt'),
      region: watch('region') === 'ALL' ? '' : Number(watch('region')),
      stnfr: getAirportLabel(watch('dep')) === 'ALL' ? '' : getAirportLabel(watch('dep')),
      stnto: getAirportLabel(watch('arr')) === 'ALL' ? '' : getAirportLabel(watch('arr')),
      sactyp: watch('acType') === 'ALL' ? '' : watch('acType'),
      fltType: watch('fltType') === 'all' ? '' : watch('fltType'),
      country: watch('country') === 'ALL' ? '' : Number(watch('country')),
      calcType: 'METHODB',
      type: 'EU_ETS',
    };

    return baseParams;
  };

  // onSubmit - 데이터 직접 fetch 및 rowData 설정
  const onSubmit: SubmitHandler<FormValues> = async () => {
    setHasSearched(true);

    const queryParams = getQueryParams();

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/reporting/euets',
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
      setRowData(res.data);

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
      field: 'etsYear',
      headerName: 'ETS Year',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C Type',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'depIataPort',
      headerName: 'Dep IATA',
      headerClass: 'bg-orange',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'depIcaoPort',
      headerName: 'Dep ICAO',
      headerClass: 'bg-orange',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'arrIataPort',
      headerName: 'Arr IATA',
      headerClass: 'bg-red',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'arrIcaoPort',
      headerName: 'Arr ICAO',
      headerClass: 'bg-red',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fltCnt',
      headerName: 'FLT Count',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fltTime',
      headerName: `FLT Time`,
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'gcdQ',
      headerName: 'GCD',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 2,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelCons',
      headerName: 'Fuel Cons (t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'emissionFactor',
      headerName: 'EF',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'emission',
      headerName: 'Emission (t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
  ];

  const searchComponent = (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <searchForm.Container>
        {/* first */}
        <searchForm.Row>
          <EtsYearSelectComponent
            control={control}
            name="year"
            label="ETS Year"
            onChange={(event, field) => {
              const value = event.target.value;
              field.onChange(value);
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
          <EtsSelectComponent control={control} name="domInt" label="Dom/Int" options={domInt} />
          <EtsAutoCompleteComponent
            control={control}
            name="region"
            label="Region"
            options={regionData}
            onChange={(_e, v) => {
              // Region이 'ALL'이 아닌 특정 지역으로 변경되면 Dep와 Arr을 'ALL'로 초기화
              if (v !== 'ALL') {
                setValue('dep', 'ALL');
                setValue('arr', 'ALL');
              }
            }}
          />
          <EtsSelectComponent control={control} name="fltType" label="FLT Type" options={fltType} />
          <EtsAutoCompleteComponent
            control={control}
            name="acType"
            label="A/C Type"
            options={acTypeData}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="dep"
            label="Dep"
            options={airportData}
            disabled={regionValue !== 'ALL'}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="arr"
            label="Arr"
            options={airportData}
            disabled={regionValue !== 'ALL'}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="country"
            label="Country"
            options={countryData}
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

  /**
   * @description Summary Excel 다운로드
   */
  const handleSummaryExport = async () => {
    // 조회한 데이터가 없으면 다운로드 불가
    if (!hasSearched || rowData.length === 0) {
      toast.error('조회된 데이터가 없습니다. 먼저 검색을 해주세요.');
      return;
    }

    try {
      const currentDate = dayjs().format('YYYYMMDD');
      const fileName = `${currentDate}_eu_ets.xlsx`;

      EtsExport({
        gridRef,
        fileName: fileName,
      });
    } catch {
      toast.error('다운로드에 실패하였습니다. 잠시 후 다시 시도해주세요');
    }
  };

  /**
   * @description Reporting Excel 다운로드
   */
  const handleReportExport = async () => {
    const queryParams = getQueryParams();

    callApiForFile({
      service: Service.POSTMAN,
      url: '/api/v1/reporting/euets/report/excel',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
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

  /**
   * @description Raw Data Excel 다운로드
   */
  const handleRawDataExport = async () => {
    const queryParams = getQueryParams();

    callApiForFile({
      service: Service.POSTMAN,
      url: '/api/v1/reporting/euets/raw/excel',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
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

  // Export 옵션 정의
  const exportOptions: EtsExportButtonOption[] = [
    {
      value: 'summary',
      label: 'Summary',
      onClick: handleSummaryExport,
    },
    {
      value: 'reporting',
      label: 'Reporting',
      onClick: handleReportExport,
    },
    {
      value: 'rawdata',
      label: 'Raw Data',
      onClick: handleRawDataExport,
    },
  ];

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <ButtonFrame>
          <EtsExportButton
            options={exportOptions}
            disabled={!hasSearched} // 검색 후에만 활성화
          >
            Export
          </EtsExportButton>
        </ButtonFrame>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <>
      <PageTemplate
        title="EU ETS"
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
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

export default EuEtsPage;
