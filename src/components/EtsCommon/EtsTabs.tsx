import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

export interface EtsTabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface EtsTabsProps {
  tabs: EtsTabItem[];
  value: string;
  onChange: (value: string) => void;
  sx?: object;
  className?: string;
  children?: React.ReactNode;
}

const EtsTabs: React.FC<EtsTabsProps> = ({ tabs, value, onChange, sx, className, children }) => {
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ width: '100%', ...sx }} className={className}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={false}
        textColor="primary"
        indicatorColor="primary"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            disabled={tab.disabled}
            sx={{ minWidth: 120, fontWeight: 700, fontFamily: 'Sans', fontSize: 16 }}
          />
        ))}
      </Tabs>
      {/* children: 탭 아래에 컨텐츠 렌더링 */}
      {children}
    </Box>
  );
};

export default EtsTabs;
