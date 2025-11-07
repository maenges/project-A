import { ICellEditorParams } from 'ag-grid-community';
import EtsInput from '../../../EtsCommon/EtsInput';
import type { EtsInputProps } from '../../../EtsCommon/EtsInput';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';

const TextLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  padding: '2px',
});

export interface EtsTextEditorProps {
  value?: any;
  onValueChange?: (value: any) => void;
  stopEditing?: () => void;
  inputProps?: Omit<EtsInputProps, 'value' | 'onChange'>;
  decimalPlaces?: number;
}

const TextEditor = forwardRef(function TextEditor(
  props: ICellEditorParams & EtsTextEditorProps,
  ref
) {
  const { inputProps, onValueChange, stopEditing, decimalPlaces } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value ?? '');
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const showTooltipMessage = (message: string) => {
    setError(message);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1000);
    setTimeout(() => setError(''), 1050);
  };

  useEffect(() => {
    // 의존성 배열을 비워서 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.
    // setTimeout을 사용하여 ref가 연결된 후 로직이 실행되도록 보장합니다.
    setTimeout(() => {
      const wrapperElement = inputRef.current;
      if (wrapperElement) {
        const inputElement = wrapperElement.querySelector('input');
        if (inputElement) {
          inputElement.focus();
          if (props.value) {
            inputElement.select();
          } else {
            inputElement.setSelectionRange(0, 0);
          }
        }
      }
    }, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (inputProps?.type === 'numeric') {
      // 숫자와 소수점만 허용
      if (!/^(\d*?\d*)$/.test(rawValue)) {
        // 허용하지 않는 문자 입력 시 무시
        showTooltipMessage('정수만 입력할 수 있습니다.');
        return;
      }
    }

    if (inputProps?.type === 'decimal') {
      if (!/^\d*\.?\d*$/.test(rawValue)) {
        showTooltipMessage('숫자만 입력할 수 있습니다.');
        return;
      }
      if (rawValue.includes('.') && rawValue.split('.')[1]?.length > (decimalPlaces ?? 0)) {
        showTooltipMessage(`소수점 ${decimalPlaces}자리까지 입력 가능합니다.`);
        return;
      }
    }

    setValue(rawValue);
    (onValueChange || props.onValueChange)?.(rawValue);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    isCancelAfterEnd: () => !!error,
  }));

  return (
    <TextLayout>
      <Tooltip
        open={showTooltip}
        title={error}
        placement="top"
        arrow
        disableHoverListener
        slotProps={{
          transition: { timeout: { enter: 150, exit: 50 } },
          arrow: { sx: { transition: 'opacity 50ms ease-in-out' } },
        }}
      >
        <EtsInput
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (stopEditing || props.stopEditing)?.();
            }
          }}
          onBlur={() => {
            (stopEditing || props.stopEditing)?.();
          }}
          width="100%"
          size="small"
          {...inputProps}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '32px !important',
              minHeight: '32px',
              maxHeight: '32px',
            },
            '& .MuiOutlinedInput-input': {
              padding: '6px 8px',
            },
            ...inputProps?.sx,
          }}
          ref={inputRef}
        />
      </Tooltip>
    </TextLayout>
  );
});
export default TextEditor;
