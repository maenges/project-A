import { EtsButton } from '@/components/EtsCommon';
import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import { Service } from '@/models/common/Service';
import { useCommonOptionsStore } from '@/store/commonCodes';
import { callApi, Method } from '@/utils';
import PageTemplate from '@/components/Teamplate/PageTemplate';
import { ColDef } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs';
import { useRef, useState, useMemo } from 'react';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FlightDetailsModal from './FlightDetailsModal.tsx';
import { searchForm } from '@/assets/style';
import {
  EtsAutoCompleteComponent,
  EtsDatePickerComponent,
  EtsInputComponent,
} from '@/components/EtsComponents';
import { useActivate } from 'react-activation';

// 타입 정의
type FormValues = {
  startDate: string;
  endDate: string;
  dep: string;
  arr: string;
  fltNo: string;
};

interface FlightDetailData {
  fltId: string;
  actDepDt: string;
  actArvDt: string;
  actDepDtLoc: string;
  actArvDtLoc: string;
  arlnCd: string;
  fltNum: string;
  sactyp: string;
  acver: string;
  svc: string;
  regno: string;
  fltType: string;
  stnfr: string;
  stnto: string;
  depIcao: string;
  arvIcao: string;
  fuelUplift: string;
  fuelCons: string;
  paxCount: string;
}

interface FlightDetailModalData {
  fltId: string;
  prvRampInRemainFuel: string;
  prvRampInRemainFuelKg: string;
  rampOutRemainFuel: string;
  rampOutRemainFuelKg: string;
  rampInRemainFuel: string;
  rampInRemainFuelKg: string;
  fuelComsumptionCalc: string;
  fuelComsumptionCalcKg: string;
  fuelComsuptionFinal: string;
  fuelComsuptionFinalKg: string;
  routeMaximumValue: string;
  routeMaximumValueKg: string;
  fuelUpliftLbs: string;
  fuelUplift: string;
  fuelUpliftUnit: string;
  fuelDensity: string;
  fuelDensityUnit: string;
  adult: string;
  child: string;
  infant: string;
  positioningCrew: string;
  totalNumberPassenger: string;
  totalMassPassengerIcao: string;
  totalMassPassengerEuets: string;
  totalMassFreightMail: string;
  totalPassengerTkIcao: string;
  totalPassengerTkEuets: string;
  totalFreightTkIcao: string;
  totalFreightTkEuets: string;
  totalTkIcao: string;
  totalTkEuets: string;
  gcdIcao: string;
  gcdEuets: string;
}

const FlightDetailsPage = () => {
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs()); // 오늘 날짜로 초기화

  const [rowData, setRowData] = useState<FlightDetailData[]>([]);
  const gridRef = useRef<EtsGridRef<FlightDetailData>>(null);
  const [totalCount, setTotalCount] = useState(0);

  const [detailOpen, setDetailOpen] = useState(false);

  const [selectedRowData, setSelectedRowData] = useState<FlightDetailData | null>(null);
  const [detailData, setDetailData] = useState<FlightDetailModalData | null>(null);

  const airportData = useCommonOptionsStore((s) => s.airportOptions);
  const airportOptions = useMemo(() => {
    const seen = new Set<string>();
    const base = (airportData ?? [])
      .map((o: any) => ({ label: o.label, value: String(o.value) }))
      .filter((opt) => {
        const k = `${opt.value}|${opt.label}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

    return [{ label: 'ALL', value: 'ALL' }, ...base.filter((o) => o.value !== 'ALL')];
  }, [airportData]);

  // KeepAlive 페이지 활성화 시 상태 초기화
  useActivate(() => {
    // 데이터가 있으면 재조회 실행
    if (rowData && rowData.length > 0) {
      handleSubmit(onSubmit)();
    }
  });

  // dep과 arr의 label 값을 찾기
  const getLabel = (value: string) => {
    if (value === 'ALL') return '';
    const option = airportOptions.find((opt) => opt.value === value);
    return option?.label || '';
  };

  // useForm
  const { control, handleSubmit, watch, setFocus } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      startDate: dayjs().startOf('month').format('YYYYMMDD'),
      endDate: endRangeDate?.format('YYYYMMDD'),
      dep: 'ALL',
      arr: 'ALL',
      fltNo: '',
    },
  });

  // 검색 핸들러
  const onSubmit: SubmitHandler<FormValues> = async () => {
    const queryParams = {
      startDate: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
      endDate: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
      stnfr: getLabel(watch('dep')) === 'ALL' ? '' : getLabel(watch('dep')),
      stnto: getLabel(watch('arr')) === 'ALL' ? '' : getLabel(watch('arr')),
      fltnum: watch('fltNo') === '' ? '' : watch('fltNo'),
    };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/flight',
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

  /**
   * @description 모달 상세 데이터를 가져오는 함수
   */
  // const fetchDetailData = async (rowData: FlightDetailModalData) => {
  //   try {
  //     const res = await callApi({
  //       service: Service.POSTMAN,
  //       url: `/api/v1/flight/${rowData.fltId}`,
  //       method: Method.GET,
  //     });

  //     if (res.successOrNot === 'Y') {
  //       return res.data;
  //     }
  //   } catch {
  //     toast.error('상세 데이터 조회에 실패했습니다.');
  //   }
  // };

  /**
   * @description 그리드 셀 클릭 핸들러
   */
  // const onCellClicked = async (params: any) => {
  // const rowData = params.data as FlightDetailData;
  // const rowModalData = params.data as FlightDetailModalData;
  // if (rowData) {
  //   setSelectedRowData(rowData);

  //   // 상세 데이터 가져오기
  //   const fetchedDetailData = await fetchDetailData(rowModalData);
  //   setDetailData(fetchedDetailData); // 상세 데이터 상태 업데이트

  //   // 모달 열기
  // setDetailOpen(true);
  // }
  // };

  const columnDefs: ColDef[] = [
    {
      field: 'actDepDt',
      headerName: 'Dep Date',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY.MM.DD');
      },
    },
    {
      field: 'actArvDt',
      headerName: 'Arr Date',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY.MM.DD');
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C Type',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'regno',
      headerName: 'A/C Reg',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fltNum',
      headerName: 'FLT No',
      flex: 1,
      valueGetter: (params: any) => {
        const arlnCd = params.data?.arlnCd || '';
        const fltNum = params.data?.fltNum || '';
        return arlnCd + fltNum;
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fltType',
      headerName: 'FLT Type',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'stnfr',
      headerName: 'Dep',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'stnto',
      headerName: 'Arr',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelUplift',
      headerName: 'Fuel Uplift (t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 3,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelCons',
      headerName: 'Fuel Cons (t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'paxCount',
      headerName: 'PAX Cnt',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
  ];

  const detailModal = (selectedRowData || detailOpen) && (
    <FlightDetailsModal
      open={detailOpen}
      onClose={() => {
        setDetailOpen(false);
        setSelectedRowData(null);
        setDetailData(null); // 상세 데이터 초기화
      }}
      header={{
        fltNo: (selectedRowData?.arlnCd || '') + (selectedRowData?.fltNum || ''),
        date: selectedRowData?.actDepDt || '',
      }}
      flightInfo={{
        fltNo: (selectedRowData?.arlnCd || '') + (selectedRowData?.fltNum || ''),
        acReg: selectedRowData?.regno || '',
        fltType: selectedRowData?.fltType || '',
        svcType: selectedRowData?.svc || '',
        acType: selectedRowData?.sactyp || '',
        acVer: selectedRowData?.acver || '',
        dep: selectedRowData?.stnfr || '',
        depIcao: selectedRowData?.depIcao || '',
        depLoc: selectedRowData?.actDepDtLoc || '',
        depGmt: selectedRowData?.actDepDt || '',
        arr: selectedRowData?.stnto || '',
        arrIcao: selectedRowData?.arvIcao || '',
        arrLoc: selectedRowData?.actArvDtLoc || '',
        arrGmt: selectedRowData?.actArvDt || '',
      }}
      fuelConsumption={{
        prvRampInRemainFuel: detailData?.prvRampInRemainFuel ?? '0',
        prvRampInRemainFuelKg: detailData?.prvRampInRemainFuelKg ?? '0',
        rampOutRemainFuel: detailData?.rampOutRemainFuel ?? '0',
        rampOutRemainFuelKg: detailData?.rampOutRemainFuelKg ?? '0',
        rampInRemainFuel: detailData?.rampInRemainFuel ?? '0',
        rampInRemainFuelKg: detailData?.rampInRemainFuelKg ?? '0',
        fuelComsumptionCalc: detailData?.fuelComsumptionCalc ?? '0',
        fuelComsumptionCalcKg: detailData?.fuelComsumptionCalcKg ?? '0',
        fuelComsuptionFinal: detailData?.fuelComsuptionFinal ?? '0',
        fuelComsuptionFinalKg: detailData?.fuelComsuptionFinalKg ?? '0',
        routeMaximumValue: detailData?.routeMaximumValue ?? '0',
        routeMaximumValueKg: detailData?.routeMaximumValueKg ?? '0',
        fuelUpliftLbs: detailData?.fuelUpliftLbs ?? '0',
        fuelUplift: detailData?.fuelUplift ?? '0',
        fuelUpliftUnit: detailData?.fuelUpliftUnit ?? '',
        fuelDensity: detailData?.fuelDensity ?? '0',
        fuelDensityUnit: detailData?.fuelDensityUnit ?? '',
      }}
      tonneKilometer={{
        totalPassengerTkIcao: detailData?.totalPassengerTkIcao ?? '0',
        totalPassengerTkEuets: detailData?.totalPassengerTkEuets ?? '0',
        totalFreightTkIcao: detailData?.totalFreightTkIcao ?? '0',
        totalFreightTkEuets: detailData?.totalFreightTkEuets ?? '0',
        totalTkIcao: detailData?.totalTkIcao ?? '0',
        totalTkEuets: detailData?.totalTkEuets ?? '0',
      }}
      payload={{
        adult: detailData?.adult ?? '0',
        child: detailData?.child ?? '0',
        infant: detailData?.infant ?? '0',
        positioningCrew: detailData?.positioningCrew ?? '0',
        totalNumberPassenger: detailData?.totalNumberPassenger ?? '0',
        totalMassPassengerIcao: detailData?.totalMassPassengerIcao ?? '0',
        totalMassPassengerEuets: detailData?.totalMassPassengerEuets ?? '0',
        totalMassFreightMail: detailData?.totalMassFreightMail ?? '0',
      }}
      gcd={{
        gcdIcao: detailData?.gcdIcao ?? '0',
        gcdEuets: detailData?.gcdEuets ?? '0',
      }}
    />
  );

  const searchComponent = (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <searchForm.Container>
        <searchForm.Row>
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
          <EtsAutoCompleteComponent
            control={control}
            name="arr"
            label="Arr"
            options={airportOptions}
          />
          <EtsInputComponent
            control={control}
            name="fltNo"
            label="FLT No"
            placeholder="검색어를 입력해주세요."
            onlyNumber
            maxLength={4}
          />
        </searchForm.Row>
      </searchForm.Container>
      <searchForm.ButtonContainer>
        <searchForm.Row sx={{ justifyContent: 'flex-end' }}>
          <EtsButton
            type="blue"
            onClick={() => {
              setDetailOpen(true);
              handleSubmit(onSubmit, onInvalid)(); // 여기 () 추가
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
        title="Flight Details"
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
        // onCellClicked={onCellClicked}
        size="md"
      />
      {detailModal}
    </>
  );
};

export default FlightDetailsPage;
