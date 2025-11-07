import { Fragment, useState, useCallback, useEffect } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { searchForm, buttonForm, tableForm } from '@/assets/style';
import { TableTemplate } from '@/components/Teamplate';
import dayjs, { Dayjs } from 'dayjs';

import { EtsButton, EtsModal, EtsSelectOption } from '@/components/EtsCommon';
import {
  EtsInputComponent,
  EtsSelectComponent,
  EtsSingleDatePickerComponent,
} from '@/components/EtsComponents';
import { useActivate } from 'react-activation';
import { callApi, Method } from '@/utils';
import { Service } from '@/models/common/Service';
import { useNotify } from '@/hooks/useNotify';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import { UNIT } from '@/models/common/CommonSelectCodes';

// 타입 정의
type FormValues = {
  date: string;
  fltNo: string;
  dep: string;
  arr: string;
};

interface FlightInfoData {
  fltId: string;
  actDepDt: string;
  actArvDt: string;
  actDepDtLoc: string;
  actArvDtLoc: string;
  fltNum: string;
  svc: string;
  acver: string;
  stnfr: string;
  stnto: string;
  depIcao: string;
  arvIcao: string;
  sactyp: string;
  regno: string;
  fltType: string;
  prvFltId: string;
  prvRampIn: number;
  fuelUplift: number;
  density: number;
  unit: string;
  fuelUpliftCal: number;
  fuelConsMethod: number;
  fuelConsBlock: number;
  rampOut: number;
  rampIn: number;
  check: boolean;
  update: boolean;
}

const TableContainer = styled(Box)`
  display: flex;
  padding: var(--spacing-0, 0);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
`;

const FlightContainer = styled(Box)`
  display: flex;
  padding: var(--spacing-0, 0);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`;

const FlightSubContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 16px;
  align-self: stretch;
`;

const FuelContainer = styled(Box)`
  display: flex;
  padding: var(--spacing-0, 0);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
`;

const FuelSubContainer = styled(Box)`
  display: flex;
  padding-bottom: 12px;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
`;

const FuelSubContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FuelDetailPage = () => {
  const [flightInfoData, setFlightInfoData] = useState<FlightInfoData | null>(null);
  const [depDate, setDepDate] = useState<Dayjs | null>(dayjs());
  const [isEditable, setIsEditable] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [depOptions, setDepOptions] = useState<EtsSelectOption[]>([]);
  const [arrOptions, setArrOptions] = useState<EtsSelectOption[]>([]);
  const { toast } = useNotify();

  const unit = UNIT;

  // 계산 로직
  const calculateFlightInfoData = useCallback((data: FlightInfoData): FlightInfoData => {
    const fuelUplift = Number(data.fuelUplift) || 0;
    const density = Number(data.density) || 0;
    const prvRampIn = Number(data.prvRampIn) || 0;
    const rampIn = Number(data.rampIn) || 0;
    const rampOut = Number(data.rampOut) || 0;
    const unit = data.unit;

    let fuelUpliftCal = 0;
    if (unit === 'USG') {
      fuelUpliftCal = fuelUplift * density;
    } else if (unit === 'LT') {
      fuelUpliftCal = fuelUplift * density * 2.204624;
    }

    const calculatedFuelUpliftCal = Math.round(fuelUpliftCal);
    const calculatedFuelConsMethod = Math.round(prvRampIn + fuelUpliftCal - rampIn);
    const calculatedFuelConsBlock = Math.round(rampOut - rampIn);

    return {
      ...data,
      fuelUpliftCal: calculatedFuelUpliftCal,
      fuelConsMethod: calculatedFuelConsMethod,
      fuelConsBlock: calculatedFuelConsBlock,
    };
  }, []);

  // KeepAlive 페이지 활성화 시 상태 초기화
  useActivate(() => {
    // 편집 상태 초기화
    if (isEditable) {
      setIsEditable(false);
    }

    // 데이터가 있으면 재조회 실행
    if (flightInfoData !== null) {
      handleSubmit(onSubmit)();
    }
  });

  const { control, handleSubmit, setFocus, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      date: depDate?.format('YYYY-MM-DD'),
      fltNo: '',
      dep: '',
      arr: '',
    },
    mode: 'onChange',
  });

  // FLT No 4자리 입력 시 자동으로 dep, arr 조회
  const depDateValue = watch('date');
  const fltNoValue = watch('fltNo');
  useEffect(() => {
    if (fltNoValue && fltNoValue.length === 4) {
      fetchFlightRoute();
    }
  }, [depDateValue, fltNoValue]);

  // FLT No로 dep, arr 정보 조회하는 API
  const fetchFlightRoute = async () => {
    // dep, arr 값을 빈값으로 초기화
    setValue('dep', '', { shouldValidate: true });
    setValue('arr', '', { shouldValidate: true });
    setDepOptions([]);
    setArrOptions([]);

    try {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/v1/management/fuel-detail/station',
        method: Method.GET,
        params: {
          queryParams: {
            fltNum: watch('fltNo'),
            depDate: depDate ? depDate.format('YYYYMMDD') : '',
          },
        },
        config: { isLoading: false },
      });

      if (res.successOrNot === 'Y' && res.data && res.data.length > 0) {
        // Dep 옵션 생성
        const depOptionsList: EtsSelectOption[] = res.data
          .filter((item: any) => item.stnfr)
          .map((item: any) => ({
            value: item.stnfr,
            label: item.stnfr,
          }));

        // Arr 옵션 생성
        const arrOptionsList: EtsSelectOption[] = res.data
          .filter((item: any) => item.stnto)
          .map((item: any) => ({
            value: item.stnto,
            label: item.stnto,
          }));

        setDepOptions(depOptionsList);
        setArrOptions(arrOptionsList);

        // 첫 번째 항목을 기본값으로 설정 (validation도 함께 실행)
        if (depOptionsList.length > 0) {
          setValue('dep', String(depOptionsList[0].value), { shouldValidate: true });
        }
        if (arrOptionsList.length > 0) {
          setValue('arr', String(arrOptionsList[0].value), { shouldValidate: true });
        }
      }
    } catch (error) {
      console.error('Failed to fetch flight route:', error);
    }
  };

  const getQueryParams = () => {
    const baseParams = {
      depDate: depDate ? depDate.format('YYYYMMDD') : '',
      fltNum: watch('fltNo') === '' ? '' : watch('fltNo'),
      stnfr: watch('dep') === 'ALL' ? '' : watch('dep'),
      stnto: watch('arr') === 'ALL' ? '' : watch('arr'),
    };

    return baseParams;
  };

  // 검색 핸들러
  const onSubmit = async () => {
    const queryParams = getQueryParams();

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/management/fuel-detail',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setFlightInfoData(null);
        return;
      }
      setFlightInfoData(res.data);
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

  // Flight  데이터 필드 업데이트 핸들러
  const handleFlightInfoDataChange = (
    field: keyof FlightInfoData,
    value: string,
    allowDecimal: boolean = false
  ) => {
    if (!flightInfoData) return;

    // 숫자만 입력 가능하도록 필터링
    let filteredValue = value;
    if (allowDecimal) {
      // 소수점 허용 (density용)
      filteredValue = value.replace(/[^0-9.]/g, '');
      // 소수점이 2개 이상이면 첫 번째만 유지
      const parts = filteredValue.split('.');
      if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
      }
    } else {
      // 정수만 허용
      filteredValue = value.replace(/[^0-9]/g, '');
    }

    const updatedData = { ...flightInfoData, [field]: filteredValue };

    // 계산에 필요한 모든 필드가 입력되었는지 확인
    if (
      updatedData.fuelUplift &&
      updatedData.density &&
      updatedData.prvRampIn &&
      updatedData.rampIn &&
      updatedData.rampOut &&
      updatedData.unit
    ) {
      const calculated = calculateFlightInfoData(updatedData);
      setFlightInfoData(calculated);
    } else {
      setFlightInfoData(updatedData);
    }
  };

  const handleSave = async () => {
    if (!flightInfoData?.fltId || !flightInfoData?.prvFltId) {
      toast.info('저장할 데이터가 없습니다.');
      return;
    }

    try {
      const payload = {
        fltId: flightInfoData.fltId,
        prvFltId: flightInfoData.prvFltId,
        prvRampIn: Number(flightInfoData.prvRampIn),
        rampOut: Number(flightInfoData.rampOut),
        rampIn: Number(flightInfoData.rampIn),
        fuelUplift: Number(flightInfoData.fuelUplift),
        density: Number(flightInfoData.density),
        unit: flightInfoData.unit,
      };

      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/v1/management/fuel-detail',
        method: Method.POST,
        params: {
          bodyParams: { request: payload },
        },
        config: { isLoading: true },
      });

      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        return;
      }

      toast.success('저장되었습니다.');
      setIsEditable(false);
      await handleSubmit(onSubmit)(); // 저장 후 재조회
    } catch {
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  // 테이블 컴포넌트
  const tableComponent = (
    <Fragment>
      <TableContainer>
        {/* Flight Information */}
        <FlightContainer>
          <FlightSubContainer>
            <Typography className="sub-title" style={{ flex: '1 0 0' }}>
              Flight Information
            </Typography>
          </FlightSubContainer>
          <tableForm.table>
            <tableForm.thead>
              <tableForm.tr>
                <tableForm.td variant="base" className="label-modal-grid-header">
                  FLT No
                </tableForm.td>
                <tableForm.td variant="base" className="label-modal-grid-header">
                  A/C Reg
                </tableForm.td>
                <tableForm.td variant="base" className="label-modal-grid-header">
                  FLT Type
                </tableForm.td>
                <tableForm.td variant="base" className="label-modal-grid-header">
                  SVC Type
                </tableForm.td>
                <tableForm.td variant="base" className="label-modal-grid-header">
                  A/C Type
                </tableForm.td>
                <tableForm.td variant="base" className="label-modal-grid-header">
                  A/C Ver
                </tableForm.td>
                <tableForm.td variant="orange" className="label-modal-grid-header">
                  Dep
                </tableForm.td>
                <tableForm.td variant="orange" className="label-modal-grid-header">
                  ICAO
                </tableForm.td>
                <tableForm.td variant="orange" className="label-modal-grid-header">
                  LOC
                </tableForm.td>
                <tableForm.td variant="orange" className="label-modal-grid-header">
                  GMT
                </tableForm.td>
                <tableForm.td variant="red" className="label-modal-grid-header">
                  Arr
                </tableForm.td>
                <tableForm.td variant="red" className="label-modal-grid-header">
                  ICAO
                </tableForm.td>
                <tableForm.td variant="red" className="label-modal-grid-header">
                  LOC
                </tableForm.td>
                <tableForm.td
                  variant="red"
                  className="label-modal-grid-header"
                  style={{ borderRight: 'none' }}
                >
                  GMT
                </tableForm.td>
              </tableForm.tr>
            </tableForm.thead>
            <tableForm.tbody>
              <tableForm.tr>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.fltNum || ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.regno || ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.fltType || ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">{flightInfoData?.svc || ''}</tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.sactyp || ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.acver || ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.stnfr || ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.depIcao || ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.actDepDtLoc
                    ? dayjs(flightInfoData.actDepDtLoc).format('YYYY.MM.DD')
                    : ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.actDepDt
                    ? dayjs(flightInfoData.actDepDt).format('YYYY.MM.DD')
                    : ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.stnto || ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.arvIcao || ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.actArvDtLoc
                    ? dayjs(flightInfoData.actArvDtLoc).format('YYYY.MM.DD')
                    : ''}
                </tableForm.td>
                <tableForm.td className="modal-body-text" style={{ borderRight: 'none' }}>
                  {flightInfoData?.actArvDt
                    ? dayjs(flightInfoData.actArvDt).format('YYYY.MM.DD')
                    : ''}
                </tableForm.td>
              </tableForm.tr>
            </tableForm.tbody>
          </tableForm.table>
        </FlightContainer>

        {/* Fuel Consumption */}
        <FuelContainer>
          <FuelSubContainer>
            <FuelSubContent>
              <Typography className="sub-title">Fuel Consumption</Typography>
            </FuelSubContent>
            <buttonForm.Row>
              {isEditable ? (
                <>
                  <EtsButton
                    type="grey"
                    onClick={() => {
                      handleSubmit(onSubmit)();
                      setIsEditable(false);
                    }}
                  >
                    Cancel
                  </EtsButton>
                  <EtsButton
                    type="blue"
                    onClick={async () => {
                      if (!flightInfoData?.fltId || !flightInfoData?.prvFltId) {
                        toast.info('저장할 데이터가 없습니다.');
                        return;
                      }

                      if (
                        !flightInfoData.prvRampIn ||
                        !flightInfoData.rampOut ||
                        !flightInfoData.rampIn ||
                        !flightInfoData.fuelUplift ||
                        !flightInfoData.density ||
                        !flightInfoData.unit
                      ) {
                        toast.info('모든 필드를 입력해주세요.');
                        return;
                      }

                      if (!flightInfoData.check) {
                        toast.info('Check를 클릭해주세요.');
                        return;
                      }

                      if (!flightInfoData.update) {
                        toast.info('Update를 체크해주세요.');
                        return;
                      }

                      setSaveOpen(true);
                    }}
                  >
                    Save
                  </EtsButton>
                </>
              ) : (
                <EtsButton
                  type="grey"
                  onClick={() => {
                    setIsEditable(true);
                    // 편집 모드 진입 시 check와 update 초기화
                    if (flightInfoData) {
                      setFlightInfoData({ ...flightInfoData, check: false, update: false });
                    }
                  }}
                >
                  Edit
                </EtsButton>
              )}
            </buttonForm.Row>
          </FuelSubContainer>

          <tableForm.table>
            <tableForm.thead>
              <tableForm.tr className="label-modal-grid-header">
                <tableForm.td variant="base" colSpan={3}>
                  ACARS
                </tableForm.td>
                <tableForm.td variant="base" colSpan={4}>
                  Emission (t)
                </tableForm.td>
                <tableForm.td variant="base" rowSpan={2}>
                  Fuel Cons
                  <br />
                  (Method B)
                </tableForm.td>
                <tableForm.td variant="base" rowSpan={2}>
                  Fuel Cons
                  <br />
                  (Block On/Off)
                </tableForm.td>
                <tableForm.td variant="base" rowSpan={2}>
                  Check
                </tableForm.td>
                <tableForm.td variant="base" rowSpan={2} style={{ borderRight: 'none' }}>
                  Update
                </tableForm.td>
              </tableForm.tr>
              <tableForm.tr className="label-modal-grid-header">
                <tableForm.td variant="base">PRV Ramp In</tableForm.td>
                <tableForm.td variant="base">Ramp Out</tableForm.td>
                <tableForm.td variant="base">Ramp In</tableForm.td>
                <tableForm.td variant="base">Fuel Uplift</tableForm.td>
                <tableForm.td variant="base">Density</tableForm.td>
                <tableForm.td variant="base">Unit</tableForm.td>
                <tableForm.td variant="orange" style={{ borderRight: '1px solid #D9D9D9' }}>
                  Fuel Uplift (Cal)
                </tableForm.td>
              </tableForm.tr>
            </tableForm.thead>
            <tableForm.tbody>
              <tableForm.tr>
                <tableForm.td className="modal-body-text">
                  <tableForm.EditableCell
                    isEditable={isEditable && !flightInfoData?.check}
                    value={flightInfoData?.prvRampIn || ''}
                    onChange={(e) => handleFlightInfoDataChange('prvRampIn', e.target.value)}
                    decimalPlaces={0}
                  />
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  <tableForm.EditableCell
                    isEditable={isEditable && !flightInfoData?.check}
                    value={flightInfoData?.rampOut || ''}
                    onChange={(e) => handleFlightInfoDataChange('rampOut', e.target.value)}
                    decimalPlaces={0}
                  />
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  <tableForm.EditableCell
                    isEditable={isEditable && !flightInfoData?.check}
                    value={flightInfoData?.rampIn || ''}
                    onChange={(e) => handleFlightInfoDataChange('rampIn', e.target.value)}
                    decimalPlaces={0}
                  />
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  <tableForm.EditableCell
                    isEditable={isEditable && !flightInfoData?.check}
                    value={flightInfoData?.fuelUplift || ''}
                    onChange={(e) => handleFlightInfoDataChange('fuelUplift', e.target.value)}
                    decimalPlaces={0}
                  />
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  <tableForm.EditableCell
                    isEditable={isEditable && !flightInfoData?.check}
                    value={flightInfoData?.density || ''}
                    onChange={(e) => handleFlightInfoDataChange('density', e.target.value, true)}
                    decimalPlaces={1}
                  />
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  <tableForm.EditableCell
                    isEditable={isEditable && !flightInfoData?.check}
                    value={flightInfoData?.unit || ''}
                    options={unit}
                    type="select"
                    onChange={(value) => {
                      if (!flightInfoData) return;
                      const updatedData = { ...flightInfoData, unit: value };
                      // 계산에 필요한 모든 필드가 입력되었는지 확인
                      if (
                        updatedData.fuelUplift &&
                        updatedData.density &&
                        updatedData.prvRampIn &&
                        updatedData.rampIn &&
                        updatedData.rampOut &&
                        updatedData.unit
                      ) {
                        const calculated = calculateFlightInfoData(updatedData);
                        setFlightInfoData(calculated);
                      } else {
                        setFlightInfoData(updatedData);
                      }
                    }}
                  />
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  <tableForm.EditableCell
                    isEditable={isEditable && !flightInfoData?.check}
                    value={flightInfoData?.fuelUpliftCal || ''}
                    onChange={(e) => handleFlightInfoDataChange('fuelUpliftCal', e.target.value)}
                    decimalPlaces={0}
                  />
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  <tableForm.EditableCell
                    isEditable={isEditable && !flightInfoData?.check}
                    value={flightInfoData?.fuelConsMethod || ''}
                    onChange={(e) => handleFlightInfoDataChange('fuelConsMethod', e.target.value)}
                    decimalPlaces={0}
                  />
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  <tableForm.EditableCell
                    isEditable={isEditable && !flightInfoData?.check}
                    value={flightInfoData?.fuelConsBlock || ''}
                    onChange={(e) => handleFlightInfoDataChange('fuelConsBlock', e.target.value)}
                    decimalPlaces={0}
                  />
                </tableForm.td>
                <tableForm.td className="modal-body-text">
                  {flightInfoData?.fltId && (
                    <tableForm.EditableCell
                      isEditable={isEditable}
                      type="check-button"
                      value={flightInfoData?.check || false}
                      onChange={(e) => {
                        if (!flightInfoData) return;

                        // check를 true로 변경하려는 경우
                        if (e === true) {
                          // 모든 필수 필드가 입력되어 있는지 검증
                          if (
                            !flightInfoData.prvRampIn ||
                            !flightInfoData.rampOut ||
                            !flightInfoData.rampIn ||
                            !flightInfoData.fuelUplift ||
                            !flightInfoData.density ||
                            !flightInfoData.unit
                          ) {
                            toast.info('모든 필드를 입력해주세요.');
                            return;
                          }

                          // 모든 필드가 입력되어 있으면 check를 true로 설정 (편집 모드는 유지)
                          setFlightInfoData({ ...flightInfoData, check: true });
                        } else {
                          // check를 false로 변경하는 경우 (update도 함께 false로)
                          setFlightInfoData({ ...flightInfoData, check: false, update: false });
                        }
                      }}
                    />
                  )}
                </tableForm.td>
                <tableForm.td className="modal-body-text" style={{ borderRight: 'none' }}>
                  {flightInfoData?.fltId && (
                    <tableForm.EditableCell
                      isEditable={isEditable}
                      type="check"
                      value={flightInfoData?.update || false}
                      onChange={(e) => {
                        if (!flightInfoData) return;

                        // check를 true로 변경하려는 경우
                        if (e === true) {
                          // 모든 필수 필드가 입력되어 있는지 검증
                          if (
                            !flightInfoData.prvRampIn ||
                            !flightInfoData.rampOut ||
                            !flightInfoData.rampIn ||
                            !flightInfoData.fuelUplift ||
                            !flightInfoData.density ||
                            !flightInfoData.unit
                          ) {
                            toast.info('모든 필드를 입력해주세요.');
                            return;
                          }

                          if (!flightInfoData.check) {
                            toast.info('Check를 클릭해주세요.');
                            return;
                          }
                          setFlightInfoData({ ...flightInfoData, update: true });
                        } else {
                          setFlightInfoData({ ...flightInfoData, update: false });
                        }
                      }}
                    />
                  )}
                </tableForm.td>
              </tableForm.tr>
            </tableForm.tbody>
          </tableForm.table>
        </FuelContainer>
      </TableContainer>
    </Fragment>
  );

  const searchComponent = (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <searchForm.Container>
        <searchForm.Row>
          <EtsSingleDatePickerComponent
            control={control}
            name="date"
            label="Dep Date"
            onValueChange={setDepDate}
          />
          <EtsInputComponent
            control={control}
            name="fltNo"
            label="FLT No"
            placeholder="검색어를 입력해주세요."
            onlyNumber
            maxLength={4}
            required={true}
          />
          <EtsSelectComponent control={control} name="dep" label="Dep" options={depOptions} />
          <EtsSelectComponent control={control} name="arr" label="Arr" options={arrOptions} />
        </searchForm.Row>
      </searchForm.Container>
      {/* Search */}
      <searchForm.ButtonContainer>
        <searchForm.Row sx={{ justifyContent: 'flex-end' }}>
          <EtsButton
            type="blue"
            onClick={() => {
              handleSubmit(onSubmit, onInvalid)();
            }}
          >
            Search
          </EtsButton>
        </searchForm.Row>
      </searchForm.ButtonContainer>
    </form>
  );

  const saveModal = (
    <>
      <EtsModal open={saveOpen} size={420} onClose={() => setSaveOpen(false)}>
        <EtsModal.Header onClose={() => setSaveOpen(false)} />
        <EtsModal.Body>
          <Typography className="label-modal-sm" component="h1">
            Save Data
          </Typography>
          <Typography className="modal-body-text" mt={2}>
            작성된 데이터를 저장하시겠습니까?
          </Typography>
        </EtsModal.Body>
        <EtsModal.Footer>
          <>
            <EtsButton
              className="modal-foot-text-cancel"
              type="outlined"
              variant="outlined"
              onClick={() => setSaveOpen(false)}
            >
              Cancel
            </EtsButton>
            <EtsButton
              className="modal-foot-text-cancel"
              type="contained"
              variant="contained"
              onClick={async () => {
                handleSave();
                setSaveOpen(false);
              }}
            >
              Save
            </EtsButton>
          </>
        </EtsModal.Footer>
      </EtsModal>
    </>
  );

  return (
    <>
      {saveModal}
      <TableTemplate
        title="Fuel Detail"
        isModal={false}
        searchComponent={searchComponent}
        component={tableComponent}
      />
    </>
  );
};
export default FuelDetailPage;
