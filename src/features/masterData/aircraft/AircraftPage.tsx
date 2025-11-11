import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { searchForm, buttonForm } from '@/assets/style';

import {
  EtsExportButton,
  EtsExportButtonOption,
  EtsButton,
  EtsExport,
  EtsSelectOption,
} from '@/components/EtsCommon';
import { EtsYearSelectComponent, EtsSelectComponent } from '@/components/EtsComponents';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { PageTemplate } from '@/components/Teamplate';
import { useCommonOptionsStore } from '@/store/commonCodes';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useNotify } from '@hooks/useNotify';
import { useActivate } from 'react-activation';
import dayjs from 'dayjs';

type AircraftData = {
  id: number;
  icaoActyp: string;
  sactyp: string;
  gactyp: string;
  acver: string;
  regno: string;
  paxY: boolean;
  mtowLb: number;
  bodyType: string;
  acarsY: boolean;
  obdUncertainty: string;
  uncertaintySrc: string;
  fuelType: string;
  fuelUpliftSrc: string;
  fuelUpliftMsr: string;
  fuelDensitySrc: string;
  fuelConsumptionMthd: string;
  maxUncertainty: string;
  registationDate: string | null;
  cancelDate: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  [key: string]: any;
};

type FormValues = {
  year: string;
  actyp: string;
};

const AircraftPage = () => {
  const [isEditable, setIsEditable] = useState(false);
  const gridRef = useRef<EtsGridRef<AircraftData>>(null);
  const [rowData, setRowData] = useState<AircraftData[]>([]);
  const { confirm, toast } = useNotify();
  const [totalCount, setTotalCount] = useState(0);

  const actypeOptions = useCommonOptionsStore((s) => s.acTypeOptions);
  // 기본 연도 범위(서버 실패 대비 더미) 최근 5년
  const defaultYears = Array.from({ length: 5 }, (_, i) => dayjs().year() - i);
  const [yearOptions, setYearOptions] = useState<number[]>(defaultYears);

  useActivate(() => {
    // 편집 상태 초기화
    if (isEditable) {
      setIsEditable(false);
    }

    // 데이터가 있으면 재조회 실행
    if (rowData.length > 0) {
      handleSubmit(onSearch)();
    }
  });

  useEffect(() => {
    // 서버가 동작하지 않아도 기본 연도는 보이도록 처리
    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/common/operation-years',
      method: Method.GET,
      params: {},
      config: { isLoading: false },
    })
      .then((res) => {
        if (res.successOrNot !== 'Y') return;
        if (Array.isArray(res.data) && res.data.length > 0) {
          setYearOptions(res.data);
        }
      })
      .catch(() => {
        // ignore - fallback(defaultYears) 유지
      });
  }, []);

  // 더미 데이터 (DB 미가동 시 스타일 확인용)
  const DUMMY_DATA: AircraftData[] = [
    {
      id: 1,
      icaoActyp: 'A320',
      sactyp: 'A320',
      gactyp: 'A320',
      acver: 'NEO',
      regno: 'HL8001',
      paxY: true,
      mtowLb: 162000,
      bodyType: 'N',
      acarsY: true,
      obdUncertainty: 'Low',
      uncertaintySrc: 'Airbus Spec',
      fuelType: 'Jet A1',
      fuelUpliftSrc: 'Fuel Slip',
      fuelUpliftMsr: 'Fuel Supplier',
      fuelDensitySrc: 'Fuel Slip',
      fuelConsumptionMthd: 'Method A ',
      maxUncertainty: 'Tier 1',
      registationDate: '2020-01-01',
      cancelDate: null,
      createdAt: '2020-01-01',
      createdBy: 'system',
      updatedAt: '2020-06-01',
      updatedBy: 'system',
    },
    {
      id: 2,
      icaoActyp: 'B738',
      sactyp: 'B738',
      gactyp: 'B738',
      acver: 'MAX',
      regno: 'HL8002',
      paxY: true,
      mtowLb: 174000,
      bodyType: 'N',
      acarsY: false,
      obdUncertainty: 'Medium',
      uncertaintySrc: 'Boeing Spec',
      fuelType: 'Jet A1',
      fuelUpliftSrc: 'Log Sheet',
      fuelUpliftMsr: 'On-board',
      fuelDensitySrc: 'On-board',
      fuelConsumptionMthd: 'Method B',
      maxUncertainty: 'Tier 2',
      registationDate: '2021-02-14',
      cancelDate: null,
      createdAt: '2021-02-14',
      createdBy: 'system',
      updatedAt: '2021-03-01',
      updatedBy: 'system',
    },
    {
      id: 3,
      icaoActyp: 'A359',
      sactyp: 'A359',
      gactyp: 'A359',
      acver: '900',
      regno: 'HL8003',
      paxY: true,
      mtowLb: 617300,
      bodyType: 'W',
      acarsY: true,
      obdUncertainty: 'Low',
      uncertaintySrc: 'Airbus Spec',
      fuelType: 'Jet A1',
      fuelUpliftSrc: 'Fuel Slip',
      fuelUpliftMsr: 'Fuel Supplier',
      fuelDensitySrc: 'Fuel Slip',
      fuelConsumptionMthd: 'Method A ',
      maxUncertainty: 'Tier 1',
      registationDate: '2022-05-20',
      cancelDate: null,
      createdAt: '2022-05-20',
      createdBy: 'system',
      updatedAt: '2022-10-01',
      updatedBy: 'system',
    },
    {
      id: 4,
      icaoActyp: 'B77W',
      sactyp: 'B77W',
      gactyp: 'B77W',
      acver: '300ER',
      regno: 'HL8004',
      paxY: true,
      mtowLb: 775000,
      bodyType: 'W',
      acarsY: false,
      obdUncertainty: 'High',
      uncertaintySrc: 'Other',
      fuelType: 'Jet A1',
      fuelUpliftSrc: 'Fuel Slip',
      fuelUpliftMsr: 'On-board',
      fuelDensitySrc: 'On-board',
      fuelConsumptionMthd: 'Method B',
      maxUncertainty: 'Tier 2',
      registationDate: '2019-07-11',
      cancelDate: null,
      createdAt: '2019-07-11',
      createdBy: 'system',
      updatedAt: '2020-01-05',
      updatedBy: 'system',
    },
  ];

  const exportOptions: EtsExportButtonOption[] = [
    {
      value: 'summary',
      label: 'Summary',
      onClick: () => {
        const currentDate = dayjs().format('YYYYMMDD');
        const fileName = `${currentDate}_aircraft_summary.xlsx`;
        EtsExport({
          gridRef,
          fileName,
        });
      },
    },
  ];

  const bodyTypeOption: EtsSelectOption[] = [
    { label: 'W', value: 'W' },
    { label: 'N', value: 'N' },
  ];

  const acarsOption: EtsSelectOption[] = [
    { label: 'Y', value: 'Y' },
    { label: 'N', value: 'N' },
  ];

  const uncrntnySourceOption: EtsSelectOption[] = [
    { label: 'Airbus Spec', value: 'Airbus Spec' },
    { label: 'Boeing Spec', value: 'Boeing Spec' },
    { label: 'Other', value: 'Other' },
  ];

  const fuelTypeOption: EtsSelectOption[] = [
    { label: 'Jet A1', value: 'Jet A1' },
    { label: 'Jet Gasoline', value: 'Jet Gasoline' },
  ];

  const upliftSourceOption: EtsSelectOption[] = [
    { label: 'Fuel Slip', value: 'Fuel Slip' },
    { label: 'Log Sheet', value: 'Log Sheet' },
  ];

  const upliftMeasureOption: EtsSelectOption[] = [
    { label: 'Fuel Supplier', value: 'Fuel Slip' },
    { label: 'On-board', value: 'On-board' },
  ];

  const densitySourceOption: EtsSelectOption[] = [
    { label: 'Fuel Slip', value: 'Fuel Slip' },
    { label: 'On-board', value: 'On-board' },
  ];

  const consMethodOption: EtsSelectOption[] = [
    { label: 'Method A ', value: 'Method A ' },
    { label: 'Method B', value: 'Method B' },
  ];

  const maxUncrntnyOption: EtsSelectOption[] = [
    { label: 'Tier 1', value: 'Tier 1' },
    { label: 'Tier 2', value: 'Tier 2' },
  ];

  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Aircraft Property',
      children: [
        EtsColumnPreset.IdPreset({
          field: 'id',
          headerName: 'id',
          hide: true,
        }),
        EtsColumnPreset.TextPreset({
          field: 'icaoActyp',
          headerName: 'ICAO',
          width: 67.5,
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'sactyp',
          headerName: 'A/C Type',
          width: 67.5,
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'gactyp',
          headerName: 'gactyp',
          hide: true,
        }),
        EtsColumnPreset.TextPreset({
          field: 'acver',
          headerName: 'A/C Ver',
          width: 67.5,
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'regno',
          headerName: 'A/C Reg',
          width: 67.5,
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'mtowLb',
          headerName: 'MTOW',
          width: 80,
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'paxY',
          headerName: 'FLT Type',
          width: 100,
          flex: 1,
        }),
        EtsColumnPreset.SelectPreset({
          field: 'bodyType',
          headerName: 'Body Type',
          editable: isEditable,
          width: 100,
          flex: 1,
          context: {
            options: bodyTypeOption,
          },
        }),
      ],
    },
    {
      headerName: 'ETS Information',
      children: [
        EtsColumnPreset.SelectPreset({
          field: 'acarsY',
          headerName: 'ACARS',
          editable: isEditable,
          width: 100,
          flex: 1,
          context: {
            options: acarsOption,
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'obdUncertainty',
          headerName: 'Uncrntny',
          editable: isEditable,
          width: 133.75,
          flex: 1,
        }),
        EtsColumnPreset.SelectPreset({
          field: 'uncertaintySrc',
          headerName: 'Uncrntny\nSource',
          editable: isEditable,
          width: 133.75,
          flex: 1,
          context: {
            options: uncrntnySourceOption,
          },
        }),
        EtsColumnPreset.SelectPreset({
          field: 'fuelType',
          headerName: 'Fuel\nType',
          editable: isEditable,
          width: 133.75,
          flex: 1,
          context: {
            options: fuelTypeOption,
          },
        }),
        EtsColumnPreset.SelectPreset({
          field: 'fuelUpliftSrc',
          headerName: 'Uplift\nSource',
          editable: isEditable,
          width: 133.75,
          flex: 1,
          context: {
            options: upliftSourceOption,
          },
        }),
        EtsColumnPreset.SelectPreset({
          field: 'fuelUpliftMsr',
          headerName: 'Uplift\nMeasure',
          editable: isEditable,
          width: 133.75,
          flex: 1,
          context: {
            options: upliftMeasureOption,
          },
        }),
        EtsColumnPreset.SelectPreset({
          field: 'fuelDensitySrc',
          headerName: 'Density\nSource',
          editable: isEditable,
          width: 133.75,
          flex: 1,
          context: {
            options: densitySourceOption,
          },
        }),
        EtsColumnPreset.SelectPreset({
          field: 'fuelConsumptionMthd',
          headerName: 'Cons\nMethod',
          editable: isEditable,
          width: 133.75,
          flex: 1,
          context: {
            options: consMethodOption,
          },
        }),
        EtsColumnPreset.SelectPreset({
          field: 'maxUncertainty',
          headerName: 'Max\nUncrntny',
          editable: isEditable,
          width: 133.75,
          flex: 1,
          context: {
            options: maxUncrntnyOption,
          },
        }),
        EtsColumnPreset.TextPreset({
          field: 'registationDate',
          headerName: 'registationDate',
          hide: true,
        }),
        EtsColumnPreset.TextPreset({
          field: 'createdAt',
          headerName: 'createdAt',
          hide: true,
        }),
        EtsColumnPreset.TextPreset({
          field: 'createdBy',
          headerName: 'createdBy',
          hide: true,
        }),
        EtsColumnPreset.TextPreset({
          field: 'updatedAt',
          headerName: 'updatedAt',
          hide: true,
        }),
        EtsColumnPreset.TextPreset({
          field: 'updatedBy',
          headerName: 'updatedBy',
          hide: true,
        }),
      ],
    },
    EtsColumnPreset.TextPreset({
      field: 'cancelDate',
      headerName: 'Cancel\nDate',
      width: 100,
      flex: 1,
    }),
  ];

  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      year: dayjs().format('YYYY'),
      actyp: 'ALL',
    },
    mode: 'onChange',
  });

  const onSearch: SubmitHandler<FormValues> = async () => {
    // DB 미가동 시 더미 데이터로 검색 결과 대체
    const actyp = watch('actyp');

    // 간단한 타입 필터링 (연도는 현재 더미에서 사용하지 않음)
    const filtered = DUMMY_DATA.filter((row) =>
      actyp === 'ALL' ? true : row.icaoActyp?.toUpperCase().includes(actyp.toUpperCase())
    );

    // rowData state는 AircraftData[] (acarsY: boolean) 필요하므로 변환없이 그대로 사용
    setRowData(filtered);
    setTotalCount(filtered.length);
  };

  // 모든 컬럼에서 editable: true인 field만 추출
  const getEditableFields = () => {
    return columnDefs
      .flatMap((col) => ('children' in col ? col.children : [col]))
      .filter((col): col is ColDef => 'editable' in col && !!col.editable)
      .map((col) => col.field as string);
  };

  // 저장 시 데이터 치환 표기
  const filterEditableData = (data: AircraftData[]) => {
    const editableFields = getEditableFields();
    return data.map((row) => {
      const filtered: Partial<AircraftData> = {};
      editableFields.forEach((field) => {
        let value = row[field];
        if (field === 'acarsY') {
          value = value === 'Y' ? true : false;
        }
        filtered[field] = value;
      });
      // id 등 PK는 꼭 포함해야 하면 추가
      if ('id' in row) filtered.id = row.id;
      return filtered;
    });
  };

  // 수정 API
  const handleGetModifiedData = async () => {
    const modifiedData = gridRef.current?.getRowsByStatus() || {
      delete: [],
      update: [],
      insert: [],
      all: [],
    };

    const apiConfigs = [
      { key: 'insert', method: Method.POST, success: '등록 되었습니다.', fail: '등록 실패' },
      { key: 'update', method: Method.PUT, success: '수정 되었습니다.', fail: '수정 실패' },
      { key: 'delete', method: Method.DELETE, success: '삭제 되었습니다.', fail: '삭제 실패' },
    ] as const;

    // 각 API 호출을 Promise로 묶어서 처리
    const promises = apiConfigs.map(({ key, method, success }) => {
      const filtered = filterEditableData(modifiedData[key as keyof typeof modifiedData]);
      if (filtered.length > 0) {
        return callApi({
          service: Service.POSTMAN,
          url: '/api/v1/aircraft',
          method,
          params: {
            bodyParams: filtered,
          },
          config: { isLoading: true },
        }).then((res) => {
          if (res.successOrNot !== 'Y') {
            toast.error(res.HeaderMsg);
            return Promise.reject(res.HeaderMsg);
          }
          toast.success(success);
          return res;
        });
      }
      return Promise.resolve();
    });

    // 모든 저장이 끝난 후에 Search 실행
    await Promise.all(promises);
    await handleSubmit(onSearch)();
    setIsEditable(false);
  };

  const searchComponent = (
    <form onSubmit={handleSubmit(onSearch)}>
      <searchForm.Container>
        <searchForm.Row>
          <EtsYearSelectComponent
            control={control}
            name="year"
            label="Year"
            minYear={yearOptions[yearOptions.length - 1]}
            maxYear={yearOptions[0]}
          />
          <EtsSelectComponent
            control={control}
            name="actyp"
            label="A/C Type"
            options={actypeOptions}
          />
        </searchForm.Row>
      </searchForm.Container>
      <searchForm.ButtonContainer>
        <searchForm.Row sx={{ justifyContent: 'flex-end' }}>
          <EtsButton
            type="green"
            onClick={() => {
              handleSubmit(onSearch)();
              setIsEditable(false);
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
                const question = await confirm('수정하시겠습니까?');
                if (question) {
                  await handleGetModifiedData();
                }
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
            <EtsExportButton options={exportOptions} disabled={rowData.length === 0}>
              Export
            </EtsExportButton>
          </>
        )}
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <PageTemplate
      title="Aircraft"
      columnDefs={columnDefs}
      rowData={rowData}
      searchComponent={searchComponent}
      buttonComponent={buttonComponent}
      totalCount={totalCount}
      gridRef={gridRef}
      // size="sm-two-header"
    />
  );
};

export default AircraftPage;
