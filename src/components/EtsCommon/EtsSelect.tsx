import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import type { SelectProps } from '@mui/material/Select';
import { styled } from '@mui/material/styles';

export interface EtsSelectOption {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface EtsSelectProps extends Omit<SelectProps, 'children'> {
  options?: EtsSelectOption[];
  placeholder?: string;
  children?: React.ReactNode;
  width?: string | number;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
}

const StyledSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'customWidth' && prop !== 'isReadOnly',
})<{ customWidth?: string | number; isReadOnly?: boolean }>(({ customWidth, isReadOnly }) => ({
  width: customWidth || '200px', // 기본 너비 200px
  // 최상위 레벨에서 배경색 강제 적용

  // disabled 상태 강제 적용 (최상위 레벨)
  '&.Mui-disabled': {
    backgroundColor: 'var(--color-background-disabled, #EDEDED) !important',
  },
  cursor: 'default',
  backgroundColor: isReadOnly
    ? 'var(--color-background-disabled, #EDEDED) !important'
    : 'var(--color-background-base-white, #FFF) !important',
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-border-primary-darkblue, #051766)',
    borderWidth: '1px !important',
  },
  '&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ef4444 !important',
    borderWidth: '1px !important',
  },
  '& .MuiOutlinedInput-root': {
    height: '36px !important',
    minHeight: '36px !important',
    maxHeight: '36px !important',
    boxSizing: 'border-box',
    borderRadius: 'var(--radius-sm, 8px)',
    backgroundColor: isReadOnly
      ? 'var(--color-background-disabled, #EDEDED) !important'
      : 'var(--color-background-base-white, #FFF) !important',
    fontSize: 'var(--font-size-label-md, 14px)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontFamily: '"Hanjin Group Sans"',
    lineHeight: '130%',
    '& fieldset': {
      border: isReadOnly
        ? '1px solid var(--color-border-base, #D9D9D9)'
        : '0.5px solid var(--color-border-base, #D9D9D9)',
    },
    '&:hover fieldset': {
      borderColor: isReadOnly
        ? 'var(--color-border-base, #D9D9D9)'
        : 'var(--color-border-base, #D9D9D9)',
      borderWidth: isReadOnly ? '1px' : '0.5px',
    },
    '&.Mui-focused fieldset': {
      borderColor: isReadOnly
        ? 'var(--color-border-base, #D9D9D9)'
        : 'var(--color-border-primary-darkblue, #051766)',
      borderWidth: isReadOnly ? '1px !important' : '0.5px !important',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: isReadOnly
        ? 'var(--color-border-base, #D9D9D9)'
        : 'var(--color-border-primary-darkblue, #051766)',
      borderWidth: isReadOnly ? '1px !important' : '0.5px !important',
    },
    '&.Mui-error fieldset': {
      borderColor: '#ef4444',
      borderWidth: '1px !important',
    },
    '&.Mui-focused.Mui-error fieldset': {
      borderColor: '#ef4444 !important',
      borderWidth: '1px !important',
    },
    '&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ef4444 !important',
      borderWidth: '1px !important',
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--color-background-disabled, #EDEDED) !important',
      '& fieldset': {
        border: '1px solid var(--color-border-base, #D9D9D9)',
      },
    },
    // Multiple select일 때만 높이 자동 조정
    '&.MuiSelect-multiple': {
      height: 'auto',
      minHeight: '36px',
    },
  },
  '& .MuiSelect-select': {
    fontFamily: '"Hanjin Group Sans"',
    fontSize: 'var(--font-size-label-md, 14px)',
    fontWeight: 'var(--font-weight-regular, 400)',
    lineHeight: '130%',
    padding: '7px 12px',
    paddingRight: '32px', // 아이콘 공간 확보
    height: '20px !important',
    minHeight: '20px !important',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    // Multiple select일 때 패딩 조정
    '&.MuiSelect-multiple': {
      padding: '4px 8px',
      alignItems: 'flex-start',
      overflow: 'visible',
      whiteSpace: 'normal',
    },
    '&.Mui-disabled': {
      color: 'var(--color-text-disabled, #A4A4A4) !important',
      WebkitTextFillColor: 'var(--color-text-disabled, #A4A4A4) !important',
    },
    // readOnly일 때 텍스트 색상을 블랙으로
    '&.Mui-disabled[data-readonly="true"]': {
      color: 'var(--color-text-base, #252525) !important',
      WebkitTextFillColor: 'var(--color-text-base, #252525) !important',
    },
    // Placeholder 스타일
    '&[data-placeholder="true"]': {
      color: 'var(--color-text-placeholder, #A4A4A4)',
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

  '& .MuiSelect-icon': {
    color: 'transparent', // 기본 아이콘 숨김
    fontSize: '18px',
    right: '4px',
    width: '24px',
    height: '20px',
    transition: 'all 0.2s ease',
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_885_68168)'%3E%3Cpath d='M19.0732 8.47837H19.8105L15.7539 12.535L15.75 12.5311L11.9922 16.2704L8.29004 12.5272L8.2832 12.535L4.50293 8.75376L4.45312 8.70493L4.22656 8.47837H4.96387C5.35186 8.45464 5.74105 8.5086 6.10742 8.63852C6.47371 8.76844 6.81036 8.97141 7.09668 9.23422L9.3418 11.4793L9.33594 11.4842L12 14.1756L14.7051 11.4862L14.6992 11.4803L16.9414 9.23422C17.2274 8.97088 17.5633 8.76749 17.9297 8.63755C18.2961 8.50762 18.6853 8.45402 19.0732 8.47837Z' fill='%23252525'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_885_68168'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '24px 24px',
  },
  '&.Mui-disabled .MuiSelect-icon': {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_885_68168)'%3E%3Cpath d='M19.0732 8.47837H19.8105L15.7539 12.535L15.75 12.5311L11.9922 16.2704L8.29004 12.5272L8.2832 12.535L4.50293 8.75376L4.45312 8.70493L4.22656 8.47837H4.96387C5.35186 8.45464 5.74105 8.5086 6.10742 8.63852C6.47371 8.76844 6.81036 8.97141 7.09668 9.23422L9.3418 11.4793L9.33594 11.4842L12 14.1756L14.7051 11.4862L14.6992 11.4803L16.9414 9.23422C17.2274 8.97088 17.5633 8.76749 17.9297 8.63755C18.2961 8.50762 18.6853 8.45402 19.0732 8.47837Z' fill='%23A4A4A4'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_885_68168'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
  },

  '&:has(.MuiSelect-select[data-readonly="true"]) .MuiSelect-icon': {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_885_68168)'%3E%3Cpath d='M19.0732 8.47837H19.8105L15.7539 12.535L15.75 12.5311L11.9922 16.2704L8.29004 12.5272L8.2832 12.535L4.50293 8.75376L4.45312 8.70493L4.22656 8.47837H4.96387C5.35186 8.45464 5.74105 8.5086 6.10742 8.63852C6.47371 8.76844 6.81036 8.97141 7.09668 9.23422L9.3418 11.4793L9.33594 11.4842L12 14.1756L14.7051 11.4862L14.6992 11.4803L16.9414 9.23422C17.2274 8.97088 17.5633 8.76749 17.9297 8.63755C18.2961 8.50762 18.6853 8.45402 19.0732 8.47837Z' fill='%23A4A4A4'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_885_68168'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
  },
  // 드롭다운이 열렸을 때 화살표 위쪽으로 변경
  '&[aria-expanded="true"] .MuiSelect-icon': {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_553_420785)'%3E%3Cpath d='M15.7095 11.4736L15.7163 11.4658L19.4976 15.2461L19.5464 15.2959L19.7729 15.5225H19.0356C18.6478 15.5461 18.2593 15.4912 17.8931 15.3613C17.5268 15.2315 17.1901 15.0293 16.9038 14.7666L14.6577 12.5205L14.6636 12.5156L12.0005 9.8252L9.29443 12.5146L9.30029 12.5205L7.05908 14.7666C6.77309 15.03 6.43628 15.2324 6.06982 15.3623C5.70336 15.4923 5.31433 15.5468 4.92627 15.5225H4.18896L4.46533 15.2461L6.82471 12.8877L6.82373 12.8867L7.00928 12.7031L8.24561 11.4658L8.24951 11.4697L12.0073 7.73047L15.7095 11.4736Z' fill='%23051766'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_553_420785'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
    transform: 'none',
  },
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  fontFamily: '"Hanjin Group Sans"',
  fontSize: 'var(--font-size-label-md, 14px)',
  fontWeight: 'var(--font-weight-regular, 400)',
  lineHeight: '130%',
  padding: '8px 12px',
  minHeight: '36px',
  color: 'var(--color-text-base, #252525) !important',
  backgroundColor: 'var(--color-background-base-white, #FFF) !important',
  '&:hover': {
    backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
  },
  '&.Mui-selected': {
    backgroundColor: 'var(--color-background-base-white, #FFF) !important',
    fontWeight: 'var(--font-weight-bold, 700)',
    color: 'var(--color-text-base, #252525) !important',
    '&:hover': {
      backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
    },
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
  },
  '&.Mui-disabled': {
    color: 'var(--color-text-disabled, #A4A4A4) !important',
    backgroundColor: 'var(--color-background-base-white, #FFF) !important',
  },
}));

const StyledChip = styled(Chip)(() => ({
  height: '24px',
  margin: '2px',
  fontFamily: '"Hanjin Group Sans"',
  fontSize: '12px',
  fontWeight: 'var(--font-weight-regular, 400)',
  '& .MuiChip-label': {
    padding: '0 8px',
  },
  '& .MuiChip-deleteIcon': {
    fontSize: '16px',
    color: 'var(--color-text-placeholder, #A4A4A4)',
    '&:hover': {
      color: 'var(--color-text-base, #252525)',
    },
  },
}));

const renderValue = (
  selected: any,
  options?: EtsSelectOption[],
  multiple?: boolean,
  placeholder?: string
) => {
  if (multiple) {
    const selectedArray = Array.isArray(selected) ? selected : [];
    if (selectedArray.length === 0) {
      return <span style={{ color: 'var(--color-text-placeholder, #A4A4A4)' }}>{placeholder}</span>;
    }
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedArray.map((value) => {
          const option = options?.find((opt) => opt.value === value);
          return <StyledChip key={value} label={option?.label || value} size="small" />;
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
        overflow: 'hidden !important',
        textOverflow: 'ellipsis !important',
        whiteSpace: 'nowrap !important',
        width: '100%',
        display: 'block !important',
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

const EtsSelect = React.forwardRef<HTMLInputElement, EtsSelectProps>(
  (
    {
      options = [],
      placeholder,
      children,
      multiple,
      value,
      width,
      readOnly,
      error = false,
      helperText = '',
      ...props
    },
    ref
  ) => {
    // multiple일 때는 빈 배열, 아닐 때는 빈 문자열이 기본값
    const defaultValue = multiple ? [] : '';
    const currentValue = value !== undefined ? value : defaultValue;
    const menuProps = {
      autoFocus: false,
      disableAutoFocus: true,
      disableEnforceFocus: true,
      disableRestoreFocus: true,
      disablePortal: true,
      disableScrollLock: true,
      PaperProps: {
        style: {
          maxHeight: 240,
          borderRadius: 'var(--radius-sm, 8px)',
          marginTop: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '0.5px solid var(--color-border-base, #D9D9D9)',
          backgroundColor: 'var(--color-background-base-white, #FFF)',
        },
        sx: {
          // 스크롤바 스타일링
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.5)',
            },
          },
          '&::-webkit-scrollbar-corner': {
            background: 'transparent',
          },
        },
      },
    };

    const displayEmpty = Boolean(placeholder);
    const isPlaceholderShowing =
      displayEmpty &&
      (!currentValue || (multiple && Array.isArray(currentValue) && currentValue.length === 0));

    return (
      <FormControl
        error={error}
        // --- FormControl의 너비를 '100%'로 설정하여 부모로부터 전달된 너비를 따르도록 합니다. ---
        sx={{ width: width || '100%', position: 'relative' }}
      >
        <StyledSelect
          ref={ref}
          {...props}
          error={error}
          customWidth={width}
          isReadOnly={readOnly}
          multiple={multiple}
          value={currentValue}
          displayEmpty={displayEmpty}
          disabled={props.disabled || readOnly}
          MenuProps={menuProps}
          renderValue={(selected) => renderValue(selected, options, multiple, placeholder)}
          SelectDisplayProps={
            {
              'data-placeholder': isPlaceholderShowing,
              'data-readonly': readOnly,
            } as any
          }
          // --- StyledSelect가 FormControl의 전체 너비를 사용하도록 합니다. ---
          sx={{
            width: '100%',
            ...(readOnly && {
              '& .MuiSelect-select.Mui-disabled': {
                color: 'var(--color-text-base, #252525) !important',
                WebkitTextFillColor: 'var(--color-text-base, #252525) !important',
              },
              '& .MuiOutlinedInput-root.Mui-disabled': {
                backgroundColor: 'var(--color-background-disabled, #EDEDED)',
                '& fieldset': {
                  border: '1px solid var(--color-border-base, #D9D9D9)',
                },
              },
              '& .MuiSelect-icon.Mui-disabled': {
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_885_68168)'%3E%3Cpath d='M19.0732 8.47837H19.8105L15.7539 12.535L15.75 12.5311L11.9922 16.2704L8.29004 12.5272L8.2832 12.535L4.50293 8.75376L4.45312 8.70493L4.22656 8.47837H4.96387C5.35186 8.45464 5.74105 8.5086 6.10742 8.63852C6.47371 8.76844 6.81036 8.97141 7.09668 9.23422L9.3418 11.4793L9.33594 11.4842L12 14.1756L14.7051 11.4862L14.6992 11.4803L16.9414 9.23422C17.2274 8.97088 17.5633 8.76749 17.9297 8.63755C18.2961 8.50762 18.6853 8.45402 19.0732 8.47837Z' fill='%23252525'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_885_68168'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
              },
            }),
            ...props.sx,
          }}
        >
          {children ||
            (options.length > 0 ? (
              options.map((option) => (
                <StyledMenuItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </StyledMenuItem>
              ))
            ) : (
              <StyledMenuItem disabled value="" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                No Data
              </StyledMenuItem>
            ))}
        </StyledSelect>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }
);

EtsSelect.displayName = 'EtsSelect';

export default EtsSelect;
