import { ICellRendererParams } from 'ag-grid-community';
import type { EtsInputProps } from '../../../EtsCommon/EtsInput';
import { styled, useTheme } from '@mui/material/styles';

const TextLayout = styled('div')(({ theme }) => ({
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
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export interface EtsTextRendererProps extends ICellRendererParams {
  inputProps?: Omit<EtsInputProps, 'value' | 'onChange'>;
}

export default function TextRenderer(props: EtsTextRendererProps) {
  const theme = useTheme();
  const hasValue = props.value !== undefined && props.value !== null && props.value !== '';
  const displayValue = hasValue ? props.value : props.inputProps?.placeholder || '';

  const textColor = hasValue
    ? theme.palette.mode === 'dark'
      ? '#FFF'
      : 'var(--color-text-secondary, #666)'
    : theme.palette.mode === 'dark'
      ? '#FFF'
      : 'var(--color-text-tertiary, #999)';

  return (
    <TextLayout
      style={{
        color: textColor,
        fontStyle: hasValue ? 'normal' : 'italic',
      }}
    >
      {displayValue}
    </TextLayout>
  );
}
