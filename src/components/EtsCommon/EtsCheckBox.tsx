import React from 'react';
import { styled } from '@mui/material/styles';
import unionIcon from '@images/union.svg?inline';

export interface EtsCheckBoxProps {
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  onChange?: (checked: boolean) => void;
  width?: string | number;
  height?: string | number;
}

const StyledCheckBox = styled('div', {
  shouldForwardProp: (prop) =>
    prop !== 'isChecked' &&
    prop !== 'isDisabled' &&
    prop !== 'isReadOnly' &&
    prop !== 'hasError' &&
    prop !== 'customWidth' &&
    prop !== 'customHeight',
})<{
  isChecked?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  hasError?: boolean;
  customWidth?: string | number;
  customHeight?: string | number;
}>(({ isChecked, isDisabled, isReadOnly, hasError, customWidth, customHeight }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: customWidth || '24px',
  height: customHeight || '24px',
  borderRadius: '4px',
  cursor: isDisabled || isReadOnly ? 'not-allowed' : 'pointer',
  backgroundColor: (() => {
    if (isDisabled || isReadOnly) {
      return '#D9D9D9';
    }
    if (hasError) {
      return '#FFF5F5';
    }
    return isChecked ? '#051766' : '#FFFFFF';
  })(),
  border: (() => {
    if (hasError) {
      return '1px solid #DA291C';
    }
    if (isDisabled) {
      return '1px solid #A4A4A4';
    }
    if (isReadOnly) {
      return '1px solid #051766';
    }
    return '1px solid #051766';
  })(),
  transition: 'all 0.2s ease-in-out',
  position: 'relative',

  '&::after': isChecked
    ? {
        content: '""',
        position: 'absolute',
        width: '12px',
        height: '10px',
        backgroundImage: `url("${unionIcon}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        filter: (() => {
          if (isDisabled) {
            return 'brightness(0) saturate(100%) invert(64%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(96%) contrast(96%)'; // #A4A4A4
          }
          if (isReadOnly) {
            return 'brightness(0) saturate(100%) invert(8%) sepia(100%) saturate(7463%) hue-rotate(240deg) brightness(90%) contrast(130%)'; // #051766
          }
          return 'brightness(0) invert(1)'; // white for default and error checked state
        })(),
      }
    : {},
}));

const EtsCheckBox = React.forwardRef<HTMLDivElement, EtsCheckBoxProps>(
  (
    {
      checked = false,
      disabled = false,
      readOnly = false,
      error = false,
      onChange,
      width,
      height,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled && !readOnly && onChange) {
        onChange(!checked);
      }
    };

    return (
      <StyledCheckBox
        ref={ref}
        isChecked={checked}
        isDisabled={disabled}
        isReadOnly={readOnly}
        hasError={error}
        customWidth={width}
        customHeight={height}
        onClick={handleClick}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled || readOnly}
        tabIndex={disabled || readOnly ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && !readOnly && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
          }
        }}
        {...props}
      />
    );
  }
);

EtsCheckBox.displayName = 'EtsCheckBox';

export default EtsCheckBox;
