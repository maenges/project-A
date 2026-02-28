import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { EtsGrid, EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { ColDef } from 'ag-grid-community';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useNotify } from '@hooks/useNotify';
import { PageModalTemplate } from '@/components/Teamplate';
import { buttonForm, searchForm } from '@/assets/style';
import { EtsButton } from '@/components/EtsCommon';
import { EtsInputComponent } from '@/components/EtsComponents';
import { useUnreadSupportStore } from '@/store/unreadSupport';
import { SupportAnswerAddEventListeners } from '@/utils/supportAnswerEventBus';
import { useForm } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';

type SupportItem = {
  no?: number;
  notice_key?: string;
  notice_title: string;
  notice_content: string;
  user_id: string;
  created: string;
  notice_process?: boolean;
  notice_recive?: boolean;
  macro_key?: string | null;
  macro_content?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const stripHtmlTags = (html: string | undefined | null): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

const ACCOUNT_TEMPLATE = {
  title: '계좌문의',
  content: `안녕하세요.\n\n계좌 관련 문의 드립니다.\n\n[문의 내용]\n- 은행 명,  예금 주, 계좌번호\n\n확인 부탁 드립니다.\n감사합니다.`,
};

const PartnerSupportModal = ({ open, onClose }: Props) => {
  const gridRef = useRef<EtsGridRef<SupportItem>>(null);
  const [rowData, setRowData] = useState<SupportItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SupportItem | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryContent, setInquiryContent] = useState('');
  const { toast } = useNotify();
  const { setUnreadCount, decrementUnreadCount } = useUnreadSupportStore();

  const {
    control: inquiryControl,
    handleSubmit: handleInquirySubmit,
    setFocus: setInquiryFocus,
    reset: resetInquiry,
  } = useForm<{ title: string }>({
    defaultValues: { title: '' },
    mode: 'onChange',
  });

  const columnDefs: ColDef[] = [
    EtsColumnPreset.IdPreset({ field: 'no', headerName: 'No', width: 70 }),
    {
      field: 'notice_title',
      headerName: '제목',
      flex: 1,
      cellStyle: (params: any) => {
        const item = params.data as SupportItem | undefined;
        const isUnread = item?.notice_process === true && item?.notice_recive === false;
        if (isUnread) {
          return { fontWeight: 'bold' as const, cursor: 'pointer' };
        }
        return {
          fontWeight: 'normal' as const,
          cursor: item?.notice_process ? 'pointer' : 'default',
        };
      },
      valueFormatter: (params: any) => {
        const item = params.data as SupportItem | undefined;
        if (!item) return '';
        const isUnread = item.notice_process === true && item.notice_recive === false;
        return isUnread ? `● ${item.notice_title}` : item.notice_title;
      },
    },
    EtsColumnPreset.TextPreset({ field: 'user_id', headerName: '보낸사람', width: 150 }),
    EtsColumnPreset.TextPreset({ field: 'created', headerName: '날짜', width: 180 }),
    {
      field: 'notice_process',
      headerName: '상태',
      width: 120,
      cellDataType: false,
      valueFormatter: (params: any) => {
        const val = params.value;
        if (val === true || val === 'true') return '답변완료';
        return '처리중';
      },
    },
  ];

  const fetchList = useCallback(async () => {
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/answerList',
      method: Method.GET,
      params: {},
      config: { isLoading: false },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg || '조회에 실패했습니다.');
      return;
    }

    const data = (res.data ?? []).map((item: SupportItem, idx: number) => ({
      ...item,
      no: idx + 1,
    }));
    setRowData(data);

    // 안읽은 문의 건수 (notice_process=true && notice_recive=false)
    const unreadCount = data.filter(
      (item: SupportItem) => item.notice_process === true && item.notice_recive === false
    ).length;
    setUnreadCount(unreadCount);
  }, []);

  const handleCellClicked = async (params: any) => {
    const item = params.data as SupportItem | undefined;
    if (!item) return;

    // 답변이 없는 항목은 상세 볼 수 없음
    if (!item.notice_process) return;

    // 읽지 않은 문의면 읽음 처리
    if (item.notice_recive === false && item.notice_key) {
      await callApi({
        service: Service.POSTMAN,
        url: '/api/client/answerRead',
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
    const unreadItems = rowData.filter((item) => item.notice_process && !item.notice_recive);
    if (unreadItems.length === 0) {
      toast.info('모든 문의를 읽었습니다.');
      return;
    }

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/answerReads',
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

  /* 문의하기 */
  const handleOpenInquiry = () => {
    resetInquiry({ title: '' });
    setInquiryContent('');
    setInquiryOpen(true);
  };

  const handleCloseInquiry = () => {
    setInquiryOpen(false);
  };

  const handleApplyTemplate = () => {
    resetInquiry({ title: ACCOUNT_TEMPLATE.title });
    setInquiryContent(ACCOUNT_TEMPLATE.content);
  };

  const onInquiryInvalid = () => {
    setInquiryFocus('title');
  };

  const onInquirySave = async (values: { title: string }) => {
    if (!inquiryContent.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/answer',
      method: Method.POST,
      params: {
        bodyParams: { title: values.title.trim(), content: inquiryContent.trim() },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg || '등록에 실패했습니다.');
      return;
    }

    toast.success('문의가 등록되었습니다.');
    setInquiryOpen(false);
    fetchList();
  };

  // 모달 열릴 때 목록 조회
  useEffect(() => {
    if (open) {
      fetchList();
      setSelectedItem(null);
    }
  }, [open, fetchList]);

  // WebSocket 이벤트 구독 (답변 완료 시 목록 갱신)
  useEffect(() => {
    const unsubscribe = SupportAnswerAddEventListeners((eventName) => {
      if (eventName === 'answer_completed' && open) {
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
        <EtsButton type="blue" onClick={handleOpenInquiry}>
          문의하기
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
            maxHeight: 260,
            overflowY: 'auto',
          })}
        >
          <Typography
            variant="subtitle2"
            sx={(theme) => ({
              mb: 1.5,
              mt: 1,
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
          {/* 관리자 답변 표시 */}
          {selectedItem.notice_process && selectedItem.macro_content && (
            <Box
              sx={(theme) => ({
                mt: 2,
                pt: 2,
                borderTop: `2px solid ${theme.palette.warning.main}`,
              })}
            >
              <Typography
                variant="body2"
                sx={(theme) => ({
                  fontWeight: 700,
                  mb: 0.5,
                  color: theme.palette.warning.main,
                  fontSize: '13px',
                })}
              >
                └ 답변
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7 }}
              >
                {stripHtmlTags(selectedItem.macro_content)}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <PageModalTemplate
        open={open}
        onClose={onClose}
        title="문의함"
        width={1000}
        buttonComponent={buttonComponent}
        component={contentComponent}
      />

      {/* 문의하기 서브 모달 (PageModalTemplate) */}
      {inquiryOpen && (
        <InquirySubModal
          open={inquiryOpen}
          onClose={handleCloseInquiry}
          control={inquiryControl}
          content={inquiryContent}
          onContentChange={setInquiryContent}
          onApplyTemplate={handleApplyTemplate}
          onSubmit={handleInquirySubmit(onInquirySave, onInquiryInvalid)}
        />
      )}
    </>
  );
};

/* ===== 문의하기 서브 모달 ===== */
type InquirySubModalProps = {
  open: boolean;
  onClose: () => void;
  control: any;
  content: string;
  onContentChange: (v: string) => void;
  onApplyTemplate: () => void;
  onSubmit: () => void;
};

const InquirySubModal = ({
  open,
  onClose,
  control,
  content,
  onContentChange,
  onApplyTemplate,
  onSubmit,
}: InquirySubModalProps) => {
  const theme = useTheme();
  const inquirySearchComponent = (
    <searchForm.Container>
      <searchForm.Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <EtsInputComponent
          control={control}
          name="title"
          label="제목"
          placeholder="제목을 입력해주세요."
          width={350}
          required={true}
          autoComplete="off"
        />
        <EtsButton type="grey" onClick={onApplyTemplate}>
          계좌문의
        </EtsButton>
      </searchForm.Row>
      <searchForm.SelectLabel>
        <searchForm.Label>내용</searchForm.Label>
      </searchForm.SelectLabel>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="내용을 입력해주세요."
        style={{
          width: '100%',
          height: 160,
          padding: '12px 14px',
          fontSize: 14,
          lineHeight: 1.6,
          color: theme.palette.text.primary,
          background: theme.palette.mode === 'light' ? '#FFFFFF' : theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 6,
          resize: 'none',
          outline: 'none',
          boxSizing: 'border-box' as const,
          fontFamily: 'inherit',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = theme.palette.primary.main;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = theme.palette.divider;
        }}
      />
    </searchForm.Container>
  );

  const inquiryButtonComponent = (
    <buttonForm.Container>
      <buttonForm.Row>
        <EtsButton type="blue" onClick={onSubmit}>
          문의하기
        </EtsButton>
      </buttonForm.Row>
    </buttonForm.Container>
  );

  return (
    <PageModalTemplate
      open={open}
      onClose={onClose}
      searchComponent={inquirySearchComponent}
      buttonComponent={inquiryButtonComponent}
      title="문의하기"
      width={680}
    />
  );
};

export default PartnerSupportModal;
