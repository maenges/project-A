import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
// import { Box } from '@mui/material';
import { SEG } from '@/models/common/CommonSelectCodes';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, callApiForFile, Method } from '@utils/ApiUtil';
import { useCommonOptionsStore } from '@/store/commonCodes';
import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';
import { useActivate } from 'react-activation';

import {
  EtsButton,
  EtsExport,
  EtsExportButton,
  EtsExportButtonOption,
} from '@/components/EtsCommon';
import { EtsSelectComponent, EtsDatePickerComponent } from '@/components/EtsComponents';

type Kets = {
  id: number;
  seg: string;
  sactyp: string;
  fuelConsQ: string;
  unit: string;
  uncertainty: string;
  fltCnt: number;
  ltoCo2: number;
  ltoCh4: number;
  ltoN2o: number;
  ltoFactor: number;
  emissionCo2: number | null;
  emissionCh4: number | null;
  emissionN2o: number | null;
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  acType: string;
  seg: string;
};

const KEtsPage = () => {
  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.IdPreset({
      field: 'id',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'seg',
      headerName: 'Seg',
      width: 124,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'sactyp',
      headerName: 'A/C Type',
      width: 124,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelConsQ',
      headerName: 'Fuel Cons',
      width: 124,
      flex: 1,
      context: {
        formatType: 'number',
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'unit',
      headerName: 'Unit',
      width: 124,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'uncertainty',
      headerName: 'Uncrtnty (%)',
      width: 124,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fltCnt',
      headerName: 'LTO Count',
      width: 124,
      flex: 1,
    }),
    {
      headerName: 'LTO EF (kgGHG/LTO)',
      headerClass: 'bg-orange',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'ltoCo2',
          headerName: 'CO2',
          headerClass: 'bg-orange',
          width: 158,
          flex: 1,
          context: {
            formatType: 'number',
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'ltoCh4',
          headerName: 'CH4',
          headerClass: 'bg-orange',
          width: 158,
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'ltoN2o',
          headerName: 'N2O',
          headerClass: 'bg-orange',
          width: 158,
          flex: 1,
        }),
      ],
    },
    EtsColumnPreset.TextPreset({
      field: 'ltoFactor',
      headerClass: 'bg-red',
      headerName: 'EF/LTO (kg)',
      width: 124,
      flex: 1,
      context: {
        formatType: 'number',
      },
    }),
    {
      headerName: 'Emission',
      headerClass: 'bg-light-green',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'emissionCo2',
          headerName: 'CO2 (t)',
          headerClass: 'bg-light-green',
          width: 158,
          flex: 1,
          context: {
            formatType: 'number',
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'emissionCh4',
          headerName: 'CH4 (kg)',
          headerClass: 'bg-light-green',
          width: 158,
          flex: 1,
          context: {
            formatType: 'number',
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'emissionN2o',
          headerName: 'N2O (kg)',
          headerClass: 'bg-light-green',
          width: 158,
          flex: 1,
          context: {
            formatType: 'number',
          },
        }),
      ],
    },
  ];

  const getQueryParams = () => {
    const sendParams = {
      startDate: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
      endDate: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
      sactyp: watch('acType') === 'ALL' ? '' : watch('acType'),
      seg: watch('seg') === 'all' ? '' : watch('seg'),
    };

    return sendParams;
  };

  /**
   * @description RowData Excel 다운로드
   */
  const handleExport = async () => {
    const queryParams = getQueryParams();

    callApiForFile({
      service: Service.POSTMAN,
      url: '/api/v1/reporting/kets/export',
      method: Method.GET,
      params: {
        queryParams,
      },
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

  const gridRef = useRef<EtsGridRef<Kets>>(null);
  const { toast } = useNotify();
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());
  const actypeOptions = useCommonOptionsStore((s) => s.acTypeOptions);
  const [rowData, setRowData] = useState<Kets[]>([]);
  const [_, setTotalCount] = useState(0);

  useActivate(() => {
    // 데이터가 있으면 재조회 실행
    if (rowData && rowData.length > 0) {
      handleSubmit(onSearch)();
    }
  });

  const exportOptions: EtsExportButtonOption[] = [
    {
      value: 'summary',
      label: 'Summary',
      onClick: () => {
        const currentDate = dayjs().format('YYYYMMDD');
        const fileName = `${currentDate}_k_ets_summary.xlsx`;
        EtsExport({
          gridRef,
          fileName,
        });
      },
    },
    {
      value: 'rawdata',
      label: 'Raw Data',
      onClick: handleExport,
    },
  ];

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      startDate: dayjs().startOf('month').format('YYYYMMDD'),
      endDate: endRangeDate?.format('YYYYMMDD'),
      acType: 'ALL',
      seg: 'all',
    },
    mode: 'onChange',
  });

  const onSearch: SubmitHandler<FormValues> = () => {
    const sendParams = getQueryParams();

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/reporting/kets',
      method: Method.GET,
      params: {
        queryParams: sendParams,
      },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      setRowData(res.data);
      setTotalCount(res.ItemCount ?? 0);
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
            name="acType"
            label="A/C type"
            options={actypeOptions}
          />
          <EtsSelectComponent control={control} name="seg" label="Seg" options={SEG} />
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
        <EtsExportButton options={exportOptions}>Export</EtsExportButton>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <PageTemplate
      title="K ETS"
      gridRef={gridRef}
      columnDefs={columnDefs}
      searchComponent={searchComponent}
      buttonComponent={buttonComponent}
      rowData={rowData}
    />
  );
};
export default KEtsPage;
