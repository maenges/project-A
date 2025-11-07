import { useEffect, useRef } from 'react';
import { ICellEditorParams } from 'ag-grid-community';
import EtsDatePicker from '../../../EtsCommon/EtsDatePicker';
import type { EtsDatePickerProps } from '../../../EtsCommon/EtsDatePicker';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

const DatePickerLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  padding: '2px',
});

export interface EtsDateEditorProps {
  datePickerProps?: Omit<EtsDatePickerProps, 'value' | 'onChange'>;
  format?: string;
  onValueChange?: (value: any) => void;
  stopEditing?: () => void;
}

export default function DateEditor(props: ICellEditorParams & EtsDateEditorProps) {
  const { datePickerProps, format = 'YYYY-MM-DD', onValueChange, stopEditing } = props;
  const ref = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    // (stopEditing || props.stopEditing)?.();
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('blur', handleBlur);
    }
    return () => ref?.current?.removeEventListener('blur', handleBlur);
  }, [ref.current]);

  return (
    <DatePickerLayout>
      <EtsDatePicker
        format={format}
        value={props.value ? dayjs(props.value) : null}
        onChange={(newValue) => {
          if (newValue) {
            (onValueChange || props.onValueChange)?.(newValue.format(format));
          }
        }}
        onClose={() => (stopEditing || props.stopEditing)?.()}
        open={true}
        width="100%"
        slotProps={{
          textField: {
            autoFocus: true,
            size: 'small',
            sx: {
              '& .MuiOutlinedInput-root': {
                height: '32px !important',
                minHeight: '32px',
                maxHeight: '32px',
              },
              '& .MuiOutlinedInput-input': {
                padding: '6px 8px',
              },
            },
            inputRef: ref,
            ...datePickerProps?.textFieldProps,
          },
          actionBar: {
            actions: ['clear', 'today'],
            sx: {
              justifyContent: 'space-between',
            },
          },
        }}
        views={['year', 'month', 'day']}
        {...datePickerProps}
      />
    </DatePickerLayout>
  );
}
