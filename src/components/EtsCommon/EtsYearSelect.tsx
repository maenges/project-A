import React, { useMemo } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import type { SelectProps } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

export interface EtsYearSelectProps extends Omit<SelectProps, 'children'> {
  /** 기본 선택값 (다양한 날짜 형식 가능) */
  defaultValue?: string | number | Date;
  /** 최소 년도 (기본: 현재년도 - 20) */
  minYear?: number;
  /** 최대 년도 (기본: 현재년도 + 20) */
  maxYear?: number;
  /** placeholder 텍스트 */
  placeholder?: string;
  // 리스트로 넣을때
  list?: any;
  /** 너비 */
  width?: string | number;
  /** 읽기전용 */
  readOnly?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** 도움말 텍스트 */
  helperText?: string;
  desc?: boolean;
}

const StyledSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'customWidth' && prop !== 'isReadOnly',
})<{ customWidth?: string | number; isReadOnly?: boolean }>(({ customWidth, isReadOnly }) => ({
  width: customWidth || '200px',
  // 최상위 레벨에서 배경색 강제 적용
  backgroundColor: isReadOnly
    ? 'var(--color-background-disabled, #EDEDED) !important'
    : 'var(--color-background-base-white, #FFF) !important',

  // disabled 상태 강제 적용 (최상위 레벨)
  '&.Mui-disabled': {
    backgroundColor: 'var(--color-background-disabled, #EDEDED) !important',
  },

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
        : '1px solid var(--color-border-base-gray, #A4A4A4)',
    },
    '&:hover fieldset': {
      borderColor: isReadOnly
        ? 'var(--color-border-base, #D9D9D9)'
        : 'var(--color-border-base-gray, #A4A4A4)',
      borderWidth: '1px',
    },
    '&.Mui-focused fieldset': {
      borderColor: isReadOnly
        ? 'var(--color-border-base, #D9D9D9)'
        : 'var(--color-border-primary-darkblue, #051766)',
      borderWidth: '1px !important',
    },
    '&.Mui-error fieldset': {
      borderColor: '#ef4444',
      borderWidth: '1px !important',
    },
    '&.Mui-focused.Mui-error fieldset': {
      borderColor: '#ef4444 !important',
      borderWidth: '1px !important',
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--color-background-disabled, #EDEDED) !important',
      '& fieldset': {
        border: '1px solid var(--color-border-base, #D9D9D9)',
      },
    },
    // readOnly일 때 disabled와 같은 배경색이지만 다른 텍스트 색상
    '&[data-readonly="true"].Mui-disabled': {
      backgroundColor: 'var(--color-background-disabled, #EDEDED) !important',
      '& fieldset': {
        border: '1px solid var(--color-border-base, #D9D9D9)',
      },
    },
  },

  // MUI 기본 클래스들을 구체적으로 타겟팅해서 disabled 배경색 강제 적용
  '&.MuiInputBase-root.MuiOutlinedInput-root.Mui-disabled': {
    backgroundColor: 'var(--color-background-disabled, #EDEDED) !important',
  },
  '& .MuiSelect-select': {
    fontFamily: '"Hanjin Group Sans"',
    fontSize: 'var(--font-size-label-md, 14px)',
    fontWeight: 'var(--font-weight-regular, 400)',
    lineHeight: '130%',
    padding: '7px 12px',
    paddingRight: '32px',
    height: '20px !important',
    minHeight: '20px !important',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '&.Mui-disabled': {
      color: 'var(--color-text-disabled, #A4A4A4) !important',
      WebkitTextFillColor: 'var(--color-text-disabled, #A4A4A4) !important',
    },
    // readOnly일 때 텍스트 색상을 블랙으로
    '&.Mui-disabled[data-readonly="true"]': {
      color: 'var(--color-text-base, #252525) !important',
      WebkitTextFillColor: 'var(--color-text-base, #252525) !important',
    },
    '&[data-placeholder="true"]': {
      color: 'var(--color-text-placeholder, #A4A4A4)',
    },
  },
  '& .MuiSelect-icon': {
    color: 'transparent',
    fontSize: '18px',
    right: '9px',
    top: '7px',
    width: '24px',
    height: '20px',
    transition: 'all 0.2s ease',
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_916_48137)'%3E%3Cpath d='M20.0777 17.5113L20.5575 16.9681C21.1312 16.3156 21.4333 15.5642 21.4333 14.8001V7.80877C21.4333 6.94818 20.7352 6.25007 19.8746 6.25007H17.76V4.4375H16.4044V6.25007H7.59539V4.4375H6.23977V6.25007H4.12511C3.26452 6.25007 2.56641 6.94818 2.56641 7.80877V18.0064C2.56641 18.8669 3.26452 19.5651 4.12511 19.5651L18.6764 19.56C19.4202 19.5448 20.1488 19.2452 20.786 18.6867L21.3293 18.2069H4.12511C4.01341 18.2094 3.92202 18.1206 3.92202 18.0064V11.4237H20.0777V17.5113ZM3.92202 10.0681V7.80623C3.92202 7.69453 4.01341 7.60314 4.12511 7.60314H6.23977V8.83437H7.59539V7.60314H16.4044V8.83437H17.76V7.60314H19.8746C19.9863 7.60314 20.0777 7.69453 20.0777 7.80623V10.0681H3.92202Z' fill='%23252525'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_916_48137'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '24px 24px',
  },
  '&.Mui-focused .MuiSelect-icon': {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_916_48137)'%3E%3Cpath d='M20.0777 17.5113L20.5575 16.9681C21.1312 16.3156 21.4333 15.5642 21.4333 14.8001V7.80877C21.4333 6.94818 20.7352 6.25007 19.8746 6.25007H17.76V4.4375H16.4044V6.25007H7.59539V4.4375H6.23977V6.25007H4.12511C3.26452 6.25007 2.56641 6.94818 2.56641 7.80877V18.0064C2.56641 18.8669 3.26452 19.5651 4.12511 19.5651L18.6764 19.56C19.4202 19.5448 20.1488 19.2452 20.786 18.6867L21.3293 18.2069H4.12511C4.01341 18.2094 3.92202 18.1206 3.92202 18.0064V11.4237H20.0777V17.5113ZM3.92202 10.0681V7.80623C3.92202 7.69453 4.01341 7.60314 4.12511 7.60314H6.23977V8.83437H7.59539V7.60314H16.4044V8.83437H17.76V7.60314H19.8746C19.9863 7.60314 20.0777 7.69453 20.0777 7.80623V10.0681H3.92202Z' fill='%23252525'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_916_48137'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
    transform: 'none',
  },
  '&.Mui-disabled .MuiSelect-icon': {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_916_48137)'%3E%3Cpath d='M20.0777 17.5113L20.5575 16.9681C21.1312 16.3156 21.4333 15.5642 21.4333 14.8001V7.80877C21.4333 6.94818 20.7352 6.25007 19.8746 6.25007H17.76V4.4375H16.4044V6.25007H7.59539V4.4375H6.23977V6.25007H4.12511C3.26452 6.25007 2.56641 6.94818 2.56641 7.80877V18.0064C2.56641 18.8669 3.26452 19.5651 4.12511 19.5651L18.6764 19.56C19.4202 19.5448 20.1488 19.2452 20.786 18.6867L21.3293 18.2069H4.12511C4.01341 18.2094 3.92202 18.1206 3.92202 18.0064V11.4237H20.0777V17.5113ZM3.92202 10.0681V7.80623C3.92202 7.69453 4.01341 7.60314 4.12511 7.60314H6.23977V8.83437H7.59539V7.60314H16.4044V8.83437H17.76V7.60314H19.8746C19.9863 7.60314 20.0777 7.69453 20.0777 7.80623V10.0681H3.92202Z' fill='%23A4A4A4'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_916_48137'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
  },
  // readOnly일 때는 아이콘도 블랙으로
  '&:has(.MuiSelect-select[data-readonly="true"]) .MuiSelect-icon': {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_916_48137)'%3E%3Cpath d='M20.0777 17.5113L20.5575 16.9681C21.1312 16.3156 21.4333 15.5642 21.4333 14.8001V7.80877C21.4333 6.94818 20.7352 6.25007 19.8746 6.25007H17.76V4.4375H16.4044V6.25007H7.59539V4.4375H6.23977V6.25007H4.12511C3.26452 6.25007 2.56641 6.94818 2.56641 7.80877V18.0064C2.56641 18.8669 3.26452 19.5651 4.12511 19.5651L18.6764 19.56C19.4202 19.5448 20.1488 19.2452 20.786 18.6867L21.3293 18.2069H4.12511C4.01341 18.2094 3.92202 18.1206 3.92202 18.0064V11.4237H20.0777V17.5113ZM3.92202 10.0681V7.80623C3.92202 7.69453 4.01341 7.60314 4.12511 7.60314H6.23977V8.83437H7.59539V7.60314H16.4044V8.83437H17.76V7.60314H19.8746C19.9863 7.60314 20.0777 7.69453 20.0777 7.80623V10.0681H3.92202Z' fill='%23A4A4A4'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_916_48137'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
  },
}));

const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{
  isSelected?: boolean;
}>(({ isSelected }) => ({
  fontFamily: '"Hanjin Group Sans"',
  fontSize: 'var(--font-size-label-md, 14px)',
  fontWeight: 'var(--font-weight-regular, 400)',
  lineHeight: '130%',
  padding: '8px 0px',
  minHeight: '36px',
  color: 'var(--color-text-base, #252525) !important',
  backgroundColor: 'var(--color-background-base-white, #FFF) !important',
  borderRadius: isSelected ? 'var(--radius-full, 9999px)' : 'var(--radius-sm, 8px)',
  border: isSelected ? '1px solid var(--color-background-primary-darkblue, #051766)' : 'none',
  margin: '0px 24px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  '&.Mui-selected': {
    backgroundColor: 'var(--color-background-primary-darkblue, #051766) !important',
    borderRadius: 'var(--radius-full, 9999px)',
    color: 'var(--color-text-inverse, #FFF) !important',
    border: '1px solid var(--color-background-primary-darkblue, #051766)',

    '&:hover': {
      backgroundColor: 'var(--color-background-primary-darkblue, #051766) !important',
      borderRadius: 'var(--radius-full, 9999px)',
    },
  },

  '&:hover': {
    backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
    borderRadius: 'var(--radius-full, 9999px)',
  },

  '&.Mui-focusVisible': {
    backgroundColor: 'var(--color-background-base-lightblue10, #EEF8FD) !important',
    borderRadius: 'var(--radius-full, 9999px)',
  },

  '&.Mui-disabled': {
    color: 'var(--color-text-disabled, #A4A4A4) !important',
    backgroundColor: 'var(--color-background-base-white, #FFF) !important',
  },
}));

const renderValue = (selected: any, placeholder?: string) => {
  const displayText =
    selected !== undefined && selected !== null && selected !== '' ? String(selected) : placeholder;

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
          (selected === undefined || selected === null || selected === '') && placeholder
            ? 'var(--color-text-placeholder, #A4A4A4)'
            : 'inherit',
      }}
      title={typeof displayText === 'string' ? displayText : undefined}
    >
      {displayText}
    </Box>
  );
};

/**
 * 다양한 날짜 형식에서 년도 추출
 */
const extractYear = (value: any): number | null => {
  if (value === undefined || value === null) return null;

  // 숫자인 경우 그대로 반환
  if (typeof value === 'number') {
    return Math.floor(value);
  }

  // Date 객체인 경우
  if (value instanceof Date) {
    return value.getFullYear();
  }

  // 문자열인 경우 dayjs로 파싱
  if (typeof value === 'string') {
    const parsed = dayjs(value);
    if (parsed.isValid()) {
      return parsed.year();
    }

    // dayjs로 파싱 안되는 경우 숫자 추출 시도
    const yearMatch = value.match(/(\d{4})/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1], 10);
      if (year >= 1000 && year <= 9999) {
        return year;
      }
    }
  }

  return null;
};

const EtsYearSelect = React.forwardRef<HTMLInputElement, EtsYearSelectProps>(
  (
    {
      defaultValue,
      minYear,
      maxYear,
      placeholder = '년도를 선택하세요',
      value,
      width,
      readOnly,
      error = false,
      helperText = '',
      desc,
      list,
      ...props
    },
    ref
  ) => {
    const currentYear = dayjs().year();

    // 년도 범위 계산
    const actualMinYear = minYear ?? currentYear - 10;
    const actualMaxYear = maxYear ?? currentYear + 10;

    const yearOptions = useMemo(() => {
      // 1. list가 있으면 list를 그대로 반환합니다.
      if (list && list.length > 0) {
        return list;
      }

      // 2. list가 없으면 min/maxYear 기준으로 배열을 생성합니다.
      const years: number[] = [];
      if (desc) {
        // 내림차순
        for (let year = actualMaxYear; year >= actualMinYear; year--) {
          years.push(year);
        }
      } else {
        // 오름차순
        for (let year = actualMinYear; year <= actualMaxYear; year++) {
          years.push(year);
        }
      }
      return years;
    }, [list, actualMinYear, actualMaxYear, desc]); // 의존성 배열에 list와 desc 추가

    // 기본값 처리
    const extractedDefaultYear = useMemo(() => {
      return extractYear(defaultValue);
    }, [defaultValue]);

    // 현재 선택된 값
    const currentValue = value !== undefined ? extractYear(value) : extractedDefaultYear;

    const menuProps = {
      autoFocus: false,
      disableAutoFocus: true,
      disableEnforceFocus: true,
      disableRestoreFocus: true,
      disablePortal: true,
      disableScrollLock: true,
      variant: 'selectedMenu' as const,
      PaperProps: {
        style: {
          maxHeight: 240,
          borderRadius: 'var(--radius-sm, 8px)',
          marginTop: '4px',
          boxShadow: '0 0 25px 0 rgba(0, 0, 0, 0.04)',
          border: '1px solid var(--color-border-base-gray, #A4A4A4)',
          backgroundColor: 'var(--color-background-base-white, #FFF)',
        },
        sx: {
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
      displayEmpty && (currentValue === null || currentValue === undefined);

    return (
      <FormControl error={error} sx={{ width: width || '180px', position: 'relative' }}>
        <StyledSelect
          ref={ref}
          {...props}
          error={error}
          customWidth={width}
          isReadOnly={readOnly}
          value={currentValue ?? ''}
          displayEmpty={displayEmpty}
          disabled={props.disabled || readOnly} // readOnly일 때도 disabled로 처리
          MenuProps={menuProps}
          renderValue={(selected) => renderValue(selected, placeholder)}
          SelectDisplayProps={
            {
              'data-placeholder': isPlaceholderShowing,
              'data-readonly': readOnly, // readOnly 상태 표시
            } as any
          }
          sx={{
            width: width || '180px',
            // readOnly 상태일 때 추가 스타일링
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
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_916_48137)'%3E%3Cpath d='M20.0777 17.5113L20.5575 16.9681C21.1312 16.3156 21.4333 15.5642 21.4333 14.8001V7.80877C21.4333 6.94818 20.7352 6.25007 19.8746 6.25007H17.76V4.4375H16.4044V6.25007H7.59539V4.4375H6.23977V6.25007H4.12511C3.26452 6.25007 2.56641 6.94818 2.56641 7.80877V18.0064C2.56641 18.8669 3.26452 19.5651 4.12511 19.5651L18.6764 19.56C19.4202 19.5448 20.1488 19.2452 20.786 18.6867L21.3293 18.2069H4.12511C4.01341 18.2094 3.92202 18.1206 3.92202 18.0064V11.4237H20.0777V17.5113ZM3.92202 10.0681V7.80623C3.92202 7.69453 4.01341 7.60314 4.12511 7.60314H6.23977V8.83437H7.59539V7.60314H16.4044V8.83437H17.76V7.60314H19.8746C19.9863 7.60314 20.0777 7.69453 20.0777 7.80623V10.0681H3.92202Z' fill='%23252525'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_916_48137'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
              },
            }),
            ...props.sx,
          }}
        >
          {yearOptions.map((year: any) => (
            <StyledMenuItem key={year} value={year} isSelected={year === currentValue}>
              {year}
            </StyledMenuItem>
          ))}
        </StyledSelect>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }
);

EtsYearSelect.displayName = 'EtsYearSelect';

export default EtsYearSelect;
