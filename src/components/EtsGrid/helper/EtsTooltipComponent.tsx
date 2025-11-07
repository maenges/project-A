import { Box } from '@mui/material';
import { CSSProperties } from 'react';

type Props = {
  content: string;
  style?: CSSProperties;
};

export default function EtsTooltipComponent({ content, style }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: 'auto',
        width: 'auto',
        maxWidth: '300px',
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-start',
        padding: '24px',
        borderRadius: '8px',
        whiteSpace: 'pre-wrap',
        fontSize: '12px',
        color: '#333333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        lineHeight: 1.4,
        wordBreak: 'break-word',
        ...style,
      }}
    >
      {content}
    </Box>
  );
}
