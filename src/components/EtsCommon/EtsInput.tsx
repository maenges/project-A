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
})<{ customWidth?: string | number; isReadOnly?: boolean }>(({
  customWidth,
  isReadOnly,
  theme,
}) => {
  const bgBase = isReadOnly
    ? theme.palette.action.disabledBackground
    : theme.palette.mode === 'light'
      ? '#FFFFFF'
      : theme.palette.background.paper;
  const textColor = theme.palette.text.primary;
  const placeholder = theme.palette.text.secondary;
  const borderColor = theme.palette.divider;
  const focusColor = theme.palette.primary.main;
  return {
    width: customWidth || '200px',
    '& .MuiOutlinedInput-root': {
      height: '36px !important',
      minHeight: '36px',
      maxHeight: '36px',
      boxSizing: 'border-box',
      borderRadius: 8,
      backgroundColor: bgBase,
      fontSize: 14,
      fontWeight: 400,
      fontFamily: 'Hanjin Group Sans',
      lineHeight: '130%',
      transition: 'background-color .2s, border-color .2s',
      '& fieldset': {
        border: `1px solid ${borderColor}`,
      },
      '&:hover fieldset': {
        borderColor: focusColor,
      },
      '&.Mui-focused fieldset': {
        borderColor: focusColor,
        borderWidth: '1px',
      },
      '&.Mui-error fieldset': {
        borderColor: '#ef4444',
      },
      '&.Mui-disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        '& fieldset': { border: `1px solid ${borderColor}` },
        '& input': {
          color: theme.palette.text.disabled,
          WebkitTextFillColor: theme.palette.text.disabled,
        },
      },
      '& input': {
        fontFamily: 'Hanjin Group Sans',
        fontSize: 14,
        fontWeight: 400,
        lineHeight: '130%',
        padding: '7px 12px',
        height: '20px !important',
        color: textColor,
        '&::placeholder': {
          overflow: 'hidden',
          color: placeholder,
          textOverflow: 'ellipsis',
          fontFamily: 'Hanjin Group Sans',
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '130%',
          opacity: 1,
        },
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: 14,
      fontWeight: 400,
      fontFamily: 'Hanjin Group Sans',
      color: placeholder,
      '&.Mui-focused': { color: placeholder },
      '&.Mui-error': { color: '#ef4444' },
    },
  };
});

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
