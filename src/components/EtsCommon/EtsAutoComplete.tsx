import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import type { AutocompleteProps } from '@mui/material/Autocomplete';

export interface EtsAutoCompleteOption {
  label: string;
  value: string;
}

export interface EtsAutoCompleteProps
  extends Omit<
    AutocompleteProps<EtsAutoCompleteOption, false, false, false>,
    'renderInput' | 'options' | 'onChange' | 'value'
  > {
  label?: string;
  value?: string;
  options: EtsAutoCompleteOption[];
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  width?: string | number;
  readOnly?: boolean;
  onBlur?: () => void;
  onChange: (event: React.ChangeEvent<{}>, value: string | null) => void;
}

const StyledAutocomplete = styled(Autocomplete, {
  shouldForwardProp: (prop) => prop !== 'customWidth' && prop !== 'isReadOnly',
})<{ customWidth?: string | number; isReadOnly?: boolean }>(({ customWidth, isReadOnly }) => ({
  width: customWidth || '200px',

  '& .MuiAutocomplete-inputRoot': {
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
    padding: '0 !important',

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
      borderWidth: isReadOnly ? '1px !important' : '1px !important',
    },
    '&.Mui-error fieldset': {
      borderColor: '#ef4444',
      borderWidth: '1px !important',
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--color-background-disabled, #EDEDED) !important',
      '& fieldset': {
        border: '1px solid var(--color-border-base, #D9D9D9)',
      },
    },
  },

  '& .MuiAutocomplete-input': {
    fontFamily: '"Hanjin Group Sans"',
    fontSize: 'var(--font-size-label-md, 14px)',
    fontWeight: 'var(--font-weight-regular, 400)',
    lineHeight: '130%',
    padding: '7px 60px 7px 12px !important', // 오른쪽 패딩을 늘려서 아이콘 영역 확보
    height: '20px !important',
    minHeight: '20px !important',
    color: '#000000',
    overflow: 'hidden', // 넘치는 텍스트 숨김
    whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
    textOverflow: 'ellipsis', // 넘치는 텍스트를 ... 으로 표시

    '&.Mui-disabled': {
      color: isReadOnly
        ? 'var(--color-text-base, #252525) !important'
        : 'var(--color-text-disabled, #A4A4A4) !important',
      WebkitTextFillColor: isReadOnly
        ? 'var(--color-text-base, #252525) !important'
        : 'var(--color-text-disabled, #A4A4A4) !important',
    },

    '&::placeholder': {
      color: 'var(--color-text-placeholder, #A4A4A4)',
      opacity: 1,
    },
  },

  '& .MuiAutocomplete-endAdornment': {
    right: '4px !important',
    top: '50%',
    transform: 'translateY(-50%)',

    '& .MuiAutocomplete-popupIndicator': {
      color: 'transparent',
      width: '24px',
      height: '24px',
      padding: '0',
      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_885_68168)'%3E%3Cpath d='M19.0732 8.47837H19.8105L15.7539 12.535L15.75 12.5311L11.9922 16.2704L8.29004 12.5272L8.2832 12.535L4.50293 8.75376L4.45312 8.70493L4.22656 8.47837H4.96387C5.35186 8.45464 5.74105 8.5086 6.10742 8.63852C6.47371 8.76844 6.81036 8.97141 7.09668 9.23422L9.3418 11.4793L9.33594 11.4842L12 14.1756L14.7051 11.4862L14.6992 11.4803L16.9414 9.23422C17.2274 8.97088 17.5633 8.76749 17.9297 8.63755C18.2961 8.50762 18.6853 8.45402 19.0732 8.47837Z' fill='%23252525'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_885_68168'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '24px 24px',

      '&.Mui-disabled': {
        backgroundImage: isReadOnly
          ? `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_885_68168)'%3E%3Cpath d='M19.0732 8.47837H19.8105L15.7539 12.535L15.75 12.5311L11.9922 16.2704L8.29004 12.5272L8.2832 12.535L4.50293 8.75376L4.45312 8.70493L4.22656 8.47837H4.96387C5.35186 8.45464 5.74105 8.5086 6.10742 8.63852C6.47371 8.76844 6.81036 8.97141 7.09668 9.23422L9.3418 11.4793L9.33594 11.4842L12 14.1756L14.7051 11.4862L14.6992 11.4803L16.9414 9.23422C17.2274 8.97088 17.5633 8.76749 17.9297 8.63755C18.2961 8.50762 18.6853 8.45402 19.0732 8.47837Z' fill='%23252525'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_885_68168'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`
          : `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_885_68168)'%3E%3Cpath d='M19.0732 8.47837H19.8105L15.7539 12.535L15.75 12.5311L11.9922 16.2704L8.29004 12.5272L8.2832 12.535L4.50293 8.75376L4.45312 8.70493L4.22656 8.47837H4.96387C5.35186 8.45464 5.74105 8.5086 6.10742 8.63852C6.47371 8.76844 6.81036 8.97141 7.09668 9.23422L9.3418 11.4793L9.33594 11.4842L12 14.1756L14.7051 11.4862L14.6992 11.4803L16.9414 9.23422C17.2274 8.97088 17.5633 8.76749 17.9297 8.63755C18.2961 8.50762 18.6853 8.45402 19.0732 8.47837Z' fill='%23A4A4A4'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_885_68168'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
      },
    },

    '& .MuiAutocomplete-clearIndicator': {
      color: 'var(--color-text-placeholder, #A4A4A4)',
      fontSize: '16px',
      marginRight: '4px',
      '&:hover': {
        color: 'var(--color-text-base, #252525)',
      },
    },
  },

  '& .MuiFormLabel-root': {
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

const StyledTextField = styled(TextField)(() => ({
  position: 'relative',
  '& .MuiInputBase-root': {
    height: '36px !important',
    minHeight: '36px !important',
    maxHeight: '36px !important',

    // Error 상태에서 border 굵게
    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ef4444',
      borderWidth: '1px !important',
    },
  },
}));

// 키보드 포커스 문제 해결을 위한 강력한 styled component
const StyledOptionListItem = styled('li', {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ isSelected }) => ({
  fontFamily: '"Hanjin Group Sans"',
  fontSize: 'var(--font-size-label-md, 14px)',
  fontWeight: isSelected ? 'var(--font-weight-bold, 700)' : 'var(--font-weight-regular, 400)',
  lineHeight: '130%',
  padding: '8px 12px !important',
  minHeight: '36px',
  color: 'var(--color-text-base, #252525) !important',
  cursor: 'pointer',
  transition: 'background-color 0.1s ease',
  overflow: 'hidden', // 넘치는 텍스트 숨김
  whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
  textOverflow: 'ellipsis', // 넘치는 텍스트를 ... 으로 표시

  // 기본 배경색
  backgroundColor: isSelected
    ? 'var(--color-background-base-white, #FFF) !important'
    : 'var(--color-background-base-white, #FFF) !important',

  // hover 및 포커스 시 배경색 (모든 가능한 선택자 사용)
  '&:hover, &.Mui-focused, &.Mui-focusVisible, &[data-focus="true"], &[aria-selected="true"]:not([data-selected="true"])':
    {
      backgroundColor: isSelected
        ? 'var(--color-background-base-white, #FFF) !important'
        : 'var(--color-background-base-lightblue10, #EEF8FD) !important',
    },

  // 추가 강제 스타일링
  '&.MuiAutocomplete-option': {
    '&:hover': {
      backgroundColor: isSelected
        ? 'var(--color-background-base-white, #FFF) !important'
        : 'var(--color-background-base-lightblue10, #EEF8FD) !important',
    },
    '&.Mui-focused': {
      backgroundColor: isSelected
        ? 'var(--color-background-base-white, #FFF) !important'
        : 'var(--color-background-base-lightblue10, #EEF8FD) !important',
    },
  },
}));

const EtsAutoComplete = React.forwardRef<HTMLInputElement, EtsAutoCompleteProps>(
  (
    {
      label = '',
      value,
      onChange,
      options,
      width,
      disabled = false,
      readOnly = false,
      placeholder = '',
      error = false,
      onBlur,
      helperText = '',
      ...props
    },
    ref
  ) => {
    const currentValue = value
      ? options.find((opt: EtsAutoCompleteOption) => opt.value === value) || null
      : null;

    return (
      <StyledAutocomplete
        ref={ref}
        {...(props as any)}
        customWidth={width}
        isReadOnly={readOnly}
        options={options}
        getOptionLabel={(option) => (option as EtsAutoCompleteOption).label}
        value={currentValue}
        onChange={(event, newValue) => {
          const typedValue = newValue as EtsAutoCompleteOption | null;
          onChange(event as React.ChangeEvent<{}>, typedValue ? typedValue.value : null);
        }}
        disabled={disabled || readOnly}
        disableClearable={readOnly}
        renderOption={(props, option, { selected }) => {
          const { key, ...otherProps } = props;

          return (
            <StyledOptionListItem key={key} {...otherProps} isSelected={selected}>
              {(option as EtsAutoCompleteOption).label}
            </StyledOptionListItem>
          );
        }}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            label={label}
            placeholder={placeholder}
            size="small"
            error={error}
            onBlur={onBlur}
            helperText={helperText}
            inputProps={{
              ...params.inputProps,
              readOnly: readOnly,
            }}
          />
        )}
        isOptionEqualToValue={(option, value) => {
          const typedOption = option as EtsAutoCompleteOption;
          const typedValue = value as EtsAutoCompleteOption;
          return typedOption.value === typedValue.value;
        }}
        // ListboxProps로 키보드 포커스 문제 해결
        ListboxProps={{
          sx: {
            fontFamily: '"Hanjin Group Sans"',
            fontSize: 'var(--font-size-label-md, 14px)',
            fontWeight: 'var(--font-weight-regular, 400)',
            lineHeight: '130%',
            padding: '4px 0',
            maxHeight: 200,

            // keYearSelect 스타일의 스크롤바 CSS
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

            // 강력한 키보드 포커스 스타일링 (모든 가능한 선택자)
            '& .MuiAutocomplete-option': {
              '&:hover': {
                backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
              },
              '&.Mui-focused': {
                backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
              },
              '&.Mui-focusVisible': {
                backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
              },
              '&[data-focus="true"]': {
                backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
              },
              '&[aria-selected="true"]:not([data-selected="true"])': {
                backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
              },
            },
          },
        }}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 240,
              borderRadius: 'var(--radius-sm, 8px)',
              marginTop: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '0.5px solid var(--color-border-base, #D9D9D9)',
              backgroundColor: 'var(--color-background-base-white, #FFF)',
            },
          },
        }}
        sx={{
          // No options 메시지 스타일 (ListboxProps와 StyledOptionListItem이 나머지 처리)
          '& .MuiAutocomplete-noOptions': {
            fontFamily: '"Hanjin Group Sans"',
            fontSize: 'var(--font-size-label-md, 14px)',
            fontStyle: 'italic',
            textAlign: 'center',
            color: 'var(--color-text-placeholder, #A4A4A4)',
            padding: '8px 12px',
          },

          // 추가 안전장치: 전역 강제 스타일링
          '& .MuiAutocomplete-option': {
            '&:hover, &.Mui-focused, &.Mui-focusVisible, &[data-focus="true"]': {
              backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
            },
          },
        }}
      />
    );
  }
);

EtsAutoComplete.displayName = 'EtsAutoComplete';

export default EtsAutoComplete;
