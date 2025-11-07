import { ICellRendererParams } from 'ag-grid-community';
import type { EtsDatePickerProps } from '../../../EtsCommon/EtsDatePicker';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

const DateLayout = styled('div')({
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
  pointerEvents: 'none',
  userSelect: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    right: '8px',
    width: '20px',
    height: '20px',
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_916_48137)'%3E%3Cpath d='M20.0777 17.5113L20.5575 16.9681C21.1312 16.3156 21.4333 15.5642 21.4333 14.8001V7.80877C21.4333 6.94818 20.7352 6.25007 19.8746 6.25007H17.76V4.4375H16.4044V6.25007H7.59539V4.4375H6.23977V6.25007H4.12511C3.26452 6.25007 2.56641 6.94818 2.56641 7.80877V18.0064C2.56641 18.8669 3.26452 19.5651 4.12511 19.5651L18.6764 19.56C19.4202 19.5448 20.1488 19.2452 20.786 18.6867L21.3293 18.2069H4.12511C4.01341 18.2094 3.92202 18.1206 3.92202 18.0064V11.4237H20.0777V17.5113ZM3.92202 10.0681V7.80623C3.92202 7.69453 4.01341 7.60314 4.12511 7.60314H6.23977V8.83437H7.59539V7.60314H16.4044V8.83437H17.76V7.60314H19.8746C19.9863 7.60314 20.0777 7.69453 20.0777 7.80623V10.0681H3.92202Z' fill='%23252525'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_916_48137'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '24px 24px',
  },
});

export interface EtsDateRendererProps extends ICellRendererParams {
  format?: string;
  datePickerProps?: Omit<EtsDatePickerProps, 'value' | 'onChange'>;
}

export default function DateRenderer(props: EtsDateRendererProps) {
  const { value, format = 'YYYY-MM-DD', datePickerProps } = props;

  const hasValue = value !== undefined && value !== null && value !== '';
  const displayValue = hasValue ? dayjs(value).format(format) : datePickerProps?.placeholder || '';

  return (
    <DateLayout
      style={{
        color: hasValue ? 'var(--color-text-secondary, #666)' : 'var(--color-text-tertiary, #999)',
        fontStyle: hasValue ? 'normal' : 'italic',
      }}
    >
      {displayValue}
    </DateLayout>
  );
}
