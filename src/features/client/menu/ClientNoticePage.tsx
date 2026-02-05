import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import type { MenuInfo, MenuKey } from '../ClientMenu.types';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import {
  NoticeCell,
  NoticeCellTitle,
  NoticeHead,
  NoticeInner,
  NoticePanel,
  NoticeTable,
  NoticeTitle,
  Wrap,
} from '../ClientMenu.styles';

const NoticeRowWrapper = styled.div<{ $active?: boolean }>`
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: ${({ $active }) => ($active ? 'rgba(255, 205, 120, 0.10)' : 'transparent')};

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

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

type Props = {
  menuKey: MenuKey;
  menu: MenuInfo;
};

type NoticeItem = {
  notice_key: string;
  notice_title: string;
  notice_content: string;
  notice_target_type: string;
  notice_order: string;
  created: string;
  author?: string;
};

const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const ClientNoticePage = ({ menu }: Props) => {
  const location = useLocation();
  const selectedTitle = (location.state as { title?: string } | null)?.title;

  const [noticeItems, setNoticeItems] = useState<NoticeItem[]>([]);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const handleRowClick = (noticeKey: string) => {
    setExpandedKey((prev) => (prev === noticeKey ? null : noticeKey));
  };

  const fetchNoticeList = async () => {
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/client/noticeList',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      return;
    }

    setNoticeItems(res.data ?? []);
  };

  useEffect(() => {
    fetchNoticeList();
  }, []);

  return (
    <>
      <Wrap>
        <NoticePanel aria-label="notice panel">
          <NoticeInner>
            <TitleRow>
              <NoticeTitle style={{ margin: 3.5 }}>{menu.title}</NoticeTitle>
            </TitleRow>
            <NoticeTable role="table" aria-label="notice list">
              <NoticeHead role="row">
                <div>제목</div>
                <div className="author" style={{ textAlign: 'right' }}>
                  글쓴이
                </div>
                <div style={{ textAlign: 'right' }}>날짜</div>
              </NoticeHead>
              {noticeItems.map((x) => {
                const isExpanded = expandedKey === x.notice_key;
                return (
                  <NoticeRowWrapper
                    key={x.notice_key}
                    $active={
                      Boolean(selectedTitle && x.notice_title.includes(selectedTitle)) || isExpanded
                    }
                  >
                    <NoticeRowHeader type="button" onClick={() => handleRowClick(x.notice_key)}>
                      <NoticeCellTitle>
                        <span className="text">
                          {x.notice_title}{' '}
                          {isToday(x.created) ? <span className="new">NEW</span> : null}
                        </span>
                      </NoticeCellTitle>
                      <NoticeCell className="author">{x.author ?? '관리자'}</NoticeCell>
                      <NoticeCell>{x.created}</NoticeCell>
                    </NoticeRowHeader>
                    <NoticeContent $expanded={isExpanded}>
                      <NoticeContentInner>
                        {stripHtmlTags(x.notice_content) || '내용이 없습니다.'}
                      </NoticeContentInner>
                    </NoticeContent>
                  </NoticeRowWrapper>
                );
              })}
            </NoticeTable>
          </NoticeInner>
        </NoticePanel>
      </Wrap>
    </>
  );
};

export default ClientNoticePage;
