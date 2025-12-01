import React from 'react';
import { styled, alpha } from '@mui/material/styles';
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
}>(({ theme, isChecked, isDisabled, isReadOnly, hasError, customWidth, customHeight }) => {
  const backgroundColor = (() => {
    if (isDisabled || isReadOnly) {
      return theme.palette.background.paper ?? '#ffffff';
    }
    if (hasError) {
      return theme.palette.error.light;
    }
    // 편집 + 체크된 상태
    if (theme.palette.mode === 'dark') {
      return isChecked ? theme.palette.primary.dark : theme.palette.background.paper;
    } else {
      return isChecked ? theme.palette.primary.main : theme.palette.background.paper;
    }
  })();

  const borderColor = (() => {
    if (hasError) return theme.palette.error.main;
    if (isDisabled) return theme.palette.action.disabled;
    if (isReadOnly) return theme.palette.primary.main;
    // 여기 보더 다크모드 흰색, 라이트모드 라이트색
    if (theme.palette.mode === 'dark') {
      return isChecked ? '#ffffff' : '#ffffff';
    } else {
      return isChecked ? theme.palette.primary.main : theme.palette.primary.main;
    }
  })();

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: customWidth || '24px',
    height: customHeight || '24px',
    borderRadius: '4px',
    cursor: isDisabled || isReadOnly ? 'not-allowed' : 'pointer',
    backgroundColor,
    border: `1px solid ${borderColor}`,
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
    boxSizing: 'border-box',

    '&:hover': {
      ...(isDisabled || isReadOnly
        ? {}
        : {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
          }),
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.25)}`,
    },

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
              return 'invert(41%) sepia(88%) saturate(3761%) hue-rotate(127deg) brightness(94%) contrast(102%)';
            }
            if (isReadOnly) {
              // 라이트모드 배경 체크 이미지 테마 색상에 맞춤
              if (theme.palette.mode === 'light') {
                if (theme.palette.primary.main === '#00AB55') {
                  return 'invert(51%) sepia(98%) saturate(2214%) hue-rotate(131deg) brightness(94%) contrast(101%)';
                } else if (theme.palette.primary.main === '#1976d2') {
                  return 'invert(41%) sepia(94%) saturate(2360%) hue-rotate(190deg) brightness(93%) contrast(93%)';
                } else if (theme.palette.primary.main === '#7C09CE') {
                  return 'invert(22%) sepia(86%) saturate(7483%) hue-rotate(267deg) brightness(93%) contrast(103%)';
                }
              }
            }
            // 다크모드 배경 체크 이미지 흰색
            return 'brightness(0) invert(1)';
          })(),
        }
      : {},
  };
});

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
