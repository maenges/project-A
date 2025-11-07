import { buttonForm, searchForm } from '@/assets/style';
import {
  EtsAutoCompleteComponent,
  EtsSelectComponent,
  EtsYearSelectComponent,
} from '@components/EtsComponents';
import {
  EtsButton,
  EtsButtonTabs,
  EtsExport,
  EtsExportButton,
  EtsExportButtonOption,
  EtsTabs,
} from '@components/EtsCommon';
import { EtsColumnPreset, EtsGridRef } from '@components/EtsGrid';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { useMemo, useRef, useState, useCallback } from 'react';
import { useCommonOptionsStore } from '@/store/commonCodes.ts';
import { Box } from '@mui/material';
import TabSearchArea from '../../../../components/Teamplate/TabSearchArea.tsx';
import TabBottomArea from '../../../../components/Teamplate/TabBottomArea.tsx';
import { DOM_INT } from '@models/common/CommonSelectCodes.ts';
import { useNotify } from '@hooks/useNotify.ts';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import styled from 'styled-components';
import { useActivate } from 'react-activation';
import { callApi, callApiForFile, Method } from '@/utils';
import { Service } from '@models/common/Service.ts';
import dayjs from 'dayjs';

const ButtonFrame = styled(Box)`
  display: flex;
  align-items: flex-end;
  gap: 40px;
`;

type FormValues = {
  year: string;
  domInt: string;
  acType: string;
  type: string;
};

interface TkData {
  sactyp: string;
  domInt: string;
  totalPaxCnt: number;
  totalPaxTk: number;
  totalCgoWeight: number;
  totalCgoTk: number;
  totalTk: number;
}

interface Tier1Data {
  sactyp: string;
  domInt: string;
  totalFltCnt: number;
  totalFuelConsUsgOrLbs: number;
  totalFuelConsLiter: number;
  totalFuelConsTonne: number;
  totalEmissionTonne: number;
}

interface Tier2Data {
  sactyp: string;
  domInt: string;
  totalFltCnt: number;
  totalFuelConsTonne: number;
  avgFuelConsPerLtoKg: number;
  totalFuelConsLtoTonne: number;
  totalFuelConsCruiseTonne: number;
  avgLtoEmissionFactor: number;
  avgCruiseEmissionFactor: number;
  totalLtoEmissionTonne: number;
  totalCruiseEmissionTonne: number;
  totalEmissionTonne: number;
}

type TabType = 'TK' | 'Tier1' | 'Tier2';
type EmissionType = 'CO2eq' | 'CO2' | 'CH4' | 'N2O' | 'NOx' | 'CO' | 'NMVOC' | 'SO2';

const KEPage = () => {
  const [rowTkData, setRowTkData] = useState<TkData[]>([]);
  const [rowTier1Data, setRowTier1Data] = useState<Tier1Data[]>([]);
  const [rowTier2Data, setRowTier2Data] = useState<Tier2Data[]>([]);

  const gridRefTk = useRef<EtsGridRef<TkData>>(null);
  const gridRefTier1 = useRef<EtsGridRef<Tier1Data>>(null);
  const gridRefTier2 = useRef<EtsGridRef<Tier2Data>>(null);

  const [totalTkCount, setTotalTkCount] = useState(0);
  const [totalTier1Count, setTotalTier1Count] = useState(0);
  const [totalTier2Count, setTotalTier2Count] = useState(0);

  const tabList = useMemo(
    () => [
      { label: 'TK Historical Summary', value: 'TK' as TabType },
      { label: 'Tier 1 Historical Summary', value: 'Tier1' as TabType },
      { label: 'Tier 2 Historical Summary', value: 'Tier2' as TabType },
    ],
    []
  );

  const [selectedTab, setSelectedTab] = useState<TabType>('TK');
  const [activeTabType, setActiveTabType] = useState<EmissionType>('CO2eq');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { toast } = useNotify();
  const acTypeData = useCommonOptionsStore((s) => s.acTypeOptions);

  const { control, handleSubmit, watch, setValue, setFocus } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      year: '2007',
      domInt: DOM_INT[0].value,
      acType: 'ALL',
      type: 'CO2eq',
    },
  });

  const resetData = useCallback(() => {
    setRowTkData([]);
    setRowTier1Data([]);
    setRowTier2Data([]);
    setTotalTkCount(0);
    setTotalTier1Count(0);
    setTotalTier2Count(0);
    setHasSearched(false);
  }, []);

  useActivate(resetData);

  const buildQueryParams = useCallback(
    (includeType = false) => {
      const formValues = watch();
      return {
        year: formValues.year,
        sactyp: formValues.acType === 'ALL' ? '' : formValues.acType,
        domInt: formValues.domInt === 'all' ? '' : formValues.domInt,
        ...(includeType && { type: formValues.type }),
      };
    },
    [watch]
  );

  const fetchTkData = useCallback(async () => {
    const queryParams = buildQueryParams();
    return callApi({
      service: Service.POSTMAN,
      url: '/api/v1/historical-summary/tk',
      method: Method.GET,
      params: { queryParams },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowTkData([]);
        setTotalTkCount(0);
        return;
      }
      setRowTkData(res.data);
      setTotalTkCount(res.ItemCount ?? 0);
    });
  }, [buildQueryParams, toast]);

  const fetchTier1Data = useCallback(async () => {
    const queryParams = buildQueryParams();
    return callApi({
      service: Service.POSTMAN,
      url: '/api/v1/historical-summary/tier1-emission',
      method: Method.GET,
      params: { queryParams },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowTier1Data([]);
        setTotalTier1Count(0);
        return;
      }
      setRowTier1Data(res.data);
      setTotalTier1Count(res.ItemCount ?? 0);
    });
  }, [buildQueryParams, toast]);

  const fetchTier2Data = useCallback(async () => {
    const queryParams = buildQueryParams(true);
    return callApi({
      service: Service.POSTMAN,
      url: '/api/v1/historical-summary/tier2-emission',
      method: Method.GET,
      params: { queryParams },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowTier2Data([]);
        setTotalTier2Count(0);
        return;
      }
      setRowTier2Data(res.data);
      setTotalTier2Count(res.ItemCount ?? 0);
    });
  }, [buildQueryParams, toast]);

  const onSubmit: SubmitHandler<FormValues> = useCallback(async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      await Promise.all([fetchTkData(), fetchTier1Data(), fetchTier2Data()]);
    } catch (err) {
      toast.error('API 호출을 실패하였습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchTkData, fetchTier1Data, fetchTier2Data, toast]);

  const onInvalid = useCallback(
    (errors: FieldErrors<FormValues>) => {
      const firstErrorField = Object.keys(errors)[0] as keyof FormValues;
      if (firstErrorField) setFocus(firstErrorField);
    },
    [setFocus]
  );

  const searchComponent = useMemo(
    () => (
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <searchForm.Container>
          <searchForm.Row>
            <EtsYearSelectComponent
              control={control}
              name="year"
              label="Year"
              minYear={2007}
              maxYear={2009}
            />
            <EtsSelectComponent control={control} name="domInt" label="Dom/Int" options={DOM_INT} />
            <EtsAutoCompleteComponent
              control={control}
              name="acType"
              label="A/C type"
              options={acTypeData}
            />
          </searchForm.Row>
        </searchForm.Container>
        <searchForm.ButtonContainer>
          <searchForm.Row sx={{ justifyContent: 'flex-end' }}>
            <EtsButton
              type="blue"
              onClick={() => {
                if (isLoading) return;
                handleSubmit(onSubmit, onInvalid)();
              }}
            >
              Search
            </EtsButton>
          </searchForm.Row>
        </searchForm.ButtonContainer>
      </form>
    ),
    [control, acTypeData, isLoading, handleSubmit, onSubmit, onInvalid]
  );

  const columnTkDefs = useMemo<ColDef[]>(
    () => [
      EtsColumnPreset.TextPreset({
        field: 'sactyp',
        headerName: 'A/C Type',
        flex: 1,
        cellDataType: 'text',
      }),
      EtsColumnPreset.TextPreset({
        field: 'domInt',
        headerName: 'Dom/Int',
        flex: 1,
        cellDataType: 'text',
      }),
      EtsColumnPreset.TextPreset({
        field: 'totalPaxCnt',
        headerName: 'PAX Cnt',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'totalPaxTk',
        headerName: 'PAX TK',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'totalCgoWeight',
        headerName: 'CGO Mass (t)',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'totalCgoTk',
        headerName: 'CGO TK',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'totalTk',
        headerName: 'Total TK',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
        },
      }),
    ],
    []
  );

  const columnTier1Defs = useMemo<ColDef[]>(
    () => [
      EtsColumnPreset.TextPreset({
        field: 'sactyp',
        headerName: 'A/C Type',
        flex: 1,
        cellDataType: 'text',
      }),
      EtsColumnPreset.TextPreset({
        field: 'domInt',
        headerName: 'Dom/Int',
        flex: 1,
        cellDataType: 'text',
      }),
      EtsColumnPreset.TextPreset({
        field: 'totalFltCnt',
        headerName: 'FLT Count',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'totalFuelConsLiter',
        headerName: 'Fuel Cons (L)',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
          decimalPlaces: 3,
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'totalFuelConsTonne',
        headerName: 'Fuel Cons (t)',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
          decimalPlaces: 3,
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'totalEmissionTonne',
        headerName: 'CO2 Emission (t)',
        flex: 1,
        cellDataType: 'number',
        context: {
          formatType: 'number',
          decimalPlaces: 3,
        },
      }),
    ],
    []
  );

  const columnTier2Defs = useMemo<(ColDef | ColGroupDef)[]>(
    () => [
      EtsColumnPreset.TextPreset({
        field: 'sactyp',
        headerName: 'A/C Type',
        flex: 1,
        cellDataType: 'text',
      }),
      EtsColumnPreset.TextPreset({
        field: 'domInt',
        headerName: 'Dom/Int',
        flex: 1,
        cellDataType: 'text',
      }),
      EtsColumnPreset.TextPreset({
        field: 'totalFltCnt',
        headerName: 'FLT Count',
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
            field: 'totalFuelConsTonne',
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
            field: 'avgFuelConsPerLtoKg',
            headerName: '/ LTO (kg)',
            headerClass: 'bg-orange',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
            },
          }),
          EtsColumnPreset.TextPreset({
            field: 'totalFuelConsLtoTonne',
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
            field: 'totalFuelConsCruiseTonne',
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
            field: 'avgLtoEmissionFactor',
            headerName: 'LTO',
            headerClass: 'bg-red',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 2,
            },
          }),
          EtsColumnPreset.TextPreset({
            field: 'avgCruiseEmissionFactor',
            headerName: 'Cruise',
            headerClass: 'bg-red',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 2,
            },
          }),
        ],
      },
      {
        headerName: 'Emission (t)',
        headerClass: 'bg-teal',
        children: [
          EtsColumnPreset.TextPreset({
            field: 'totalLtoEmissionTonne',
            headerName: 'LTO',
            headerClass: 'bg-teal',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 3,
            },
          }),
          EtsColumnPreset.TextPreset({
            field: 'totalCruiseEmissionTonne',
            headerName: 'Cruise',
            headerClass: 'bg-teal',
            flex: 1,
            cellDataType: 'number',
            context: {
              formatType: 'number',
              decimalPlaces: 3,
            },
          }),
          EtsColumnPreset.TextPreset({
            field: 'totalEmissionTonne',
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
    ],
    []
  );

  const getCurrentTabData = useCallback(() => {
    switch (selectedTab) {
      case 'TK':
        return { data: rowTkData, gridRef: gridRefTk };
      case 'Tier1':
        return { data: rowTier1Data, gridRef: gridRefTier1 };
      case 'Tier2':
        return { data: rowTier2Data, gridRef: gridRefTier2 };
    }
  }, [selectedTab, rowTkData, rowTier1Data, rowTier2Data]);

  const handleSummaryExport = useCallback(async () => {
    const config = getCurrentTabData();

    if (!hasSearched || config.data.length === 0) {
      toast.error('조회된 데이터가 없습니다. 먼저 검색을 해주세요.');
      return;
    }

    try {
      const fileName = `${dayjs().format('YYYYMMDD')}_emission_history_${selectedTab}.xlsx`;
      EtsExport({ gridRef: config.gridRef, fileName });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('다운로드에 실패하였습니다. 잠시 후 다시 시도해주세요');
    }
  }, [selectedTab, getCurrentTabData, hasSearched, toast]);

  const exportUrls = useMemo(
    () => ({
      TK: '/api/v1/historical-summary/tk/export',
      Tier1: '/api/v1/historical-summary/tier1-emission/export',
      Tier2: '/api/v1/historical-summary/tier2-emission/export',
    }),
    []
  );

  const handleRawDataExport = useCallback(async () => {
    const queryParams = buildQueryParams();
    const url = exportUrls[selectedTab];

    try {
      const res = await callApiForFile({
        service: Service.POSTMAN,
        url,
        method: Method.GET,
        params: { queryParams },
        config: { isLoading: true },
      });

      if (res.successOrNot !== 'Y') {
        toast.error('다운로드에 실패하였습니다. 잠시 후 다시 시도해주세요');
        return;
      }

      if (res.data) {
        const link = document.createElement('a');
        link.href = res.data;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Raw data export error:', error);
      toast.error('다운로드에 실패하였습니다. 잠시 후 다시 시도해주세요');
    }
  }, [selectedTab, exportUrls, buildQueryParams, toast]);

  const handleTabClick = useCallback(
    async (tabType: EmissionType) => {
      setActiveTabType(tabType);
      setValue('type', tabType);

      if (hasSearched) {
        setIsLoading(true);
        try {
          await fetchTier2Data();
        } finally {
          setIsLoading(false);
        }
      }
    },
    [hasSearched, setValue, fetchTier2Data]
  );

  const tier2Tabs = useMemo(
    () => [
      { label: 'CO2eq', value: 'CO2eq' as EmissionType },
      { label: 'CO2', value: 'CO2' as EmissionType },
      { label: 'CH4', value: 'CH4' as EmissionType },
      { label: 'N2O', value: 'N2O' as EmissionType },
      { label: 'NOx', value: 'NOx' as EmissionType },
      { label: 'CO', value: 'CO' as EmissionType },
      { label: 'NMVOC', value: 'NMVOC' as EmissionType },
      { label: 'SO2', value: 'SO2' as EmissionType },
    ],
    []
  );

  const exportOptions = useMemo<EtsExportButtonOption[]>(
    () => [
      { value: 'summary', label: 'Summary', onClick: handleSummaryExport },
      { value: 'rawdata', label: 'Raw Data', onClick: handleRawDataExport },
    ],
    [handleSummaryExport, handleRawDataExport]
  );

  const buttonComponent = useMemo(
    () => (
      <buttonForm.Container>
        <buttonForm.Row>
          <ButtonFrame>
            {selectedTab === 'Tier2' && hasSearched && (
              <EtsButtonTabs
                activeTab={activeTabType}
                onTabClick={handleTabClick}
                tabs={tier2Tabs}
              />
            )}
          </ButtonFrame>
          <EtsExportButton options={exportOptions} disabled={!hasSearched}>
            Export
          </EtsExportButton>
        </buttonForm.Row>
      </buttonForm.Container>
    ),
    [selectedTab, activeTabType, handleTabClick, tier2Tabs, exportOptions, hasSearched]
  );

  return (
    <Box>
      <TabSearchArea title="Historical Summary - KE" searchComponent={searchComponent} />
      <EtsTabs
        tabs={tabList}
        value={selectedTab}
        onChange={(tab) => setSelectedTab(tab as TabType)}
        sx={{ mb: 1 }}
      />
      <TabBottomArea
        visible={selectedTab === 'TK'}
        gridRef={gridRefTk}
        columnDefs={columnTkDefs}
        rowData={rowTkData}
        totalCount={totalTkCount}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
      />
      <TabBottomArea
        visible={selectedTab === 'Tier1'}
        gridRef={gridRefTier1}
        columnDefs={columnTier1Defs}
        rowData={rowTier1Data}
        totalCount={totalTier1Count}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
      />
      <TabBottomArea
        visible={selectedTab === 'Tier2'}
        gridRef={gridRefTier2}
        columnDefs={columnTier2Defs}
        rowData={rowTier2Data}
        totalCount={totalTier2Count}
        buttonComponent={buttonComponent}
        showPinnedBottom={true}
      />
    </Box>
  );
};

export default KEPage;
