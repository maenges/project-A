import React from 'react';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface SearchPanelProps {
  searchComponent?: React.ReactNode;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ searchComponent }) => {
  return (
    <Box
      sx={(theme) => ({
        // 브랜드 프라이머리 컬러를 아주 옅게 틴트하여 배경 적용
        // 다크 모드에서는 더 연하게(0.06), 라이트는 0.08
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.mode === 'dark' ? 0.06 : 0.08
        ),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 2px 8px rgba(0, 0, 0, 0.24)'
            : '0 4px 12px rgba(0, 0, 0, 0.06)',
        height: '100%',
        padding: 'var(--spacing-24, 24px)',
      })}
    >
      {searchComponent}
    </Box>
    // <Box
    //   sx={{
    //     // backgroundColor: '#e4f5ed',
    //     backgroundColor: '#F7F8FA',
    //     borderRadius: 2,
    //     boxShadow: 'none',
    //     height: '100%',
    //     padding: 'var(--spacing-24, 24px)',
    //   }}
    // >
    //   {searchComponent}
    // </Box>
  );
};

export default SearchPanel;
