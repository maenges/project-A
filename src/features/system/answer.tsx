import React from 'react';

import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { Box } from '@mui/material';
import { searchForm, buttonForm } from '@/assets/style';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { processStatusOptions } from '@/models/common/CommonSelectCodes';
import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';
import { useActivate } from 'react-activation';
import AnswerModal from './answerModal';
import AnswerMacroModal from './answerMacroModal';

import { EtsButton } from '@/components/EtsCommon';
import { EtsSelectComponent, EtsDatePickerComponent } from '@/components/EtsComponents';

type AnswerProps = {
  [key: string]: any;
};

type FormValues = {
  startDate: string;
  endDate: string;
  noticeProcess: string;
};

const Answer: React.FC = () => {
  const [isEditable, setIsEditable] = useState(false);
  const gridRef = useRef<EtsGridRef<AnswerProps>>(null);
  const { toast } = useNotify();
  const [startRangeDate, setStartRangeDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endRangeDate, setEndRangeDate] = useState<Dayjs | null>(dayjs());
  const [rowData, setRowData] = useState<AnswerProps[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [macroModalOpen, setMacroModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [modalData, setModalData] = useState<any | null>(null);

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
      field: 'notice_key',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'group_sh',
      headerName: '부본사',
      width: 150,
      flex: 1,
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
      field: 'user_bank_won',
      headerName: '예금주명',
      width: 100,
    }),
    EtsColumnPreset.TextPreset({
      field: 'notice_title',
      headerName: '제목',
      width: 200,
    }),
    EtsColumnPreset.TextPreset({
      field: 'notice_content',
      headerName: '내용',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'last_charge_date',
      headerName: '최종충전일시',
      width: 200,
    }),
    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '등록일시',
      width: 200,
    }),
    EtsColumnPreset.TextPreset({
      field: 'notice_process',
      headerName: '처리 상태',
      width: 80,
    }),
    EtsColumnPreset.CheckButtonPreset2({
      field: 'answer',
      headerName: '답변',
      width: 150,
      context: {
        label: '답변하기',
        onClick: async (p: any) => {
          const row = p?.data;
          if (!row) return;
          setSelectedRow(row);
          callApi({
            service: Service.POSTMAN,
            url: '/api/answer/reply',
            method: Method.GET,
            params: {},
          }).then((res) => {
            if (res.successOrNot !== 'Y') {
              toast.error(res.HeaderMsg);
              return;
            }
            setModalData(res.data);
            console.log(selectedRow);

            setModalOpen(true);
          });
        },
        // 처리 상태 완료시 disable 처리
        disabled: (p: any) =>
          p?.data?.notice_process ===
          processStatusOptions.find((opt) => opt.value === 'COMPLETED')?.label,
      },
      flex: 1,
    }),
  ];

  useActivate(() => {
    // 데이터가 있으면 재조회 실행
    // if (rowData && rowData.length > 0) {
    //   handleSubmit(onSearch)();
    // }
  });

  const { control, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: {
      startDate: dayjs().subtract(7, 'day').format('YYYYMMDD'),
      endDate: dayjs().format('YYYYMMDD'),
      noticeProcess: 'ALL',
    },
    mode: 'onChange',
  });

  // const getQueryParams = () => {
  //   const sendParams = {
  //     startDate: startRangeDate ? startRangeDate.format('YYYYMMDD') : '',
  //     endDate: endRangeDate ? endRangeDate.format('YYYYMMDD') : '',
  //     // sactyp: watch('acType') === 'ALL' ? '' : watch('acType'),
  //     // seg: watch('seg') === 'all' ? '' : watch('seg'),
  //   };

  //   return sendParams;
  // };

  const onSearch: SubmitHandler<FormValues> = () => {
    // const sendParams = getQueryParams();

    const { startDate, endDate, noticeProcess } = getValues();

    callApi({
      service: Service.POSTMAN,
      url: '/api/answer',
      method: Method.GET,
      params: {
        queryParams: {
          startDate: startDate,
          endDate: endDate,
          noticeProcess: noticeProcess === 'ALL' ? '' : noticeProcess,
        },
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }
      const mapped = (res.data || []).map((row: any) => {
        const statusKey = row?.notice_process === true ? 'COMPLETED' : 'PENDING';
        const statusLabel =
          processStatusOptions.find((opt) => opt.value === statusKey)?.label || statusKey;
        return {
          ...row,
          notice_process: statusLabel,
        };
      });

      setRowData(mapped);
    });
  };

  const macroModal = macroModalOpen && (
    <AnswerMacroModal
      open={macroModalOpen}
      onClose={() => {
        setMacroModalOpen(false);
      }}
    />
  );
  const modal = modalOpen && (
    <AnswerModal
      open={modalOpen}
      onClose={() => {
        setModalOpen(false);
      }}
      onSaved={() => {
        handleSubmit(onSearch)();
      }}
      // 넘긴값 + 조회 값
      data={{
        noticeKey: selectedRow?.notice_key,
        userId: selectedRow?.user_id,
        nickName: selectedRow?.user_nick,
        title: selectedRow?.notice_title,
        content: selectedRow?.notice_content,
        macroList: modalData,
      }}
    />
  );

  const handleDeleteRow = () => {
    const selected = (gridRef.current?.getSelectedData() ?? []) as AnswerProps[];
    const row = selected[0];
    if (!row) {
      toast.info('삭제할 항목을 선택하세요.');
      return;
    }
    gridRef.current?.deleteBySelectedRows();
  };

  // GridRow 저장 버튼
  const handleSave = async () => {
    if (gridRef.current) {
      gridRef.current.api.stopEditing();
    }

    // stopEditing 이후 rowStatus 반영 타이밍 보장
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    const deleteNodes: any[] = [];

    gridRef.current?.api.forEachNode((node) => {
      const status = String(node?.data?.rowStatus ?? '').toUpperCase();
      if (status === 'D') deleteNodes.push(node);
    });

    const deletePayload = deleteNodes
      .map((node) => node?.data?.notice_key)
      .filter((v): v is string => typeof v === 'string' && v.length > 0)
      .map((notice_key) => ({ notice_key }));

    if (deletePayload.length === 0) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    await callApi({
      service: Service.POSTMAN,
      url: '/api/answer',
      method: Method.DELETE,
      params: {
        bodyParams: deletePayload,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        return;
      }
      toast.success('저장되었습니다.');
      handleSubmit(onSearch)();
      setIsEditable(false);
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
            name="noticeProcess"
            label="처리 상태"
            options={processStatusOptions}
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
              onClick={() => {
                if (gridRef.current) {
                  handleDeleteRow();
                }
              }}
            >
              삭제
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
              onClick={() => {
                setMacroModalOpen(true);
              }}
            >
              매크로 관리
            </EtsButton>
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
      {macroModal}
      {modal}
      <PageTemplate
        title="1:1 문의"
        gridRef={gridRef}
        columnDefs={columnDefs}
        searchComponent={searchComponent}
        buttonComponent={buttonComponent}
        rowData={rowData}
        isRowSelectable={() => isEditable}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
      />
    </>
  );
};

export default Answer;
