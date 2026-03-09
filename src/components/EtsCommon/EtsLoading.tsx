import { Backdrop, CircularProgress } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { styled } from 'styled-components';

export interface EtsLoadingProps {
  open: boolean;
  hasBackdrop?: boolean; // (기본값: true)
}

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

/**
 * @description 화면 전체를 덮는 로딩 스피너 컴포넌트
 * @param open - 로딩 스피너 표시 여부
 * @param hasBackdrop - 배경 오버레이 표시 여부 (기본값: true)
 */
const EtsLoading = ({ open, hasBackdrop = true }: EtsLoadingProps) => {
  const theme = useTheme();

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 9999,
        backgroundColor: hasBackdrop
          ? alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? 0.6 : 0.5)
          : 'transparent',
      }}
    >
      <LoadingContainer>
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
          }}
        />
        <LoadingText style={{ color: theme.palette.text.primary }} />
      </LoadingContainer>
    </Backdrop>
  );
};

export default EtsLoading;
