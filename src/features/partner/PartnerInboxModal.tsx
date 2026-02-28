import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { EtsGrid, EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { ColDef } from 'ag-grid-community';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useNotify } from '@hooks/useNotify';
import { PageModalTemplate } from '@/components/Teamplate';
import { buttonForm } from '@/assets/style';
import { EtsButton } from '@/components/EtsCommon';
import { useUnreadInboxStore } from '@/store/unreadInbox';
import { InboxMessageAddEventListeners } from '@/utils/inboxMessageEventBus';

type InboxItem = {
  no?: number;
  notice_key: string;
  sender: string;
  notice_title: string;
  notice_content: string;
  notice_recive: boolean;
  notice_process: boolean;
  created: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const stripHtmlTags = (html: string | undefined | null): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

const PartnerInboxModal = ({ open, onClose }: Props) => {
  const gridRef = useRef<EtsGridRef<InboxItem>>(null);
  const [rowData, setRowData] = useState<InboxItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const { toast } = useNotify();
  const { setUnreadCount, decrementUnreadCount } = useUnreadInboxStore();

  const columnDefs: ColDef[] = [
    EtsColumnPreset.IdPreset({ field: 'no', headerName: 'No', width: 70 }),
    {
      field: 'notice_title',
      headerName: '제목',
      flex: 1,
      cellStyle: (params: any) => {
        if (params.data && !params.data.notice_recive) {
          return { fontWeight: 'bold' as const, cursor: 'pointer' };
        }
        return { fontWeight: 'normal' as const, cursor: 'pointer' };
      },
      valueFormatter: (params: any) => {
        if (!params.data) return '';
        return !params.data.notice_recive
          ? `● ${params.data.notice_title}`
          : params.data.notice_title;
      },
    },
    EtsColumnPreset.TextPreset({ field: 'sender', headerName: '보낸사람', width: 150 }),
    EtsColumnPreset.TextPreset({ field: 'created', headerName: '날짜', width: 180 }),
  ];

  const fetchList = useCallback(async () => {
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/messageList',
      method: Method.GET,
      params: {},
      config: { isLoading: false },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg || '조회에 실패했습니다.');
      return;
    }

    const data = (res.data ?? []).map((item: InboxItem, idx: number) => ({
      ...item,
      no: idx + 1,
    }));
    setRowData(data);

    const unreadCount = data.filter((item: InboxItem) => !item.notice_recive).length;
    setUnreadCount(unreadCount);
  }, []);

  const handleCellClicked = async (params: any) => {
    const item = params.data as InboxItem | undefined;
    if (!item) return;

    // 읽지 않은 쪽지면 읽음 처리
    if (!item.notice_recive) {
      await callApi({
        service: Service.POSTMAN,
        url: '/api/client/messageRead',
        method: Method.PATCH,
        params: { bodyParams: { noticeKey: item.notice_key } },
        config: { isLoading: false },
      });
      decrementUnreadCount();
      fetchList();
    }

    // 토글: 같은 행 클릭 시 닫기 / 다른 행 클릭 시 열기
    setSelectedItem((prev) => (prev?.notice_key === item.notice_key ? null : item));
  };

  const handleMarkAllRead = async () => {
    const unreadItems = rowData.filter((item) => !item.notice_recive);
    if (unreadItems.length === 0) {
      toast.info('모든 쪽지를 읽었습니다.');
      return;
    }

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/messageReads',
      method: Method.PATCH,
      params: {
        bodyParams: { noticeKeys: unreadItems.map((item) => item.notice_key) },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg || '처리에 실패했습니다.');
      return;
    }

    toast.success('모두 읽음 처리되었습니다.');
    setSelectedItem(null);
    fetchList();
  };

  // 모달 열릴 때 목록 조회
  useEffect(() => {
    if (open) {
      fetchList();
      setSelectedItem(null);
    }
  }, [open, fetchList]);

  // WebSocket 이벤트 구독 (쪽지 수신 시 목록 갱신)
  useEffect(() => {
    const unsubscribe = InboxMessageAddEventListeners((eventName) => {
      if (eventName === 'message_received' && open) {
        fetchList();
      }
    });
    return () => unsubscribe();
  }, [open, fetchList]);

  const buttonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <EtsButton type="grey" onClick={handleMarkAllRead}>
          모두 읽음
        </EtsButton>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  const contentComponent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1, pt: 1 }}>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <EtsGrid
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          onCellClicked={handleCellClicked}
          suppressRowTransform
          height="calc(100vh - 500px)"
        />
      </Box>
      {selectedItem && (
        <Box
          sx={(theme) => ({
            p: 2.5,
            borderRadius: '8px',
            border: `1px solid ${theme.palette.primary.main}44`,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
            maxHeight: 220,
            overflowY: 'auto',
          })}
        >
          <Typography
            variant="subtitle2"
            sx={(theme) => ({
              mb: 1.5,
              fontWeight: 700,
              fontSize: '14px',
              color: theme.palette.primary.main,
            })}
          >
            {selectedItem.notice_title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7 }}
          >
            {stripHtmlTags(selectedItem.notice_content) || '내용이 없습니다.'}
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <PageModalTemplate
      open={open}
      onClose={onClose}
      title="쪽지함"
      width={900}
      buttonComponent={buttonComponent}
      component={contentComponent}
    />
  );
};

export default PartnerInboxModal;
