import styled from 'styled-components';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './components/clientStyleTokens';

export const Wrap = styled.section`
  max-width: ${CLIENT_MAX_WIDTH};
  margin: 14px auto 40px;
  padding: 0 ${CLIENT_SIDE_PADDING};
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const NoticePanel = styled.section`
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

export const NoticeInner = styled.div`
  position: relative;
  z-index: 1;
  padding: 22px 22px 18px;
`;

export const NoticeTitle = styled.h2`
  margin: 0 0 14px;
  font-weight: 1000;
  letter-spacing: -0.6px;
  font-size: 28px;
  color: rgba(255, 255, 255, 0.92);
`;

export const NoticeTable = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
`;

export const NoticeHead = styled.div`
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
    .author {
      display: none;
    }
  }
`;

export const NoticeRow = styled.button<{ $active?: boolean }>`
  width: 100%;
  border: none;
  background: ${({ $active }) => ($active ? 'rgba(255, 205, 120, 0.10)' : 'transparent')};
  color: inherit;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 160px 170px;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr 88px;
    .author {
      display: none;
    }
  }
`;

// 읽음/안읽음 표시가 가능한 Row (문의, 쪽지함용)
export const MessageRow = styled.button<{ $active?: boolean; $unread?: boolean }>`
  width: 100%;
  border: none;
  background: ${({ $active }) => ($active ? 'rgba(255, 205, 120, 0.10)' : 'transparent')};
  color: inherit;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 160px 170px;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: ${({ $unread }) => ($unread ? '1000' : '500')};

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr 88px;
    .author {
      display: none;
    }
  }
`;

export const NoticeCellTitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 1000;
  letter-spacing: -0.2px;
  font-size: 13px;
  min-width: 0;

  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .new {
    font-size: 11px;
    font-weight: 1000;
    color: rgba(255, 205, 120, 0.95);
    letter-spacing: 0.2px;
  }
`;

export const NoticeCell = styled.div`
  color: rgba(255, 255, 255, 0.72);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.1px;
  text-align: right;
`;

export const DepositPanel = styled.section`
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
`;

export const DepositInner = styled.div`
  padding: 16px;
`;

export const FormTable = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 12px;
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  &:first-child {
    border-top: none;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 12px;
  }
`;

export const FormLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 1000;
  letter-spacing: -0.2px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

export const ValueText = styled.div`
  color: rgba(255, 255, 255, 0.92);
  font-weight: 1100;
  letter-spacing: -0.2px;
`;

export const Field = styled.input`
  width: 100%;
  max-width: 520px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.92);
  padding: 0 12px;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: -0.2px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
    font-weight: 800;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 205, 120, 0.55);
    box-shadow: 0 0 0 3px rgba(255, 205, 120, 0.14);
  }
`;

export const FieldShort = styled(Field)`
  max-width: 280px;

  @media (max-width: 720px) {
    max-width: 100%;
  }
`;

export const PasswordField = styled(FieldShort)`
  -webkit-text-security: disc;
`;

export const SelectField = styled.select`
  max-width: 280px;
  width: 100%;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.92);
  padding: 0 12px;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: -0.2px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;

  &:focus {
    outline: none;
    border-color: rgba(255, 205, 120, 0.55);
    box-shadow: 0 0 0 3px rgba(255, 205, 120, 0.14);
  }

  option {
    background: #1a1a1a;
    color: rgba(255, 255, 255, 0.92);
  }

  @media (max-width: 720px) {
    max-width: 100%;
  }
`;

export const FieldAmount = styled(Field)`
  max-width: 360px;

  @media (max-width: 720px) {
    max-width: 100%;
  }
`;

export const Inline = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const MiniBtn = styled.button<{ $tone?: 'gold' | 'gray' }>`
  height: 32px;
  padding: 0 10px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 1000;
  letter-spacing: -0.2px;
  cursor: pointer;
  border: 1px solid
    ${({ $tone }) => ($tone === 'gold' ? 'rgba(255, 205, 120, 0.75)' : 'rgba(255, 255, 255, 0.14)')};
  background: ${({ $tone }) =>
    $tone === 'gold' ? 'rgba(255, 205, 120, 0.92)' : 'rgba(255, 255, 255, 0.10)'};
  color: ${({ $tone }) => ($tone === 'gold' ? '#141414' : 'rgba(255, 255, 255, 0.88)')};

  &:hover {
    filter: brightness(1.03);
    background: ${({ $tone }) =>
      $tone === 'gold' ? 'rgba(255, 205, 120, 0.98)' : 'rgba(255, 255, 255, 0.13)'};
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 2px;
  }
`;

export const AmountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const Hint = styled.div`
  color: rgba(255, 255, 255, 0.65);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: -0.1px;
  line-height: 1.35;
`;

export const SubmitWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 18px 0 4px;
`;

export const SubmitBtn = styled.button<{ $tone?: 'gold' }>`
  width: min(520px, 100%);
  height: 52px;
  border-radius: 12px;
  border: 1px solid
    ${({ $tone }) => ($tone === 'gold' ? 'rgba(255, 205, 120, 0.75)' : 'rgba(255, 255, 255, 0.14)')};
  background: ${({ $tone }) =>
    $tone === 'gold' ? 'rgba(255, 205, 120, 0.92)' : 'rgba(255, 255, 255, 0.86)'};
  color: ${({ $tone }) => ($tone === 'gold' ? '#141414' : 'rgba(0, 0, 0, 0.78)')};
  font-weight: 1000;
  letter-spacing: -0.2px;
  cursor: pointer;

  &:hover {
    filter: brightness(${({ $tone }) => ($tone === 'gold' ? '1.03' : '1.02')});
    background: ${({ $tone }) => ($tone === 'gold' ? 'rgba(255, 205, 120, 0.98)' : undefined)};
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 3px;
  }
`;

export const HistoryTitle = styled.h2`
  margin: 18px 0 12px;
  font-weight: 700;
  letter-spacing: -0.8px;
  font-size: 26px;
  color: rgba(255, 255, 255, 0.92);

  @media (max-width: 720px) {
    margin: 14px 0 10px;
    font-size: 20px;
    letter-spacing: -0.5px;
  }
`;

export const HistoryTable = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
  max-width: 100%;
  overflow-x: hidden;
`;

export const HistoryScroll = styled.div`
  &[data-scroll='true'] {
    max-height: calc(44px + 66px * 5);
    overflow-y: auto;
    overscroll-behavior: contain;

    /* 헤더/바디 컬럼 정렬을 위해 스크롤바 공간을 안정적으로 예약 */
    scrollbar-gutter: stable;

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.22) rgba(255, 255, 255, 0.06);

    /* WebKit */
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.06);
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 999px;
      border: 2px solid rgba(255, 255, 255, 0.06);
    }
  }

  @media (max-width: 720px) {
    &[data-scroll='true'] {
      max-height: 360px;
    }
  }
`;

export const HistoryBody = styled.div``;

export const HistoryHead = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr 1.2fr 1.2fr 1fr 120px;
  gap: 12px;
  padding: 12px 16px;
  background: rgb(18, 18, 18);
  color: rgba(255, 255, 255, 0.78);
  font-weight: 1000;
  letter-spacing: -0.2px;
  font-size: 13px;
  height: 44px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 2;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  & > * {
    min-width: 0;
  }

  .requested,
  .processed {
    text-align: center;
  }

  @media (max-width: 980px) {
    grid-template-columns: 1.1fr 1fr 1.2fr 1fr 110px;
    .processed {
      display: none;
    }
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1.1fr 1fr 76px;
    gap: 8px;
    padding: 10px 12px;
    font-size: 11px;
    height: 38px;
    .requested,
    .processed {
      display: none;
    }
  }
`;

export const HistoryRow = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr 1.2fr 1.2fr 1fr 120px;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  align-items: center;
  height: 66px;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.86);
  font-weight: 900;
  letter-spacing: -0.2px;

  & > * {
    min-width: 0;
  }

  .requested,
  .processed {
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 980px) {
    grid-template-columns: 1.1fr 1fr 1.2fr 1fr 110px;
    .processed {
      display: none;
    }
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1.1fr 1fr 76px;
    gap: 8px;
    padding: 10px 12px;
    height: auto;
    min-height: 56px;
    font-size: 12px;
    line-height: 1.2;
    .requested,
    .processed {
      display: none;
    }

    button {
      height: 28px;
      padding: 0 8px;
      border-radius: 8px;
      font-size: 12px;
    }
  }

  .amount {
    text-align: center;
    font-size: 18px;
    font-weight: 1100;

    @media (max-width: 720px) {
      font-size: 14px;
      line-height: 1.15;
    }
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 205, 120, 0.18);
  border: 1px solid rgba(255, 205, 120, 0.22);
  color: rgba(255, 235, 205, 0.96);
  font-weight: 1100;
  letter-spacing: -0.2px;
  font-size: 12px;
  justify-self: center;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 720px) {
    height: 24px;
    padding: 0 8px;
    font-size: 11px;
  }
`;

export const Left = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  min-height: 420px;
  position: relative;

  @media (max-width: 980px) {
    min-height: 260px;
  }

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(255, 205, 120, 0.25), rgba(255, 255, 255, 0.02)),
      linear-gradient(135deg, rgba(15, 15, 15, 0.18), rgba(0, 0, 0, 0.45));
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.9) contrast(1.05);
    opacity: 0.72;
    transform: scale(1.03);
  }

  .caption {
    position: absolute;
    left: 18px;
    bottom: 16px;
    color: rgba(255, 255, 255, 0.92);
    font-weight: 1000;
    letter-spacing: -0.4px;
    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.65);

    small {
      display: block;
      margin-top: 4px;
      color: rgba(255, 255, 255, 0.68);
      font-weight: 900;
      letter-spacing: 0.2px;
    }
  }
`;

export const Right = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  padding: 18px;
`;

export const Heading = styled.div`
  font-weight: 1000;
  letter-spacing: -0.6px;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 12px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Tile = styled.button<{ $bg?: string }>`
  height: 118px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: ${({ $bg }) =>
    $bg
      ? `linear-gradient(135deg, rgba(0,0,0,0.32), rgba(0,0,0,0.10)), url(${$bg}) center / cover no-repeat`
      : 'rgba(0, 0, 0, 0.35)'};
  color: rgba(255, 255, 255, 0.92);
  font-weight: 1000;
  letter-spacing: -0.2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 14px;
  text-align: left;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 30%, rgba(255, 205, 120, 0.18), rgba(255, 255, 255, 0.02)),
      linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.4));
    pointer-events: none;
  }

  .label {
    position: relative;
    z-index: 1;
    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.65);
  }

  span {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.62);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.46);
    border-color: rgba(255, 205, 120, 0.35);
  }
`;

// 모달 스타일
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 520px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgb(24, 24, 24);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-weight: 1000;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: -0.4px;
`;

export const ModalCloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
`;

export const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModalLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 900;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: -0.2px;
`;

export const ModalInput = styled.input`
  width: 100%;
  height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.92);
  padding: 0 14px;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: -0.2px;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 205, 120, 0.55);
    box-shadow: 0 0 0 3px rgba(255, 205, 120, 0.14);
  }
`;

export const ModalTextarea = styled.textarea`
  width: 100%;
  min-height: 160px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.92);
  padding: 12px 14px;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: -0.2px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 205, 120, 0.55);
    box-shadow: 0 0 0 3px rgba(255, 205, 120, 0.14);
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
`;

export const ModalBtn = styled.button<{ $primary?: boolean }>`
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  font-weight: 1000;
  font-size: 14px;
  letter-spacing: -0.2px;
  cursor: pointer;
  border: 1px solid
    ${({ $primary }) => ($primary ? 'rgba(255, 205, 120, 0.75)' : 'rgba(255, 255, 255, 0.14)')};
  background: ${({ $primary }) =>
    $primary ? 'rgba(255, 205, 120, 0.92)' : 'rgba(255, 255, 255, 0.08)'};
  color: ${({ $primary }) => ($primary ? '#141414' : 'rgba(255, 255, 255, 0.88)')};

  &:hover {
    filter: brightness(1.05);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 2px;
  }
`;

export const TemplateBtn = styled.button`
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  font-weight: 900;
  font-size: 13px;
  letter-spacing: -0.2px;
  cursor: pointer;
  border: 1px solid rgba(100, 180, 255, 0.4);
  background: rgba(100, 180, 255, 0.15);
  color: rgba(180, 220, 255, 0.95);

  &:hover {
    background: rgba(100, 180, 255, 0.25);
  }
`;

export const AddBtn = styled.button`
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  font-weight: 1000;
  font-size: 14px;
  letter-spacing: -0.2px;
  cursor: pointer;
  border: 1px solid rgba(255, 205, 120, 0.6);
  background: rgba(255, 205, 120, 0.18);
  color: rgba(255, 235, 205, 0.95);

  &:hover {
    background: rgba(255, 205, 120, 0.28);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 2px;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

// Alert 모달 스타일
export const AlertOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
`;

export const AlertContainer = styled.div<{ $type?: 'success' | 'error' | 'info' }>`
  width: 100%;
  max-width: 360px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid
    ${({ $type }) =>
      $type === 'success'
        ? 'rgba(120, 220, 150, 0.3)'
        : $type === 'error'
          ? 'rgba(255, 120, 120, 0.3)'
          : 'rgba(255, 205, 120, 0.3)'};
  background: rgb(28, 28, 28);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.6);
  text-align: center;
  padding: 28px 24px 24px;
`;

export const AlertIcon = styled.div<{ $type?: 'success' | 'error' | 'info' }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: ${({ $type }) =>
    $type === 'success'
      ? 'rgba(120, 220, 150, 0.15)'
      : $type === 'error'
        ? 'rgba(255, 120, 120, 0.15)'
        : 'rgba(255, 205, 120, 0.15)'};
  border: 1px solid
    ${({ $type }) =>
      $type === 'success'
        ? 'rgba(120, 220, 150, 0.25)'
        : $type === 'error'
          ? 'rgba(255, 120, 120, 0.25)'
          : 'rgba(255, 205, 120, 0.25)'};
`;

export const AlertMessage = styled.p`
  margin: 0 0 20px;
  font-weight: 900;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.5;
  letter-spacing: -0.2px;
`;

export const AlertBtn = styled.button<{ $type?: 'success' | 'error' | 'info' }>`
  height: 42px;
  padding: 0 32px;
  border-radius: 10px;
  font-weight: 1000;
  font-size: 14px;
  letter-spacing: -0.2px;
  cursor: pointer;
  border: 1px solid
    ${({ $type }) =>
      $type === 'success'
        ? 'rgba(120, 220, 150, 0.5)'
        : $type === 'error'
          ? 'rgba(255, 120, 120, 0.5)'
          : 'rgba(255, 205, 120, 0.5)'};
  background: ${({ $type }) =>
    $type === 'success'
      ? 'rgba(120, 220, 150, 0.2)'
      : $type === 'error'
        ? 'rgba(255, 120, 120, 0.2)'
        : 'rgba(255, 205, 120, 0.2)'};
  color: ${({ $type }) =>
    $type === 'success'
      ? 'rgba(180, 255, 200, 0.95)'
      : $type === 'error'
        ? 'rgba(255, 200, 200, 0.95)'
        : 'rgba(255, 235, 205, 0.95)'};

  &:hover {
    filter: brightness(1.1);
  }
`;
