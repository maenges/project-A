import React from 'react';

import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Box } from '@mui/material';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { blockStatusOptions } from '@/models/common/CommonSelectCodes';
import { useNotify } from '@hooks/useNotify';

import { EtsButton } from '@/components/EtsCommon';
import { EtsSelectComponent, EtsInputComponent } from '@/components/EtsComponents';

type BlockProps = {
  [key: string]: any;
};

type FormValues = {
  blockStatus: string;
  userId: string;
};

const Block: React.FC = () => {
  const [isEditable, setIsEditable] = useState(false);
  const gridRef = useRef<EtsGridRef<BlockProps>>(null);
  const { toast, confirm } = useNotify();
  const [rowData, setRowData] = useState<BlockProps[]>([]);

  const columnDefs: (ColDef | ColGroupDef)[] = [
    EtsColumnPreset.SelectionBoxPreset({
      headerName: '',
      width: 60,
      headerCheckboxSelection: true,
    }),
    EtsColumnPreset.IdPreset({
      field: 'no',
      headerName: 'No',
      width: 60,
    }),
    EtsColumnPreset.TextPreset({
      field: 'block_key',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_key',
      headerName: 'user_id',
      hide: true,
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
      width: 150,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'block_message',
      headerName: '차단 사유',
      width: 200,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_money',
      headerName: '보유금',
      width: 200,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'user_rolling_money',
      headerName: '롤링금',
      width: 200,
      flex: 1,
      context: {
        formatType: 'number',
        decimalPlaces: 0,
      },
    }),
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '차단일시',
      width: 200,
      flex: 1,
    }),
    EtsColumnPreset.CheckButtonPreset({
      field: 'block_status',
      headerName: '차단 여부',
      width: 120,
      editable: isEditable,
      context: {
        checkButtonProps: {
          checkedLabel: '차단해제',
          uncheckedLabel: '차단하기',
        },
      },
    }),
  ];

  useEffect(() => {
    handleSubmit(onSearch)();
  }, []);

  const { control, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: {
      blockStatus: blockStatusOptions[0].value,
      userId: '',
    },
    mode: 'onChange',
  });

  const onSearch: SubmitHandler<FormValues> = () => {
    const { blockStatus, userId } = getValues();
    callApi({
      service: Service.POSTMAN,
      url: '/api/block',
      method: Method.GET,
      params: {
        queryParams: {
          blockStatus: blockStatus === 'ALL' ? '' : blockStatus,
          userId,
          blockType: 'USER_BLOCK',
        },
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }
      const mapped = (res.data || []).map((row: any) => {
        const raw = row?.block_status;
        const normalized = raw === 'BLOCKED' ? true : raw === 'UNBLOCKED' ? false : Boolean(raw);
        const userTypeCode = String(row?.user_type ?? '');
        const userTypeLabel = userTypeCode === 'CU' ? '고객' : '파트너';
        return {
          ...row,
          block_status: normalized,
          user_type_code: userTypeCode,
          user_type: userTypeLabel,
        };
      });

      setRowData(mapped);
    });
  };

  const handleUpdatedRow = async () => {
    if (gridRef.current) {
      gridRef.current.api.stopEditing();
    }
    // 승인 여부 컬럼 체크로 인하여 셀렉트 체크 로직 없음
    const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];

    selectedNodes.forEach((node) => {
      if (!node) return;
      const current = Boolean(node.data?.block_status);
      node.setDataValue('block_status', !current);
    });
  };

  // GridRow 저장 버튼
  const handleSave = async () => {
    if (gridRef.current) {
      gridRef.current.api.stopEditing();
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    const changedRows: any[] = [];

    gridRef.current?.api.forEachNode((node) => {
      const status = String(node?.data?.rowStatus ?? '').toUpperCase();
      if (status !== 'I' && status !== 'U' && status !== 'D') return;
      if (!node?.data) return;

      const { ...rest } = node.data as any;
      const payloadRow: any = {
        ...rest,
        rowStatus: status,
      };

      changedRows.push(payloadRow);
    });

    if (changedRows.length === 0) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/block/batch',
      method: Method.POST,
      params: {
        bodyParams: changedRows,
      },
      config: { isLoading: true },
    });

    if (res?.successOrNot !== 'Y') {
      toast.error(res?.HeaderMsg ?? '저장에 실패했습니다.');
      return;
    }

    toast.success('저장되었습니다.');
    handleSubmit(onSearch)();
    setIsEditable(false);
  };

  const searchComponent = (
    <form onSubmit={handleSubmit(onSearch)}>
      <searchForm.Container>
        <searchForm.Row>
          <EtsSelectComponent
            control={control}
            name="blockStatus"
            label="차단 여부"
            options={blockStatusOptions}
          />
          <EtsInputComponent
            control={control}
            name="userId"
            label="회원 ID"
            placeholder="회원 ID를 입력하세요."
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key !== 'Enter') return;
              if ((e.nativeEvent as any)?.isComposing) return;
              e.preventDefault();
              handleSubmit(onSearch)();
            }}
            // width={250}
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
        {isEditable ? (
          <>
            <EtsButton
              type="grey"
              onClick={async () => {
                if (gridRef.current) {
                  await handleUpdatedRow();
                }
              }}
            >
              선택차단 및 해제
            </EtsButton>
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
              취소
            </EtsButton>
            <EtsButton
              type="blue"
              onClick={() => {
                handleSave();
              }}
            >
              저장
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
              편집
            </EtsButton>
          </>
        )}
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <>
      <PageTemplate
        title="회원 차단 관리"
        gridRef={gridRef}
        columnDefs={columnDefs}
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        rowData={rowData}
        isRowSelectable={() => isEditable}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
        size="one-search"
      />
    </>
  );
};

export default Block;
