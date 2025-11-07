import { ICellRendererParams } from 'ag-grid-community';
import type { EtsAutoCompleteOption } from '../../../EtsCommon/EtsAutoComplete';
import { styled } from '@mui/material/styles';

const AutocompleteLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: '32px !important',
  maxHeight: '32px !important',
  border: '1px solid var(--color-border-base, #D9D9D9)',
  borderRadius: '8px',
  margin: '0px 2px',
  backgroundColor: 'var(--color-background-base-white, #FFF) !important',
  padding: '6px 36px 6px 8px', // 오른쪽 패딩을 늘려서 아이콘 영역 확보
  color: 'var(--color-text-secondary, #666)',
  fontSize: '14px',
  cursor: 'default',
  pointerEvents: 'none', // 클릭 방지
  userSelect: 'none',
  position: 'relative',
  overflow: 'hidden', // 넘치는 텍스트 숨김
  whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
  textOverflow: 'ellipsis', // 넘치는 텍스트를 ... 으로 표시

  '&::after': {
    content: '""',
    position: 'absolute',
    right: '8px',
    width: '20px',
    height: '20px',
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_885_68168)'%3E%3Cpath d='M19.0732 8.47837H19.8105L15.7539 12.535L15.75 12.5311L11.9922 16.2704L8.29004 12.5272L8.2832 12.535L4.50293 8.75376L4.45312 8.70493L4.22656 8.47837H4.96387C5.35186 8.45464 5.74105 8.5086 6.10742 8.63852C6.47371 8.76844 6.81036 8.97141 7.09668 9.23422L9.3418 11.4793L9.33594 11.4842L12 14.1756L14.7051 11.4862L14.6992 11.4803L16.9414 9.23422C17.2274 8.97088 17.5633 8.76749 17.9297 8.63755C18.2961 8.50762 18.6853 8.45402 19.0732 8.47837Z' fill='%23252525'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_885_68168'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '20px 20px',
  },
});

export interface EtsAutocompleteRendererProps extends ICellRendererParams {
  options?: EtsAutoCompleteOption[];
  isEditable?: boolean;
  autoCompleteProps?: any;
}

export default function AutocompleteRenderer(props: EtsAutocompleteRendererProps) {
  const { value, options, autoCompleteProps } = props;

  // 옵션에서 라벨 찾기
  const selectedOption = options?.find((opt) => opt.value === String(value));
  const hasValue = value !== undefined && value !== null && value !== '';
  const displayValue = hasValue
    ? selectedOption?.label || value
    : autoCompleteProps?.placeholder || '';

  return (
    <AutocompleteLayout
      style={{
        color: hasValue ? 'var(--color-text-secondary, #666)' : 'var(--color-text-tertiary, #999)',
        fontStyle: hasValue ? 'normal' : 'italic',
      }}
    >
      {displayValue}
    </AutocompleteLayout>
  );
}
