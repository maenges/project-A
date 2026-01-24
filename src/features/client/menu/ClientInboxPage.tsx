import type { MenuInfo, MenuKey } from '../ClientMenu.types';
import {
  NoticeHead,
  NoticeInner,
  NoticePanel,
  NoticeTable,
  NoticeTitle,
  Wrap,
} from '../ClientMenu.styles';

type Props = {
  menuKey: MenuKey;
  menu: MenuInfo;
};

const ClientInboxPage = ({ menu }: Props) => {
  return (
    <>
      <Wrap>
        <NoticePanel aria-label="inbox board">
          <NoticeInner>
            <NoticeTitle>{menu.title}</NoticeTitle>
            <NoticeTable role="table" aria-label="inbox list">
              <NoticeHead role="row">
                <div>제목</div>
                <div className="author" style={{ textAlign: 'right' }}>
                  보낸사람
                </div>
                <div style={{ textAlign: 'right' }}>날짜</div>
              </NoticeHead>
            </NoticeTable>
          </NoticeInner>
        </NoticePanel>
      </Wrap>
    </>
  );
};

export default ClientInboxPage;
