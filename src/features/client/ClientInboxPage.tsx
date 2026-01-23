import styled from 'styled-components';
import { ClientSiteHeader } from './components';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './components/clientStyleTokens';

const Page = styled.section`
  color: inherit;
`;

const Wrap = styled.div`
  max-width: ${CLIENT_MAX_WIDTH};
  margin: 14px auto 40px;
  padding: 0 ${CLIENT_SIDE_PADDING};
`;

const BoardPanel = styled.section`
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 25% 0%, rgba(255, 205, 120, 0.14), transparent 46%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.12));
    pointer-events: none;
  }
`;

const BoardInner = styled.div`
  position: relative;
  z-index: 1;
  padding: 22px 22px 18px;
`;

const BoardTitle = styled.h2`
  margin: 0 0 14px;
  font-weight: 1000;
  letter-spacing: -0.6px;
  font-size: 28px;
  color: rgba(255, 255, 255, 0.92);
`;

const BoardTable = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
`;

const BoardHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 160px 170px;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.78);
  font-weight: 1000;
  letter-spacing: -0.2px;
  font-size: 13px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr 88px;
    .sender {
      display: none;
    }
  }
`;

const ClientInboxPage = () => {
  return (
    <Page>
      <ClientSiteHeader />
      <Wrap>
        <BoardPanel aria-label="inbox board">
          <BoardInner>
            <BoardTitle>쪽지함</BoardTitle>
            <BoardTable role="table" aria-label="inbox list">
              <BoardHead role="row">
                <div>제목</div>
                <div className="sender" style={{ textAlign: 'right' }}>
                  보낸사람
                </div>
                <div style={{ textAlign: 'right' }}>날짜</div>
              </BoardHead>
            </BoardTable>
          </BoardInner>
        </BoardPanel>
      </Wrap>
    </Page>
  );
};

export default ClientInboxPage;
