import { useEffect, useState } from 'react';
import type { MenuInfo, MenuKey } from '../ClientMenu.types';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import {
  AddBtn,
  AlertBtn,
  AlertContainer,
  AlertIcon,
  AlertMessage,
  AlertOverlay,
  MessageRow,
  NoticeCell,
  NoticeCellTitle,
  NoticeHead,
  NoticeInner,
  NoticePanel,
  NoticeTable,
  NoticeTitle,
  TitleRow,
  Wrap,
} from '../ClientMenu.styles';

type Props = {
  menuKey: MenuKey;
  menu: MenuInfo;
};

type InboxItem = {
  inbox_key: string;
  title: string;
  content: string;
  sender: string;
  created: string;
  is_read: boolean;
};

type AlertState = {
  open: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
};

const ClientInboxPage = ({ menu }: Props) => {
  const [inboxList, setInboxList] = useState<InboxItem[]>([]);
  const [alert, setAlert] = useState<AlertState>({ open: false, type: 'info', message: '' });

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ open: true, type, message });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const fetchInboxList = async () => {
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/inboxList',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      showAlert('error', res.HeaderMsg || '조회에 실패했습니다.');
      return;
    }

    setInboxList(res.data ?? []);
  };

  const handleMarkAllRead = async () => {
    const unreadItems = inboxList.filter((item) => !item.is_read);
    if (unreadItems.length === 0) {
      showAlert('info', '모든 쪽지를 읽었습니다.');
      return;
    }

    const inboxKeys = unreadItems.map((item) => item.inbox_key);

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/inboxRead',
      method: Method.PATCH,
      params: {
        bodyParams: { inbox_keys: inboxKeys },
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
  }, []);

  return (
    <>
      <Wrap>
        <NoticePanel aria-label="inbox board">
          <NoticeInner>
            <TitleRow>
              <NoticeTitle style={{ margin: 0 }}>{menu.title}</NoticeTitle>
              <AddBtn type="button" onClick={handleMarkAllRead}>
                모두 읽음
              </AddBtn>
            </TitleRow>
            <NoticeTable role="table" aria-label="inbox list">
              <NoticeHead role="row">
                <div>제목</div>
                <div className="author" style={{ textAlign: 'right' }}>
                  보낸사람
                </div>
                <div style={{ textAlign: 'right' }}>날짜</div>
              </NoticeHead>
              {inboxList.map((item) => (
                <MessageRow key={item.inbox_key} type="button" $unread={!item.is_read}>
                  <NoticeCellTitle>
                    <span className="text">{item.title}</span>
                  </NoticeCellTitle>
                  <NoticeCell>{item.sender}</NoticeCell>
                  <NoticeCell>{item.created}</NoticeCell>
                </MessageRow>
              ))}
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
