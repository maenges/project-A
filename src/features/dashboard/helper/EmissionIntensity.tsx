import { Stack } from '@mui/system';
import { styled } from 'styled-components';

const EmissionContainer = styled(Stack)`
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;

  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    margin-top: 0.5rem; /* 8px */
  }

  @media (max-height: 700px) {
    margin-top: 0.375rem; /* 6px */
  }

  @media (max-height: 600px) {
    margin-top: 0.25rem; /* 4px */
  }
`;

const RankBox = styled(Stack)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.25rem; /* 4px */
  margin-top: 0.25rem; /* 4px */

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    padding-bottom: 0.1875rem; /* 3px */
    margin-top: 0.1875rem; /* 3px */
  }

  @media (max-height: 700px) {
    padding-bottom: 0.125rem; /* 2px */
    margin-top: 0.125rem; /* 2px */
  }

  @media (max-height: 600px) {
    padding-bottom: 0.0625rem; /* 1px */
    margin-top: 0.0625rem; /* 1px */
  }
`;
const RankBoxLeft = styled(Stack)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.625rem; /* 10px */

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    gap: 0.5rem; /* 8px */
  }

  @media (max-height: 700px) {
    gap: 0.375rem; /* 6px */
  }

  @media (max-height: 600px) {
    gap: 0.25rem; /* 4px */
  }
`;
const RankBoxLeftItemIndex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.375rem; /* 6px */
  border-radius: 9999px;
  border: 1.5px solid #051766;
  color: #051766;
  font-weight: 700;
  height: 1.5rem; /* 24px */
  width: 1.5rem; /* 24px */
  justify-content: center;
  font-size: 0.875rem; /* 14px */

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    height: 1.25rem; /* 20px */
    width: 1.25rem; /* 20px */
    font-size: 0.75rem; /* 12px */
    gap: 0.25rem; /* 4px */
    border: 1px solid #051766;
  }

  @media (max-height: 700px) {
    height: 1rem; /* 16px */
    width: 1rem; /* 16px */
    font-size: 0.625rem; /* 10px */
    gap: 0.1875rem; /* 3px */
  }

  @media (max-height: 600px) {
    height: 0.75rem; /* 12px */
    width: 0.75rem; /* 12px */
    font-size: 0.5rem; /* 8px */
    gap: 0.125rem; /* 2px */
    border: 0.5px solid #051766;
  }
`;
const RankBoxLeftItemText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.375rem; /* 6px */
  font-size: 0.75rem; /* 12px */
  color: #273240;

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    font-size: 0.625rem; /* 10px */
    gap: 0.25rem; /* 4px */
  }

  @media (max-height: 700px) {
    font-size: 0.5rem; /* 8px */
    gap: 0.1875rem; /* 3px */
  }

  @media (max-height: 600px) {
    font-size: 0.375rem; /* 6px */
    gap: 0.125rem; /* 2px */
  }
`;
const RankBoxRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.375rem; /* 6px */
  font-size: 0.75rem; /* 12px */
  color: #273240;

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 900px) {
    font-size: 0.625rem; /* 10px */
    gap: 0.25rem; /* 4px */
  }

  @media (max-height: 700px) {
    font-size: 0.5rem; /* 8px */
    gap: 0.1875rem; /* 3px */
  }

  @media (max-height: 600px) {
    font-size: 0.375rem; /* 6px */
    gap: 0.125rem; /* 2px */
  }
`;

const rankingDummyArr = [
  {
    id: 0,
    from: 'ICN',
    to: 'LAX',
    capacity: '33,000.0000',
  },
  {
    id: 1,
    from: 'ICN',
    to: 'SYD',
    capacity: '33,000.0000',
  },
  {
    id: 2,
    from: 'ICN',
    to: 'LCY',
    capacity: '33,000.0000',
  },
  {
    id: 3,
    from: 'ICN',
    to: 'GRU',
    capacity: '33,000.0000',
  },
  {
    id: 4,
    from: 'ICN',
    to: 'DXB',
    capacity: '33,000.0000',
  },
  {
    id: 5,
    from: 'ICN',
    to: 'LAX',
    capacity: '33,000.0000',
  },
  {
    id: 6,
    from: 'ICN',
    to: 'SYD',
    capacity: '33,000.0000',
  },
  {
    id: 7,
    from: 'ICN',
    to: 'LCY',
    capacity: '33,000.0000',
  },
  {
    id: 8,
    from: 'ICN',
    to: 'GRU',
    capacity: '33,000.0000',
  },
  {
    id: 9,
    from: 'ICN',
    to: 'DXB',
    capacity: '33,000.0000',
  },
];

export default function EmissionIntensity() {
  const RankArea = ({
    id,
    from,
    to,
    capacity,
  }: {
    id: number;
    from: string;
    to: string;
    capacity: string;
  }) => {
    return (
      <RankBox direction={'row'}>
        <RankBoxLeft direction={'row'}>
          <RankBoxLeftItemIndex>{id + 1}</RankBoxLeftItemIndex>
          <RankBoxLeftItemText>{`${from} - ${to}`}</RankBoxLeftItemText>
        </RankBoxLeft>
        <RankBoxRight>{`${capacity} ton`}</RankBoxRight>
      </RankBox>
    );
  };

  return (
    <EmissionContainer>
      {rankingDummyArr.map((v) => (
        <RankArea key={v.id} {...v} />
      ))}
    </EmissionContainer>
  );
}
