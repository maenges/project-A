import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Box } from '@mui/material';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';
import { EtsButton } from '@/components/EtsCommon';
import { EtsInputComponent, EtsDatePickerComponent } from '@/components/EtsComponents';
import CustomerListModal from './customerListModal';

type Customer = {
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
};

const CUSTOMER_LIST_UI_STATE_KEY = 'customerList.uiState';

type CustomerListUiState = {
  groupKey?: string;
  firstRow?: number;
  showCasinoSlot?: boolean;
};

const readCustomerListUiState = (): CustomerListUiState | null => {
  try {
    const raw = sessionStorage.getItem(CUSTOMER_LIST_UI_STATE_KEY);
    return raw ? (JSON.parse(raw) as CustomerListUiState) : null;
  } catch {
    return null;
  }
};

const getInitialCustomerGroupKey = (): string | null => {
  try {
    const urlGroupKey = new URLSearchParams(window.location.search).get('groupKey');
    const saved = readCustomerListUiState();
    return urlGroupKey ?? saved?.groupKey ?? null;
  } catch {
    return null;
  }
};

const CustomerList: React.FC = () => {
  const gridRef = useRef<EtsGridRef<Customer>>(null);
  const { toast } = useNotify();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowData, setRowData] = useState<Customer[]>([]);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [showCasinoSlot, setShowCasinoSlot] = useState(
    () => readCustomerListUiState()?.showCasinoSlot ?? false
  );
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(() =>
    getInitialCustomerGroupKey()
  );
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());

  // 복원할 스크롤 위치(첫 표시 row index)
  const restoreFirstRowRef = useRef<number | null>(null);

  const saveUiState = (patch: Partial<CustomerListUiState>) => {
    try {
      const raw = sessionStorage.getItem(CUSTOMER_LIST_UI_STATE_KEY);
      const prev = raw ? (JSON.parse(raw) as CustomerListUiState) : {};
      sessionStorage.setItem(CUSTOMER_LIST_UI_STATE_KEY, JSON.stringify({ ...prev, ...patch }));
    } catch {
      // ignore
    }
  };

  const getGroupNameOptionsByRow = (row: any) => {
    const raw = row?.group_name;
    if (!Array.isArray(raw)) return [];

    const toLevel = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : -1;
    };

    // level: 1(하위) ~ 4(상위) => 역순(상위 -> 하위)
    const sorted = [...raw].sort((a: any, b: any) => toLevel(b?.level) - toLevel(a?.level));
    return sorted
      .map((x: any) => ({
        name: x?.group_name ?? x?.groupName,
        level: toLevel(x?.level),
      }))
      .filter((x: any) => Boolean(x?.name))
      .map((x: any) => {
        const name = String(x.name);
        const level = typeof x.level === 'number' ? x.level : undefined;
        const prefix = level ? `[L${level}]` : '';
        return {
          value: name,
          label: prefix ? `${prefix} ${name}` : name,
        };
      });
  };

  const getStoreNameByRow = (row: any) => {
    const raw = row?.group_name;
    if (!Array.isArray(raw)) return '';
    const match = raw.find((x: any) => String(x?.group_key) === String(row?.group_key));
    const store = match ?? raw.find((x: any) => x?.level === 1) ?? raw[0];
    return store?.group_name ?? store?.groupName ?? '';
  };

  const defaultViewVisibleColKeys = [
    'charge_pay',
    'charge_recover',
    'user_money',
    'user_rolling_money',
    'group_name',
    'withdrawal',
    'deposit',
    'created',
  ] as const;

  const casinoSlotFields = [
    'c_betting_amount',
    'c_winning_amount',
    'c_rolling_amount',
    's_betting_amount',
    's_winning_amount',
    's_rolling_amount',
  ] as const;

  useEffect(() => {
    const api = (gridRef.current as any)?.api;
    if (!api) return;

    if (showCasinoSlot) {
      // compact: No, 회원ID, 카지노, 슬롯만 표시
      api.setColumnsVisible([...defaultViewVisibleColKeys], false);
      api.setColumnsVisible(['no', 'user_id', ...casinoSlotFields], true);
    } else {
      // default: 기존 화면 복원(카지노/슬롯은 숨김)
      api.setColumnsVisible(['no', 'user_id', ...defaultViewVisibleColKeys], true);
      api.setColumnsVisible([...casinoSlotFields], false);
    }
  }, [showCasinoSlot]);

  const columnDefs: (ColDef | ColGroupDef)[] = [
    // EtsColumnPreset.SelectionBoxPreset({
    //   headerName: '',
    //   width: 60,
    //   headerCheckboxSelection: true,
    // }),
    EtsColumnPreset.IdPreset({
      field: 'no',
      headerName: 'No',
      width: 60,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_key',
      headerName: 'ID',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_id',
      headerName: '회원 ID',
      width: 100,
      context: {
        clickable: true,
      },
    }),
    {
      headerName: '충환전',
      children: [
        {
          ...EtsColumnPreset.CheckButtonPreset2({
            field: 'charge_pay',
            headerName: '지급',
            width: 100,
            context: {
              label: '지급',
              onClick: async (_p: any) => {},
            },
          }),
          colId: 'charge_pay',
        },
        {
          ...EtsColumnPreset.CheckButtonPreset2({
            field: 'charge_recover',
            headerName: '회수',
            width: 100,
            context: {
              label: '회수',
              onClick: async (_p: any) => {},
            },
          }),
          colId: 'charge_recover',
        },
      ],
    },
    EtsColumnPreset.TextPreset({
      field: 'user_money',
      headerName: '보유금액',
      width: 100,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_rolling_money',
      headerName: '롤링금액',
      width: 100,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.SelectPreset({
      field: 'group_name',
      headerName: '소속',
      width: 100,
      flex: 1,
      editable: true,
      valueGetter: (p: any) => getStoreNameByRow(p?.data),
      valueSetter: () => {
        // 보기용 콤보: 선택해도 rowData(group_name 배열)는 변경하지 않음
        return false;
      },
      cellEditorParams: (p: any) => ({
        ...p,
        options: getGroupNameOptionsByRow(p?.data),
      }),
      context: {
        // renderer는 value만 보여주면 되므로 빈 options
        options: [],
      },
    }),
    {
      headerName: '입출금',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'withdrawal',
          headerName: '입금',
          width: 150,
        }),
        EtsColumnPreset.TextPreset({
          field: 'deposit',
          headerName: '출금',
          width: 150,
        }),
      ],
    },
    {
      headerName: '카지노',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'c_betting_amount',
          headerName: '베팅금액',
          width: 150,
          hide: true,
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'c_winning_amount',
          headerName: '당첨금액',
          width: 150,
          hide: true,
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'c_rolling_amount',
          headerName: '롤링금액',
          width: 150,
          hide: true,
          flex: 1,
        }),
      ],
    },
    {
      headerName: '슬롯',
      children: [
        EtsColumnPreset.TextPreset({
          field: 's_betting_amount',
          headerName: '베팅금액',
          width: 150,
          hide: true,
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 's_winning_amount',
          headerName: '당첨금액',
          width: 150,
          hide: true,
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 's_rolling_amount',
          headerName: '롤링금액',
          width: 150,
          hide: true,
          flex: 1,
        }),
      ],
    },
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '등록일시',
      width: 200,
    }),
  ];

  const { control, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: {
      startDate: dayjs().subtract(7, 'day').format('YYYYMMDD'),
      endDate: dayjs().format('YYYYMMDD'),
    },
    mode: 'onChange',
  });

  const onSearch = () => {
    // 충환전 끝나면 작성, 신규등록후 재조회도 해야함
    // callApi({
    //   service: Service.POSTMAN,
    //   url: '/api/notice',
    //   method: Method.GET,
    //   params: {},
    // }).then((res) => {
    //   if (res.successOrNot !== 'Y') {
    //     return toast.error(res.HeaderMsg);
    //   }
    //   setRowData(res.data);
    // });
  };

  const handleCellClicked = (params: any) => {
    const field = params?.colDef?.field;
    if (field !== 'user_id') return;

    const row = params?.data as Customer | undefined;
    if (!row) return;

    // row는 userKey를 가지고 있음(요구사항). 실제 API 응답 키가 user_key인 것으로 보임.
    const userKey = row?.user_key ?? row?.userKey;
    if (!userKey) {
      toast.info('회원 키(userKey)가 없어 상세보기로 이동할 수 없습니다.');
      return;
    }

    if (gridRef.current) {
      gridRef.current.api.stopEditing();
    }

    // 뒤로 돌아올 때 트리/스크롤 위치 복원용 상태 저장
    const firstRow = (gridRef.current as any)?.api?.getFirstDisplayedRow?.();
    saveUiState({
      groupKey: selectedTreeId ?? undefined,
      firstRow: typeof firstRow === 'number' ? firstRow : undefined,
      showCasinoSlot,
    });

    navigate('/customer/customerDetail', { state: { userKey } });
  };

  const fetchCustomerListByGroupKey = (groupKey: string) => {
    const { startDate, endDate } = getValues();
    callApi({
      service: Service.POSTMAN,
      url: '/api/user/cuInfo',
      method: Method.GET,
      params: {
        queryParams: { groupKey, startDate, endDate },
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowData([]);
        return;
      }

      // rowData는 API 응답 그대로 사용 (group_name 배열 포함)
      const data = (res.data ?? []) as Customer[];
      setRowData(data);

      // 데이터 세팅 후 스크롤 위치 복원(최초 1회)
      const restoreIndex = restoreFirstRowRef.current;
      if (typeof restoreIndex === 'number') {
        restoreFirstRowRef.current = null;
        const api = (gridRef.current as any)?.api;
        if (api?.ensureIndexVisible) {
          const safeIndex = Math.max(0, Math.min(restoreIndex, Math.max(0, data.length - 1)));
          requestAnimationFrame(() => {
            try {
              api.ensureIndexVisible(safeIndex, 'top');
            } catch {
              // ignore
            }
          });
        }
      }
    });
  };

  // 상세 화면으로 갔다가 뒤로 왔을 때도 리스트가 유지되도록
  // 선택된 트리(groupKey)를 URL 쿼리에 저장하고, 마운트 시 자동 재조회
  useEffect(() => {
    const urlGroupKey = searchParams.get('groupKey');
    const saved = readCustomerListUiState();
    const groupKey = urlGroupKey ?? saved?.groupKey;
    if (!groupKey) return;

    setSelectedTreeId(groupKey);
    if (!urlGroupKey) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('groupKey', groupKey);
        return next;
      });
    }

    if (typeof saved?.showCasinoSlot === 'boolean') {
      setShowCasinoSlot(saved.showCasinoSlot);
    }
    if (typeof saved?.firstRow === 'number') {
      restoreFirstRowRef.current = saved.firstRow;
    }

    fetchCustomerListByGroupKey(groupKey);
  }, []);

  const handleTreeSelect = (id: string) => {
    // 트리 선택 시에는 항상 기본 컬럼 뷰로 복원
    setShowCasinoSlot(false);
    const api = (gridRef.current as any)?.api;
    if (api) {
      api.setColumnsVisible(['no', 'user_id', ...defaultViewVisibleColKeys], true);
      api.setColumnsVisible([...casinoSlotFields], false);
    }

    // 마지막 선택 트리 저장 + 스크롤은 최상단으로 리셋
    saveUiState({ groupKey: id, firstRow: 0, showCasinoSlot: false });

    setSelectedTreeId(id);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('groupKey', id);
      return next;
    });
    fetchCustomerListByGroupKey(id);
  };

  const storeConfirm = async (): Promise<boolean> => {
    if (!selectedTreeId) {
      toast.info('매장을 선택해 주세요.');
      return false;
    }
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/group/groupInfo',
      method: Method.GET,
      params: {
        queryParams: { groupKey: selectedTreeId },
      },
    });
    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return false;
    }
    if (res.data?.group_type !== 'ST') {
      toast.info('회원 신규 등록은 매장 선택 후에만 가능합니다.');
      return false;
    }
    return true;
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
          <EtsInputComponent
            control={control}
            name="acReg"
            label="회원 ID"
            placeholder="아이디 or 닉네임을 입력해 주세요."
            sx={{ width: 250 }}
          />
          <Box sx={{ marginLeft: 'auto' }}>
            <EtsButton
              type="blue"
              onClick={() => {
                handleSubmit(onSearch)();
              }}
            >
              검색
            </EtsButton>
          </Box>
        </searchForm.Row>
      </searchForm.Container>
    </form>
  );

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <EtsButton
          type="grey"
          onClick={async () => {
            const canProceed = await storeConfirm();
            if (canProceed) {
              setNewModalOpen(true);
            }
          }}
        >
          회원 신규 등록
        </EtsButton>
        <EtsButton
          type="grey"
          aria-label={showCasinoSlot ? '카지노/슬롯 컬럼 숨기기' : '카지노/슬롯 컬럼 보기'}
          onClick={() => {
            setShowCasinoSlot((prev) => {
              const next = !prev;
              saveUiState({ showCasinoSlot: next });
              return next;
            });
          }}
        >
          {showCasinoSlot ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
        </EtsButton>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  const newModal = newModalOpen && (
    <CustomerListModal
      open={newModalOpen}
      onClose={() => {
        setNewModalOpen(false);
      }}
      onSaved={() => {
        if (!selectedTreeId) return;
        fetchCustomerListByGroupKey(selectedTreeId);
      }}
      groupKey={selectedTreeId || ''}
    />
  );

  return (
    <>
      {newModalOpen && newModal}
      <PageTemplate
        title="회원목록"
        columnDefs={columnDefs}
        rowData={rowData}
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        // totalCount={totalCount}
        gridRef={gridRef}
        alwaysShowHorizontalScroll={true}
        defaultColDef={{
          autoHeaderHeight: false,
          wrapHeaderText: false,
        }}
        onCellClicked={handleCellClicked}
        tree={true}
        leftTreeProps={{
          onSelect: handleTreeSelect,
          selectedId: selectedTreeId ?? undefined,
        }}
        rowSelection="single"
      />
    </>
  );
};

export default CustomerList;
