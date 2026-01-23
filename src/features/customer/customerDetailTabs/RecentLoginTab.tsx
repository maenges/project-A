import React, { useEffect, useMemo, useRef, useState } from 'react';

import { ColDef } from 'ag-grid-community';
import { useLocation } from 'react-router-dom';

import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import { PageTemplate } from '@/components/Teamplate';
import { useNotify } from '@hooks/useNotify';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import dayjs from 'dayjs';

type LoginRecordRow = {
  [key: string]: any;
};

type RecentLoginTabProps = {
  userId?: string;
};

const mapLoginRecordRows = (rows: any[]) =>
  (rows || []).map((row: any) => {
    const userTypeCode = String(row?.user_type ?? '');
    const userTypeLabel = userTypeCode === 'CU' ? '고객' : '파트너';

    const loginSuccessRaw = row?.login_success;
    const loginSuccessCode = String(loginSuccessRaw ?? '').toUpperCase();
    const loginSuccessLabel =
      loginSuccessRaw === true || loginSuccessCode === 'TRUE' || loginSuccessCode === 'Y'
        ? '성공'
        : loginSuccessRaw === false || loginSuccessCode === 'FALSE' || loginSuccessCode === 'N'
          ? '실패'
          : String(loginSuccessRaw ?? '');

    return {
      ...row,
      user_type_code: userTypeCode,
      user_type: userTypeLabel,
      login_success: loginSuccessLabel,
    };
  });

const RecentLoginTab: React.FC<RecentLoginTabProps> = ({ userId: userIdProp }) => {
  const { toast } = useNotify();
  const location = useLocation();
  const userId = userIdProp ?? ((location.state as any)?.userId as string | undefined) ?? undefined;

  const gridRef = useRef<EtsGridRef<LoginRecordRow>>(null);
  const [rowData, setRowData] = useState<LoginRecordRow[]>([]);

  const columnDefs: ColDef[] = useMemo(
    () => [
      EtsColumnPreset.IdPreset({
        field: 'no',
        headerName: 'No',
        width: 80,
      }),
      EtsColumnPreset.TextPreset({
        field: 'user_id',
        headerName: '회원 ID',
        width: 150,
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'user_nick',
        headerName: '회원 닉네임',
        width: 150,
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'user_type',
        headerName: '회원 구분',
        width: 120,
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'login_ip',
        headerName: '접속 IP',
        width: 150,
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'login_success',
        headerName: '성공 유무',
        width: 110,
      }),
      EtsColumnPreset.TextPreset({
        field: 'login_fail_reason',
        headerName: '실패 사유',
        width: 220,
        flex: 1,
      }),
      EtsColumnPreset.TextPreset({
        field: 'created',
        headerName: '접속일시',
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

      const startDate = dayjs().subtract(7, 'day').format('YYYYMMDD');
      const endDate = dayjs().format('YYYYMMDD');

      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/login-record',
        method: Method.GET,
        params: {
          queryParams: {
            userId,
            startDate,
            endDate,
          },
        },
        config: { isLoading: true },
      });

      if (cancelled) return;

      if (res?.successOrNot !== 'Y') {
        toast.error(res?.HeaderMsg ?? '로그인 기록 조회에 실패했습니다.');
        setRowData([]);
        return;
      }

      setRowData(mapLoginRecordRows(res?.data ?? []));
    };

    fetchRows();

    return () => {
      cancelled = true;
    };
  }, [toast, userId]);

  return (
    <PageTemplate gridRef={gridRef} columnDefs={columnDefs} rowData={rowData} size="one-search" />
  );
};

export default RecentLoginTab;
