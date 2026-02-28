import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { PageTemplate } from '@/components/Teamplate';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
// import dayjs, { Dayjs } from 'dayjs';
import { useNotify } from '@hooks/useNotify';

import { EtsButton } from '@/components/EtsCommon';
import { buttonForm } from '@/assets/style';
import MessageSendModal from './messageSendModal';
import HtmlTooltipComponent from '@/components/EtsGrid/helper/HtmlTooltipComponent';

type Messages = {
  [key: string]: any;
};

const toYesNo = (value: unknown) => {
  if (value === true || value === 'true') return '예';
  if (value === false || value === 'false') return '아니오';
  return value;
};

const stripHtmlToText = (value: unknown) => {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') return String(value);

  const html = value
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*\/\s*p\s*>/gi, '\n')
    .replace(/<\s*\/\s*div\s*>/gi, '\n');

  if (typeof document !== 'undefined') {
    const el = document.createElement('div');
    el.innerHTML = html;

    // innerText는 블록 요소/리스트 등의 줄바꿈을 반영해 주는 편이라
    // '첫 줄만 표시' 같은 요구에 더 안정적임.
    const text = (el.innerText ?? el.textContent ?? '').trim();
    return text.replace(/\n{3,}/g, '\n\n');
  }

  // SSR/비브라우저 환경 fallback
  return html.replace(/<[^>]*>/g, '').trim();
};

const toFirstLine = (value: unknown) => {
  const text = stripHtmlToText(value);
  const lines = text.split(/\r?\n/).map((x) => x.trim());
  return lines.find((x) => x.length > 0) ?? '';
};

const Message: React.FC = () => {
  const [isEditable, setIsEditable] = useState(false);
  const gridRef = useRef<EtsGridRef<Messages>>(null);
  const { toast, confirm } = useNotify();
  const [rowData, setRowData] = useState<Messages[]>([]);
  const [sendModalOpen, setSendModalOpen] = useState(false);

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
      headerName: 'ID',
      hide: true,
    }),

    EtsColumnPreset.TextPreset({
      field: 'notice_title',
      headerName: '제목',
      width: 200,
      flex: 1,
    }),

    EtsColumnPreset.TextPreset({
      field: 'notice_content_text',
      headerName: '내용',
      width: 200,
      flex: 1,
      tooltipComponent: HtmlTooltipComponent,
      tooltipValueGetter: (p: any) => p?.data?.notice_content ?? p?.data?.notice_content_text ?? '',
      wrapText: false,
      autoHeight: false,
      cellStyle: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    }),

    EtsColumnPreset.TextPreset({
      field: 'notice_target_id',
      headerName: '수신자',
      width: 200,
    }),

    EtsColumnPreset.TextPreset({
      field: 'notice_receive',
      headerName: '수신여부',
      width: 200,
    }),

    EtsColumnPreset.TextPreset({
      field: 'created',
      headerName: '등록일시',
      width: 200,
    }),
  ];

  useEffect(() => {
    onSearch();
  }, []);

  const onSearch = () => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/message',
      method: Method.GET,
      params: {},
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      const normalized = (Array.isArray(res.data) ? res.data : []).map((row: any) => {
        const rawReceive = row?.notice_receive ?? row?.notice_recive;
        const rawContent = row?.notice_content ?? row?.notice_content_text;
        return {
          ...row,
          notice_receive: toYesNo(rawReceive),
          notice_content_text: toFirstLine(rawContent),
        };
      });

      setRowData(normalized);
    });
  };

  const handleDeleteRow = () => {
    const selected = (gridRef.current?.getSelectedData() ?? []) as Messages[];
    const row = selected[0];
    if (!row) {
      toast.info('삭제할 항목을 선택하세요.');
      return;
    }
    gridRef.current?.deleteBySelectedRows();
  };

  const handleSave = async () => {
    if (gridRef.current) {
      gridRef.current.api.stopEditing();
    }

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

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/message',
      method: Method.DELETE,
      params: {
        bodyParams: deletePayload,
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }

    toast.success('삭제되었습니다.');
    onSearch();
    setIsEditable(false);
  };

  const sendModal = sendModalOpen && (
    <MessageSendModal
      open={sendModalOpen}
      onClose={() => {
        setSendModalOpen(false);
      }}
      onSaved={onSearch}
    />
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
                onSearch();
                setIsEditable(false);
              }}
            >
              취소
            </EtsButton>
            <EtsButton type="blue" onClick={handleSave}>
              저장
            </EtsButton>
          </>
        ) : (
          <>
            <EtsButton
              type="grey"
              onClick={() => {
                setSendModalOpen(true);
              }}
            >
              메세지 보내기
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
      {sendModal}
      <PageTemplate
        title="보낸쪽지함"
        gridRef={gridRef}
        columnDefs={columnDefs}
        buttonComponent={buttonComponent}
        isRowSelectable={() => isEditable}
        rowData={rowData}
        rowSelection="multiple"
        rowMultiSelectWithClick={true}
        suppressRowClickSelection={true}
        size="no-search"
      />
    </>
  );
};
export default Message;
