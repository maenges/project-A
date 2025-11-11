import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import { Paper, Box } from '@mui/material';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import type { TextFieldProps } from '@mui/material/TextField';
import { styled, useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import icArrowLeft from '@images/ic-arrow-left.svg?inline';
import icArrowRight from '@images/ic-arrow-right.svg?inline';

export interface EtsDatePickerProps extends Omit<DatePickerProps<Dayjs>, 'renderInput'> {
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 너비 */
  width?: string | number;
  /** 읽기전용 */
  readOnly?: boolean;
  /** 날짜 포맷 */
  format?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 헬퍼 텍스트 */
  helperText?: string;
  /** TextField props */
  textFieldProps?: Omit<TextFieldProps, 'value' | 'onChange'>;
  /** DatePicker 타입 - responsive(자동), desktop, mobile, static 중 선택 */
  variant?: 'responsive' | 'desktop' | 'mobile' | 'static';
  /** 모달 방향 - portrait, landscape 중 선택 */
  orientation?: 'portrait' | 'landscape';
  /** 지원하는 뷰 - day, month, year */
  views?: Array<'day' | 'month' | 'year'>;
  /** 기본으로 열리는 뷰 */
  openTo?: 'day' | 'month' | 'year';
  /** 연도 순서 - asc(오름차순), desc(내림차순) */
  yearsOrder?: 'asc' | 'desc';
  /** 값 초기화 버튼 표시 여부 */
  clearable?: boolean;
  /** 오늘 날짜로 빠른 설정 버튼 표시 여부 */
  showTodayButton?: boolean;
  /** 커스텀 액션 버튼 */
  actionBar?: boolean;
  /** 데스크탑 모드 미디어 쿼리 커스터마이징 */
  desktopModeMediaQuery?: string;
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'isReadOnly' && prop !== 'ownerState',
})<{ isReadOnly?: boolean }>(({ isReadOnly, theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '36px !important',
    minHeight: '36px !important',
    maxHeight: '36px !important',
    boxSizing: 'border-box',
    borderRadius: 'var(--radius-sm, 8px)',
    backgroundColor: isReadOnly
      ? theme.palette.action.disabledBackground
      : theme.palette.mode === 'light'
        ? '#FFFFFF'
        : theme.palette.background.paper,
    fontSize: 'var(--font-size-label-md, 14px)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontFamily: '"Hanjin Group Sans"',
    lineHeight: '130%',
    '& fieldset': {
      border: `1px solid ${theme.palette.divider}`,
    },
    // 요구: hover일 때만 테마색, focus는 기본 divider 유지 (Autocomplete와 일관)
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.divider,
      borderWidth: '1px',
    },
    '&.Mui-error fieldset': {
      borderColor: '#ef4444',
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      '& fieldset': {
        border: `1px solid ${theme.palette.divider}`,
      },
    },
  },
  '& .MuiOutlinedInput-input': {
    fontFamily: '"Hanjin Group Sans"',
    fontSize: 'var(--font-size-label-md, 14px)',
    fontWeight: 'var(--font-weight-regular, 400)',
    lineHeight: '130%',
    padding: '7px 12px',
    height: '20px !important',
    color: theme.palette.text.primary,
    '&.Mui-disabled': {
      color: 'var(--color-text-disabled, #A4A4A4)',
      WebkitTextFillColor: 'var(--color-text-disabled, #A4A4A4)',
    },
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: 'var(--font-size-label-md, 14px)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontFamily: '"Hanjin Group Sans"',
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.secondary,
    },
    '&.Mui-error': {
      color: '#ef4444',
    },
  },

  '& .MuiInputAdornment-root': {
    '& .MuiIconButton-root': {
      //   padding: '4px',
      // marginRight: '0px', // 외부 테두리와 12px gap
      '& svg': {
        display: 'none', // 기본 아이콘 숨김
      },
      width: '24px',
      height: '24px',
      right: '6px',
      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_916_48137)'%3E%3Cpath d='M20.0777 17.5113L20.5575 16.9681C21.1312 16.3156 21.4333 15.5642 21.4333 14.8001V7.80877C21.4333 6.94818 20.7352 6.25007 19.8746 6.25007H17.76V4.4375H16.4044V6.25007H7.59539V4.4375H6.23977V6.25007H4.12511C3.26452 6.25007 2.56641 6.94818 2.56641 7.80877V18.0064C2.56641 18.8669 3.26452 19.5651 4.12511 19.5651L18.6764 19.56C19.4202 19.5448 20.1488 19.2452 20.786 18.6867L21.3293 18.2069H4.12511C4.01341 18.2094 3.92202 18.1206 3.92202 18.0064V11.4237H20.0777V17.5113ZM3.92202 10.0681V7.80623C3.92202 7.69453 4.01341 7.60314 4.12511 7.60314H6.23977V8.83437H7.59539V7.60314H16.4044V8.83437H17.76V7.60314H19.8746C19.9863 7.60314 20.0777 7.69453 20.0777 7.80623V10.0681H3.92202Z' fill='%23252525'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_916_48137'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '24px 24px',
      filter: theme.palette.mode === 'dark' ? 'invert(1) brightness(2)' : 'none',
      '&:hover': {
        backgroundColor: isReadOnly ? 'transparent' : theme.palette.action.hover,
      },
      '&.Mui-disabled': {
        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_916_48137)'%3E%3Cpath d='M20.0777 17.5113L20.5575 16.9681C21.1312 16.3156 21.4333 15.5642 21.4333 14.8001V7.80877C21.4333 6.94818 20.7352 6.25007 19.8746 6.25007H17.76V4.4375H16.4044V6.25007H7.59539V4.4375H6.23977V6.25007H4.12511C3.26452 6.25007 2.56641 6.94818 2.56641 7.80877V18.0064C2.56641 18.8669 3.26452 19.5651 4.12511 19.5651L18.6764 19.56C19.4202 19.5448 20.1488 19.2452 20.786 18.6867L21.3293 18.2069H4.12511C4.01341 18.2094 3.92202 18.1206 3.92202 18.0064V11.4237H20.0777V17.5113ZM3.92202 10.0681V7.80623C3.92202 7.69453 4.01341 7.60314 4.12511 7.60314H6.23977V8.83437H7.59539V7.60314H16.4044V8.83437H17.76V7.60314H19.8746C19.9863 7.60314 20.0777 7.69453 20.0777 7.80623V10.0681H3.92202Z' fill='%23A4A4A4'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_916_48137'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
      },
      // readonly 상태일 때 disabled와 같은 아이콘 적용
      ...(isReadOnly && {
        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_916_48137)'%3E%3Cpath d='M20.0777 17.5113L20.5575 16.9681C21.1312 16.3156 21.4333 15.5642 21.4333 14.8001V7.80877C21.4333 6.94818 20.7352 6.25007 19.8746 6.25007H17.76V4.4375H16.4044V6.25007H7.59539V4.4375H6.23977V6.25007H4.12511C3.26452 6.25007 2.56641 6.94818 2.56641 7.80877V18.0064C2.56641 18.8669 3.26452 19.5651 4.12511 19.5651L18.6764 19.56C19.4202 19.5448 20.1488 19.2452 20.786 18.6867L21.3293 18.2069H4.12511C4.01341 18.2094 3.92202 18.1206 3.92202 18.0064V11.4237H20.0777V17.5113ZM3.92202 10.0681V7.80623C3.92202 7.69453 4.01341 7.60314 4.12511 7.60314H6.23977V8.83437H7.59539V7.60314H16.4044V8.83437H17.76V7.60314H19.8746C19.9863 7.60314 20.0777 7.69453 20.0777 7.80623V10.0681H3.92202Z' fill='%23A4A4A4'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_916_48137'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
        pointerEvents: 'none', // readonly일 때 클릭 비활성화
      }),
    },
  },
}));

// 모달 스타일링
const StyledModalPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px !important',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 6px 24px rgba(0,0,0,0.6) !important'
      : '0 4px 20px rgba(0, 0, 0, 0.15) !important',
  overflow: 'hidden !important',
  backgroundColor: `${theme.palette.mode === 'dark' ? '#141A21' : theme.palette.background.paper} !important`,
  position: 'relative',

  // 전체 캘린더 컨테이너 - 스크롤 방지를 위한 고정 높이
  '& .MuiDateCalendar-root': {
    overflow: 'hidden',
    '& .MuiPickersSlideTransition-root': {
      height: '220px',
      minHeight: '220px',
      maxHeight: '220px',
      overflow: 'hidden',
      '& > div': {
        overflow: 'hidden',
      },
    },
  },

  // 커스텀 헤더가 적용되므로 기본 헤더 스타일은 제거

  // 요일 헤더 스타일링 - 일요일 빨간색
  '& .MuiDayCalendar-weekDayLabel': {
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: '"Hanjin Group Sans"',
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'var(--color-text-secondary, #666666)',
    '&:first-of-type': {
      color: '#FF0000 !important', // 일요일(S)를 빨간색으로
    },
  },

  // 달력 본체 영역 - 고정 높이로 스크롤 방지
  '& .MuiDayCalendar-root': {
    height: '220px',
    minHeight: '220px',
    maxHeight: '220px',
    overflow: 'hidden',
  },

  // 달력 날짜 스타일링 - 일요일 컬럼 빨간색
  '& .MuiPickersDay-root': {
    fontSize: '14px',
    fontFamily: '"Hanjin Group Sans"',
    color: theme.palette.text.primary,
    width: '36px',
    height: '36px',
    margin: '2px',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: '#fff',
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main} !important`,
      },
    },
    '&.MuiPickersDay-today': {
      border: `1px solid ${theme.palette.primary.main} !important`,
      boxSizing: 'border-box !important',
      '&:not(.Mui-selected)': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
      },
    },
  },

  // 일요일 날짜 스타일링을 위한 nth-of-type 사용
  '& .MuiDayCalendar-weekContainer .MuiPickersDay-root:first-of-type': {
    color: '#FF0000 !important',
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: '#fff !important',
    },
    '&.MuiPickersDay-today:not(.Mui-selected)': {
      color: '#FF0000 !important',
      border: `1px solid ${theme.palette.primary.main} !important`,
      boxSizing: 'border-box !important',
    },
    '&.Mui-disabled': {
      color: 'rgba(255, 0, 0, 0.38) !important', // 일요일 비활성화 시 연한 빨간색
    },
  },

  // 년도/월 선택 스타일링
  '& .MuiPickersYear-yearButton, & .MuiPickersMonth-monthButton': {
    fontSize: '14px',
    fontFamily: '"Hanjin Group Sans"',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: '#fff',
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main} !important`,
      },
    },
  },
}));

// 데스크탑 팝오버 스타일링
const StyledPopperPaper = styled(Paper)(({ theme }) => ({
  marginTop: '8px !important',
  borderRadius: '12px !important',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 6px 24px rgba(0,0,0,0.6) !important'
      : '0 4px 20px rgba(0, 0, 0, 0.15) !important',
  overflow: 'hidden !important',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: `${theme.palette.mode === 'dark' ? '#141A21' : theme.palette.background.paper} !important`,
  position: 'relative',

  // 달력 컨테이너
  '& .MuiDayCalendar-header': {
    paddingLeft: '16px',
    paddingRight: '16px',
  },

  // 커스텀 헤더가 적용되므로 기본 헤더 스타일은 제거

  // 요일 헤더 스타일링 - 일요일 빨간색
  '& .MuiDayCalendar-weekDayLabel': {
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: '"Hanjin Group Sans"',
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'var(--color-text-secondary, #666666)',
    '&:first-of-type': {
      color: '#FF0000 !important', // 일요일(S)를 빨간색으로
    },
  },

  // 달력 날짜 스타일링 - 일요일 컬럼 빨간색
  '& .MuiPickersDay-root': {
    fontSize: '14px',
    fontFamily: '"Hanjin Group Sans"',
    color: theme.palette.text.primary,
    width: '36px',
    height: '36px',
    margin: '2px',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: '#fff',
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main} !important`,
      },
    },
    '&.MuiPickersDay-today': {
      border: `1px solid ${theme.palette.primary.main} !important`,
      boxSizing: 'border-box !important',
      '&:not(.Mui-selected)': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
      },
    },
  },

  // 일요일 날짜 스타일링을 위한 nth-of-type 사용
  '& .MuiDayCalendar-weekContainer .MuiPickersDay-root:first-of-type': {
    color: '#FF0000 !important',
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: '#fff !important',
    },
    '&.MuiPickersDay-today:not(.Mui-selected)': {
      color: '#FF0000 !important',
      border: `1px solid ${theme.palette.primary.main} !important`,
      boxSizing: 'border-box !important',
    },
    '&.Mui-disabled': {
      color: 'rgba(255, 0, 0, 0.38) !important', // 일요일 비활성화 시 연한 빨간색
    },
  },

  '& .MuiPickersYear-yearButton, & .MuiPickersMonth-monthButton': {
    fontSize: '14px',
    fontFamily: '"Hanjin Group Sans"',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: '#fff',
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main} !important`,
      },
    },
  },
}));

// 액션 버튼 스타일링 - 하단 라인 제거 및 DOM props 필터링
const StyledActionBar = styled(Box, {
  shouldForwardProp: (prop) =>
    !['onAccept', 'onClear', 'onCancel', 'onSetToday', 'actions', 'ownerState'].includes(
      prop as string
    ),
})(({ theme }) => ({
  padding: '12px 16px',
  borderTop: 'none', // 거슬리는 라인 제거
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  '& .MuiButton-root': {
    fontFamily: '"Hanjin Group Sans"',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '6px',
    padding: '6px 16px',
    minWidth: 'auto',

    '&.MuiButton-text': {
      color: theme.palette.text.secondary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },

    '&.MuiButton-contained': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        boxShadow: '0 2px 8px rgba(5, 23, 102, 0.3)',
      },
    },
  },
}));
// textField 컴포넌트를 분리 - 렌더링마다 재생성되지 않도록
const CustomTextField = React.forwardRef<HTMLInputElement, any>((params, forwardedRef) => {
  const isReadOnly = params.inputProps?.readOnly || false;
  return <StyledTextField {...params} ref={forwardedRef} isReadOnly={isReadOnly} />;
});

CustomTextField.displayName = 'CustomTextField';

// 커스텀 캘린더 헤더 - (화살표) 2025.09 (화살표) 형식
const CustomCalendarHeader = React.forwardRef<any, any>((props, ref) => {
  const { currentMonth, onMonthChange, onViewChange } = props;
  const theme = useTheme();

  // currentMonth가 없으면 헤더를 렌더링하지 않음
  if (!currentMonth || !onMonthChange) {
    return null;
  }

  // dayjs를 사용해서 YYYY.MM 형태로 포맷
  const year = dayjs(currentMonth).format('YYYY');
  const month = dayjs(currentMonth).format('MM');

  const handlePreviousMonth = () => {
    onMonthChange(dayjs(currentMonth).subtract(1, 'month'), 'right');
  };

  const handleNextMonth = () => {
    onMonthChange(dayjs(currentMonth).add(1, 'month'), 'left');
  };

  const handleYearClick = () => {
    if (onViewChange) {
      onViewChange('year');
    }
  };

  const handleMonthClick = () => {
    if (onViewChange) {
      onViewChange('month');
    }
  };

  return (
    <div
      ref={ref}
      className="MuiPickersCalendarHeader-root"
      style={{
        backgroundColor: theme.palette.mode === 'dark' ? '#141A21' : '#FFFFFF',
        padding: '32px 44px 16px 44px',
        margin: '0',
        borderBottom: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 이전 월 버튼 */}
      <button
        type="button"
        onClick={handlePreviousMonth}
        style={{
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '4px',
          backgroundImage: `url("${icArrowLeft}")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '24px 24px',
          width: '28px',
          height: '28px',
          filter: theme.palette.mode === 'dark' ? 'invert(1) brightness(2)' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <span style={{ visibility: 'hidden' }}>Previous</span>
      </button>

      {/* 날짜 표시 - 클릭 가능 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',

          fontSize: '16px',
          fontWeight: '600',
          fontFamily: '"Hanjin Group Sans"',
          color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'var(--color-text-base, #252525)',
        }}
      >
        <button
          type="button"
          onClick={handleYearClick}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: '"Hanjin Group Sans"',
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'var(--color-text-base, #252525)',
            // padding: '4px 8px',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {year}
        </button>
        <span>.</span>
        <button
          type="button"
          onClick={handleMonthClick}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: '"Hanjin Group Sans"',
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'var(--color-text-base, #252525)',
            // padding: '4px 8px',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {month}
        </button>
      </div>

      {/* 다음 월 버튼 */}
      <button
        type="button"
        onClick={handleNextMonth}
        style={{
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '4px',
          backgroundImage: `url("${icArrowRight}")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '24px 24px',
          width: '28px',
          height: '28px',
          filter: theme.palette.mode === 'dark' ? 'invert(1) brightness(2)' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <span style={{ visibility: 'hidden' }}>Next</span>
      </button>
    </div>
  );
});

CustomCalendarHeader.displayName = 'CustomCalendarHeader';

const EtsDatePicker = React.forwardRef<HTMLInputElement, EtsDatePickerProps>(
  (
    {
      placeholder = '날짜를 선택하세요',
      width,
      readOnly,
      format = 'YYYY.MM.DD',
      error,
      helperText,
      textFieldProps,
      variant = 'responsive',
      orientation = 'portrait',
      views = ['year', 'month', 'day'],
      openTo = 'day',
      yearsOrder = 'asc',
      clearable = false,
      showTodayButton = false,
      actionBar = true,
      desktopModeMediaQuery,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    // 기본 미디어 쿼리: 포인터가 fine한 경우 데스크탑 모드
    const defaultDesktopQuery = '@media (pointer: fine)';

    // dayjs 영어 로케일 설정 - 요일을 S M T W T F S로 표시
    dayjs.locale('en');

    // 공통 props 설정
    const commonProps = {
      ...props,
      ref,
      format,
      views,
      openTo,
      yearsOrder,
      open: readOnly ? false : props.open, // readonly일 때 달력 열림 비활성화
      onOpen: readOnly ? undefined : props.onOpen, // readonly일 때 onOpen 이벤트 무시
      slotProps: {
        ...props.slotProps,
        textField: {
          placeholder,
          error,
          helperText,
          sx: {
            width: width || '200px',
            ...textFieldProps?.sx,
          },
          inputProps: {
            readOnly: readOnly,
            ...textFieldProps?.inputProps,
          },
          ...textFieldProps,
        },
        // 모바일 모달 스타일링
        mobilePaper: {
          ...props.slotProps?.mobilePaper,
          component: StyledModalPaper,
        },
        // 데스크탑 팝오버 스타일링
        desktopPaper: {
          ...props.slotProps?.desktopPaper,
          component: StyledPopperPaper,
        },
        // 정적 모드용 스타일링
        layout: {
          ...props.slotProps?.layout,
          sx: {
            backgroundColor:
              theme.palette.mode === 'dark' ? '#141A21' : theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px',
            overflow: 'hidden !important',
            position: 'relative',

            '& .MuiDateCalendar-root': {
              overflow: 'hidden',
              '& .MuiPickersSlideTransition-root': {
                height: '220px',
                minHeight: '220px',
                maxHeight: '220px',
                overflow: 'hidden',
              },
            },

            '& .MuiDayCalendar-weekDayLabel': {
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: '"Hanjin Group Sans"',
              color:
                theme.palette.mode === 'dark' ? '#FFFFFF' : 'var(--color-text-secondary, #666666)',
              '&:first-of-type': {
                color: '#FF0000 !important',
              },
            },

            // 달력 날짜 스타일링
            '& .MuiPickersDay-root': {
              fontSize: '14px',
              fontFamily: '"Hanjin Group Sans"',
              color: theme.palette.text.primary,
              '&.MuiPickersDay-today': {
                border: `1px solid ${theme.palette.primary.main} !important`,
                boxSizing: 'border-box !important',
                '&:not(.Mui-selected)': {
                  backgroundColor: 'transparent',
                  color: theme.palette.primary.main,
                },
              },
            },

            // 일요일 날짜 스타일링
            '& .MuiDayCalendar-weekContainer .MuiPickersDay-root:first-of-type': {
              color: '#FF0000 !important',
              '&.Mui-selected': {
                backgroundColor: `${theme.palette.primary.main} !important`,
                color: '#fff !important',
              },
              '&.MuiPickersDay-today:not(.Mui-selected)': {
                color: '#FF0000 !important',
                border: `1px solid ${theme.palette.primary.main} !important`,
                boxSizing: 'border-box !important',
              },
              '&.Mui-disabled': {
                color: 'rgba(255, 0, 0, 0.38) !important', // 일요일 비활성화 시 연한 빨간색
              },
            },

            ...props.slotProps?.layout?.sx,
          } as any,
        },
        // 액션 버튼 설정 (기본값 사용)
      },
      slots: {
        textField: CustomTextField,
        calendarHeader: CustomCalendarHeader,
        ...(actionBar && { actionBar: StyledActionBar }),
        ...props.slots,
      },
    };

    // variant에 따른 컴포넌트 렌더링
    const renderDatePicker = () => {
      switch (variant) {
        case 'desktop':
          return <DesktopDatePicker {...commonProps} />;
        case 'mobile':
          return <MobileDatePicker {...commonProps} orientation={orientation} />;
        case 'static':
          return (
            <Box
              sx={{
                display: 'inline-block',
                border: '1px solid var(--color-border-base, #D9D9D9)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <StaticDatePicker {...commonProps} orientation={orientation} />
            </Box>
          );
        case 'responsive':
        default:
          return (
            <DatePicker
              {...commonProps}
              desktopModeMediaQuery={desktopModeMediaQuery || defaultDesktopQuery}
              orientation={orientation}
            />
          );
      }
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        {renderDatePicker()}
      </LocalizationProvider>
    );
  }
);

EtsDatePicker.displayName = 'EtsDatePicker';

export default EtsDatePicker;
