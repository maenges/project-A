import { useState, useRef, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Box, Typography, Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { ColDef } from 'ag-grid-community';

import checkSvg from '@/assets/images/checked.svg';
import circleMinusSvg from '@/assets/images/circle-minus.svg';
import deleteSvg from '@/assets/images/delete-text.svg';
import { searchForm, buttonForm } from '@/assets/style';

import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
import { useCommonOptionsStore } from '@/store/commonCodes';
import dayjs, { Dayjs } from 'dayjs';

import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { EtsSelectComponent } from '@/components/EtsComponents';
import { EtsSelect, EtsDatePicker, EtsButton, EtsModal } from '@/components/EtsCommon';
import { PageTemplate } from '@/components/Teamplate';
import { styled } from 'styled-components';
import { useActivate } from 'react-activation';

import EmissionFactorTierModal from './EmissionFactorTierModal';

const Bar = styled.div`
  display: flex;
  height: 70%;
  width: 1px;
  border-right: 1px solid #a4a4a4;
`;

const EmissionFactorPage = () => {
  type RowType = {
    factorId: string;
    revisionId: string;
    division: string;
    emissionFactor: string;
    fuelConsumptionQ: string;
    co2: string;
    ch4: string;
    n2o: string;
    nox: string;
    co: string;
    nmvoc: string;
    so2: string;
    co2eq: string | null;
    createdBy: string | null;
    [key: string]: any;
  };

  type ApiType = {
    id: string;
    revisionCode: string;
    revisionStartDt: string;
    revisionEndDt: string | null;
    status: string;
    actyp: string;
    details: {
      factorId: string;
      revisionId: string;
      division: string;
      emissionFactor: string;
      fuelConsumptionQ: string;
      co2: string;
      ch4: string;
      n2o: string;
      nox: string;
      co: string;
      nmvoc: string;
      so2: string;
      co2eq: string;
      createdBy: string;
    }[];
  };

  const [isEditable, setIsEditable] = useState(false);
  const gridRef = useRef<EtsGridRef<RowType>>(null);
  const [revisionOptionsRaw, setRevisionOptionsRaw] = useState<
    {
      id: string;
      revisionCode: string;
      revisionStartDt: string;
      revisionEndDt: string | null;
      status: string;
      actyp: string;
      details: {
        factorId: string;
        revisionId: string;
        division: string;
        emissionFactor: string;
        fuelConsumptionQ: string;
        co2: string;
        ch4: string;
        n2o: string;
        nox: string;
        co: string;
        nmvoc: string;
        so2: string;
        co2eq: string;
        createdBy: string;
      }[];
    }[]
  >([]);

  const [revisionOptionsRawBackup, setRevisionOptionsRawBackup] = useState<ApiType[] | null>(null);
  const [newRevision, setNewRevision] = useState<{
    id: string;
    revisionCode: string;
    revisionStartDt: string;
    revisionEndDt: string;
    status: string;
    actyp: string;
    details: {
      factorId: string;
      revisionId: string;
      division: string;
      emissionFactor: string;
      fuelConsumptionQ: string;
      co2: string;
      ch4: string;
      n2o: string;
      nox: string;
      co: string;
      nmvoc: string;
      so2: string;
      co2eq: string;
      createdBy: string;
    }[];
  } | null>(null);

  const actype = useCommonOptionsStore((s) => s.actypes);
  // 공통 actype ALL 없는 버전 [{label, value}]
  const actypeOptions = actype.map((item) => ({
    label: item,
    value: item,
  }));

  // 신규 리비전 생성
  const handleAddRevision = (newStartDt: string) => {
    setRevisionOptionsRawBackup(revisionOptionsRaw);

    // id 기준으로 내림차순 정렬
    const sorted = [...revisionOptionsRaw].sort((a, b) => Number(b.id) - Number(a.id));
    // status !== 'deleted' 중 가장 id가 높은 리비전 찾기

    const latestIdx = sorted.findIndex((rev) => rev.status !== 'deleted');
    const latestRevision = sorted[latestIdx];

    // 새 리비전 번호 생성
    const nextNum = sorted.length + 1;
    const newRevisionCode = `REV${nextNum}`;

    // 이전 리비전의 종료일을 새 리비전 시작일 하루 전으로 변경하고 status를 normal로 변경
    const prevEndDt = dayjs(newStartDt).subtract(1, 'day').format('YYYY-MM-DD');
    const updatedPrev = latestRevision
      ? {
          ...latestRevision,
          revisionEndDt: prevEndDt,
          status: 'closed',
        }
      : undefined;

    const newId = latestRevision ? String(Number(latestRevision.id) + 1) : '1';

    const addNewRevision = {
      id: newId,
      revisionCode: newRevisionCode,
      revisionStartDt: newStartDt,
      revisionEndDt: '',
      status: 'closed',
      actyp: latestRevision ? latestRevision.actyp : actypWatchValue,
      createdBy: 'admin',
      details: [],
    };

    setNewRevision(addNewRevision);

    // 기존 배열에서 최신 리비전만 교체
    let newRaw = [...sorted];
    if (updatedPrev) {
      newRaw[latestIdx] = updatedPrev;
      setRevisionOptionsRaw([addNewRevision, ...newRaw]);
    } else {
      setRevisionOptionsRaw([addNewRevision]);
    }
    setValue('revision', addNewRevision.id);
  };

  // 리비전 아이콘 체크
  const getIcon = (revision: {
    id?: string;
    revisionStartDt: string;
    revisionEndDt: string | null;
    status: string;
  }) => {
    // const today = dayjs();
    // const start = dayjs(revision.revisionStartDt);
    // const end = revision.revisionEndDt ? dayjs(revision.revisionEndDt) : null;

    // status가 deleted면 무조건 X 아이콘
    if (revision.status === 'deleted') return deleteSvg;

    // id가 가장 높은 리비전에만 체크 아이콘
    const enabledRevisions = revisionOptionsRaw.filter((rev) => rev.status !== 'deleted');
    const maxId = Math.max(...enabledRevisions.map((rev) => Number(rev.id)));
    if (Number(revision.id) === maxId) {
      return checkSvg;
    }
    // 오늘 날짜가 시작일 ~ 종료일 사이에 해당하면 체크 아이콘
    // if (
    //   today.isSame(start) ||
    //   (today.isAfter(start) && (!end || today.isBefore(end) || today.isSame(end)))
    // ) {
    //   return checkSvg;
    // }

    return circleMinusSvg;
  };

  // 리비전 콤보 박스 Label CSS 튜닝
  const revisionOptions = [...revisionOptionsRaw]
    .sort((a, b) => Number(b.id) - Number(a.id)) // id 높은 순으로 정렬 (최신순)
    .map((opt) => {
      let labelStyle = {};
      let disabled = false;

      // 삭제 디비전
      // if (opt.status === 'deleted') {
      //   labelStyle = {
      //     color: '#B0B0B0',
      //     textDecoration: 'line-through',
      //   };
      //   disabled = true;
      // }

      const endText = opt.revisionEndDt ? opt.revisionEndDt : 'Open';
      const labelText = `${opt.revisionCode} (${opt.revisionStartDt} ~ ${endText})`;

      return {
        ...opt,
        label: (
          <Box display="flex" alignItems="center">
            <img
              src={getIcon(opt)}
              alt={opt.status}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            <span style={labelStyle}>{labelText}</span>
          </Box>
        ),
        value: String(opt.id),
        disabled,
      };
    });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [tierOpen, setTierOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  // merge
  const rowSpan = (params: any) => {
    const api = params.api;
    const rowIndex = params.node.rowIndex;
    const field = params.colDef.field;
    if (!field) return 1;
    const value = params.data?.[field];
    if (value == null) return 1;
    if (rowIndex > 0) {
      const prev = api.getDisplayedRowAtIndex(rowIndex - 1);
      if (prev && prev.data && prev.data[field] === value) return 1;
    }
    let span = 1;
    const rowCount = api.getDisplayedRowCount();
    for (let i = rowIndex + 1; i < rowCount; i++) {
      const next = api.getDisplayedRowAtIndex(i);
      if (!next || !next.data) break;
      if (next.data[field] === value) span++;
      else break;
    }
    return span;
  };

  const columnDefs: ColDef[] = [
    EtsColumnPreset.IdPreset({
      field: 'id',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'division',
      headerName: 'Division',
      width: 182,
      flex: 1,
      cellClass: 'bg-teal',
      rowSpan: isEditable ? undefined : rowSpan,
      editable: false,
    }),
    EtsColumnPreset.TextPreset({
      field: 'emissionFactor',
      headerName: 'Emission Factor',
      width: 182,
      flex: 1,
      cellClass: 'bg-orange',
      rowSpan: isEditable ? undefined : rowSpan,
      editable: false,
    }),
    EtsColumnPreset.TextPreset({
      field: 'fuelConsumptionQ',
      headerName: 'Fuel Consumption\n(kg / LTO)',
      width: 182,
      flex: 1,
      editable: (params) => isEditable && !isNaN(Number(params.data.fuelConsumptionQ)),
      context: {
        inputProps: {
          placeholder: 'Typing Here',
          type: 'decimal',
        },
        decimalPlaces: 7,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'co2',
      headerName: 'CO2',
      width: 182,
      flex: 1,
      headerClass: 'bg-orange',
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: 'Typing Here',
          type: 'decimal',
        },
        decimalPlaces: 7,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'ch4',
      headerName: 'CH4',
      width: 182,
      flex: 1,
      headerClass: 'bg-orange',
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: 'Typing Here',
          type: 'decimal',
        },
        decimalPlaces: 7,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'n2o',
      headerName: 'N2O',
      width: 182,
      flex: 1,
      headerClass: 'bg-orange',
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: 'Typing Here',
          type: 'decimal',
        },
        decimalPlaces: 7,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'nox',
      headerName: 'NOx',
      width: 182,
      flex: 1,
      headerClass: 'bg-orange',
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: 'Typing Here',
          type: 'decimal',
        },
        decimalPlaces: 7,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'co',
      headerName: 'CO',
      width: 182,
      flex: 1,
      headerClass: 'bg-orange',
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: 'Typing Here',
          type: 'decimal',
        },
        decimalPlaces: 7,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'nmvoc',
      headerName: 'NMVOC',
      width: 182,
      flex: 1,
      headerClass: 'bg-orange',
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: 'Typing Here',
          type: 'decimal',
        },
        decimalPlaces: 7,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'so2',
      headerName: 'SO2',
      width: 182,
      flex: 1,
      headerClass: 'bg-orange',
      editable: isEditable,
      context: {
        inputProps: {
          placeholder: 'Typing Here',
          type: 'decimal',
        },
        decimalPlaces: 7,
      },
    }),
  ];

  const initialRowData: RowType[] = [
    {
      factorId: '1',
      revisionId: '1',
      division: 'LTO',
      emissionFactor: 'IPCC2006',
      fuelConsumptionQ: '0',
      co2: '0',
      ch4: '0',
      n2o: '0',
      nox: '0',
      co: '0',
      nmvoc: '0',
      so2: '0',
      co2eq: null,
      createdBy: null,
    },
    {
      factorId: '2',
      revisionId: '1',
      division: 'CRUISE',
      emissionFactor: 'IPCC1960',
      fuelConsumptionQ: 'Domestic',
      co2: '0',
      ch4: '0',
      n2o: '0',
      nox: '0',
      co: '0',
      nmvoc: '0',
      so2: '0',
      co2eq: null,
      createdBy: null,
    },
    {
      factorId: '3',
      revisionId: '1',
      division: 'CRUISE',
      emissionFactor: 'IPCC1960',
      fuelConsumptionQ: 'International',
      co2: '0',
      ch4: '0',
      n2o: '0',
      nox: '0',
      co: '0',
      nmvoc: '0',
      so2: '0',
      co2eq: null,
      createdBy: null,
    },
  ];

  const [rowData, setRowData] = useState<RowType[]>();
  const [rowDataBackup, setRowDataBackup] = useState<RowType[] | null>(null);
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
  const { toast } = useNotify();
  const [searchedActyp, setSearchedActyp] = useState<string>('-');

  const handleCancel = () => {
    if (revisionOptionsRawBackup) {
      setRevisionOptionsRaw(revisionOptionsRawBackup);
      setRevisionOptionsRawBackup(null);
    }
    if (rowDataBackup) {
      setRowData(rowDataBackup);
      setRowDataBackup(null);
    }
    setIsEditable(false);
  };

  type FormValues = {
    actyp: string;
    revision: string;
  };

  const { handleSubmit, control, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      actyp: actypeOptions[0]?.value,
      revision: revisionOptions.find((opt) => opt.status !== 'deleted')?.value,
    },
    mode: 'onChange',
  });

  const actypWatchValue = watch('actyp');
  const revisionWatchValue = watch('revision');

  // A/C Type 변경 시 Revision Api 호출
  // useEffect(() => {
  //   if (!actypWatchValue) return;
  //   callApi({
  //     service: Service.POSTMAN,
  //     url: '/api/v1/factors',
  //     method: Method.GET,
  //     params: {
  //       queryParams: {
  //         actyp: actypWatchValue,
  //       },
  //     },
  //   }).then((res) => {
  //     if (res.successOrNot !== 'Y') {
  //       toast.error(res.HeaderMsg);
  //       return;
  //     }
  //     setIsEditable(false);
  //     setRevisionOptionsRaw(res.data || []);
  //   });
  // }, [actypWatchValue]);

  useEffect(() => {
    // 사용 가능한 리비전 옵션
    const enabledOptions = revisionOptions.filter((opt) => !opt.disabled);
    const firstEnabled = enabledOptions[0]?.value;
    const validRevision = enabledOptions.some((opt) => opt.value === revisionWatchValue);

    // 선택 가능한 옵션이 없으면 revision 값을 ''로 초기화
    if (enabledOptions.length === 0 && revisionWatchValue) {
      setRowData([]);
      setValue('revision', '');
    }
    // 현재 revision 값이 옵션에 없거나 deleted일 때만 세팅
    else if (!validRevision && firstEnabled) {
      setValue('revision', firstEnabled);
    }
  }, [revisionOptions, revisionWatchValue, setValue]);

  useEffect(() => {
    search();
  }, []);

  // 리비전 변경시 Search
  useEffect(() => {
    handleSubmit(onSearch)();
  }, [revisionWatchValue]);

  const onSearch: SubmitHandler<FormValues> = async () => {
    if (!revisionWatchValue) return;
    // 선택된 리비전의 ID 로 값 찾기
    const selectedRevision = revisionOptionsRaw.find(
      (rev) => String(rev.id) === String(revisionWatchValue)
    );
    const details: RowType[] = selectedRevision?.details || [];

    // number -> string
    const newRowData: RowType[] = details.map((row, idx) => {
      const converted = Object.entries(row).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'number' ? String(value) : value;
        return acc;
      }, {} as RowType);

      // 하드코딩 && 히든 정보
      return {
        ...converted,
        division:
          converted.division === 'AC_LTO'
            ? 'LTO'
            : converted.division === 'CRUISE_DOM' || converted.division === 'CRUISE_INT'
              ? 'CRUISE'
              : converted.division,
        emissionFactor: converted.emissionFactor ?? initialRowData[idx]?.emissionFactor ?? '',
        fuelConsumptionQ: converted.fuelConsumptionQ ?? initialRowData[idx]?.fuelConsumptionQ ?? '',
        co2eq: converted.co2eq ?? null,
        createdBy: converted.createdBy ?? null,
      };
    });

    setRowData(newRowData.length ? newRowData : initialRowData);
  };

  useActivate(() => {
    // 편집 상태 초기화
    if (isEditable) {
      setIsEditable(false);
    }

    // 데이터가 있으면 재조회 실행
    if (rowData && rowData.length > 0) {
      handleSubmit(onSearch)();
    }
  });

  // 등록 API
  const handleInsertData = async () => {
    const api = gridRef.current?.api;
    const rowCount = api?.getDisplayedRowCount() ?? 0;
    const gridRows: RowType[] = [];

    for (let i = 0; i < rowCount; i++) {
      const node = api!.getDisplayedRowAtIndex(i);
      if (node && node.data) {
        gridRows.push(node.data);
      }
    }

    // detail 치환
    const details = gridRows.map((row) => ({
      division:
        row.fuelConsumptionQ === 'Domestic'
          ? 'CRUISE_DOM'
          : row.fuelConsumptionQ === 'International'
            ? 'CRUISE_INT'
            : 'AC_LTO',
      fuelConsumptionQ:
        !isNaN(Number(row.fuelConsumptionQ)) && row.fuelConsumptionQ !== ''
          ? Number(row.fuelConsumptionQ)
          : '',
      co2: row.co2 ? Number(row.co2) : 0,
      ch4: row.ch4 ? Number(row.ch4) : 0,
      n2o: row.n2o ? Number(row.n2o) : 0,
      nox: row.nox ? Number(row.nox) : 0,
      co: row.co ? Number(row.co) : 0,
      nmvoc: row.nmvoc ? Number(row.nmvoc) : 0,
      so2: row.so2 ? Number(row.so2) : 0,
      co2eq: String(row.co2eq ?? ''),
      createdBy: String(row.createdBy ?? ''),
    }));

    // 저장 구조 생성
    const saveData = {
      ...newRevision,
      details,
    };

    console.log(saveData);

    // 저장 API 호출 예시
    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/factors',
      method: Method.POST,
      params: {
        bodyParams: saveData,
      },
      config: { isLoading: true },
    }).then(async (res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        return;
      }
      toast.success('저장되었습니다.');
      await search();
    });
  };

  // 삭제 API
  const handleDeleteData = async () => {
    // 현재 선택된 리비전 id 가져오기
    const revisionId = revisionWatchValue;

    if (!revisionId) {
      toast.error('삭제할 리비전을 선택하세요.');
      return;
    }

    callApi({
      service: Service.POSTMAN,
      url: `/api/v1/factors/${revisionId}`,
      method: Method.DELETE,
      config: { isLoading: true },
    }).then(async (res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        return;
      }
      setDeleteOpen(false);

      toast.success('삭제되었습니다.');
      await search();
    });
  };

  // 삭제 시 최신 리비전만 가능하게 하기
  const latestEnabledRevision = revisionOptionsRaw
    .filter((opt) => opt.status !== 'deleted')
    .sort((a, b) => Number(b.id) - Number(a.id))[0];
  const latestEnabledId = latestEnabledRevision?.id;

  // 최신 리비전 불러오기
  const handleLoadLatestRevision = () => {
    const dbLatestRevision = revisionOptionsRaw
      .filter((rev) => rev.status !== 'deleted' && rev.details?.length)
      .sort((a, b) => Number(b.id) - Number(a.id))[0];

    if (!dbLatestRevision) return;

    const details = dbLatestRevision.details;

    const newRowData: RowType[] = details.map((row, idx) => {
      const converted = Object.entries(row).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'number' ? String(value) : value;
        return acc;
      }, {} as RowType);

      return {
        ...converted,
        division:
          converted.division === 'AC_LTO'
            ? 'LTO'
            : converted.division === 'CRUISE_DOM' || converted.division === 'CRUISE_INT'
              ? 'CRUISE'
              : converted.division,
        emissionFactor: converted.emissionFactor ?? initialRowData[idx]?.emissionFactor ?? '',
        fuelConsumptionQ: converted.fuelConsumptionQ ?? initialRowData[idx]?.fuelConsumptionQ ?? '',
        co2eq: converted.co2eq ?? null,
        createdBy: converted.createdBy ?? null,
      };
    });

    setRowData(newRowData.length ? newRowData : initialRowData);
  };

  const search = async () => {
    setSearchedActyp(actypWatchValue);
    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/factors',
      method: Method.GET,
      params: {
        queryParams: {
          actyp: actypWatchValue,
        },
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        return;
      }
      setIsEditable(false);
      setRevisionOptionsRaw(res.data || []);
      if (revisionWatchValue) {
        handleSubmit(onSearch)();
      }
    });
  };

  // 편집 모드
  useEffect(() => {
    // 편집 초기화
    if (isEditable && !checked) {
      setRowData((prev) =>
        prev?.map((row) => {
          const newRow: RowType = { ...row };
          Object.keys(newRow).forEach((key) => {
            if (!['id', 'division', 'emissionFactor'].includes(key)) {
              if (
                newRow.id !== 1 &&
                (newRow[key] === 'Domestic' || newRow[key] === 'International')
              ) {
                return;
              }
              newRow[key] = '';
            }
          });
          return newRow;
        })
      );
    } else if (isEditable) {
      // 최신 리비전으로 불러오기
      handleLoadLatestRevision();
    }
  }, [isEditable, checked]);

  const searchComponent = (
    <form onSubmit={handleSubmit(onSearch)}>
      <searchForm.Container>
        <searchForm.Row>
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
            type="blue"
            onClick={async () => {
              await search();
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
                handleCancel();
                setIsEditable(false);
              }}
            >
              Cancel
            </EtsButton>
            <EtsButton
              type="grey"
              onClick={() => {
                if (gridRef.current) {
                  gridRef.current.api.stopEditing();
                }
                handleInsertData();
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
                setTierOpen(true);
              }}
            >
              Tier 1
            </EtsButton>
            {revisionWatchValue && String(revisionWatchValue) === String(latestEnabledId) && (
              <EtsButton
                type="grey"
                onClick={async () => {
                  setDeleteOpen(true);
                }}
              >
                Delete
              </EtsButton>
            )}
            {searchedActyp !== '-' && (
              <EtsButton
                type="grey"
                onClick={async () => {
                  setNewOpen(true);
                }}
              >
                New
              </EtsButton>
            )}
          </>
        )}
      </buttonForm.Row>
    </buttonForm.Container>
  );

  const tierModal = (
    <>
      <EmissionFactorTierModal
        open={tierOpen}
        onClose={() => {
          setTierOpen(false);
        }}
      />
    </>
  );

  const deleteModal = (
    <>
      <EtsModal open={deleteOpen} size={420} onClose={() => setDeleteOpen(false)}>
        <EtsModal.Header onClose={() => setDeleteOpen(false)} />
        <EtsModal.Body>
          <Typography className="label-modal-sm" component="h1">
            Delete Revision
          </Typography>
          <Typography className="modal-body-text" mt={3}>
            현재 Revision 정보를 삭제하고 이전 Revision을 활성화시키 시겠습니까?
          </Typography>
          <Typography className="modal-body-text-sub" mt={3}>
            ※ 삭제된 Revision 내용은 확인할 수 있으나 재활성화는 불가 능합니다.
          </Typography>
        </EtsModal.Body>
        <EtsModal.Footer>
          <>
            <EtsButton variant="outlined" type="outlined" onClick={() => setDeleteOpen(false)}>
              Cancel
            </EtsButton>
            <EtsButton variant="contained" type="contained" onClick={() => handleDeleteData()}>
              Save
            </EtsButton>
          </>
        </EtsModal.Footer>
      </EtsModal>
    </>
  );

  const newModal = (
    <>
      <EtsModal open={newOpen} size={420} onClose={() => setNewOpen(false)}>
        <EtsModal.Header onClose={() => setNewOpen(false)} />
        <EtsModal.Body>
          <Typography className="label-modal-sm" component="h1">
            New Revision
          </Typography>
          <Box display="flex" alignItems="flex-start" mt={2}>
            <Typography className="modal-body-text" component="span">
              시작일을 지정하세요.
              <span style={{ color: '#D32F2F', marginLeft: 2 }}>*</span>
            </Typography>
          </Box>
          <Box display="flex" alignItems="flex-start" mt={2}>
            <EtsDatePicker
              value={dateValue}
              onChange={(newValue) => {
                setDateValue(newValue);
              }}
              format="YYYY.MM.DD"
              width="200px"
              shouldDisableDate={(date) => {
                // status가 deleted가 아닌 리비전만 체크
                return revisionOptionsRaw
                  .filter((rev) => rev.status !== 'deleted')
                  .some((rev) => {
                    const start = dayjs(rev.revisionStartDt);
                    const end = rev.revisionEndDt ? dayjs(rev.revisionEndDt) : null;
                    if (end) {
                      return (
                        date.isSame(start) ||
                        (date.isAfter(start) && date.isBefore(end)) ||
                        date.isSame(end)
                      );
                    }
                    return date.isSame(start);
                  });
              }}
            />
          </Box>
          <Box display="flex" alignItems="flex-start" mt={2}>
            <Box>
              <Typography className="modal-body-text-sub">
                ※ 새 Revision은 종료일 없이 생성됩니다.
                <br />
                이전 Revision은 시작일 전날기준으로 자동 종료됩니다.
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start" mt={2}>
            {revisionOptionsRaw.filter((opt) => opt.status !== 'deleted').length > 0 && (
              <>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    icon={
                      <span
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 24,
                          height: 24,
                          background: '#fff',
                          border: '2px solid #051766',
                          borderRadius: 'var(--radius-xs, 2px)',
                        }}
                      />
                    }
                    checkedIcon={
                      <span
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 24,
                          height: 24,
                          background: '#051766',
                          borderRadius: 'var(--radius-xs, 2px)',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 20 20">
                          <polyline
                            points="4,11 9,16 16,6"
                            style={{ fill: 'none', stroke: '#fff', strokeWidth: 2 }}
                          />
                        </svg>
                      </span>
                    }
                    sx={{ p: 0 }}
                  />
                  <Typography className="modal-body-text" ml={1}>
                    최신 버전 데이터를 불러오겠습니까?
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </EtsModal.Body>
        <EtsModal.Footer>
          <>
            <EtsButton variant="outlined" type="outlined" onClick={() => setNewOpen(false)}>
              Cancel
            </EtsButton>
            <EtsButton
              variant="contained"
              type="contained"
              // 리비전에 등록된 날짜를 선택할 경우 Proceed 버튼 비활성화
              disabled={
                !dateValue ||
                !dayjs(dateValue).isValid() ||
                revisionOptionsRaw
                  .filter((rev) => rev.status !== 'deleted')
                  .some((rev) => {
                    const start = dayjs(rev.revisionStartDt);
                    const end = rev.revisionEndDt ? dayjs(rev.revisionEndDt) : null;
                    if (end) {
                      return (
                        dateValue.isSame(start) ||
                        (dateValue.isAfter(start) && dateValue.isBefore(end)) ||
                        dateValue.isSame(end)
                      );
                    }
                    return dateValue.isSame(start);
                  })
              }
              onClick={() => {
                handleAddRevision(dateValue?.format('YYYY-MM-DD') ?? dayjs().format('YYYY-MM-DD'));
                setIsEditable(true);
                setNewOpen(false);
              }}
            >
              Save
            </EtsButton>
          </>
        </EtsModal.Footer>
      </EtsModal>
    </>
  );

  const subSelect = (
    <Box display="flex" alignItems="center">
      <Stack direction="row" alignItems="center" gap={'16px'} sx={{ height: '36px' }}>
        <Typography className="sub-title">{searchedActyp}</Typography>
        <Bar />
        <Typography className="label" style={{ marginLeft: '0px !important' }}>
          Revision
        </Typography>
      </Stack>
      <Box ml={2} sx={{ width: 478 }}>
        <Controller
          name="revision"
          control={control}
          render={({ field }) => (
            <EtsSelect
              {...field}
              options={revisionOptions}
              sx={{
                minWidth: 478,
                maxWidth: 478,
              }}
            />
          )}
        />
      </Box>
    </Box>
  );

  return (
    <Box>
      {tierModal}
      {deleteModal}
      {newModal}
      <PageTemplate
        title="Emission Factor"
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        columnDefs={columnDefs}
        rowData={rowData}
        gridRef={gridRef}
        subSelect={subSelect}
      />
    </Box>
  );
};

export default EmissionFactorPage;
