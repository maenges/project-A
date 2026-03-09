import React, { useEffect, useMemo, useRef, useState } from 'react';

import { ColDef } from 'ag-grid-community';
import { useLocation } from 'react-router-dom';

import { Box } from '@mui/material';
import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import { PageTemplate } from '@/components/Teamplate';
import { useNotify } from '@hooks/useNotify';
import { MemberTypeOptions, transactionStatusOptions } from '@models/common/CommonSelectCodes';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';

type AlHistoryRow = {
  [key: string]: any;
};

type BalanceHistoryTabProps = {
  userId?: string;
  groupKey?: string;
};

const getLabelByValue = (options: Array<{ value: any; label: string }>, value: unknown): string => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);

  const exact = options.find((o) => String(o.value) === stringValue);
  if (exact) return exact.label;

  const lower = stringValue.toLowerCase();
  const caseInsensitive = options.find((o) => String(o.value).toLowerCase() === lower);
  return caseInsensitive?.label ?? stringValue;
};

const BalanceHistoryTab: React.FC<BalanceHistoryTabProps> = ({ userId: userIdProp, groupKey }) => {
  const { toast } = useNotify();
  const location = useLocation();
  const userId = userIdProp ?? ((location.state as any)?.userId as string | undefined) ?? undefined;
  const resolvedGroupKey =
    groupKey ??
    ((location.state as any)?.groupKey as string | undefined) ??
    ((location.state as any)?.group_key as string | undefined) ??
    undefined;

  const gridRef = useRef<EtsGridRef<AlHistoryRow>>(null);
  const [rowData, setRowData] = useState<AlHistoryRow[]>([]);

  const columnDefs: ColDef[] = useMemo(
    () => [
      EtsColumnPreset.IdPreset({
        field: 'no',
        headerName: 'No',
        width: 60,
      }),
      EtsColumnPreset.TextPreset({
        field: 'user_key',
        headerName: '보낸 유저 키',
        hide: true,
      }),
      EtsColumnPreset.TextPreset({
        field: 'target_user_key',
        headerName: '받은 유저 키',
        hide: true,
      }),
      {
        field: 'al_trans_type',
        headerName: '알 이동 유형',
        width: 120,
        cellRenderer: (params: any) => {
          const code = params.data?.al_trans_type_code;
          const color =
            code === 'PAYOUT'
              ? 'error.main'
              : code === 'RECOVERY'
                ? 'success.main'
                : code === 'CONVERT'
                  ? 'warning.main'
                  : undefined;
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
                fontWeight: 700,
                color,
              }}
            >
              {params.value ?? ''}
            </Box>
          );
        },
      },
      EtsColumnPreset.TextPreset({
        field: 'user_type',
        headerName: '회원 유형',
        width: 120,
      }),
      EtsColumnPreset.TextPreset({
        field: 'user_id',
        headerName: '지급(회수) 회원',
        width: 150,
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'target_user_type',
        headerName: '대상 회원 유형',
        width: 120,
      }),
      EtsColumnPreset.TextPreset({
        field: 'target_user_id',
        headerName: '대상 회원',
        width: 150,
        flex: 1,
      }),
      {
        field: 'al_trans_amount',
        headerName: '알 이동 금액',
        width: 140,
        flex: 1,
        cellRenderer: (params: any) => {
          const val = Number(params.value);
          const display = isNaN(val) ? '' : val.toLocaleString();
          const code = params.data?.al_trans_type_code;
          const color =
            code === 'PAYOUT'
              ? 'error.main'
              : code === 'RECOVERY'
                ? 'success.main'
                : code === 'CONVERT'
                  ? 'warning.main'
                  : undefined;
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
                fontWeight: 700,
                color,
              }}
            >
              {display}
            </Box>
          );
        },
      },
      EtsColumnPreset.TextPreset({
        field: 'created',
        headerName: '등록일시',
        width: 200,
        flex: 1,
      }),
    ],
    []
  );

  useEffect(() => {
    let cancelled = false;

    const fetchRows = async () => {
      if (!userId) {
        setRowData([]);
        toast.error('회원 ID(userId)를 찾을 수 없습니다.');
        return;
      }

      if (!resolvedGroupKey) {
        setRowData([]);
        toast.error('그룹 키(groupKey)를 찾을 수 없습니다.');
        return;
      }

      const startDate = '00000101';
      const endDate = '99991231';

      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/al-trans-record/alTransInfo',
        method: Method.GET,
        params: {
          queryParams: {
            groupKey: resolvedGroupKey,
            startDate,
            endDate,
            transType: '',
            userId,
          },
        },
        config: { isLoading: true },
      });

      if (cancelled) return;

      if (res?.successOrNot !== 'Y') {
        toast.error(res?.HeaderMsg ?? '알 이력 조회에 실패했습니다.');
        setRowData([]);
        return;
      }

      const data = (res?.data ?? []) as AlHistoryRow[];
      const mapped = data.map((row) => {
        const amount = Number(row?.al_trans_amount) || 0;
        return {
          ...row,
          al_trans_type_code: row?.al_trans_type,
          user_type_code: row?.user_type,
          target_user_type_code: row?.target_user_type,
          al_trans_type: getLabelByValue(transactionStatusOptions, row?.al_trans_type),
          user_type: getLabelByValue(MemberTypeOptions, row?.user_type),
          target_user_type: getLabelByValue(MemberTypeOptions, row?.target_user_type),
          al_trans_amount: row?.al_trans_type === 'PAYOUT' ? -Math.abs(amount) : amount,
        };
      });

      setRowData(mapped);
    };

    fetchRows();

    return () => {
      cancelled = true;
    };
  }, [toast, userId, resolvedGroupKey]);

  return (
    <PageTemplate gridRef={gridRef} columnDefs={columnDefs} rowData={rowData} size="one-search" />
  );
};

export default BalanceHistoryTab;
