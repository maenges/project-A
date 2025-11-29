import { ICellRendererParams } from 'ag-grid-community';
import type { EtsSelectOption } from '../../../EtsCommon/EtsSelect';
import { styled, useTheme } from '@mui/material/styles';

const SelectLayout = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: '32px !important',
  maxHeight: '32px !important',
  border: '1px solid var(--color-border-base, #D9D9D9)',
  borderRadius: '8px',
  margin: '0px 2px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.background.paper || '#222' // 다크모드 배경
      : 'var(--color-background-base-white, #FFF)',
  padding: '6px 8px',
  color: 'var(--color-text-secondary, #666)',
  fontSize: '14px',
  cursor: 'default',
  pointerEvents: 'none', // 클릭 방지
  userSelect: 'none',
  position: 'relative',

  /* arrow icon removed for renderer */
}));

export interface EtsSelectRendererProps extends ICellRendererParams {
  options?: EtsSelectOption[];
  isEditable?: boolean;
  selectProps?: any;
}

export default function SelectRenderer(props: EtsSelectRendererProps) {
  const { value, options, selectProps } = props;
  const theme = useTheme();

  // 옵션에서 라벨 찾기
  const selectedOption = options?.find((opt) => opt.value === value);
  const hasValue = value !== undefined && value !== null && value !== '';
  const displayValue = hasValue ? selectedOption?.label || value : selectProps?.placeholder || '';

  const textColor = hasValue
    ? theme.palette.mode === 'dark'
      ? '#FFF'
      : 'var(--color-text-secondary, #666)'
    : theme.palette.mode === 'dark'
      ? '#FFF'
      : 'var(--color-text-tertiary, #999)';

  return (
    <SelectLayout
      style={{
        color: textColor,
        fontStyle: hasValue ? 'normal' : 'italic',
      }}
    >
      {displayValue}
    </SelectLayout>
  );
}
