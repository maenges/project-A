import { useCallback, useRef, useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { useCommonOptionsStore } from '@/store/commonCodes';
import dayjs, { Dayjs } from 'dayjs';

import { EtsButton } from '@/components/EtsCommon';
import {
  EtsSelectComponent,
  EtsDatePickerComponent,
  EtsInputComponent,
  EtsAutoCompleteComponent,
} from '@/components/EtsComponents';
import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import { MANUAL } from '@/models/common/CommonSelectCodes';
import { useActivate } from 'react-activation';
import { callApi, Method } from '@/utils';
import { Service } from '@/models/common/Service';
import { useNotify } from '@/hooks/useNotify';
import { ColDef, ColGroupDef } from 'ag-grid-community';

// 타입 정의
type FormValues = {
  startDate: string;
  endDate: string;
  region: string;
  acReg: string;
  dep: string;
  arr: string;
  manual: string;
};

interface PayloadDataCleansing {
  fltId: string;
  actDepDt: string;
  actArvDt: string;
  schDepDt: string;
  schArvDt: string;
  fltNum: string;
  stnfr: string;
  stnto: string;
  sactyp: string;
  regno: string;
  adultCount: string;
  childCount: string;
  infantCount: string;
  totalpassengers: string;
  totalPassengerKg: string;
  totalFreightWeightKg: string;
  totalMass: string;
}

const PayloadCleansingPage = () => {
  const [rowData, setRowData] = useState<PayloadDataCleansing[]>([]);
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs()); // 오늘 날짜로 초기화
  const [totalCount, setTotalCount] = useState(0);
  const [isEditable, setIsEditable] = useState(false);

  const gridRef = useRef<EtsGridRef<PayloadDataCleansing>>(null);

  const { toast } = useNotify();

  // 읽기 전용 컬럼에 사용할 숫자 포맷터
  const numberFormatter = (params: any) => {
    if (params.value == null || params.value === '') return '';
    return Number(params.value).toLocaleString();
  };

  const regionData = useCommonOptionsStore((s) => s.regionAllOptions);
  const airportData = useCommonOptionsStore((s) => s.airportOptions);
  const manual = MANUAL;

  /**
   * @description 계산된 필드값들을 업데이트하는 함수
   */
  const calculateFields = useCallback((data: PayloadDataCleansing): PayloadDataCleansing => {
    const adultCount = Number(data.adultCount) || 0;
    const childCount = Number(data.childCount) || 0;
    const infantCount = Number(data.infantCount) || 0;
    const totalFreightWeightKg = Number(data.totalFreightWeightKg) || 0;

    // totalpassengers = adultCount + childCount + infantCount
    const totalpassengers = adultCount + childCount + infantCount;

    // totalPassengerKg = totalpassengers * 100
    const totalPassengerKg = totalpassengers * 100;

    // totalMass = totalPassengerKg + totalFreightWeightKg
    const totalMass = totalPassengerKg + totalFreightWeightKg;

    return {
      ...data,
      totalpassengers: totalpassengers.toString(),
      totalPassengerKg: totalPassengerKg.toString(),
      totalMass: totalMass.toString(),
    };
  }, []);

  // 셀 값 변경 시 계산된 필드 업데이트
  const onCellValueChanged = useCallback(
    (params: any) => {
      if (!isEditable || !params.node?.data) {
        return;
      }

      // 계산 대상 필드만 처리
      const calculationFields = ['adultCount', 'childCount', 'infantCount', 'totalFreightWeightKg'];
      if (!calculationFields.includes(params.colDef.field)) {
        return;
      }

      const data = { ...params.node.data };
      const updatedData = calculateFields(data);

      // 계산된 값들을 그리드에 반영 (setTimeout으로 지연 실행하여 충돌 방지)
      setTimeout(() => {
        params.node.setDataValue('totalpassengers', updatedData.totalpassengers);
        params.node.setDataValue('totalPassengerKg', updatedData.totalPassengerKg);
        params.node.setDataValue('totalMass', updatedData.totalMass);
      }, 0);
    },
    [isEditable, calculateFields]
  );

  const { control, handleSubmit, watch, setValue, setFocus } = useForm<FormValues>({
    defaultValues: {
      startDate: dayjs().startOf('month').format('YYYYMMDD'),
      endDate: endRangeDate?.format('YYYYMMDD'),
      region: 'ALL',
      acReg: '',
      dep: 'ALL',
      arr: 'ALL',
      manual: MANUAL[0].value,
    },
    mode: 'onChange',
  });

  const regionValue = watch('region');

  const getAirportLabel = (value: string) => {
    if (value === 'ALL') return '';
    const option = airportData.find((opt) => opt.value === value);
    return option?.label || '';
  };

  // KeepAlive 페이지 활성화 시 상태 초기화
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

  const getQueryParams = () => {
    const baseParams = {
      startDate: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
      endDate: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
      region: watch('region') === 'ALL' ? '' : Number(watch('region')),
      stnfr: watch('dep') === 'ALL' ? '' : getAirportLabel(watch('dep')),
      stnto: watch('arr') === 'ALL' ? '' : getAirportLabel(watch('arr')),
      regno: watch('acReg') === '' ? '' : watch('acReg'),
      manualYn: watch('manual'),
    };

    return baseParams;
  };

  // 검색 핸들러
  const onSubmit = async () => {
    const queryParams = getQueryParams();

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/management/payload-cleansing/flights',
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
      // 데이터에 계산된 필드 적용
      const calculatedData = res.data.map((item: PayloadDataCleansing) => calculateFields(item));
      setRowData(calculatedData);
      setTotalCount(res.ItemCount ?? 0);
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

  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      field: 'actDepDt',
      headerName: 'ATD',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY-MM-DD');
      },
    },
    {
      field: 'actArvDt',
      headerName: 'ATA',
      headerClass: 'bg-orange',
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY-MM-DD');
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'fltNum',
      headerName: 'FLT No',
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
      field: 'sactyp',
      headerName: 'A/C Type',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'regno',
      headerName: 'A/C Reg',
      flex: 1,
    }),
    {
      headerName: 'Passenger Count (by Type)',
      children: [
        EtsColumnPreset.TextPreset({
          editable: isEditable,
          field: 'adultCount',
          headerName: 'Adult',
          width: 100,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
        EtsColumnPreset.TextPreset({
          editable: isEditable,
          field: 'childCount',
          headerName: 'Child',
          width: 100,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
        EtsColumnPreset.TextPreset({
          editable: isEditable,
          field: 'infantCount',
          headerName: 'Infant',
          width: 100,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
      ],
    },
    {
      headerName: 'Passenger Count (by Class)',
      children: [
        EtsColumnPreset.TextPreset({
          editable: isEditable,
          field: 'fCheckinCount',
          headerName: 'F',
          width: 100,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
        EtsColumnPreset.TextPreset({
          editable: isEditable,
          field: 'cCheckinCount',
          headerName: 'C',
          width: 100,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
        EtsColumnPreset.TextPreset({
          editable: isEditable,
          field: 'vCheckinCount',
          headerName: 'V',
          width: 100,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
        EtsColumnPreset.TextPreset({
          editable: isEditable,
          field: 'yCheckinCount',
          headerName: 'Y',
          width: 100,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
            decimalPlaces: 0,
          },
        }),
      ],
    },
    EtsColumnPreset.TextPreset({
      editable: isEditable,
      field: 'dchCount',
      headerName: 'Deadhead\n Crew',
      width: 100,
      context: {
        inputProps: {
          type: 'numeric',
        },
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      editable: isEditable,
      field: 'totalFreightWeightKg',
      headerName: 'Mass of Freight\n & Mail (kg)',
      minWidth: 150,
      flex: 1,
      context: {
        inputProps: {
          type: 'numeric',
        },
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'totalMass',
      headerName: 'Total Mass',
      minWidth: 150,
      flex: 1,
      editable: false, // 계산된 값이므로 편집 불가
      valueFormatter: numberFormatter,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
  ];

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
          <EtsInputComponent
            control={control}
            name="acReg"
            label="A/C Reg"
            placeholder="검색어를 입력해주세요."
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
          <EtsSelectComponent control={control} name="manual" label="Manual" options={manual} />
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

  const handleSave = async () => {
    const modifiedData = gridRef.current?.getRowsByStatus() || {
      delete: [],
      update: [],
      insert: [],
      all: [],
    };

    const updateData = modifiedData.update.map((item) => ({
      fltId: item.fltId,
      adultCount: Number(item.adultCount),
      childCount: Number(item.childCount),
      infantCount: Number(item.infantCount),
      totalFreightWeightKg: Number(item.totalFreightWeightKg),
    }));

    if (updateData.length === 0) {
      toast.info('변경된 데이터가 없습니다.');
      return;
    }

    try {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/v1/management/payload-cleansing/flights',
        method: Method.POST,
        params: {
          bodyParams: {
            cleansingList: updateData,
          },
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
  };

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
    <>
      <PageTemplate
        title="Payload Cleansing"
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        columnDefs={columnDefs}
        rowData={rowData}
        totalCount={totalCount}
        gridRef={gridRef}
        size="md"
        onCellValueChanged={onCellValueChanged}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
      />
    </>
  );
};
export default PayloadCleansingPage;
