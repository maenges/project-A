import { useState, useEffect, useMemo, useRef } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import PageTemplate from '@/components/Teamplate/PageTemplate';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import { ColDef } from 'ag-grid-community';
import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import { EtsButton } from '@/components/EtsCommon';
import { callApi, Method } from '@/utils';
import { Service } from '@/models/common/Service';
import { useNotify } from '@/hooks/useNotify';
import {
  airportLabeldOption,
  countryLabeldOption,
  useCommonOptionsStore,
} from '@/store/commonCodes';
import { buttonForm } from '@/assets/style';
import { EtsAutoCompleteComponent } from '@/components/EtsComponents';
import { useActivate } from 'react-activation';

// 스타일 컴포넌트
const BaseContainer = styled(Box)`
  display: flex;
  height: 96px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const FrameContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const GroupContainer = styled(Box)`
  width: 50px;
  height: 36px;
`;

const GroupContainerField = styled(Box)`
  display: inline-flex;
  height: 36px;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const GroupContainerFieldLabel = styled(Box)`
  display: flex;
  align-items: flex-start;
`;

const GroupComboBoxContainer = styled(Box)`
  width: 843px;
  height: 36px;
  display: flex;
  gap: 24px;
`;

const GroupComboBoxContainerField = styled(Box)`
  display: flex;
  width: 265px;
  height: 36px;
  align-items: center;
  gap: var(--spacing-16, 16px);
  flex-shrink: 0;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  align-self: stretch;
`;

// 타입 정의
type FormValues = {
  fromRegion: string;
  fromCountry: string;
  fromAirport: string;
  toRegion: string;
  toCountry: string;
  toAirport: string;
};

interface GcdData {
  fromCountry: string;
  fromAirport: string;
  toCountry: string;
  toAirport: string;
  gcd: string;
  gcdEts: string;
}

const GCDPage = () => {
  // 상태 관리
  const [rowData, setRowData] = useState<GcdData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const gridRef = useRef<EtsGridRef<GcdData>>(null);

  const { toast } = useNotify();

  useActivate(() => {
    // 데이터가 있으면 재조회 실행
    if (rowData && rowData.length > 0) {
      handleSubmit(onSubmit)();
    }
  });

  const regionOptions = useMemo(
    () => useCommonOptionsStore.getState().regionOptions.filter((o) => o.value !== 'ALL'),
    []
  );
  const countryOptions = useMemo(
    () => useCommonOptionsStore.getState().countryOptions.filter((o) => o.value !== 'ALL'),
    []
  );
  const airportOptions = useMemo(
    () => useCommonOptionsStore.getState().airportOptions.filter((o) => o.value !== 'ALL'),
    []
  );

  // From 콤보박스 옵션 및 활성화 상태 관리
  const [countryFromOptions, setCountryFromOptions] = useState<countryLabeldOption[]>([]);
  const [airportFromOptions, setAirportFromOptions] = useState<airportLabeldOption[]>([]);
  const [isCountryFromDisabled, setIsCountryFromDisabled] = useState(true);
  const [isAirportFromDisabled, setIsAirportFromDisabled] = useState(true);

  // To 콤보박스 옵션 및 활성화 상태 관리
  const [countryToOptions, setCountryToOptions] = useState<countryLabeldOption[]>([]);
  const [airportToOptions, setAirportToOptions] = useState<airportLabeldOption[]>([]);
  const [isCountryToDisabled, setIsCountryToDisabled] = useState(true);
  const [isAirportToDisabled, setIsAirportToDisabled] = useState(true);

  const isInitialLoad = useRef(true);

  // useForm
  const { control, handleSubmit, watch, setValue, setFocus } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      fromRegion: '',
      fromCountry: '',
      fromAirport: '',
      toRegion: '',
      toCountry: '',
      toAirport: '',
    },
  });

  const watchedFromRegion = watch('fromRegion');
  const watchedFromCountry = watch('fromCountry');
  const watchedToRegion = watch('toRegion');
  const watchedToCountry = watch('toCountry');

  // 초기 화면 진입 시 ICN, JFK로 설정
  useEffect(() => {
    if (regionOptions.length > 0 && countryOptions.length > 0 && airportOptions.length > 0) {
      const icnAirport = airportOptions.find((a) => a.label === 'ICN');
      const icnCountry = countryOptions.find((c) => c.value === String(icnAirport?.country));
      const icnRegion = regionOptions.find((r) => r.value === String(icnCountry?.region));

      const jfkAirport = airportOptions.find((a) => a.label === 'JFK');
      const jfkCountry = countryOptions.find((c) => c.value === String(jfkAirport?.country));
      const jfkRegion = regionOptions.find((r) => r.value === String(jfkCountry?.region));

      if (icnAirport && icnCountry && icnRegion && jfkAirport && jfkCountry && jfkRegion) {
        // From 설정
        setCountryFromOptions(countryOptions.filter((c) => c.region === icnCountry.region));
        setAirportFromOptions(airportOptions.filter((a) => a.country === icnAirport.country));
        setValue('fromRegion', icnRegion.value);
        setValue('fromCountry', icnCountry.value);
        setValue('fromAirport', icnAirport.value);
        setIsCountryFromDisabled(false);
        setIsAirportFromDisabled(false);

        // To 설정
        setCountryToOptions(countryOptions.filter((c) => c.region === jfkCountry.region));
        setAirportToOptions(airportOptions.filter((a) => a.country === jfkAirport.country));
        setValue('toRegion', jfkRegion.value);
        setValue('toCountry', jfkCountry.value);
        setValue('toAirport', jfkAirport.value);
        setIsCountryToDisabled(false);
        setIsAirportToDisabled(false);

        setTimeout(() => {
          isInitialLoad.current = false;
        }, 0);
      }
    }
  }, [airportOptions, countryOptions, regionOptions, setValue]);

  // From Region 변경 시
  useEffect(() => {
    if (isInitialLoad.current || !watchedFromRegion) return;

    const filtered = countryOptions.filter((c) => Number(c.region) === Number(watchedFromRegion));
    setCountryFromOptions(filtered);
    setIsCountryFromDisabled(false);

    // 필터링된 국가 목록의 첫 번째 값을 기본으로 설정
    if (filtered.length > 0) {
      setValue('fromCountry', filtered[0].value, { shouldValidate: true });
    } else {
      setValue('fromCountry', '', { shouldValidate: true }); // 목록이 없으면 초기화
      setIsAirportFromDisabled(true);
    }
  }, [watchedFromRegion, setValue, countryOptions]);

  // To Region 변경 시
  useEffect(() => {
    if (isInitialLoad.current || !watchedToRegion) return;

    const filtered = countryOptions.filter((c) => Number(c.region) === Number(watchedToRegion));
    setCountryToOptions(filtered);
    setIsCountryToDisabled(false);

    // 필터링된 국가 목록의 첫 번째 값을 기본으로 설정
    if (filtered.length > 0) {
      setValue('toCountry', filtered[0].value, { shouldValidate: true });
    } else {
      setValue('toCountry', '', { shouldValidate: true });
      setIsAirportToDisabled(true);
    }
  }, [watchedToRegion, setValue, countryOptions]);

  // From Country 변경 시
  useEffect(() => {
    if (isInitialLoad.current || !watchedFromCountry) return;

    const filtered = airportOptions.filter((a) => Number(a.country) === Number(watchedFromCountry));
    setAirportFromOptions(filtered);
    setIsAirportFromDisabled(false);

    // 필터링된 공항 목록의 첫 번째 값을 기본으로 설정
    if (filtered.length > 0) {
      setValue('fromAirport', filtered[0].value, { shouldValidate: true });
    } else {
      setValue('fromAirport', '', { shouldValidate: true });
    }
  }, [watchedFromCountry, setValue, airportOptions]);

  // To Country 변경 시
  useEffect(() => {
    if (isInitialLoad.current || !watchedToCountry) return;

    const filtered = airportOptions.filter((a) => Number(a.country) === Number(watchedToCountry));
    setAirportToOptions(filtered);
    setIsAirportToDisabled(false);

    // 필터링된 공항 목록의 첫 번째 값을 기본으로 설정
    if (filtered.length > 0) {
      setValue('toAirport', filtered[0].value, { shouldValidate: true });
    } else {
      setValue('toAirport', '', { shouldValidate: true });
    }
  }, [watchedToCountry, setValue, airportOptions]);

  // 검색 핸들러
  const onSubmit = async (data: FormValues) => {
    const queryParams = {
      fromAirportId: Number(data.fromAirport),
      toAirportId: Number(data.toAirport),
    };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/gcd',
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
      const itemCount = res.ItemCount ?? 0;
      setTotalCount(itemCount);
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
      field: 'fromCountry',
      headerName: 'From Country',
      headerClass: 'bg-orange',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fromAirport',
      headerName: 'From Airport',
      headerClass: 'bg-orange',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'toCountry',
      headerName: 'To Country',
      headerClass: 'bg-red',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'toAirport',
      headerName: 'To Airport',
      headerClass: 'bg-red',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'gcd',
      headerName: 'GCD',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'gcdEts',
      headerName: 'GCD for ETS',
      flex: 1,
    }),
  ];

  const searchComponent = (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <BaseContainer>
        {/* From */}
        <FrameContainer>
          <GroupContainer>
            <GroupContainerField>
              <GroupContainerFieldLabel>
                <Typography className="label-sm">From :</Typography>
              </GroupContainerFieldLabel>
            </GroupContainerField>
          </GroupContainer>
          {/*From Region */}
          <GroupComboBoxContainer>
            <GroupComboBoxContainerField>
              <EtsAutoCompleteComponent
                control={control}
                name="fromRegion"
                label="Region"
                options={regionOptions}
              />
            </GroupComboBoxContainerField>
            {/*From Country */}
            <GroupComboBoxContainerField>
              <EtsAutoCompleteComponent
                control={control}
                name="fromCountry"
                label="Country"
                disabled={isCountryFromDisabled}
                options={countryFromOptions}
              />
            </GroupComboBoxContainerField>
            {/*From Airport */}
            <GroupComboBoxContainerField>
              <EtsAutoCompleteComponent
                control={control}
                name="fromAirport"
                label="Airport"
                disabled={isAirportFromDisabled}
                options={airportFromOptions}
              />
            </GroupComboBoxContainerField>
          </GroupComboBoxContainer>
        </FrameContainer>
        {/* To */}
        <FrameContainer>
          <GroupContainer>
            <GroupContainerField>
              <GroupContainerFieldLabel>
                <Typography className="label-sm">To :</Typography>
              </GroupContainerFieldLabel>
            </GroupContainerField>
          </GroupContainer>
          {/*To Region */}
          <GroupComboBoxContainer>
            <GroupComboBoxContainerField>
              <EtsAutoCompleteComponent
                control={control}
                name="toRegion"
                label="Region"
                options={regionOptions}
              />
            </GroupComboBoxContainerField>
            {/*To Country */}
            <GroupComboBoxContainerField>
              <EtsAutoCompleteComponent
                control={control}
                name="toCountry"
                label="Country"
                disabled={isCountryToDisabled}
                options={countryToOptions}
              />
            </GroupComboBoxContainerField>
            {/*To Airport */}
            <GroupComboBoxContainerField>
              <EtsAutoCompleteComponent
                control={control}
                name="toAirport"
                label="Airport"
                disabled={isAirportToDisabled}
                options={airportToOptions}
              />
            </GroupComboBoxContainerField>
          </GroupComboBoxContainer>
        </FrameContainer>
      </BaseContainer>
      {/* Search */}
      <ButtonContainer>
        <buttonForm.Row>
          <EtsButton
            type="blue"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Search
          </EtsButton>
        </buttonForm.Row>
      </ButtonContainer>
    </form>
  );

  return (
    <>
      <PageTemplate
        title="GCD"
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

export default GCDPage;
