import { useEffect, useState, useRef } from 'react';
import { ICellEditorParams } from 'ag-grid-community';
import EtsSelect from './SelectEditorForm';
import type { EtsSelectProps, EtsSelectOption } from './SelectEditorForm';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

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
  const containerRef = useRef<HTMLDivElement>(null);

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

  const renderValue = (
    selected: any,
    options?: EtsSelectOption[],
    multiple?: boolean,
    placeholder?: string
  ) => {
    if (multiple) {
      const selectedArray = Array.isArray(selected) ? selected : [];
      if (selectedArray.length === 0) {
        return (
          <span style={{ color: 'var(--color-text-placeholder, #A4A4A4)' }}>{placeholder}</span>
        );
      }
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedArray.map((value) => {
            const option = options?.find((opt) => opt.value === value);
            return (
              <Box
                key={value}
                sx={{
                  height: '24px',
                  margin: '2px',
                  fontFamily: '"Hanjin Group Sans"',
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-regular, 400)',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {option?.label || value}
              </Box>
            );
          })}
        </Box>
      );
    }

    const displayText = (() => {
      // 빈 문자열도 유효한 값으로 처리하되, undefined나 null인 경우에만 placeholder 표시
      if ((selected === undefined || selected === null) && placeholder) {
        return placeholder;
      }
      if (options) {
        const option = options.find((opt) => opt.value === selected);
        return option?.label || selected;
      }
      return selected;
    })();

    return (
      <Box
        component="div"
        sx={{
          overflow: 'visible',
          textOverflow: 'clip',
          whiteSpace: 'nowrap',
          width: '100%',
          display: 'block',
          color:
            (selected === undefined || selected === null) && placeholder
              ? 'var(--color-text-placeholder, #A4A4A4)'
              : 'inherit',
        }}
        title={typeof displayText === 'string' ? displayText : undefined}
      >
        {displayText}
      </Box>
    );
  };

  return (
    <SelectLayout
      ref={containerRef}
      onMouseEnter={() => {
        const row = containerRef.current?.closest('.ag-row');
        if (row) {
          row.classList.remove('ag-row-hover');
        }
      }}
    >
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
        renderValue={renderValue}
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
            overflow: 'visible !important',
            textOverflow: 'clip !important',
            whiteSpace: 'normal !important',
          },
          ...selectProps?.sx,
        }}
        {...selectProps}
        ref={undefined}
      />
    </SelectLayout>
  );
}
