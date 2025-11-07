import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import PageTemplate from '@/components/Teamplate/PageTemplate';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { useActivate } from 'react-activation';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@/utils';
import { ColDef } from 'ag-grid-community';
import { EtsButton } from '@/components/EtsCommon';
import { useNotify } from '@/hooks/useNotify';
import {
  airportLabeldOption,
  countryLabeldOption,
  useCommonOptionsStore,
} from '@/store/commonCodes';
import { searchForm, buttonForm } from '@/assets/style';
import { EtsAutoCompleteComponent } from '@/components/EtsComponents';

// 타입 정의
type FormValues = {
  region: string;
  country: string;
  airport: string;
};

interface AirportData {
  id: number;
  regionId: number;
  countryId: number;
  country: string;
  airport: string;
  iataPort: string;
  icaoPort: string;
  etsLat: string;
  etsLon: string;
  operationYn: boolean;
}

const AirportPage = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [rowData, setRowData] = useState<AirportData[]>([]);
  const gridRef = useRef<EtsGridRef<AirportData>>(null);

  const regionData = useCommonOptionsStore((s) => s.regionOptions);
  const countryData = useCommonOptionsStore((s) => s.countryOptions);
  const airportData = useCommonOptionsStore((s) => s.airportOptions);

  const { toast } = useNotify();

  // useState의 초기값을 스토어의 'ALL'
  const [countryOptions, setCountryOptions] = useState<countryLabeldOption[]>(
    countryData.length > 0 ? [countryData[0]] : []
  );
  const [airportOptions, setAirportOptions] = useState<airportLabeldOption[]>(
    airportData.length > 0 ? [airportData[0]] : []
  );

  const [isCountryDisabled, setIsCountryDisabled] = useState(true);
  const [isAirportDisabled, setIsAirportDisabled] = useState(true);
  const [isEditable, setIsEditable] = useState(false);

  // useForm
  const { control, handleSubmit, watch, setValue, reset, setFocus } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      region: '',
      country: 'ALL',
      airport: 'ALL',
    },
  });

  const filteredRegionData = useMemo(
    () => regionData.filter((option) => option.value !== 'ALL'),
    [regionData]
  );

  const watchedRegion = watch('region');
  const watchedCountry = watch('country');

  // 컴포넌트가 다시 활성화될 때 편집 상태 초기화 및 재조회
  useActivate(() => {
    // 편집 상태 초기화
    if (isEditable) {
      setIsEditable(false);
    }

    // 데이터가 있으면 재조회 실행
    if (rowData.length > 0) {
      handleSubmit(onSubmit)();
    }
  });

  useEffect(() => {
    // 'ALL'이 제외된 region 데이터가 있고, 아직 폼에 region 값이 설정되지 않았다면
    if (filteredRegionData.length > 0) {
      reset({
        region: filteredRegionData[0].value, // 첫 번째 실제 Region 값으로 설정
        country: 'ALL',
        airport: 'ALL',
      });
    }
  }, [filteredRegionData, reset]);

  /**
   * @description Region 선택이 변경될 때 실행되는 로직
   */
  useEffect(() => {
    // Country 데이터가 없거나, Region 값이 아직 설정되지 않았다면 return
    if (!countryData || countryData.length === 0 || !watchedRegion) return;

    // 'ALL'을 제외한 나머지 목록에서 필터링합니다.
    const filtered = countryData.filter(
      (c) => c.value !== 'ALL' && Number(c.region) === Number(watchedRegion)
    );

    // Country 옵션을 설정하고 ('ALL' 옵션 포함) 활성화합니다.
    const allCountryOption = countryData[0]; // 스토어에서 'ALL' 객체 가져오기
    setCountryOptions([allCountryOption, ...filtered]);
    setIsCountryDisabled(false);

    // 하위 필드인 Country와 Airport를 'ALL'로 초기화합니다.
    setValue('country', 'ALL', { shouldValidate: true });
    setValue('airport', 'ALL', { shouldValidate: true });

    // Airport 옵션도 'ALL'만 남기고 비활성화합니다.
    if (airportData.length > 0) {
      setAirportOptions([airportData[0]]);
    }
    setIsAirportDisabled(true);
  }, [watchedRegion, setValue, countryData, airportData]);

  /**
   * @description Country 선택이 변경될 때 실행되는 로직
   */

  useEffect(() => {
    if (!airportData || airportData.length === 0) return;

    // 3. Airport 로직도 동일하게 스토어의 'ALL' 옵션을 기준으로 재구성합니다.
    const allAirportOption = airportData[0];

    if (isCountryDisabled || watchedCountry === 'ALL' || !watchedCountry) {
      setAirportOptions([allAirportOption]);
      setIsAirportDisabled(true);
    } else {
      const filtered = airportData.filter(
        (a) => a.value !== 'ALL' && Number(a.country) === Number(watchedCountry)
      );
      setAirportOptions([allAirportOption, ...filtered]);
      setIsAirportDisabled(false);
    }
    setValue('airport', 'ALL', { shouldValidate: true });
  }, [watchedCountry, isCountryDisabled, setValue, airportData]);

  // 검색 핸들러
  const onSubmit = async (data: FormValues) => {
    await performSearch(data);
  };

  const performSearch = async (data: FormValues) => {
    const queryParams = {
      region: Number(data.region),
      country: data.country === 'ALL' ? '' : Number(data.country),
      airport: data.airport === 'ALL' ? '' : Number(data.airport),
    };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/airport',
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
      const totalCount = res.TotalCount ?? 0;
      setTotalCount(totalCount);

      // 편집 모드 해제
      setIsEditable(false);
    });
  };

  /**
   * @description 폼 유효성 검사 실패 시 첫 번째 에러 필드로 포커스를 이동시키는 함수
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
      field: 'country',
      headerName: 'Country',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'airport',
      headerName: 'Airport',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'iataPort',
      headerName: 'IATA Code',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'icaoPort',
      headerName: 'ICAO Code',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'etsLat',
      headerName: 'Latitude',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'etsLon',
      headerName: 'Longitude',
      flex: 1,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'operationYn',
      headerName: 'Operation Y/N',
      editable: isEditable,
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      flex: 0,
      suppressKeyboardEvent: (_params) => {
        return !isEditable;
      },
      onCellClicked: (params) => {
        if (isEditable && gridRef.current?.api) {
          const newValue = !params.value;
          params.node.setDataValue('operationYn', newValue);
        }
      },
    }),
  ];

  // 검색 UI
  const searchComponent = (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <searchForm.Container>
        <searchForm.Row>
          <EtsAutoCompleteComponent
            control={control}
            name="region"
            label="Region"
            options={regionData}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="country"
            label="Country"
            options={countryOptions}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="airport"
            label="Airport"
            disabled={isAirportDisabled}
            options={airportOptions}
          />
        </searchForm.Row>
      </searchForm.Container>
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
   * @description Save 버튼 클릭 시 변경사항 저장
   */
  const handleSave = useCallback(async () => {
    const modifiedData = gridRef.current?.getRowsByStatus() || {
      delete: [],
      update: [],
      insert: [],
      all: [],
    };

    const updateData = modifiedData.update.map((item) => ({
      id: item.id,
      operationYn: item.operationYn,
    }));

    if (updateData.length === 0) {
      toast.info('변경된 데이터가 없습니다.');
      return;
    }

    try {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/v1/airport',
        method: Method.POST,
        params: {
          bodyParams: updateData,
        },
        config: { isLoading: true },
      });

      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg || '저장에 실패하였습니다.');
        return;
      }

      toast.success('저장되었습니다.');
      setIsEditable(false);
      await handleSubmit(onSubmit)(); // 저장 후 재조회
    } catch {
      toast.error('저장 중 오류가 발생했습니다.');
    }
  }, [toast, handleSubmit]);

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        {isEditable ? (
          <>
            <EtsButton
              type="grey"
              onClick={() => {
                if (gridRef.current) {
                  gridRef.current.api.stopEditing();
                }
                handleSubmit(onSubmit)();
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
                await handleSave();
              }}
            >
              Save
            </EtsButton>
          </>
        ) : (
          <>
            <EtsButton type="grey" onClick={() => setIsEditable(true)}>
              Edit
            </EtsButton>
          </>
        )}
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <PageTemplate
      title="Airport"
      searchComponent={searchComponent}
      buttonComponent={buttonComponent}
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
  );
};

export default AirportPage;
