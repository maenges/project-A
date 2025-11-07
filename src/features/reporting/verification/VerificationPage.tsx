import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import { Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useActivate } from 'react-activation';
import styled from 'styled-components';
import { DOM_INT, PAX_CGO, SEG } from '@/models/common/CommonSelectCodes';
import { useCommonOptionsStore } from '@/store/commonCodes';
import { useNotify } from '@/hooks/useNotify';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import {
  EtsYearSelectComponent,
  EtsDatePickerComponent,
  EtsSelectComponent,
  EtsAutoCompleteComponent,
  EtsInputComponent,
} from '@/components/EtsComponents';
import TabSearchArea from '@/components/Teamplate/TabSearchArea';
import TabBottomArea from '@/components/Teamplate/TabBottomArea';
import { searchForm, buttonForm } from '@/assets/style';
import { callApi, Method } from '@/utils';
import { Service } from '@/models/common/Service';
import { EtsButton, EtsButtonTabs, EtsTabs } from '@/components/EtsCommon';

// 스타일 컴포넌트
const ButtonFrame = styled(Box)`
  display: flex;
  align-items: flex-end;
  gap: 40px;
`;

const ButtonBoxFrame = styled(Box)`
  display: flex;
  width: 72px;
  height: 37px;
  align-items: flex-end;
  gap: 24px;
`;

// 타입 정의
type FormValues = {
  year: string;
  startDate: string;
  endDate: string;
  domInt: string;
  region: string;
  fltType: string;
  acType: string;
  dep: string;
  arr: string;
  country: string;
  fltNo: string;
  acReg: string;
  selectedTab: string;
  type: string;
  seg: string;
};

interface CorsiaData {
  etsYear: number;
  actDepDt: string;
  fltNum: string;
  sactyp: string;
  regno: string;
  depCountry: string;
  depIataPort: string;
  depIcaoPort: string;
  arrCountry: string;
  arrIataPort: string;
  arrIcaoPort: string;
  domInt: string;
  fuelType: string;
  rampFuelQ: number;
  remFuelQ: number;
  prvRemFuelQ: number;
  upliftFuelCons: number;
  offsetYn: string;
  fuelConsLbs: number;
  fuelConsTonn: number;
  emissionFactor: number;
  emission: number;
}

interface EuEtsData {
  etsYear: number;
  actDepDt: string;
  actArvDt: string;
  fltNum: string;
  sactyp: string;
  regno: string;
  depCountry: string;
  depIataPort: string;
  depIcaoPort: string;
  arrCountry: string;
  arrIataPort: string;
  arrIcaoPort: string;
  spcGrvtyQ: string;
  fuelConsKg: string;
  upliftFuelConsKg: string;
  remFuelQKg: string;
  prvRemFuelQKg: string;
}

interface UkEtsData {
  etsYear: number;
  actDepDt: string;
  actArvDt: string;
  fltNum: string;
  sactyp: string;
  regno: string;
  depCountry: string;
  depIataPort: string;
  depIcaoPort: string;
  arrCountry: string;
  arrIataPort: string;
  arrIcaoPort: string;
  spcGrvtyQ: number;
  fuelConsKg: number;
  upliftFuelConsKg: number;
  remFuelQKg: number;
  prvRemFuelQKg: number;
}

interface KeEtsData {
  actDepDt: string;
  actArvDt: string;
  fltNum: string;
  sactyp: string;
  regno: string;
  stnfr: string;
  stnto: string;
  actnid: string;
  fltTime: string;
  seg: string;
  prirfLbs: number;
  prirfTon: number;
  refuelQ: number;
  density: number;
  upliftLbs: number;
  upliftTon: number;
  rirfLbs: number;
  rirfTon: number;
  fuelConsTon: number;
  fuelConsKl: number;
  emissionCo2: number;
  emissionCh4: number;
  emissionN2o: number;
  tk: string;
  svc: string;
}

const VerificationPage = () => {
  const [airportEtsYears, setAirportEtsYears] = useState([]);
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs()); // 오늘 날짜로 초기화

  const [rowCorsiaData, setRowCorsiaData] = useState<CorsiaData[]>([]);
  const [rowEuEtsData, setRowEuEtsData] = useState<EuEtsData[]>([]);
  const [rowUkEtsData, setRowUkEtsData] = useState<UkEtsData[]>([]);
  const [rowKeEtsData, setRowKeEtsData] = useState<KeEtsData[]>([]);

  const gridRefCorsia = useRef<EtsGridRef<CorsiaData>>(null);
  const gridRefEuEts = useRef<EtsGridRef<EuEtsData>>(null);
  const gridRefUkEts = useRef<EtsGridRef<UkEtsData>>(null);
  const gridRefKeEts = useRef<EtsGridRef<KeEtsData>>(null);

  //total
  const [totalCorsiaCount, setTotalCorsiaCount] = useState(0);
  const [totalEuEtsCount, setTotalEuEtsCount] = useState(0);
  const [totalUkEtsCount, setTotalUkEtsCount] = useState(0);
  const [totalKeEtsCount, setTotalKeEtsCount] = useState(0);

  const [activeTabType, setActiveTabType] = useState<string>('BLOCK'); // 탭 버튼 상태 추가

  const tabList = [
    { label: 'CORSIA', value: 'CORSIA' },
    { label: 'EU ETS', value: 'EU_ETS' },
    { label: 'UK ETS', value: 'UK_ETS' },
    { label: 'K ETS', value: 'K_ETS' },
  ];

  // Total 데이터를 위한 state 추가
  const [hasSearched, setHasSearched] = useState(false); // 검색 여부 추가

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
  const seg = SEG;

  // useForm
  const { control, handleSubmit, watch, setValue, setFocus } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      year: dayjs().format('YYYY'),
      startDate: dayjs().startOf('month').format('YYYYMMDD'),
      endDate: endRangeDate?.format('YYYYMMDD'),
      domInt: DOM_INT[0].value,
      fltType: PAX_CGO[0].value,
      acType: 'ALL',
      region: 'ALL',
      dep: 'ALL',
      arr: 'ALL',
      country: 'ALL',
      fltNo: '',
      acReg: '',
      seg: SEG[0].value,
      selectedTab: tabList[0].value,
      type: activeTabType,
    },
  });

  const tab = watch('selectedTab');
  const regionValue = watch('region');

  const getAirportLabel = (value: string) => {
    if (value === 'ALL') return '';
    const option = airportData.find((opt) => opt.value === value);
    return option?.label || '';
  };

  // KeepAlive 페이지 활성화 시 현재 탭의 데이터 재조회
  useActivate(() => {
    const currentTab = watch('selectedTab');

    // 현재 탭에 데이터가 있으면 재조회 실행
    const hasData =
      (currentTab === 'CORSIA' && rowCorsiaData.length > 0) ||
      (currentTab === 'EU_ETS' && rowEuEtsData.length > 0) ||
      (currentTab === 'UK_ETS' && rowUkEtsData.length > 0) ||
      (currentTab === 'K_ETS' && rowKeEtsData.length > 0);

    if (hasData) {
      handleSubmit(onSubmit)();
    }
  });

  // 공통 query params 생성 함수
  const getQueryParams = (targetTab?: string) => {
    const currentTab = targetTab || watch('selectedTab');
    const formTypeValue = watch('type');

    const baseParams = {
      startDate: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
      endDate: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
      fltType: watch('fltType') === 'all' ? '' : watch('fltType'),
      sactyp: watch('acType') === 'ALL' ? '' : watch('acType'),
      stnfr: getAirportLabel(watch('dep')) === 'ALL' ? '' : getAirportLabel(watch('dep')),
      stnto: getAirportLabel(watch('arr')) === 'ALL' ? '' : getAirportLabel(watch('arr')),
      country: watch('country') === 'ALL' ? '' : Number(watch('country')),
      fltNum: watch('fltNo') === '' ? '' : watch('fltNo'),
      regno: watch('acReg') === '' ? '' : watch('acReg'),
    };

    // K_ETS 탭이 아닐 때만 etsYear 파라미터 추가
    if (currentTab !== 'K_ETS') {
      return {
        ...baseParams,
        etsYear: watch('year'),
        domInt: watch('domInt') === 'all' ? '' : watch('domInt'),
        region: watch('region') === 'ALL' ? '' : Number(watch('region')),
        type: currentTab,
        calcType: currentTab === 'CORSIA' ? formTypeValue : 'METHODB',
      };
    } else {
      return {
        ...baseParams,
        seg: watch('seg') === 'all' ? '' : watch('seg'),
      };
    }
  };

  // Corsia 데이터 fetch 함수
  const fetchCorsiaData = async () => {
    const queryParams = getQueryParams('CORSIA');

    return callApi({
      service: Service.POSTMAN,
      url: '/api/v1/verification/corsia',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowCorsiaData([]);
        setTotalCorsiaCount(0);
        return;
      }
      setRowCorsiaData(res.data);

      // Total count
      const totalCount = res.ItemCount ?? 0;
      setTotalCorsiaCount(totalCount);
    });
  };

  // EU ETS 데이터 fetch 함수
  const fetchEuEtsData = async () => {
    const queryParams = getQueryParams('EU_ETS');

    return callApi({
      service: Service.POSTMAN,
      url: '/api/v1/verification/euets',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowEuEtsData([]);
        setTotalEuEtsCount(0);
        return;
      }
      setRowEuEtsData(res.data);

      // Total count
      const totalCount = res.ItemCount ?? 0;
      setTotalEuEtsCount(totalCount);
    });
  };

  // UK ETS 데이터 fetch 함수
  const fetchUkEtsData = async () => {
    const queryParams = getQueryParams('UK_ETS');

    return callApi({
      service: Service.POSTMAN,
      url: '/api/v1/verification/ukets',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowUkEtsData([]);
        setTotalUkEtsCount(0);
        return;
      }
      setRowUkEtsData(res.data);

      // Total count
      const totalCount = res.ItemCount ?? 0;
      setTotalUkEtsCount(totalCount);
    });
  };

  // K ETS 데이터 fetch 함수
  const fetchKeEtsData = async () => {
    const queryParams = getQueryParams('K_ETS');

    return callApi({
      service: Service.POSTMAN,
      url: '/api/v1/verification/kets',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowKeEtsData([]);
        setTotalKeEtsCount(0);
        return;
      }
      setRowKeEtsData(res.data);

      // Total count
      const totalCount = res.ItemCount ?? 0;
      setTotalKeEtsCount(totalCount);
    });
  };

  // onSubmit - 현재 탭에 따라 적절한 데이터 fetch
  const onSubmit: SubmitHandler<FormValues> = async () => {
    setHasSearched(true);

    try {
      const currentTab = watch('selectedTab');

      switch (currentTab) {
        case 'CORSIA':
          await fetchCorsiaData();
          break;
        case 'EU_ETS':
          await fetchEuEtsData();
          break;
        case 'UK_ETS':
          await fetchUkEtsData();
          break;
        case 'K_ETS':
          await fetchKeEtsData();
          break;
        default:
      }
    } catch {
      toast.error('API 호출을 실패하였습니다.');
    }
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

  // 기본 CORSIA 컬럼 정의
  const baseColumnCorsiaDefs: ColDef[] = [
    EtsColumnPreset.TextPreset({
      field: 'etsYear',
      headerName: 'ETS Year',
      cellDataType: 'text',
      flex: 1,
    }),
    {
      field: 'actDepDt',
      headerName: 'Dep Date',
      cellDataType: 'text',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY.MM.DD');
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'fltNum',
      headerName: 'FLT No',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C\nType',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'regno',
      headerName: 'A/C Reg',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-orange',
      field: 'depCountry',
      headerName: 'Dep Country',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-orange',
      field: 'depIataPort',
      headerName: 'Dep',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-orange',
      field: 'depIcaoPort',
      headerName: 'Dep\nICAO',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-red',
      field: 'arrCountry',
      headerName: 'Arr Country',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-red',
      field: 'arrIataPort',
      headerName: 'Arr',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-red',
      field: 'arrIcaoPort',
      headerName: 'Arr\nICAO',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'domInt',
      headerName: 'Dom\n/Int',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelType',
      headerName: 'Fuel\nType',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'prvRemFuelQ',
      headerName: 'PRIRF\n(lbs)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'rampFuelQ',
      headerName: 'RORF\n(lbs)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'remFuelQ',
      headerName: 'RIRF\n(lbs)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'upliftFuelCons',
      headerName: 'Fuel Uplift\n(lbs)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 2,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelConsLbs',
      headerName: 'Fuel Cons\n(lbs)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelConsTonn',
      headerName: 'Fuel Cons\n(t)',
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
      headerName: 'Emission\n(t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'offsetYn',
      headerName: 'Offset',
      cellDataType: 'text',
      flex: 1,
    }),
  ];

  // 활성 탭에 따른 CORSIA 컬럼 정의
  const columnCorsiaDefs: ColDef[] = (() => {
    if (activeTabType === 'BLOCK') {
      // Block 탭: 'Fuel Uplift (lbs)', 'PRIRF (lbs)' 제외
      return baseColumnCorsiaDefs.filter(
        (column) => column.field !== 'upliftFuelCons' && column.field !== 'prvRemFuelQ'
      );
    } else if (activeTabType === 'METHODB') {
      // Method B 탭: 'RORF (lbs)' 제외
      return baseColumnCorsiaDefs.filter((column) => column.field !== 'rampFuelQ');
    } else if (activeTabType === 'UPLIFT') {
      // Fuel Uplift 탭: 'RORF (lbs)', 'RIRF (lbs)',  'PRIRF (lbs)'  제외
      return baseColumnCorsiaDefs.filter(
        (column) =>
          column.field !== 'rampFuelQ' &&
          column.field !== 'remFuelQ' &&
          column.field !== 'prvRemFuelQ'
      );
    }
    // 기본값: 모든 컬럼 표시
    return baseColumnCorsiaDefs;
  })();

  const columnEuEtsDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.TextPreset({
      field: 'etsYear',
      headerName: 'ETS Year',
      cellDataType: 'text',
      flex: 1,
    }),
    {
      field: 'actDepDt',
      headerName: 'Dep Time',
      cellDataType: 'text',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY.MM.DD');
      },
    },
    {
      field: 'actArvDt',
      headerName: 'Arr Time',
      cellDataType: 'text',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY.MM.DD');
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'fltNum',
      headerName: 'FLT No',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C\nType',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'regno',
      headerName: 'A/C Reg',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-orange',
      field: 'depCountry',
      headerName: 'Dep Country',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-orange',
      field: 'depIcaoPort',
      headerName: 'Dep\nICAO',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-red',
      field: 'arrIataPort',
      headerName: 'Arr Country',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-red',
      field: 'arrIcaoPort',
      headerName: 'Arr\nICAO',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'upliftFuelConsKg',
      headerName: 'Uplift\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 2,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'spcGrvtyQ',
      headerName: 'Density',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'prvRemFuelQKg',
      headerName: 'BOPF\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 2,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'remFuelQKg',
      headerName: 'BOCF\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 2,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelConsKg',
      headerName: 'Fuel Cons\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
  ];

  const columnUkEtsDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.TextPreset({
      field: 'etsYear',
      headerName: 'ETS Year',
      cellDataType: 'text',
      flex: 1,
    }),
    {
      field: 'actDepDt',
      headerName: 'Dep Time',
      cellDataType: 'text',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY.MM.DD');
      },
    },
    {
      field: 'actArvDt',
      headerName: 'Arr Time',
      cellDataType: 'text',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY.MM.DD');
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'fltNum',
      headerName: 'FLT No',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C\nType',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'regno',
      headerName: 'A/C Reg',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-orange',
      field: 'depIcaoPort',
      headerName: 'Dep\nICAO',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-red',
      field: 'arrIcaoPort',
      headerName: 'Arr\nICAO',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'upliftFuelConsKg',
      headerName: 'Uplift\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 2,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'spcGrvtyQ',
      headerName: 'Density',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'prvRemFuelQKg',
      headerName: 'BOPF\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 2,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'remFuelQKg',
      headerName: 'BOCF\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 2,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelConsKg',
      headerName: 'Fuel Cons\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
  ];

  const columnKeEtsDefs: (ColDef | ColGroupDef)[] = [
    {
      field: 'actDepDt',
      headerName: 'Dep Time',
      flex: 1,
      cellDataType: 'text',
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        // total row인 경우 또는 날짜가 아닌 문자열인 경우 그대로 반환
        if (
          params.value === 'Total' ||
          (typeof params.value === 'string' && !dayjs(params.value).isValid())
        ) {
          return params.value;
        }
        return dayjs(params.value).format('YYYY.MM.DD');
      },
    },
    {
      field: 'actArvDt',
      headerName: 'Arr Time',
      flex: 1,
      cellDataType: 'text',
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        // total row인 경우 또는 날짜가 아닌 문자열인 경우 그대로 반환
        if (
          params.value === 'Total' ||
          (typeof params.value === 'string' && !dayjs(params.value).isValid())
        ) {
          return params.value;
        }
        return dayjs(params.value).format('YYYY.MM.DD');
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'fltNum',
      headerName: 'FLT\nNo',
      flex: 1,
      cellDataType: 'text',
    }),
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C\nType',
      flex: 1,
      cellDataType: 'text',
    }),
    EtsColumnPreset.TextPreset({
      field: 'regno',
      headerName: 'A/C\nReg',
      flex: 1,
      cellDataType: 'text',
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-orange',
      field: 'stnfr',
      headerName: 'Dep',
      flex: 1,
      cellDataType: 'text',
    }),
    EtsColumnPreset.TextPreset({
      headerClass: 'bg-red',
      field: 'stnto',
      headerName: 'Arr',
      flex: 1,
      cellDataType: 'text',
    }),
    EtsColumnPreset.TextPreset({
      field: 'actnid',
      headerName: 'ACTNID',
      flex: 1,
      cellDataType: 'text',
    }),
    EtsColumnPreset.TextPreset({
      field: 'seg',
      headerName: 'Seg',
      flex: 1,
      cellDataType: 'text',
    }),
    EtsColumnPreset.TextPreset({
      field: 'prirfLbs',
      headerName: 'PRIRF\n(lbs)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'prirfTon',
      headerName: 'PRIRF\n(t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'density',
      headerName: 'Density',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 2,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'refuelQ',
      headerName: 'Uplift\n(gal)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'upliftLbs',
      headerName: 'Uplift\n(lbs)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'upliftTon',
      headerName: 'Uplift\n(t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'rirfLbs',
      headerName: 'RIRF\n(lbs)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'rirfTon',
      headerName: 'RIRF\n(t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelConsTon',
      headerName: 'Fuel Cons\n(t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelConsKl',
      headerName: 'Fuel Cons\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'emissionCo2',
      headerName: 'Emission CO2\n(t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'emissionCh4',
      headerName: 'Emission CH4\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'emissionN2o',
      headerName: 'Emission N20\n(kg)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'tk',
      headerName: 'TK',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'svc',
      headerName: 'Service',
      flex: 1,
      cellDataType: 'text',
    }),
  ];

  const searchComponent = (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <searchForm.Container>
        {/* first */}
        <searchForm.Row>
          {tab !== 'K_ETS' && (
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
          )}
          <EtsDatePickerComponent
            control={control}
            startDate={startRangeDate}
            endDate={endRangeDate}
            setStartDate={setStartRangeDate}
            setEndDate={setEndRangeDate}
          />
          {tab !== 'K_ETS' && (
            <EtsSelectComponent control={control} name="domInt" label="Dom/Int" options={domInt} />
          )}
          {tab !== 'K_ETS' && (
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
          )}
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
          {tab !== 'K_ETS' && (
            <EtsAutoCompleteComponent
              control={control}
              name="country"
              label="Country"
              options={countryData}
            />
          )}
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
          />
          {tab === 'K_ETS' && (
            <EtsSelectComponent control={control} name="seg" label="Seg" options={seg} />
          )}
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
   * @description Tab 버튼 클릭 시 - 새로 검색 실행
   */
  const handleTabClick = async (tabType: string) => {
    const currentTab = watch('selectedTab');

    // 현재 탭에 따라 적절한 상태 업데이트
    if (currentTab === 'CORSIA') {
      setActiveTabType(tabType);
    }

    setValue('type', tabType);

    // 검색된 데이터가 있거나 현재 탭에 데이터가 있으면 다시 검색
    const hasCurrentTabData =
      (currentTab === 'CORSIA' && rowCorsiaData.length > 0) ||
      (currentTab === 'EU_ETS' && rowEuEtsData.length > 0) ||
      (currentTab === 'UK_ETS' && rowUkEtsData.length > 0) ||
      (currentTab === 'K_ETS' && rowKeEtsData.length > 0);

    if (hasSearched || hasCurrentTabData) {
      try {
        // 현재 탭에 따라 직접 해당 API 호출
        switch (currentTab) {
          case 'CORSIA':
            await fetchCorsiaData();
            break;
          case 'EU_ETS':
            await fetchEuEtsData();
            break;
          case 'UK_ETS':
            await fetchUkEtsData();
            break;
          case 'K_ETS':
            await fetchKeEtsData();
            break;
          default:
        }
      } catch {
        toast.error('API 호출을 실패하였습니다.');
      }
    }
  };

  // 탭 옵션
  const corsiaTabs = [
    { label: 'Block', value: 'BLOCK' },
    { label: 'Method B', value: 'METHODB' },
    { label: 'Fuel Uplift', value: 'UPLIFT' },
  ];

  const tabComponent = (
    <EtsTabs
      tabs={tabList}
      value={watch('selectedTab')}
      onChange={(setSelectedTab) => {
        setValue('selectedTab', setSelectedTab);
        setHasSearched(false); // 탭 변경 시 검색 상태 리셋
      }}
      sx={{ mb: 1 }}
    />
  );
  // CORSIA 탭 버튼 렌더링
  const renderCorsiaTabButtons = () => (
    <EtsButtonTabs activeTab={activeTabType} onTabClick={handleTabClick} tabs={corsiaTabs} />
  );

  // 버튼 영역 렌더링
  const renderButtonArea = () => {
    if (tab === 'CORSIA') {
      return renderCorsiaTabButtons();
    }
    return <ButtonBoxFrame />;
  };

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <ButtonFrame>{renderButtonArea()}</ButtonFrame>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  const mainComponent = (
    <Box>
      <TabSearchArea title="Verification Data" searchComponent={searchComponent} />
      {tabComponent}
      <TabBottomArea
        visible={tab === 'CORSIA'}
        gridRef={gridRefCorsia}
        columnDefs={columnCorsiaDefs}
        rowData={rowCorsiaData}
        totalCount={totalCorsiaCount}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
        size="lg"
      />
      <TabBottomArea
        visible={tab === 'EU_ETS'}
        gridRef={gridRefEuEts}
        columnDefs={columnEuEtsDefs}
        rowData={rowEuEtsData}
        totalCount={totalEuEtsCount}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
        size="lg"
      />
      <TabBottomArea
        visible={tab === 'UK_ETS'}
        gridRef={gridRefUkEts}
        columnDefs={columnUkEtsDefs}
        rowData={rowUkEtsData}
        totalCount={totalUkEtsCount}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
        size="lg"
      />
      <TabBottomArea
        visible={tab === 'K_ETS'}
        gridRef={gridRefKeEts}
        columnDefs={columnKeEtsDefs}
        rowData={rowKeEtsData}
        totalCount={totalKeEtsCount}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
        size="md"
      />
    </Box>
  );

  return <Box>{mainComponent}</Box>;
};

export default VerificationPage;
