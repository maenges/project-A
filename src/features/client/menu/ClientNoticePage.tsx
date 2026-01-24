import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { MenuInfo, MenuKey, NoticeItem } from '../ClientMenu.types';
import {
  NoticeCell,
  NoticeCellTitle,
  NoticeHead,
  NoticeInner,
  NoticePanel,
  NoticeRow,
  NoticeTable,
  NoticeTitle,
  Wrap,
} from '../ClientMenu.styles';

type Props = {
  menuKey: MenuKey;
  menu: MenuInfo;
};

const ClientNoticePage = ({ menu }: Props) => {
  const location = useLocation();
  const selectedTitle = (location.state as { title?: string } | null)?.title;

  const noticeItems: NoticeItem[] = useMemo(
    () => [
      {
        title: '롤링비 미지급 게임 안내',
        author: '관리자',
        date: '2025-06-29 19:29:40',
        isNew: true,
      },
      {
        title: '비정상적인 이용에 대한 제재 안내',
        author: '관리자',
        date: '2024-11-29 12:00:53',
        isNew: true,
      },
      { title: '충전 및 환전 규정', author: '관리자', date: '2023-04-27 12:10:34', isNew: true },
      { title: '라이브 카지노 및 슬롯 규정', author: '관리자', date: '2023-04-27 12:08:54' },
    ],
    []
  );

  return (
    <>
      <Wrap>
        <NoticePanel aria-label="notice panel">
          <NoticeInner>
            <NoticeTitle>{menu.title}</NoticeTitle>
            <NoticeTable role="table" aria-label="notice list">
              <NoticeHead role="row">
                <div>제목</div>
                <div className="author" style={{ textAlign: 'right' }}>
                  글쓴이
                </div>
                <div style={{ textAlign: 'right' }}>날짜</div>
              </NoticeHead>
              {noticeItems.map((x) => (
                <NoticeRow
                  key={x.title}
                  type="button"
                  $active={Boolean(selectedTitle && x.title.includes(selectedTitle))}
                  onClick={() => window.alert(`공지 상세(데모): ${x.title}`)}
                >
                  <NoticeCellTitle>
                    <span className="text">
                      {x.title} {x.isNew ? <span className="new">NEW</span> : null}
                    </span>
                  </NoticeCellTitle>
                  <NoticeCell className="author">{x.author}</NoticeCell>
                  <NoticeCell>{x.date}</NoticeCell>
                </NoticeRow>
              ))}
            </NoticeTable>
          </NoticeInner>
        </NoticePanel>
      </Wrap>
    </>
  );
};

export default ClientNoticePage;
