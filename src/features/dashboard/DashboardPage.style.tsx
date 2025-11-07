import { Stack } from '@mui/system';
import { styled } from 'styled-components';

export const Container = styled(Stack)`
  display: flex;
  width: 100%;
  /* 전체 화면을 100vh로 사용, 헤더 높이만 제외 */
  height: calc(100vh - 84px); /* 헤더 고정 높이 80px만 빼기 */
  max-height: calc(100vh - 84px);
  padding: 1vh 0; /* 최소한의 여백만 */
  overflow: hidden;
  box-sizing: border-box;
`;
export const InnerContainer = styled(Stack)`
  gap: 0.75rem;
  flex: 1;
  height: 100%;
  min-height: 0;
`;
export const ParentArea = styled(Stack)`
  display: flex;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-divider-primary, #e5e7eb) !important;
  padding: 1rem 1.5rem; /* 16px 24px */
  width: 100%;
  min-width: 300px;

  max-height: 12vh;
  flex-shrink: 0;
`;
export const SubParentArea = styled(ParentArea)`
  display: flex;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-divider-primary, #e5e7eb) !important;
  padding: 1rem 1.5rem; /* 16px 24px */
  width: 100%;
  min-width: 300px;
  /* min-height: 15vh; */
  height: 100%;
  max-height: none;
  flex: 1;
  overflow: hidden;
`;

export const FlexArea3_5 = styled(Stack)`
  display: flex;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-divider-primary, #e5e7eb) !important;
  padding: 1rem 1.5rem; /* 16px 24px */
  flex: 3.5;
  min-height: 20vh;
  height: 100%;
  overflow: hidden;
`;

export const TopHeaderArea = styled(Stack)`
  display: flex;
  flex-direction: row !important;
  justify-content: space-between;
  width: 100%;
  align-items: end;
  flex-shrink: 0;
`;

export const InnerHeader = styled(Stack)<{ $isborder?: boolean }>`
  display: flex;
  border-bottom: ${({ $isborder }) => $isborder && '1.5px solid #051766'};
  flex-direction: row !important;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 0.5rem; /* 8px */
  margin-bottom: 0.5rem; /* 8px */
  align-items: end;
  flex-shrink: 0;

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 1050px) {
    padding-bottom: 0.375rem; /* 6px */
    margin-bottom: 0.375rem; /* 6px */
  }

  @media (max-height: 700px) {
    padding-bottom: 0.25rem; /* 4px */
    margin-bottom: 0.25rem; /* 4px */
  }

  @media (max-height: 600px) {
    padding-bottom: 0.125rem; /* 2px */
    margin-bottom: 0.125rem; /* 2px */
  }
`;

export const HeaderFrontContent = styled(Stack)`
  display: flex;
  flex-direction: row !important;

  font-size: 1rem; /* 16px - 간단한 rem */
  font-weight: 400;
  line-height: 130%;
  color: #051766;
  font-family: 'Hanjin Group Sans';
  justify-content: end;
  align-items: end;

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 1050px) {
    font-size: 0.75rem; /* 12px */
    gap: 0.25rem;
  }

  @media (max-height: 700px) {
    font-size: 0.5rem; /* 8px */
    gap: 0.125rem;
  }

  @media (max-height: 600px) {
    font-size: 0.375rem; /* 6px */
    gap: 0.0625rem;
  }
`;

export const HeaderBackText = styled.div`
  font-size: 0.75rem; /* 12px - 간단한 rem */
  font-weight: 400;
  line-height: 130%;
  color: #051766;
  font-family: 'Hanjin Group Sans';
  justify-content: end;
  align-items: end;

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 1050px) {
    font-size: 0.5rem; /* 8px */
  }

  @media (max-height: 700px) {
    font-size: 0.375rem; /* 6px */
  }

  @media (max-height: 600px) {
    font-size: 0.25rem; /* 4px */
  }
`;
export const IntCircle = styled.div`
  width: 1rem; /* 16px */
  height: 1rem;
  border-radius: 50%;
  background-color: #1177a7;

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 1050px) {
    width: 0.75rem; /* 12px */
    height: 0.75rem;
  }

  @media (max-height: 700px) {
    width: 0.5rem; /* 8px */
    height: 0.5rem;
  }

  @media (max-height: 600px) {
    width: 0.375rem; /* 6px */
    height: 0.375rem;
  }
`;
export const IntPatternCircle = styled.div`
  width: 1rem; /* 16px */
  height: 1rem;
  border-radius: 50%;
  background: repeating-linear-gradient(-45deg, #e6e7ef, #e6e7ef 2px, #3cb4ec 2px, #3cb4ec 3px);

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 1050px) {
    width: 0.75rem; /* 12px */
    height: 0.75rem;
  }

  @media (max-height: 700px) {
    width: 0.5rem; /* 8px */
    height: 0.5rem;
  }

  @media (max-height: 600px) {
    width: 0.375rem; /* 6px */
    height: 0.375rem;
  }
`;

export const DomCircle = styled.div`
  width: 1rem; /* 16px */
  height: 1rem;
  border-radius: 50%;
  background-color: #051766;

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 1050px) {
    width: 0.75rem; /* 12px */
    height: 0.75rem;
  }

  @media (max-height: 700px) {
    width: 0.5rem; /* 8px */
    height: 0.5rem;
  }

  @media (max-height: 600px) {
    width: 0.375rem; /* 6px */
    height: 0.375rem;
  }
`;
export const DomPatternCircle = styled.div`
  width: 1rem; /* 16px */
  height: 1rem;
  border-radius: 50%;
  background: repeating-linear-gradient(-45deg, #e6e7ef, #e6e7ef 2px, #081c78 2px, #081c78 3px);

  /* 브라우저 배율이 높아질 때 크기 축소 */
  @media (max-height: 1050px) {
    width: 0.75rem; /* 12px */
    height: 0.75rem;
  }

  @media (max-height: 700px) {
    width: 0.5rem; /* 8px */
    height: 0.5rem;
  }

  @media (max-height: 600px) {
    width: 0.375rem; /* 6px */
    height: 0.375rem;
  }
`;
