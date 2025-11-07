import { ICellRendererParams } from 'ag-grid-community';
import type { EtsInputProps } from '../../../EtsCommon/EtsInput';
import { styled } from '@mui/material/styles';

const TextLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: '32px !important',
  maxHeight: '32px !important',
  border: '1px solid var(--color-border-base, #D9D9D9)',
  borderRadius: '8px',
  margin: '0px 2px',
  backgroundColor: 'var(--color-background-base-white, #FFF) !important',
  padding: '6px 8px',
  color: 'var(--color-text-secondary, #666)',
  fontSize: '14px',
  cursor: 'default',
  pointerEvents: 'none', // 클릭 방지
  userSelect: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export interface EtsTextRendererProps extends ICellRendererParams {
  inputProps?: Omit<EtsInputProps, 'value' | 'onChange'>;
}

export default function TextRenderer(props: EtsTextRendererProps) {
  const hasValue = props.value !== undefined && props.value !== null && props.value !== '';
  const displayValue = hasValue ? props.value : props.inputProps?.placeholder || '';

  return (
    <TextLayout
      style={{
        color: hasValue ? 'var(--color-text-secondary, #666)' : 'var(--color-text-tertiary, #999)',
        fontStyle: hasValue ? 'normal' : 'italic',
      }}
    >
      {displayValue}
    </TextLayout>
  );
}
