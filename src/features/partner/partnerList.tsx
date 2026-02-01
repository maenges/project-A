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
import {
  EtsInputComponent,
  EtsDatePickerComponent,
  EtsSelectComponent,
} from '@/components/EtsComponents';
import { MemberTypeOptions } from '@models/common/CommonSelectCodes';
import CustomerChargeModal, { type CustomerChargeModalMode } from '../customer/customerChargeModal';
import PartnerListModal from './partnerListModal';

const MEMBER_TYPE_LABEL_BY_VALUE = new Map(
  MemberTypeOptions.map((x) => [String(x.value).toUpperCase(), x.label] as const)
);

const getMemberTypeLabel = (value: unknown) => {
  if (value === null || value === undefined) return '';
  const key = String(value).toUpperCase();
  return MEMBER_TYPE_LABEL_BY_VALUE.get(key) ?? String(value);
};

type Partner = {
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  userType: string;
  userId: string;
};

const PARTNER_LIST_UI_STATE_KEY = 'partnerList.uiState';

type PartnerListUiState = {
  groupKey?: string;
  firstRow?: number;
  showCasinoSlot?: boolean;
};

const readPartnerListUiState = (): PartnerListUiState | null => {
  try {
    const raw = sessionStorage.getItem(PARTNER_LIST_UI_STATE_KEY);
    return raw ? (JSON.parse(raw) as PartnerListUiState) : null;
  } catch {
    return null;
  }
};

const getInitialGroupKey = (): string | null => {
  try {
    const urlGroupKey = new URLSearchParams(window.location.search).get('groupKey');
    const saved = readPartnerListUiState();
    return urlGroupKey ?? saved?.groupKey ?? null;
  } catch {
    return null;
  }
};

const PartnerList: React.FC = () => {
  const gridRef = useRef<EtsGridRef<Partner>>(null);
  const { toast } = useNotify();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowData, setRowData] = useState<Partner[]>([]);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [chargeModalOpen, setChargeModalOpen] = useState(false);
  const [chargeModalMode, setChargeModalMode] = useState<CustomerChargeModalMode>('PAYOUT');
  const [chargeTargetRow, setChargeTargetRow] = useState<Partner | null>(null);
  const [showCasinoSlot, setShowCasinoSlot] = useState(
    () => readPartnerListUiState()?.showCasinoSlot ?? false
  );
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(() => getInitialGroupKey());
  const [treeReloadKey, setTreeReloadKey] = useState(0);
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());

  // 복원할 스크롤 위치(첫 표시 row index)
  const restoreFirstRowRef = useRef<number | null>(null);

  const saveUiState = (patch: Partial<PartnerListUiState>) => {
    try {
      const raw = sessionStorage.getItem(PARTNER_LIST_UI_STATE_KEY);
      const prev = raw ? (JSON.parse(raw) as PartnerListUiState) : {};
      sessionStorage.setItem(PARTNER_LIST_UI_STATE_KEY, JSON.stringify({ ...prev, ...patch }));
    } catch {
      // ignore
    }
  };

  const defaultViewVisibleColKeys = [
    'charge_pay',
    'charge_recover',
    'user_money',
    'user_rolling_money',
    'user_bonus_money',
    'created',
    'user_type',
    'user_rolling_s',
    'user_rolling_c',
    'user_bonus_s',
    'user_bonus_c',
  ] as const;

  const casinoSlotFields = [
    'casino_bet_amount',
    'casino_win_amount',
    'casino_rolling_amount',
    'casino_bonus_amount',
    'slot_bet_amount',
    'slot_win_amount',
    'slot_rolling_amount',
    'slot_bonus_amount',
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
      headerName: '파트너 ID',
      width: 150,
      context: {
        clickable: true,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_type',
      headerName: '파트너 유형',
      width: 100,
    }),
    {
      headerName: '알 이동',
      children: [
        {
          ...EtsColumnPreset.CheckButtonPreset2({
            field: 'charge_pay',
            headerName: '지급',
            width: 100,
            context: {
              label: '지급',
              onClick: async (p: any) => {
                setChargeTargetRow((p?.data ?? null) as Partner | null);
                setChargeModalMode('PAYOUT');
                setChargeModalOpen(true);
              },
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
              onClick: async (p: any) => {
                setChargeTargetRow((p?.data ?? null) as Partner | null);
                setChargeModalMode('RECOVERY');
                setChargeModalOpen(true);
              },
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
      headerName: '보유 롤링금액',
      width: 100,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_bonus_money',
      headerName: '보유 루징금액',
      width: 100,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    {
      headerName: '롤링 %',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'user_rolling_s',
          headerName: '슬롯',
          width: 60,
        }),
        EtsColumnPreset.TextPreset({
          field: 'user_rolling_c',
          headerName: '카지노',
          width: 60,
        }),
      ],
    },
    {
      headerName: '루징 %',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'user_bonus_s',
          headerName: '슬롯',
          width: 60,
        }),
        EtsColumnPreset.TextPreset({
          field: 'user_bonus_c',
          headerName: '카지노',
          width: 60,
        }),
      ],
    },
    {
      headerName: '카지노',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'casino_bet_amount',
          headerName: '베팅금액',
          width: 150,
          hide: true,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'casino_win_amount',
          headerName: '당첨금액',
          width: 150,
          hide: true,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'casino_rolling_amount',
          headerName: '롤링금액',
          width: 150,
          hide: true,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'casino_bonus_amount',
          headerName: '루징금액',
          width: 150,
          hide: true,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
          flex: 1,
        }),
      ],
    },
    {
      headerName: '슬롯',
      children: [
        EtsColumnPreset.TextPreset({
          field: 'slot_bet_amount',
          headerName: '베팅금액',
          width: 150,
          hide: true,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'slot_win_amount',
          headerName: '당첨금액',
          width: 150,
          hide: true,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'slot_rolling_amount',
          headerName: '롤링금액',
          width: 150,
          hide: true,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
          flex: 1,
        }),
        EtsColumnPreset.TextPreset({
          field: 'slot_bonus_amount',
          headerName: '루징금액',
          width: 150,
          hide: true,
          context: {
            formatType: 'number',
            decimalPlaces: 0,
          },
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
      userType: 'ALL',
      userId: '',
    },
    mode: 'onChange',
  });

  const onSearch = () => {
    if (!selectedTreeId) {
      toast.info('좌측 트리를 선택해 주세요.');
      return;
    }

    // 검색 시에도 기본 컬럼 뷰로 복원
    setShowCasinoSlot(false);
    const api = (gridRef.current as any)?.api;
    if (api) {
      api.setColumnsVisible(['no', 'user_id', ...defaultViewVisibleColKeys], true);
      api.setColumnsVisible([...casinoSlotFields], false);
    }
    saveUiState({ groupKey: selectedTreeId, firstRow: 0, showCasinoSlot: false });

    fetchPartnerListByGroupKey(selectedTreeId);
  };

  // 상세 화면으로 이동
  const handleCellClicked = (params: any) => {
    const field = params?.colDef?.field;
    if (field !== 'user_id') return;

    const row = params?.data as Partner | undefined;
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

    navigate('/partner/partnerDetail', { state: { userKey } });
  };

  const fetchPartnerListByGroupKey = (groupKey: string) => {
    const { startDate, endDate, userId, userType } = getValues();
    callApi({
      service: Service.POSTMAN,
      url: '/api/user/partnerInfo',
      method: Method.GET,
      params: {
        queryParams: {
          groupKey,
          startDate,
          endDate,
          userId: userId?.trim() || '',
          userType: userType === 'ALL' ? '' : userType,
        },
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setRowData([]);
        return;
      }

      const mapped: Partner[] = Array.isArray(res.data)
        ? res.data.map((row: any) => {
            const userTypeCode = row?.user_type ?? row?.userType;
            const userTypeLabel = getMemberTypeLabel(userTypeCode);
            return {
              ...row,
              user_type_code: userTypeCode,
              user_type: userTypeLabel || userTypeCode,
            };
          })
        : [];

      // rowData는 API 응답 기반으로 표시용 필드(user_type)만 친화적으로 치환
      setRowData(mapped);

      // 데이터 세팅 후 스크롤 위치 복원(최초 1회)
      const restoreIndex = restoreFirstRowRef.current;
      if (typeof restoreIndex === 'number') {
        restoreFirstRowRef.current = null;
        const api = (gridRef.current as any)?.api;
        if (api?.ensureIndexVisible) {
          const safeIndex = Math.max(0, Math.min(restoreIndex, Math.max(0, mapped.length - 1)));
          // 그리드 렌더 타이밍 보장을 위해 다음 프레임에 수행
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
    const saved = readPartnerListUiState();
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

    fetchPartnerListByGroupKey(groupKey);
  }, []);

  // 트리 선택 시
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
    fetchPartnerListByGroupKey(id);
  };

  const storeConfirm = async (): Promise<boolean> => {
    if (!selectedTreeId) {
      toast.info('조직을 선택해 주세요.');
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
    if (res.data?.group_type === 'ST') {
      toast.info('파트너 등록은 상위 조직에서만 가능합니다. 상위 조직을 선택해 주세요.');
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
          <EtsSelectComponent
            control={control}
            name="userType"
            label="파트너 유형"
            options={MemberTypeOptions.filter((opt) => opt.value !== 'CU')}
          />
          <EtsInputComponent
            control={control}
            name="userId"
            label="파트너 ID"
            placeholder="아이디를 입력해 주세요."
            sx={{ width: 250 }}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key !== 'Enter') return;
              if ((e.nativeEvent as any)?.isComposing) return;
              e.preventDefault();
              handleSubmit(onSearch)();
            }}
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
          파트너 등록
        </EtsButton>
        <EtsButton
          type="grey"
          aria-label={showCasinoSlot ? '카지노/슬롯 컬럼 숨기기' : '카지노/슬롯 컬럼 보기'}
          onClick={() => {
            setShowCasinoSlot((prev) => !prev);
          }}
        >
          {showCasinoSlot ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
        </EtsButton>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  const newModal = newModalOpen && (
    <PartnerListModal
      open={newModalOpen}
      onClose={() => {
        setNewModalOpen(false);
      }}
      onSaved={() => {
        // 신규 등록 후 좌측 조직 트리 재조회
        setTreeReloadKey((prev) => prev + 1);

        // 신규 등록 후 현재 선택 조직의 리스트도 재조회
        if (selectedTreeId) {
          restoreFirstRowRef.current = 0;
          saveUiState({ groupKey: selectedTreeId, firstRow: 0 });
          fetchPartnerListByGroupKey(selectedTreeId);
        }
      }}
      groupKey={selectedTreeId || ''}
    />
  );

  const chargeModal = chargeModalOpen && (
    <CustomerChargeModal
      open={chargeModalOpen}
      mode={chargeModalMode}
      row={chargeTargetRow ?? undefined}
      onClose={() => {
        setChargeModalOpen(false);
        setChargeTargetRow(null);
      }}
      onSaved={() => {
        if (selectedTreeId) {
          restoreFirstRowRef.current = 0;
          fetchPartnerListByGroupKey(selectedTreeId);
        }
      }}
    />
  );

  return (
    <>
      {newModalOpen && newModal}
      {chargeModal}
      <PageTemplate
        title="파트너 목록"
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
          reloadKey: treeReloadKey,
          selectedId: selectedTreeId ?? undefined,
        }}
        rowSelection="single"
        size="two-search"
      />
    </>
  );
};

export default PartnerList;
