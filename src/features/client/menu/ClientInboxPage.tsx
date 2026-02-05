import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { MenuInfo, MenuKey } from '../ClientMenu.types';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useUnreadInboxStore } from '@/store/unreadInbox';
import { InboxMessageAddEventListeners } from '@/utils/inboxMessageEventBus';
import {
  AlertBtn,
  AlertContainer,
  AlertIcon,
  AlertMessage,
  AlertOverlay,
  NoticeCell,
  NoticeCellTitle,
  NoticeHead,
  NoticeInner,
  NoticePanel,
  NoticeTable,
  NoticeTitle,
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

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
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

type InboxItem = {
  notice_key: string;
  sender: string;
  notice_title: string;
  notice_content: string;
  notice_recive: boolean;
  notice_process: boolean;
  created: string;
};

type AlertState = {
  open: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
};

const ClientInboxPage = ({ menu }: Props) => {
  const [inboxList, setInboxList] = useState<InboxItem[]>([]);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertState>({ open: false, type: 'info', message: '' });
  const { setUnreadCount, decrementUnreadCount } = useUnreadInboxStore();

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ open: true, type, message });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleRowClick = async (item: InboxItem) => {
    const noticeKey = item.notice_key;

    // 읽지 않은 쪽지면 읽음 처리
    if (!item.notice_recive) {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/client/messageRead',
        method: Method.PATCH,
        params: {
          bodyParams: { noticeKey },
        },
        config: { isLoading: false },
      });

      if (res.successOrNot === 'Y') {
        decrementUnreadCount();
        fetchInboxList();
      }
    }

    setExpandedKey((prev) => (prev === noticeKey ? null : noticeKey));
  };

  const fetchInboxList = async () => {
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/messageList',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      showAlert('error', res.HeaderMsg || '조회에 실패했습니다.');
      return;
    }

    setInboxList(res.data ?? []);

    // 안읽은 쪽지 건수 계산
    const unreadCount = (res.data ?? []).filter((item: InboxItem) => !item.notice_recive).length;
    setUnreadCount(unreadCount);
  };

  const handleMarkAllRead = async () => {
    const unreadItems = inboxList.filter((item) => !item.notice_recive);
    if (unreadItems.length === 0) {
      showAlert('info', '모든 쪽지를 읽었습니다.');
      return;
    }

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/messageReads',
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
    fetchInboxList();
  };

  useEffect(() => {
    fetchInboxList();

    // WebSocket message_received 이벤트 구독
    const unsubscribe = InboxMessageAddEventListeners((eventName) => {
      if (eventName === 'message_received') {
        console.log('📨 ClientInboxPage: 쪽지 수신 이벤트, 목록 갱신');
        fetchInboxList();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Wrap>
        <NoticePanel aria-label="inbox board">
          <NoticeInner>
            <TitleRow>
              <NoticeTitle style={{ margin: 0 }}>{menu.title}</NoticeTitle>
              <SmallBtn type="button" onClick={handleMarkAllRead}>
                모두 읽음
              </SmallBtn>
            </TitleRow>
            <NoticeTable role="table" aria-label="inbox list">
              <NoticeHead role="row">
                <div>제목</div>
                <div className="author" style={{ textAlign: 'right' }}>
                  보낸사람
                </div>
                <div style={{ textAlign: 'right' }}>날짜</div>
              </NoticeHead>
              {inboxList.map((item) => {
                const isExpanded = expandedKey === item.notice_key;
                const isUnread = !item.notice_recive;
                return (
                  <NoticeRowWrapper key={item.notice_key} $active={isExpanded} $unread={isUnread}>
                    <NoticeRowHeader type="button" onClick={() => handleRowClick(item)}>
                      <NoticeCellTitle>
                        <span className="text">
                          {isUnread && (
                            <span
                              style={{ color: 'rgba(255, 205, 120, 0.95)', marginRight: '6px' }}
                            >
                              •
                            </span>
                          )}
                          {item.notice_title}
                        </span>
                      </NoticeCellTitle>
                      <NoticeCell className="author">{item.sender}</NoticeCell>
                      <NoticeCell>{item.created}</NoticeCell>
                    </NoticeRowHeader>
                    <NoticeContent $expanded={isExpanded}>
                      <NoticeContentInner>
                        {stripHtmlTags(item.notice_content) || '내용이 없습니다.'}
                      </NoticeContentInner>
                    </NoticeContent>
                  </NoticeRowWrapper>
                );
              })}
            </NoticeTable>
          </NoticeInner>
        </NoticePanel>
      </Wrap>

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

export default ClientInboxPage;
