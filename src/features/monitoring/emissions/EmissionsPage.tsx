import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import { Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { RefObject, useRef, useState } from 'react';
import { useActivate } from 'react-activation';
import styled from 'styled-components';
import { SERVICE, DOM_INT, PAX_CGO } from '@/models/common/CommonSelectCodes';
import { useCommonOptionsStore } from '@/store/commonCodes';
import { useNotify } from '@/hooks/useNotify';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import {
  EtsExportButton,
  EtsExportButtonOption,
  EtsButton,
  EtsTabs,
  EtsButtonTabs,
  EtsExport,
} from '@/components/EtsCommon';
import TabSearchArea from '@/components/Teamplate/TabSearchArea';
import TabBottomArea from '@/components/Teamplate/TabBottomArea';
import { searchForm, buttonForm } from '@/assets/style';
import {
  EtsAutoCompleteComponent,
  EtsDatePickerComponent,
  EtsSelectComponent,
} from '@/components/EtsComponents';
import { callApi, callApiForFile, Method } from '@/utils';
import { Service } from '@/models/common/Service';

// 스타일 컴포넌트
const ButtonFrame = styled(Box)`
  display: flex;
  align-items: flex-end;
  gap: 40px;
`;

// 타입 정의
type FormValues = {
  startDate: string;
  endDate: string;
  domInt: string;
  region: string;
  dep: string;
  arr: string;
  acType: string;
  fltType: string;
  service: string;
  selectedTab: string;
  type: string;
};

interface T1Data {
  sactyp: string;
  stnfr: string;
  stnto: string;
  fltCnt: number;
  fltTime: number;
  gcd: number;
  fuelCons: number;
  emissionFactor: string;
  emission: number;
}

interface T2Data {
  sactyp: string;
  stnfr: string;
  stnto: string;
  fltTime: number;
  ltoCnt: number;
  ttlFuelCons: number;
  ltoFuelConsKg: number;
  ltoFuelCons: number;
  cruiseFuelCons: number;
  ltoEmissionFactor: number;
  cruiseEmissionFactor: number;
  ltoEmission: number;
  cruiseEmission: number;
  totalEmission: number;
}

interface UnitData {
  sactyp: string;
  stnfr: string;
  stnto: string;
  bodyType: string;
  fltCnt: number;
  fltTime: number;
  fuelCons: number;
  paxFrEmission: number;
  paxPrEmission: number;
  paxPyEmission: number;
  paxEyEmission: number;
  cgoEmission: number;
  ttlEmission: number;
}

const EmissionsPage = () => {
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs()); // 오늘 날짜로 초기화

  const [rowT1Data, setRowT1Data] = useState<T1Data[]>([]);
  const [rowT2Data, setRowT2Data] = useState<T2Data[]>([]);
  const [rowUnitData, setRowUnitData] = useState<UnitData[]>([]);

  const gridRefT1 = useRef<EtsGridRef<T1Data>>(null);
  const gridRefT2 = useRef<EtsGridRef<T2Data>>(null);
  const gridRefUnit = useRef<EtsGridRef<UnitData>>(null);

  const [totalT1Count, setTotalT1Count] = useState(0);
  const [totalT2Count, setTotalT2Count] = useState(0);
  const [totalUnitCount, setTotalUnitCount] = useState(0);

  const [activeTabT1Type, setActiveTabT1Type] = useState<string>('CORSIA'); // 탭 버튼 상태 추가
  const [activeTabT2Type, setActiveTabT2Type] = useState<string>('CO2eq'); // 탭 버튼 상태 추가

  const tabList = [
    { label: 'Tier 1 Emission Summary', value: 'Tier1' },
    { label: 'Tier 2 Emission Summary', value: 'Tier2' },
    { label: 'Unit Emission Summary', value: 'Unit' },
  ];

  // Total 데이터를 위한 state 추가
  const [hasSearched, setHasSearched] = useState(false); // 검색 여부 추가

  const { toast } = useNotify();

  const acTypeData = useCommonOptionsStore((s) => s.acTypeOptions);
  const regionData = useCommonOptionsStore((s) => s.regionAllOptions);
  const airportData = useCommonOptionsStore((s) => s.airportOptions);

  // 누락된 옵션 변수들 정의
  const domInt = DOM_INT;
  const fltType = PAX_CGO;
  const service = SERVICE;

  // useForm
  const { control, handleSubmit, watch, setValue, setFocus } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      startDate: dayjs().startOf('month').format('YYYYMMDD'),
      endDate: endRangeDate?.format('YYYYMMDD'),
      domInt: DOM_INT[0].value,
      region: 'ALL',
      dep: 'ALL',
      arr: 'ALL',
      acType: 'ALL',
      fltType: PAX_CGO[0].value,
      service: SERVICE[0].value,
      selectedTab: tabList[0].value,
      type: activeTabT1Type, // 기본값을 Tier1 타입으로 설정
    },
  });

  const tab = watch('selectedTab');
  const regionValue = watch('region');

  const getLabel = (value: string) => {
    if (value === 'ALL') return '';
    const option = airportData.find((opt) => opt.value === value);
    return option?.label || '';
  };

  // KeepAlive 페이지 활성화 시 현재 탭의 데이터 재조회
  useActivate(() => {
    const currentTab = watch('selectedTab');

    // 현재 탭에 데이터가 있으면 재조회 실행
    const hasData =
      (currentTab === 'Tier1' && rowT1Data.length > 0) ||
      (currentTab === 'Tier2' && rowT2Data.length > 0) ||
      (currentTab === 'Unit' && rowUnitData.length > 0);

    if (hasData) {
      handleSubmit(onSubmit)();
    }
  });

  // 공통 query params 생성 함수
  const getQueryParams = () => {
    const currentTab = watch('selectedTab');
    let typeValue = '';

    // 탭 버튼
    const formTypeValue = watch('type');
    if (currentTab === 'Tier1') {
      typeValue = formTypeValue || activeTabT1Type;
    } else if (currentTab === 'Tier2') {
      typeValue = formTypeValue || activeTabT2Type;
    }

    const baseParams = {
      startDate: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
      endDate: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
      sactyp: watch('acType') === 'ALL' ? '' : watch('acType'),
      stnfr: getLabel(watch('dep')) === 'ALL' ? '' : getLabel(watch('dep')),
      stnto: getLabel(watch('arr')) === 'ALL' ? '' : getLabel(watch('arr')),
      fltType: watch('fltType') === 'all' ? '' : watch('fltType'),
      domInt: watch('domInt') === 'all' ? '' : watch('domInt'),
      region: watch('region') === 'ALL' ? '' : Number(watch('region')),
      svc: watch('service') === 'all' ? '' : watch('service'),
    };

    // T1, T2 탭일 때만 tab 파라미터 추가
    if (watch('selectedTab') !== 'Unit') {
      return {
        ...baseParams,
        type: typeValue,
      };
    }

    return baseParams;
  };

  // T1 데이터 fetch 함수
  const fetchT1Data = async () => {
    const queryParams = getQueryParams();

    return callApi({
      service: Service.POSTMAN,
      url: '/api/v1/emission-summary/tier1',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowT1Data([]);
        setTotalT1Count(0);
        return;
      }
      setRowT1Data(res.data);

      // Total count
      const totalCount = res.ItemCount ?? 0;
      setTotalT1Count(totalCount);
    });
  };

  // T2 데이터 fetch 함수
  const fetchT2Data = async () => {
    const queryParams = getQueryParams();

    return callApi({
      service: Service.POSTMAN,
      url: '/api/v1/emission-summary/tier2',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowT2Data([]);
        setTotalT2Count(0);
        return;
      }
      setRowT2Data(res.data);

      // Total count
      const totalCount = res.ItemCount ?? 0;
      setTotalT2Count(totalCount);
    });
  };

  // Unit 데이터 fetch 함수
  const fetchUnitData = async () => {
    const queryParams = getQueryParams();

    return callApi({
      service: Service.POSTMAN,
      url: '/api/v1/emission-summary/unit',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowUnitData([]);
        setTotalUnitCount(0);
        return;
      }
      setRowUnitData(res.data);

      // Total count
      const totalCount = res.ItemCount ?? 0;
      setTotalUnitCount(totalCount);
    });
  };

  // onSubmit - 현재 탭에 따라 적절한 데이터 fetch
  const onSubmit: SubmitHandler<FormValues> = async () => {
    setHasSearched(true);

    try {
      const currentTab = watch('selectedTab');

      switch (currentTab) {
        case 'Tier1':
          await fetchT1Data();
          break;
        case 'Tier2':
          await fetchT2Data();
          break;
        case 'Unit':
          await fetchUnitData();
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

  const columnT1Defs: ColDef[] = [
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C Type',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'stnfr',
      headerName: 'Dep',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'stnto',
      headerName: 'Arr',
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
      headerName: 'FLT Time',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'gcd',
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
      headerName: 'Emission Factor (3.15)',
      flex: 1,
      cellDataType: 'text',
      context: {
        formatType: 'number',
      },
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

  // Tier2 컬럼 정의를 함수로 변경하여 동적으로 생성
  const getColumnT2Defs = (): (ColDef | ColGroupDef)[] => {
    // CH4, N2O 선택 시 단위를 kg로, 그 외는 t로 표시
    const isKgUnit = activeTabT2Type === 'CH4' || activeTabT2Type === 'N2O';
    const emissionUnit = isKgUnit ? 'kg' : 't';
    const ltoHeaderName = isKgUnit ? 'LTO' : 'LTO (t)';
    const cruiseHeaderName = isKgUnit ? 'Cruise' : 'Cruise (t)';

    return [
      EtsColumnPreset.TextPreset({
        field: 'sactyp',
        headerName: 'A/C Type',
        cellDataType: 'text',
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'stnfr',
        headerName: 'Dep',
        cellDataType: 'text',
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'stnto',
        headerName: 'Arr',
        cellDataType: 'text',
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'fltTime',
        headerName: 'FLT Time',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'ltoCnt',
        headerName: 'LTO Count',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
        },
      }),
      {
        headerName: 'Fuel Cons (t)',
        headerClass: 'bg-orange',
        children: [
          EtsColumnPreset.TextPreset({
            field: 'ttlFuelCons',
            headerName: 'Total',
            headerClass: 'bg-orange',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 3,
            },
          }),
          EtsColumnPreset.TextPreset({
            field: 'ltoFuelConsKg',
            headerName: '/ LTO (kg)',
            headerClass: 'bg-orange',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 3,
            },
          }),
          EtsColumnPreset.TextPreset({
            field: 'ltoFuelCons',
            headerName: 'LTO',
            headerClass: 'bg-orange',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 3,
            },
          }),
          EtsColumnPreset.TextPreset({
            field: 'cruiseFuelCons',
            headerName: 'Cruise',
            headerClass: 'bg-orange',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 3,
            },
          }),
        ],
      },
      {
        headerName: 'Emission Factor (kg)',
        headerClass: 'bg-red',
        children: [
          EtsColumnPreset.TextPreset({
            field: 'ltoEmissionFactor',
            headerName: 'LTO',
            headerClass: 'bg-red',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 3,
            },
          }),
          EtsColumnPreset.TextPreset({
            field: 'cruiseEmissionFactor',
            headerName: 'Cruise',
            headerClass: 'bg-red',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
            },
          }),
        ],
      },
      {
        headerName: `Emission (${emissionUnit})`,
        headerClass: 'bg-teal',
        children: [
          EtsColumnPreset.TextPreset({
            field: 'ltoEmission',
            headerName: ltoHeaderName,
            headerClass: 'bg-teal',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 3,
            },
          }),
          EtsColumnPreset.TextPreset({
            field: 'cruiseEmission',
            headerName: cruiseHeaderName,
            headerClass: 'bg-teal',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 3,
            },
          }),
          EtsColumnPreset.TextPreset({
            field: 'totalEmission',
            headerName: 'Total',
            headerClass: 'bg-teal',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 3,
            },
          }),
        ],
      },
    ];
  };

  const columnUnitDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C Type',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'stnfr',
      headerName: 'Dep',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'stnto',
      headerName: 'Arr',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'bodyType',
      headerName: 'Body Type',
      cellDataType: 'text',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fltCnt',
      headerName: 'FLT\nCount',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fltTime',
      headerName: 'FLT\nTime',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
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
    {
      headerName: 'Emission (kg)',
      headerClass: 'bg-orange',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'paxFrEmission',
          headerName: 'Pax (FR)',
          headerClass: 'bg-orange',
          flex: 1,
          cellDataType: 'number',
          context: {
            formatType: 'number',
            decimalPlaces: 3,
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'paxPrEmission',
          headerName: 'Pax (PR)',
          headerClass: 'bg-orange',
          flex: 1,
          cellDataType: 'number',
          context: {
            formatType: 'number',
            decimalPlaces: 3,
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'paxPyEmission',
          headerName: 'Pax (PY)',
          headerClass: 'bg-orange',
          flex: 1,
          cellDataType: 'number',
          context: {
            formatType: 'number',
            decimalPlaces: 3,
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'paxEyEmission',
          headerName: 'Pax (EY)',
          headerClass: 'bg-orange',
          flex: 1,
          cellDataType: 'number',
          context: {
            formatType: 'number',
            decimalPlaces: 3,
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'cgoEmission',
          headerName: 'CGO (t)',
          headerClass: 'bg-orange',
          flex: 1,
          cellDataType: 'number',
          context: {
            formatType: 'number',
            decimalPlaces: 3,
          },
        }),
      ],
    },
    EtsColumnPreset.TextPreset({
      field: 'ttlEmission',
      headerName: 'Emission (t)',
      headerClass: 'bg-teal',
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
            name="acType"
            label="A/C Type"
            options={acTypeData}
          />
          <EtsSelectComponent control={control} name="fltType" label="FLT Type" options={fltType} />
          <EtsSelectComponent control={control} name="service" label="Service" options={service} />
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

  // API URL 매핑
  const getApiUrl = (currentTab: string) => {
    const baseUrls = {
      Tier1: '/api/v1/emission-summary/tier1/export',
      Tier2: '/api/v1/emission-summary/tier2/export',
      Unit: '/api/v1/emission-summary/unit/export',
    };
    return baseUrls[currentTab as keyof typeof baseUrls] || baseUrls.Tier1;
  };

  // Export 함수들
  const handleSummaryExport = async () => {
    const currentTab = watch('selectedTab');

    // 현재 탭에 따라 적절한 데이터와 gridRef 선택
    let currentRowData: any[] = [];
    let currentGridRef: RefObject<any> | null = null;

    switch (currentTab) {
      case 'Tier1':
        currentRowData = rowT1Data;
        currentGridRef = gridRefT1;
        break;
      case 'Tier2':
        currentRowData = rowT2Data;
        currentGridRef = gridRefT2;
        break;
      case 'Unit':
        currentRowData = rowUnitData;
        currentGridRef = gridRefUnit;
        break;
      default:
        currentRowData = rowT1Data;
        currentGridRef = gridRefT1;
        break;
    }

    // 조회한 데이터가 없으면 다운로드 불가
    if (!hasSearched || currentRowData.length === 0) {
      toast.error('조회된 데이터가 없습니다. 먼저 검색을 해주세요.');
      return;
    }

    try {
      const currentDate = dayjs().format('YYYYMMDD');
      const fileName = `${currentDate}_emission_summary_${currentTab}.xlsx`;

      EtsExport({
        gridRef: currentGridRef,
        fileName: fileName,
      });
    } catch {
      toast.error('다운로드에 실패하였습니다. 잠시 후 다시 시도해주세요');
    }
  };

  const handleRawDataExport = async () => {
    const currentTab = watch('selectedTab');
    const queryParams = getQueryParams();

    try {
      const res = await callApiForFile({
        service: Service.POSTMAN,
        url: getApiUrl(currentTab),
        method: Method.GET,
        params: {
          queryParams,
        },
        config: { isLoading: true },
      });

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
    } catch {
      toast.error('다운로드에 실패하였습니다. 잠시 후 다시 시도해주세요');
    }
  };

  /**
   * @description Tab 버튼 클릭 시 - 새로 검색 실행
   */
  const handleTabClick = async (tabType: string) => {
    const currentTab = watch('selectedTab');

    // 현재 탭에 따라 적절한 상태 업데이트
    if (currentTab === 'Tier1') {
      setActiveTabT1Type(tabType);
    } else if (currentTab === 'Tier2') {
      setActiveTabT2Type(tabType);
    }

    setValue('type', tabType);

    // 검색된 데이터가 있거나 현재 탭에 데이터가 있으면 다시 검색
    const hasCurrentTabData =
      (currentTab === 'Tier1' && rowT1Data.length > 0) ||
      (currentTab === 'Tier2' && rowT2Data.length > 0) ||
      (currentTab === 'Unit' && rowUnitData.length > 0);

    if (hasSearched || hasCurrentTabData) {
      handleSubmit(onSubmit)(); // 새 탭으로 다시 검색
    }
  };

  // Tier2 Type 옵션
  const Tier2Tabs = [
    { label: 'CO2eq', value: 'CO2eq' },
    { label: 'CO2', value: 'CO2' },
    { label: 'CH4', value: 'CH4' },
    { label: 'N2O', value: 'N2O' },
    { label: 'NOx', value: 'NOx' },
    { label: 'CO', value: 'CO' },
    { label: 'NMVOC', value: 'NMVOC' },
    { label: 'SO2', value: 'SO2' },
  ];

  // Tier1 Type 옵션
  const Tier1Tabs = [
    { label: 'CORSIA', value: 'CORSIA' },
    { label: 'EU-ETS', value: 'EU_ETS' },
    { label: 'UK-ETS', value: 'UK_ETS' },
    { label: 'ReFuelEU', value: 'REFUEL_EU' },
  ];

  // Export 옵션 정의
  const exportOptions: EtsExportButtonOption[] = [
    {
      value: 'summary',
      label: 'Summary',
      onClick: handleSummaryExport,
    },
    {
      value: 'rawdata',
      label: 'Raw Data',
      onClick: handleRawDataExport,
    },
  ];

  const tabComponent = (
    <EtsTabs
      tabs={tabList}
      value={watch('selectedTab')}
      onChange={(setSelectedTab) => {
        setValue('selectedTab', setSelectedTab);

        // 탭 변경 시 해당 탭의 활성 타입으로 form 값 설정
        if (setSelectedTab === 'Tier1') {
          setValue('type', activeTabT1Type);
        } else if (setSelectedTab === 'Tier2') {
          setValue('type', activeTabT2Type);
        }

        // 탭 변경 시 검색 상태는 유지 (데이터가 있으면 계속 조회 가능하도록)
      }}
      sx={{ mb: 1 }}
    />
  );

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <ButtonFrame>
          {tab === 'Tier1' && (
            <EtsButtonTabs
              activeTab={activeTabT1Type}
              onTabClick={handleTabClick}
              tabs={Tier1Tabs}
            />
          )}
          {tab === 'Tier2' && (
            <EtsButtonTabs
              activeTab={activeTabT2Type}
              onTabClick={handleTabClick}
              tabs={Tier2Tabs}
            />
          )}
          <EtsExportButton options={exportOptions} disabled={!hasSearched}>
            Export
          </EtsExportButton>
        </ButtonFrame>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  const mainComponent = (
    <Box>
      <TabSearchArea title="Emissions Summary" searchComponent={searchComponent} />
      {tabComponent}
      <TabBottomArea
        visible={tab === 'Tier1'}
        gridRef={gridRefT1}
        columnDefs={columnT1Defs}
        rowData={rowT1Data}
        totalCount={totalT1Count}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
        size="md"
      />
      <TabBottomArea
        visible={tab === 'Tier2'}
        gridRef={gridRefT2}
        columnDefs={getColumnT2Defs()}
        rowData={rowT2Data}
        totalCount={totalT2Count}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
        size="md"
      />
      <TabBottomArea
        visible={tab === 'Unit'}
        gridRef={gridRefUnit}
        columnDefs={columnUnitDefs}
        rowData={rowUnitData}
        totalCount={totalUnitCount}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
        size="md"
      />
    </Box>
  );

  return <Box>{mainComponent}</Box>;
};

export default EmissionsPage;
