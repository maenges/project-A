import React, { useRef, useState } from 'react';
import PageTemplate from '@/components/Teamplate/PageTemplate';
import dayjs, { Dayjs } from 'dayjs';
import { EtsColumnPreset, EtsGridRef } from '@components/EtsGrid';
import { useNotify } from '@hooks/useNotify.ts';
import { useCommonOptionsStore } from '@/store/commonCodes.ts';
import { DOM_INT } from '@models/common/CommonSelectCodes.ts';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { useActivate } from 'react-activation';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { searchForm } from '@/assets/style';
import {
  EtsAutoCompleteComponent,
  EtsDatePickerComponent,
  EtsSelectComponent,
} from '@/components/EtsComponents';
import { callApi, Method } from '@/utils';
import { Service } from '@models/common/Service.ts';
import { EtsButton } from '@components/EtsCommon';

type FormValues = {
  startDate: string;
  endDate: string;
  domInt: string;
  acType: string;
  dep: string;
  arr: string;
};

interface OZData {
  acType: string;
  fltCount: string;
  fuelCons: string;
  tier1C02: string;
  tier2C02: string;
  tier2CH4: string;
  tier2N20: string;
  tier2C02eq: string;
}

const OZPage: React.FC = () => {
  const [rowData, setRowData] = useState<OZData[]>([]);
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs());
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());
  const gridRef = useRef<EtsGridRef<OZData>>(null);
  const [totalCount, setTotalCount] = useState(0);

  const { toast } = useNotify();

  const acTypeData = useCommonOptionsStore((s) => s.acTypeOptions);
  const airportData = useCommonOptionsStore((s) => s.airportOptions);
  const domInt = DOM_INT;

  const { control, handleSubmit, watch, setFocus } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      startDate: startRangeDate?.format('YYYYMMDD'),
      endDate: endRangeDate?.format('YYYYMMDD'),
      domInt: DOM_INT[0].value,
      acType: 'ALL',
      dep: 'ALL',
      arr: 'ALL',
    },
  });

  useActivate(() => {
    setRowData([]);
    setTotalCount(0);
  });

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

  const getLabel = (value: string) => {
    if (value === 'ALL') return '';
    const option = airportData.find((opt) => opt.value === value);
    return option?.label || '';
  };

  const onSubmit: SubmitHandler<FormValues> = async () => {
    const queryParams = {
      startYearMonth: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
      endYearMonth: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
      domInt: watch('domInt') === 'all' ? '' : watch('domInt'),
      stnfr: getLabel(watch('dep')) === 'ALL' ? '' : getLabel(watch('dep')),
      stnto: getLabel(watch('arr')) === 'ALL' ? '' : getLabel(watch('arr')),
      sactyp: watch('acType') === 'ALL' ? '' : Number(watch('acType')),
    };

    console.log('Query params:', queryParams);
    console.log('Start date value:', watch('startDate'));
    console.log('End date value:', watch('endDate'));

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/history-summary-oz',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowData([]);
        setTotalCount(0);
        return;
      }
      console.log('API Response Data:', res.data);
      setRowData(res.data);

      // Total count
      const totalCount = res.ItemCount ?? 0;
      setTotalCount(totalCount);
    });
  };

  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C Type',
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
      field: 'fuelConsumptionQ',
      headerName: 'Fuel Cons(t)',
      flex: 1,
      cellDataType: 'number',
      context: {
        formatType: 'number',
      },
    }),
    {
      headerName: 'Emission(t)',
      headerClass: 'bg-orange',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'emiTier1Co2Lto',
          headerName: 'Tier1 CO2',
          flex: 1,
          cellDataType: 'number',
          context: {
            formatType: 'number',
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'emiTier2Co2Lto',
          headerName: 'Tier2 CO2',
          flex: 1,
          cellDataType: 'number',
          context: {
            formatType: 'number',
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'emiTier2Ch4Lto',
          headerName: 'Tier2 CH4',
          flex: 1,
          cellDataType: 'number',
          context: {
            formatType: 'number',
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'emiTier2N20Lto',
          headerName: 'Tier2 N2O',
          flex: 1,
          cellDataType: 'number',
          context: {
            formatType: 'number',
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'emiTier2Co2eLto',
          headerName: 'Tier2 CO2eq',
          flex: 1,
          cellDataType: 'number',
          context: {
            formatType: 'number',
          },
        }),
      ],
    },
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
            format="YYYY.MM"
            views={['year', 'month']}
          />
          <EtsSelectComponent control={control} name="domInt" label="Dom/Int" options={domInt} />
          <EtsAutoCompleteComponent
            control={control}
            name="acType"
            label="A/C type"
            options={acTypeData}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="dep"
            label="Dep"
            options={airportData}
          />
          <EtsAutoCompleteComponent
            control={control}
            name="arr"
            label="Arr"
            options={airportData}
          />
        </searchForm.Row>
        <searchForm.ButtonContainer>
          <searchForm.Row sx={{ justifyContent: 'flex-end' }}>
            <EtsButton
              type={'blue'}
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
            >
              Search
            </EtsButton>
          </searchForm.Row>
        </searchForm.ButtonContainer>
      </searchForm.Container>
    </form>
  );

  return (
    <PageTemplate
      title="OZ Historical Summary"
      searchComponent={searchComponent}
      columnDefs={columnDefs}
      showPinnedBottom={true}
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

export default OZPage;
