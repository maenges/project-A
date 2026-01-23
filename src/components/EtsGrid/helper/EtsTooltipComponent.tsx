import { Box } from '@mui/material';
import { CSSProperties } from 'react';
import { useTheme } from '@mui/material/styles';

type Props = {
  content: string;
  style?: CSSProperties;
};

export default function EtsTooltipComponent({ content, style }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'auto',
        width: 'auto',
        maxWidth: '300px',
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.96)' : '#FFFFFF',
        justifyContent: 'flex-start',
        padding: '24px',
        borderRadius: '8px',
        whiteSpace: 'pre-wrap',
        fontSize: '12px',
        color: isDark ? '#ffffff' : '#333333',
        boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.25)' : '0 4px 12px rgba(0,0,0,0.15)',
        lineHeight: 1.4,
        wordBreak: 'break-word',
        ...style,
      }}
    >
      {content}
    </Box>
  );
}
