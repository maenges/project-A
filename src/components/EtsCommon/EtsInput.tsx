import React from 'react';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

export interface EtsInputProps extends Omit<TextFieldProps, 'readOnly'> {
  width?: string | number;
  readOnly?: boolean;
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'customWidth' && prop !== 'isReadOnly',
})<{ customWidth?: string | number; isReadOnly?: boolean }>(({ customWidth, isReadOnly }) => ({
  width: customWidth || '200px', // 기본 너비 200px
  '& .MuiOutlinedInput-root': {
    height: '36px !important',
    minHeight: '36px',
    maxHeight: '36px',
    boxSizing: 'border-box',
    borderRadius: 'var(--radius-sm, 8px)',
    backgroundColor: isReadOnly
      ? 'var(--color-background-disabled, #EDEDED)'
      : 'var(--color-background-base-white, #FFF)',
    fontSize: 'var(--font-size-label-md, 14px)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontFamily: '"Hanjin Group Sans"',
    lineHeight: '130%',
    overflow: 'hidden',
    '& fieldset': {
      border: isReadOnly
        ? '1px solid var(--color-border-base, #D9D9D9)'
        : '1px solid var(--color-border-base, #D9D9D9)',
    },
    '&:hover fieldset': {
      borderColor: isReadOnly
        ? 'var(--color-border-base, #D9D9D9)'
        : 'var(--color-border-primary-darkblue, #051766)',
    },
    '&.Mui-focused fieldset': {
      borderColor: isReadOnly
        ? 'var(--color-border-base, #D9D9D9)'
        : 'var(--color-border-primary-darkblue, #051766)',
      borderWidth: '1px',
    },
    '&.Mui-error fieldset': {
      borderColor: '#ef4444',
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--color-background-disabled, #EDEDED)',
      '& fieldset': {
        border: '1px solid var(--color-border-base, #D9D9D9)',
      },
      '& input': {
        color: 'var(--color-text-disabled, #A4A4A4)',
        WebkitTextFillColor: 'var(--color-text-disabled, #A4A4A4)',
      },
    },
    '& input': {
      fontFamily: '"Hanjin Group Sans"',
      fontSize: 'var(--font-size-label-md, 14px)',
      fontWeight: 'var(--font-weight-regular, 400)',
      lineHeight: '130%',
      padding: '7px 12px',
      height: '20px !important',
      color: isReadOnly ? 'var(--color-text-base, #252525)' : '#000000',
      '&::placeholder': {
        overflow: 'hidden',
        color: 'var(--color-text-placeholder, #A4A4A4)',
        textOverflow: 'ellipsis',
        fontFamily: '"Hanjin Group Sans"',
        fontSize: 'var(--font-size-label-md, 14px)',
        fontStyle: 'normal',
        fontWeight: 'var(--font-weight-regular, 400)',
        lineHeight: '130%',
        opacity: 1,
      },
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: 'var(--font-size-label-md, 14px)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontFamily: '"Hanjin Group Sans"',
    color: 'var(--color-text-placeholder, #A4A4A4)',
    '&.Mui-focused': {
      color: 'var(--color-text-placeholder, #A4A4A4)',
    },
    '&.Mui-error': {
      color: '#ef4444',
    },
  },
}));

const EtsInput = React.forwardRef<HTMLInputElement, EtsInputProps>(
  ({ width, readOnly, ...props }, ref) => {
    return (
      <StyledTextField
        ref={ref}
        {...props}
        customWidth={width}
        isReadOnly={readOnly}
        InputProps={{
          readOnly: readOnly,
          ...props.InputProps,
        }}
        sx={{
          width: width || '200px',
          position: 'relative',
          ...props.sx,
        }}
      />
    );
  }
);

EtsInput.displayName = 'EtsInput';

export default EtsInput;
