import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { MenuInfo, MenuKey } from '../ClientMenu.types';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useUnreadSupportStore } from '@/store/unreadSupport';
import { SupportAnswerAddEventListeners } from '@/utils/supportAnswerEventBus';
import {
  AlertBtn,
  AlertContainer,
  AlertIcon,
  AlertMessage,
  AlertOverlay,
  ModalBody,
  ModalBtn,
  ModalCloseBtn,
  ModalContainer,
  ModalFooter,
  ModalHeader,
  ModalInput,
  ModalLabel,
  ModalOverlay,
  ModalTextarea,
  ModalTitle,
  NoticeCell,
  NoticeCellTitle,
  NoticeHead,
  NoticeInner,
  NoticePanel,
  NoticeTable,
  NoticeTitle,
  TemplateBtn,
  Wrap,
} from '../ClientMenu.styles';

const NoticeRowWrapper = styled.div<{ $active?: boolean; $unread?: boolean }>`
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: ${({ $active, $unread }) =>
    $active ? 'rgba(255, 205, 120, 0.10)' : $unread ? 'rgba(255, 205, 120, 0.05)' : 'transparent'};

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(255, 205, 120, 0.10)' : 'rgba(255, 255, 255, 0.03)'};
  }
`;

const NoticeRowHeader = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  color: inherit;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 160px 170px;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;

  @media (max-width: 720px) {
    grid-template-columns: 1fr 88px;
    .author {
      display: none;
    }
  }
`;

const NoticeContent = styled.div<{ $expanded: boolean }>`
  max-height: ${({ $expanded }) => ($expanded ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background: rgba(0, 0, 0, 0.25);
`;

const NoticeContentInner = styled.div`
  padding: 16px 20px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.6;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  white-space: pre-wrap;
  word-break: break-word;
`;

const ReplySection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
`;

const ReplyItem = styled.div`
  padding-left: 20px;
  position: relative;
  color: rgba(255, 205, 120, 0.9);

  &::before {
    content: 'ㄴ';
    position: absolute;
    left: 0;
    color: rgba(255, 205, 120, 0.6);
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const SmallBtn = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 205, 120, 0.95);
  background: transparent;
  border: 1px solid rgba(255, 205, 120, 0.4);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 205, 120, 0.1);
    border-color: rgba(255, 205, 120, 0.6);
  }
`;

const stripHtmlTags = (html: string | undefined | null): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

type Props = {
  menuKey: MenuKey;
  menu: MenuInfo;
};

type SupportItem = {
  notice_title: string;
  notice_content: string;
  user_id: string;
  created: string;
  notice_process?: boolean;
  notice_recive?: boolean;
  notice_key?: string;
  macro_key?: string | null;
  macro_content?: string;
};

type AlertState = {
  open: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
};

const ACCOUNT_TEMPLATE = {
  title: '계좌문의',
  content: `안녕하세요.\n\n계좌 관련 문의 드립니다.\n\n[문의 내용]\n- 은행 명,  예금 주, 계좌번호\n\n확인 부탁 드립니다.\n감사합니다.`,
};

const ClientSupportPage = ({ menu }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [supportList, setSupportList] = useState<SupportItem[]>([]);
  const [expandedKey, setExpandedKey] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertState>({ open: false, type: 'info', message: '' });
  const { setUnreadCount, decrementUnreadCount } = useUnreadSupportStore();

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ open: true, type, message });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleRowClick = async (index: number, item: SupportItem) => {
    if (!item.notice_process) return;

    // notice_recive가 false면 읽음 처리
    if (item.notice_recive === false && item.notice_key) {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/client/answerRead',
        method: Method.PATCH,
        params: {
          bodyParams: { noticeKey: item.notice_key },
        },
        config: { isLoading: false },
      });

      if (res.successOrNot === 'Y') {
        decrementUnreadCount();
        fetchSupportList();
      }
    }

    setExpandedKey((prev) => (prev === index ? null : index));
  };

  const fetchSupportList = async () => {
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/answerList',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      showAlert('error', res.HeaderMsg || '조회에 실패했습니다.');
      return;
    }

    setSupportList(res.data ?? []);

    // 안읽은 문의 건수 계산 (notice_process=true && notice_recive=false)
    const unreadCount = (res.data ?? []).filter(
      (item: SupportItem) => item.notice_process === true && item.notice_recive === false
    ).length;
    setUnreadCount(unreadCount);
  };

  const handleMarkAllRead = async () => {
    const unreadItems = supportList.filter((item) => !item.notice_recive && item.notice_process);
    if (unreadItems.length === 0) {
      showAlert('info', '모든 문의를 읽었습니다.');
      return;
    }

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/answerReads',
      method: Method.PATCH,
      params: {
        bodyParams: {
          noticeKeys: unreadItems.map((item) => item.notice_key),
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      showAlert('error', res.HeaderMsg || '처리에 실패했습니다.');
      return;
    }

    showAlert('success', '모두 읽음 처리되었습니다.');
    fetchSupportList();
  };

  const handleOpenModal = () => {
    setTitle('');
    setContent('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApplyTemplate = () => {
    setTitle(ACCOUNT_TEMPLATE.title);
    setContent(ACCOUNT_TEMPLATE.content);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showAlert('error', '제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      showAlert('error', '내용을 입력해주세요.');
      return;
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
    };

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/answer',
      method: Method.POST,
      params: {
        bodyParams: payload,
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      showAlert('error', res.HeaderMsg || '등록에 실패했습니다.');
      return;
    }

    setIsModalOpen(false);
    showAlert('success', '문의가 등록되었습니다.');
    fetchSupportList();
  };

  useEffect(() => {
    fetchSupportList();

    // WebSocket answer_completed 이벤트 구독
    const unsubscribe = SupportAnswerAddEventListeners((eventName) => {
      if (eventName === 'answer_completed') {
        console.log('📬 ClientSupportPage: 답변 완료 이벤트 수신, 목록 갱신');
        fetchSupportList();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Wrap>
        <NoticePanel aria-label="support board">
          <NoticeInner>
            <TitleRow>
              <NoticeTitle style={{ margin: 0 }}>{menu.title}</NoticeTitle>
              <ButtonGroup>
                <SmallBtn type="button" onClick={handleMarkAllRead}>
                  모두 읽음
                </SmallBtn>
                <SmallBtn type="button" onClick={handleOpenModal}>
                  문의하기
                </SmallBtn>
              </ButtonGroup>
            </TitleRow>
            <NoticeTable role="table" aria-label="support list">
              <NoticeHead role="row">
                <div>제목</div>
                <div className="author" style={{ textAlign: 'right' }}>
                  보낸사람
                </div>
                <div style={{ textAlign: 'right' }}>날짜</div>
              </NoticeHead>
              {supportList.map((item, index) => {
                const isExpanded = expandedKey === index;
                const canExpand = item.notice_process === true;
                const isUnread = item.notice_process === true && item.notice_recive === false;
                return (
                  <NoticeRowWrapper
                    key={`${item.macro_key ?? index}-${index}`}
                    $active={isExpanded}
                    $unread={isUnread}
                  >
                    <NoticeRowHeader
                      type="button"
                      onClick={() => handleRowClick(index, item)}
                      style={{ cursor: canExpand ? 'pointer' : 'default' }}
                    >
                      <NoticeCellTitle>
                        <span className="text">
                          {isUnread && (
                            <span
                              style={{ color: 'rgba(255, 205, 120, 0.95)', marginRight: '6px' }}
                            >
                              •
                            </span>
                          )}
                          {item.notice_title}{' '}
                          {item.notice_process === false && <span className="new">[처리중]</span>}
                          {item.notice_process === true && <span className="new">[답변완료]</span>}
                        </span>
                      </NoticeCellTitle>
                      <NoticeCell className="author">{item.user_id}</NoticeCell>
                      <NoticeCell>{item.created}</NoticeCell>
                    </NoticeRowHeader>
                    {canExpand && (
                      <NoticeContent $expanded={isExpanded}>
                        <NoticeContentInner>
                          {stripHtmlTags(item.notice_content) || '내용이 없습니다.'}
                          {item.notice_process && item.macro_content && (
                            <ReplySection>
                              <ReplyItem>{stripHtmlTags(item.macro_content)}</ReplyItem>
                            </ReplySection>
                          )}
                        </NoticeContentInner>
                      </NoticeContent>
                    )}
                  </NoticeRowWrapper>
                );
              })}
            </NoticeTable>
          </NoticeInner>
        </NoticePanel>
      </Wrap>

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>문의하기</ModalTitle>
              <ModalCloseBtn type="button" onClick={handleCloseModal}>
                ✕
              </ModalCloseBtn>
            </ModalHeader>
            <ModalBody>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <ModalLabel style={{ margin: 0 }}>제목</ModalLabel>
                  <TemplateBtn type="button" onClick={handleApplyTemplate}>
                    계좌문의
                  </TemplateBtn>
                </div>
                <ModalInput
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해주세요"
                  autoComplete="off"
                />
              </div>
              <div>
                <ModalLabel>내용</ModalLabel>
                <ModalTextarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력해주세요"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalBtn type="button" onClick={handleCloseModal}>
                취소
              </ModalBtn>
              <ModalBtn type="button" $primary onClick={handleSave}>
                등록
              </ModalBtn>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      {alert.open && (
        <AlertOverlay onClick={closeAlert}>
          <AlertContainer $type={alert.type} onClick={(e) => e.stopPropagation()}>
            <AlertIcon $type={alert.type}>
              {alert.type === 'success' ? '✓' : alert.type === 'error' ? '!' : 'i'}
            </AlertIcon>
            <AlertMessage>{alert.message}</AlertMessage>
            <AlertBtn $type={alert.type} onClick={closeAlert}>
              확인
            </AlertBtn>
          </AlertContainer>
        </AlertOverlay>
      )}
    </>
  );
};

export default ClientSupportPage;
