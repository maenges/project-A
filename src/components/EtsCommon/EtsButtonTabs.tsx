import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

// 스타일 컴포넌트
const TabFrame = styled(Box)`
  display: flex;
  height: 36px;
  align-items: flex-start;
  gap: var(--spacing-8, 8px);
`;

const TabButtonOn = styled(Box)`
  display: flex;
  height: 36px;
  min-width: 60px;
  min-height: 29.63px;
  padding: var(--spacing-8, 8px) var(--spacing-16, 16px);
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-full, 9999px);
  background: var(--color-background-base, #f7f7f7);
  border-radius: var(--radius-full, 9999px);
  background: var(--color-background-base-lightblue40, #bce4f7);
  cursor: pointer;
`;

const TabButtonOff = styled(Box)`
  display: flex;
  height: 36px;
  min-width: 60px;
  min-height: 29.63px;
  padding: var(--spacing-8, 8px) var(--spacing-16, 16px);
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-full, 9999px);
  background: var(--color-background-base, #f7f7f7);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--color-neutral-30, #ededed);
  }
`;

// 타입 정의
interface TabOption {
  label: string;
  value: string;
}

export interface EtsButtonTabsProps<T = string> {
  activeTab: T;
  onTabClick: (tab: T) => void;
  tabs: TabOption[];
}

const EtsButtonTabs = <T extends string>({
  activeTab,
  onTabClick,
  tabs,
}: EtsButtonTabsProps<T>) => {
  return (
    <TabFrame>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const TabComponent = isActive ? TabButtonOn : TabButtonOff;
        const className = isActive ? 'tab-button-on' : 'tab-button-off';

        return (
          <TabComponent key={tab.value} onClick={() => onTabClick(tab.value as T)}>
            <Typography className={className}>{tab.label}</Typography>
          </TabComponent>
        );
      })}
    </TabFrame>
  );
};

export default EtsButtonTabs;
