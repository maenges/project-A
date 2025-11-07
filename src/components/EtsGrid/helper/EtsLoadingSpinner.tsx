import { CSSProperties } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function EtsLoadingSpinner(props: {
  position?: CSSProperties['position'];
  show: boolean;
  style?: CSSProperties;
}) {
  if (!props.show) return null;

  return (
    <Box
      sx={{
        position: props.position || 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 99,
        backgroundColor: 'rgba(30, 30, 30, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.style,
      }}
    >
      <CircularProgress size={40} />
    </Box>
  );
}
