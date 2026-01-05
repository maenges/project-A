import React from 'react';
import { Button } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

export interface EtsButtonProps {
  children: React.ReactNode;
  variant?: 'outlined' | 'contained';
  onClick?: () => void;
  type: 'outlined' | 'contained' | 'blue' | 'grey' | 'green';
  sx?: object;
  fileName?: string;
  fileUrl?: string;
  fileBlob?: Blob;
  disabled?: boolean;
  className?: string;
}

const EtsButton = ({
  children,
  onClick,
  // type 제거 (현재 요구사항에서는 변형 사용 안 함)
  sx,
  disabled,
  variant,
  className,
}: EtsButtonProps) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const themeActionBg = (muiTheme as any).palette.primary.main;
  // primary.light 토큰이 없어 alpha로 밝기 조정하므로 기존 fallback 변수 제거

  // 기본 스타일: 라이트 모드 -> 흰 배경 + 검은 테두리/텍스트, 다크 모드 -> 흰 배경 + 테두리 제거 + 검은 텍스트
  const baseStyle = {
    width: 'auto',
    minHeight: '36px',
    height: 'auto',
    padding: '8px 12px',
    borderRadius: 999,
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    border: isDark ? 'none' : '1px solid #000000',
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Sans, sans-serif',
    fontStyle: 'normal',
    lineHeight: '1.5',
    boxShadow: 'none',
    whiteSpace: 'nowrap' as const,
    '&:hover': {
      background: '#F7F8FA',
      filter: 'none',
    },
    // pressed (누를때)
    '&:active': {
      // 사용자가 요청한 alpha 적용으로 살짝 연한 톤
      backgroundColor: `${alpha(themeActionBg, 0.2)} !important`,
      color: '#000000 !important',
    },
    '&:focus': { outline: 'none' },
    ...sx,
  } as const;

  // 타입에 따른 추가 변형이 필요하면 여기서 분기 (현재 요구사항은 공통 화이트 스타일이므로 그대로 사용)
  const style = baseStyle;

  const handleClick = (_e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick();
  };

  return (
    <Button
      variant={variant}
      sx={style}
      disabled={disabled}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default EtsButton;
