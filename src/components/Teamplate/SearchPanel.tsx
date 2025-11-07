import React from 'react';
import { Box } from '@mui/material';

interface SearchPanelProps {
  searchComponent?: React.ReactNode;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ searchComponent }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#F7F8FA',
        borderRadius: 2,
        boxShadow: 'none',
        height: '100%',
        padding: 'var(--spacing-24, 24px)',
      }}
    >
      {searchComponent}
    </Box>
  );
};

export default SearchPanel;
