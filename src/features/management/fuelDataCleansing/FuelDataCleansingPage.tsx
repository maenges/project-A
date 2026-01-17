import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useCommonOptionsStore } from '@/store/commonCodes';
import { DOM_INT_TYPE_2 } from '@models/common/CommonSelectCodes';

import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';
import { useActivate } from 'react-activation';

import { EtsButton, EtsSelectOption } from '@/components/EtsCommon';
import {
  EtsSelectComponent,
  EtsDatePickerComponent,
  EtsInputComponent,
  EtsAutoCompleteComponent,
} from '@/components/EtsComponents';

type FuelDataCleansing = {
  fltId: string;
  actDepDt: string;
  actArvDt: string;
  fltNum: string;
  stnfr: string;
  stnto: string;
  sactyp: string;
  regno: string;
  prvFltId: string;
  prvRampIn: number;
  rampOut: number;
  rampIn: number;
  fuelUplift: number;
  density: number;
  unit: string;
  fuelUpliftCal: number;
  fuelConsMethod: number;
  fuelConsBlock: number;
  fuelConsAvg: number;
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  region: string;
  acReg: string;
  dep: string;
  arr: string;
  manual: string | boolean;
};

// 계산 로직을 별도의 함수로 정의
const runCalculation = (node: any) => {
  const currentRowData = { ...node.data };

  const fuelUplift = Number(currentRowData.fuelUplift) || 0;
  const density = Number(currentRowData.density) || 0;
  const prvRampIn = Number(currentRowData.prvRampIn) || 0;
  const rampIn = Number(currentRowData.rampIn) || 0;
  const rampOut = Number(currentRowData.rampOut) || 0;
  const unit = currentRowData.unit;

  let fuelUpliftCal = 0;
  if (unit === 'USG') {
    fuelUpliftCal = fuelUplift * density;
  } else if (unit === 'LT') {
    fuelUpliftCal = fuelUplift * density * 2.204624;
  }

  currentRowData.fuelUpliftCal = Math.round(fuelUpliftCal);
  currentRowData.fuelConsMethod = Math.round(prvRampIn + fuelUpliftCal - rampIn);
  currentRowData.fuelConsBlock = Math.round(rampOut - rampIn);
  currentRowData.check = !currentRowData.check;

  node.setData(currentRowData);
};

const FuelDataCleansingPage = () => {
  const [isEditable, setIsEditable] = useState(false);

  const unit: EtsSelectOption[] = [
    { label: 'USG', value: 'USG' },
    { label: 'LT', value: 'LT' },
  ];

  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.IdPreset({
      field: 'fltId',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'actDepDt',
      headerName: 'ATD',
      width: 105,
    }),
    EtsColumnPreset.TextPreset({
      field: 'actArvDt',
      headerName: 'ATA',
      headerClass: 'bg-orange',
      width: 105,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fltNum',
      headerName: 'FLT No',
      width: 90,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'stnto',
      headerName: 'Dep',
      width: 60,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'stnfr',
      headerName: 'Arr',
      width: 60,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C\nType',
      width: 80,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'regno',
      headerName: 'A/C Reg',
      width: 80,
      flex: 1,
    }),
    {
      headerName: 'ACARS',
      children: [
        EtsColumnPreset.IdPreset({
          field: 'prvFltId',
          headerName: 'prvFltId',
          hide: true,
        }),
        EtsColumnPreset.TextPreset({
          field: 'prvRampIn',
          headerName: 'PRV Ramp In',
          width: 106,
          editable: (params) => isEditable && params.data.check !== true,
          flex: 1,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'rampOut',
          headerName: 'Ramp Out',
          width: 106,
          editable: (params) => isEditable && params.data.check !== true,
          flex: 1,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'rampIn',
          headerName: 'Ramp In',
          width: 106,
          editable: (params) => isEditable && params.data.check !== true,
          flex: 1,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
          },
        }),
      ],
    },
    {
      headerName: 'Emission (t)',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'fuelUplift',
          headerName: 'Fuel Uplift',
          width: 100,
          editable: (params) => isEditable && params.data.check !== true,
          flex: 1,
          context: {
            inputProps: {
              type: 'numeric',
            },
            formatType: 'number',
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'density',
          headerName: 'Density',
          width: 100,
          editable: (params) => isEditable && params.data.check !== true,
          flex: 1,
          context: {
            inputProps: {
              type: 'decimal',
            },
            formatType: 'number',
            decimalPlaces: 4,
          },
        }),
        EtsColumnPreset.SelectPreset({
          field: 'unit',
          headerName: 'Unit',
          width: 80,
          editable: (params) => isEditable && params.data.check !== true,
          flex: 1,
          context: {
            options: unit,
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'fuelUpliftCal',
          headerName: 'Fuel Uplift(Cal)',
          headerClass: 'bg-orange',
          width: 120,
          flex: 1,
          context: {
            formatType: 'number',
          },
        }),
      ],
    },
    EtsColumnPreset.TextPreset({
      field: 'fuelConsMethod',
      headerName: 'Fuel Cons\n(Method B)',
      width: 116,
      flex: 1,
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelConsBlock',
      headerName: 'Fuel Cons\n(Block On/\nOff)',
      width: 116,
      flex: 1,
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelConsAvg',
      headerName: 'Fuel Cons\n(Average)',
      width: 116,
      flex: 1,
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.CheckButtonPreset({
      field: 'check',
      headerName: 'Check',
      width: 100,
      editable: isEditable,
      flex: 1,
      // cellStyle: (params: any) => {
      //   if (isEditable && (params.value === true || params.value === 'true')) {
      //     return { 'pointer-events': 'none', cursor: 'default' };
      //   } else {
      //   }
      //   return null;
      // },
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'update',
      headerName: 'Update',
      width: 70,
      editable: isEditable,
      flex: 1,
    }),
  ];

  useActivate(() => {
    // 편집 상태 초기화
    if (isEditable) {
      setIsEditable(false);
    }
    if (rowData && rowData.length > 0) {
      handleSubmit(onSearch)();
    }
  });

  const gridRef = useRef<EtsGridRef<FuelDataCleansing>>(null);
  const { toast } = useNotify();
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs()); // 오늘 날짜로 초기화
  // const regionAllOptions = useCommonOptionsStore((s) => s.regionAllOptions);
  const airportOptions = useCommonOptionsStore((s) => s.airportOptions).filter(
    (item) => item.value !== '183'
  );

  const manualOption = [
    { label: 'ALL', value: 'ALL' },
    { label: 'Y', value: true },
    { label: 'N', value: false },
  ];

  const [rowData, setRowData] = useState<FuelDataCleansing[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      startDate: dayjs().startOf('month').format('YYYYMMDD'),
      endDate: endRangeDate?.format('YYYYMMDD'),
      region: DOM_INT_TYPE_2[0].value,
      acReg: '',
      dep: airportOptions[0].value,
      arr: airportOptions[0].value,
      manual: manualOption[0].value,
    },
    mode: 'onChange',
  });

  const handleCellClicked = (event: any) => {
    if (event.colDef.field === 'check') {
      runCalculation(event.node);
    }
  };

  const onSearch: SubmitHandler<FormValues> = async () => {
    const getLabel = (value: string) => {
      if (value === 'ALL') return '';
      const option = airportOptions.find((opt) => opt.value === value);
      return option?.label || '';
    };

    const sendParams = {
      startDate: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
      endDate: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
      domInt: watch('region') === 'all' ? '' : watch('region'),
      acReg: watch('acReg'),
      stnfr: getLabel(watch('arr')) === 'ALL' ? '' : getLabel(watch('arr')),
      stnto: getLabel(watch('dep')) === 'ALL' ? '' : getLabel(watch('dep')),
      manual: watch('manual') === 'ALL' ? '' : watch('manual'),
    };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/management/fuel-cleansing',
      method: Method.GET,
      config: { isLoading: true },
      params: {
        queryParams: sendParams,
      },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      const stringifiedData = res.data.map((row: FuelDataCleansing) => {
        const newRow: { [key: string]: any } = {};
        for (const key in row) {
          // null 또는 undefined는 빈 문자열로, 나머지는 String()으로 변환합니다.
          newRow[key] = row[key] === null || row[key] === undefined ? '' : String(row[key]);
        }
        newRow.check = false; // check 초기값 설정
        newRow.update = false; // update 초기값 설정

        return newRow as FuelDataCleansing;
      });
      setRowData(stringifiedData);
      setTotalCount(res.ItemCount ?? 0);
    });
  };

  const handleGetModifiedData = async () => {
    const modifiedRows = gridRef.current?.api.getRenderedNodes().filter((node) => {
      return (
        node.data?.check === true && node.data?.update === true && node.data?.rowStatus === 'U'
      );
    });

    if (!modifiedRows || modifiedRows.length === 0) {
      toast.info('수정된 내용이 없습니다.');
      return;
    }

    const updatePayload = modifiedRows.map((node) => {
      if (!node.data) return null;
      const { originData, ...currentData } = node.data;
      const changedData: Partial<FuelDataCleansing> = {
        fltId: currentData.fltId,
        prvFltId: currentData.prvFltId,
      };

      Object.keys(currentData).forEach((key) => {
        const currentValue = currentData[key];
        const originalValue = originData ? originData[key] : undefined;

        if (currentValue !== originalValue) {
          changedData[key] = currentValue;
        }
      });

      // type 변경
      const numericFields = ['prvRampIn', 'rampOut', 'rampIn', 'fuelUplift', 'density'];
      numericFields.forEach((f) => {
        if (f in changedData) {
          const raw = changedData[f];
          if (raw === '' || raw === null || raw === undefined) {
            changedData[f] = 0;
          } else {
            changedData[f] = Number(raw);
          }
        }
      });

      delete changedData.rowStatus;
      delete changedData.check;
      delete changedData.update;
      return changedData;
    });

    // 변경된 데이터가 있는 행만 실제 API 호출
    const finalPayload = updatePayload.filter((item) => item && Object.keys(item).length > 1);

    if (finalPayload.length === 0) {
      toast.info('수정된 내용이 없습니다.');
      return;
    }

    await callApi({
      service: Service.POSTMAN,
      url: '/api/v1/management/fuel-cleansing',
      method: Method.POST,
      config: { isLoading: true },
      params: {
        bodyParams: { cleansingList: finalPayload },
      },
    }).then(async (res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }
      toast.success('수정 되었습니다.');

      await handleSubmit(onSearch)();
      setIsEditable(false);
    });
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
          />
          <EtsSelectComponent
            control={control}
            name="region"
            label="Region"
            options={DOM_INT_TYPE_2}
          />
          <EtsInputComponent
            control={control}
            name="acReg"
            label="A/C Reg"
            placeholder="검색어를 입력해주세요."
            onlyNumber
            maxLength={4}
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
            name="manual"
            label="Manual"
            options={manualOption}
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
        {isEditable ? (
          <>
            <EtsButton
              type="grey"
              onClick={() => {
                if (gridRef.current) {
                  gridRef.current.api.stopEditing();
                }
                handleSubmit(onSearch)();
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
                handleGetModifiedData();
              }}
            >
              Save
            </EtsButton>
          </>
        ) : (
          <>
            <EtsButton
              type="grey"
              onClick={async () => {
                setIsEditable(true);
              }}
            >
              Edit
            </EtsButton>
          </>
        )}
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <PageTemplate
      title="Fuel Data Cleansing"
      gridRef={gridRef}
      columnDefs={columnDefs}
      searchComponent={searchComponent}
      buttonComponent={buttonComponent}
      totalCount={totalCount}
      rowData={rowData}
      onCellClicked={handleCellClicked}
    />
  );
};
export default FuelDataCleansingPage;
