import { useEffect, useState } from 'react';
import { ICellEditorParams } from 'ag-grid-community';
import EtsSelect from '../../../EtsCommon/EtsSelect';
import type { EtsSelectProps, EtsSelectOption } from '../../../EtsCommon/EtsSelect';
import { styled } from '@mui/material/styles';

const SelectLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  padding: '2px',
});

export interface EtsSelectEditorProps {
  options: EtsSelectOption[];
  selectProps?: Omit<EtsSelectProps, 'value' | 'onChange' | 'options'>;
  onValueChange?: (value: any) => void;
  stopEditing?: () => void;
  initialValue?: any;
}

export default function SelectEditor(props: ICellEditorParams & EtsSelectEditorProps) {
  const { options, selectProps, onValueChange, stopEditing, initialValue } = props;
  const [localValue, setLocalValue] = useState<string | string[]>('');

  useEffect(() => {
    const handleValueType = () => {
      if (selectProps?.multiple) {
        if (!props.value) return [];
        else if (typeof props.value === 'string') return props.value.split(',');
        else return props.value;
      } else {
        return props.value || '';
      }
    };

    const tempValue = handleValueType();
    setLocalValue(tempValue);
  }, [props.value, selectProps?.multiple]);

  const handleChange = (event: any) => {
    const value = event.target.value;
    if (!value) return;

    if (selectProps?.multiple) {
      (onValueChange || props.onValueChange)?.(
        typeof (initialValue || props.initialValue) === 'string'
          ? Array.isArray(value)
            ? value.join(',')
            : value
          : value
      );
    } else {
      (onValueChange || props.onValueChange)?.(value);
    }
  };

  return (
    <SelectLayout>
      <EtsSelect
        value={localValue}
        options={options}
        onChange={handleChange}
        onClose={() => {
          (stopEditing || props.stopEditing)?.();
        }}
        open={true}
        autoFocus
        width="100%"
        MenuProps={{
          autoFocus: false,
          disableAutoFocus: true,
          disableEnforceFocus: true,
          disableRestoreFocus: true,
          PaperProps: {
            style: {
              maxHeight: 300,
              borderRadius: 'var(--radius-sm, 8px)',
              marginTop: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '0.5px solid var(--color-border-base, #D9D9D9)',
              backgroundColor: 'var(--color-background-base-white, #FFF)',
            },
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '32px !important',
            minHeight: '32px',
            maxHeight: '32px',
          },
          '& .MuiSelect-select': {
            padding: '6px 8px !important',
            paddingRight: '32px !important',
          },
          ...selectProps?.sx,
        }}
        {...selectProps}
        ref={undefined}
      />
    </SelectLayout>
  );
}
