import React from 'react';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import { styled, alpha } from '@mui/material/styles';

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
    ? theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.06)
      : theme.palette.action.disabledBackground
    : theme.palette.mode === 'light'
      ? '#FFFFFF'
      : theme.palette.background.paper;
  const borderForReadonly = isReadOnly
    ? theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.35)
      : theme.palette.divider
    : theme.palette.divider;
  const textColor = isReadOnly ? theme.palette.text.secondary : theme.palette.text.primary;
  const placeholder = theme.palette.text.secondary;
  const borderColor = borderForReadonly;
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
      fontFamily: 'Sans',
      lineHeight: '130%',
      transition: 'background-color .2s, border-color .2s',
      '& fieldset': {
        border: `1px solid ${borderColor}`,
      },
      '&:hover fieldset': {
        borderColor: isReadOnly ? borderForReadonly : focusColor,
      },
      '&.Mui-focused fieldset': {
        borderColor: isReadOnly ? borderForReadonly : focusColor,
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
      '& input:-webkit-autofill, & textarea:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${bgBase} inset !important`,
        boxShadow: `0 0 0 100px ${bgBase} inset !important`,
        WebkitTextFillColor: `${textColor} !important`,
        caretColor: textColor,
        borderRadius: 'inherit',
        transition: 'background-color 600000s 0s, color 600000s 0s',
      },
      '& input:-webkit-autofill:hover, & textarea:-webkit-autofill:hover': {
        WebkitBoxShadow: `0 0 0 100px ${bgBase} inset !important`,
        boxShadow: `0 0 0 100px ${bgBase} inset !important`,
      },
      '& input:-webkit-autofill:focus, & textarea:-webkit-autofill:focus': {
        WebkitBoxShadow: `0 0 0 100px ${bgBase} inset !important`,
        boxShadow: `0 0 0 100px ${bgBase} inset !important`,
      },
      '& input:-internal-autofill-selected, & textarea:-internal-autofill-selected': {
        WebkitBoxShadow: `0 0 0 100px ${bgBase} inset !important`,
        boxShadow: `0 0 0 100px ${bgBase} inset !important`,
        WebkitTextFillColor: `${textColor} !important`,
        caretColor: textColor,
        transition: 'background-color 600000s 0s, color 600000s 0s',
      },
      '& input:-internal-autofill-previewed, & textarea:-internal-autofill-previewed': {
        WebkitBoxShadow: `0 0 0 100px ${bgBase} inset !important`,
        boxShadow: `0 0 0 100px ${bgBase} inset !important`,
        WebkitTextFillColor: `${textColor} !important`,
        caretColor: textColor,
        transition: 'background-color 600000s 0s, color 600000s 0s',
      },
      '& input:-moz-autofill, & textarea:-moz-autofill': {
        boxShadow: `0 0 0 100px ${bgBase} inset !important`,
        MozTextFillColor: textColor,
        caretColor: textColor,
      },
      '& input': {
        fontFamily: 'Sans',
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
          fontFamily: 'Sans',
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '130%',
          opacity: 1,
        },
        '&:-webkit-autofill': {
          WebkitBoxShadow: `0 0 0 100px ${bgBase} inset !important`,
          WebkitTextFillColor: `${textColor} !important`,
          caretColor: textColor,
          borderRadius: 'inherit',
        },
        '&:-webkit-autofill:hover': {
          WebkitBoxShadow: `0 0 0 100px ${bgBase} inset !important`,
        },
        '&:-webkit-autofill:focus': {
          WebkitBoxShadow: `0 0 0 100px ${bgBase} inset !important`,
        },
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: 14,
      fontWeight: 400,
      fontFamily: 'Sans',
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
          width: width || '177px',
          position: 'relative',
          ...props.sx,
        }}
      />
    );
  }
);

EtsInput.displayName = 'EtsInput';

export default EtsInput;
