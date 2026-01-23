import styled from 'styled-components';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './clientStyleTokens';
import goldSpadeA from '@/assets/images/icon/goldSpadeA.svg';
import blackSpadeA from '@/assets/images/icon/blackSpadeA.svg';
import goldSlot from '@/assets/images/icon/goldSlot.svg';
import blackSlot from '@/assets/images/icon/blackSlot.svg';

const Wrap = styled.section`
  max-width: ${CLIENT_MAX_WIDTH};
  margin: 12px auto 0;
  padding: 0 ${CLIENT_SIDE_PADDING};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);

  @media (max-width: 900px) {
    gap: 10px;
    padding: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding: 8px;
  }
`;

const Pill = styled.button<{ $active?: boolean }>`
  height: 56px;
  border-radius: 999px;
  border: 2px solid
    ${({ $active }) => ($active ? 'rgba(255, 205, 120, 0.85)' : 'rgba(255, 205, 120, 0.55)')};
  background: ${({ $active }) => ($active ? 'rgba(255, 205, 120, 0.92)' : 'rgba(0, 0, 0, 0.35)')};
  color: ${({ $active }) => ($active ? '#141414' : 'rgba(255,255,255,0.9)')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  min-width: 0;
  overflow: hidden;

  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 1000;
    letter-spacing: -0.5px;
    font-size: 16px;
    min-width: 0;
    flex: 1;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
  }

  .label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tab-icon-img {
    height: 34px;
    width: auto;
    flex: 0 0 auto;
    display: block;
    filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.28));
  }

  .sub {
    font-size: 12px;
    font-weight: 1000;
    letter-spacing: 0.2px;
    opacity: 0.7;
    flex: 0 0 auto;
  }

  svg {
    opacity: 0.95;
  }

  @media (max-width: 900px) {
    .sub {
      display: none;
    }
  }

  @media (max-width: 480px) {
    height: 44px;
    padding: 0 14px;
    border-width: 1.5px;

    .left {
      gap: 8px;
      font-size: 14px;
      letter-spacing: -0.3px;
    }

    .tab-icon-img {
      height: 24px;
      filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.24));
    }
  }
`;

export type ClientTabKey = 'casino' | 'slot';

type Props = {
  activeTab: ClientTabKey;
  onChange: (tab: ClientTabKey) => void;
};

const ClientCategoryRow = ({ activeTab, onChange }: Props) => {
  const casinoTabIconSrc = activeTab === 'casino' ? blackSpadeA : goldSpadeA;
  const slotTabIconSrc = activeTab === 'slot' ? blackSlot : goldSlot;

  return (
    <Wrap>
      <Row aria-label="categories">
        <Pill
          $active={activeTab === 'casino'}
          type="button"
          aria-pressed={activeTab === 'casino'}
          onClick={() => onChange('casino')}
        >
          <span className="left">
            <img className="tab-icon-img" src={casinoTabIconSrc} alt="" aria-hidden="true" />{' '}
            <span className="label">카지노</span> <span className="sub">CASINO</span>
          </span>
        </Pill>
        <Pill
          $active={activeTab === 'slot'}
          type="button"
          aria-pressed={activeTab === 'slot'}
          onClick={() => onChange('slot')}
        >
          <span className="left">
            <img className="tab-icon-img" src={slotTabIconSrc} alt="" aria-hidden="true" />{' '}
            <span className="label">슬롯게임</span> <span className="sub">SLOT GAME</span>
          </span>
        </Pill>
      </Row>
    </Wrap>
  );
};

export default ClientCategoryRow;
