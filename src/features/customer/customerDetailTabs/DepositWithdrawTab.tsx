import React, { useEffect, useMemo, useRef, useState } from 'react';

import { ColDef } from 'ag-grid-community';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import { PageTemplate } from '@/components/Teamplate';
import { useNotify } from '@hooks/useNotify';
import { transStatusOptions } from '@models/common/CommonSelectCodes';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';

type DepositWithdrawRow = {
  [key: string]: any;
};

type DepositWithdrawTabProps = {
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

const normalizePermission = (raw: unknown): boolean | undefined => {
  if (raw === true) return true;
  if (raw === false) return false;
  if (typeof raw !== 'string') return undefined;
  const v = raw.toLowerCase();
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'y') return true;
  if (v === 'n') return false;
  return undefined;
};

const DepositWithdrawTab: React.FC<DepositWithdrawTabProps> = ({
  userId: userIdProp,
  groupKey,
}) => {
  const { toast } = useNotify();
  const location = useLocation();

  const userId = userIdProp ?? ((location.state as any)?.userId as string | undefined) ?? undefined;
  const resolvedGroupKey =
    groupKey ??
    ((location.state as any)?.groupKey as string | undefined) ??
    ((location.state as any)?.group_key as string | undefined) ??
    undefined;

  const gridRef = useRef<EtsGridRef<DepositWithdrawRow>>(null);
  const [rowData, setRowData] = useState<DepositWithdrawRow[]>([]);

  const columnDefs: ColDef[] = useMemo(
    () => [
      EtsColumnPreset.IdPreset({
        field: 'no',
        headerName: 'No',
        width: 60,
      }),
      EtsColumnPreset.TextPreset({
        field: 'trans_type',
        headerName: '거래 유형',
        width: 120,
      }),
      EtsColumnPreset.TextPreset({
        field: 'user_id',
        headerName: '회원 ID',
        width: 150,
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'trans_amount',
        headerName: '충전(환전) 금액',
        width: 140,
        context: {
          formatType: 'number',
          decimalPlaces: 0,
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'trans_before_amount',
        headerName: '이전 금액',
        width: 120,
        context: {
          formatType: 'number',
          decimalPlaces: 0,
        },
      }),
      EtsColumnPreset.TextPreset({
        field: 'trans_bank_won',
        headerName: '예금주',
        width: 120,
      }),
      EtsColumnPreset.TextPreset({
        field: 'created',
        headerName: '요청일시',
        width: 180,
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'updated',
        headerName: '처리일시',
        width: 180,
        flex: 1,
      }),
      {
        headerName: '처리현황',
        colId: 'trans_permission',
        width: 120,
        suppressMovable: true,
        cellRenderer: (rendererParams: any) => {
          const value = rendererParams?.data?._normalized_trans_permission as boolean | undefined;
          if (value === true) {
            return (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  fontWeight: 700,
                  color: 'success.main',
                }}
              >
                완료
              </Box>
            );
          }

          if (value === false) {
            return (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  fontWeight: 700,
                  color: 'error.main',
                }}
              >
                거절
              </Box>
            );
          }

          return '';
        },
      },
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
        url: '/api/trans-record/transInfo',
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
        toast.error(res?.HeaderMsg ?? '충/환전 이력 조회에 실패했습니다.');
        setRowData([]);
        return;
      }

      const data = Array.isArray(res?.data) ? res.data : [];
      const mapped = data
        .map((row: any) => ({
          ...row,
          trans_type: getLabelByValue(transStatusOptions, row?.trans_type),
          _normalized_trans_permission: normalizePermission(row?.trans_permission),
        }))
        .filter(
          (row: any) =>
            row?._normalized_trans_permission === true ||
            row?._normalized_trans_permission === false
        );

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

export default DepositWithdrawTab;
