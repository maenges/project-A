import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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

  // 기본 스타일: 라이트 모드 -> 흰 배경 + 검은 테두리/텍스트, 다크 모드 -> 흰 배경 + 테두리 제거 + 검은 텍스트
  const baseStyle = {
    width: 'auto',
    height: '36px',
    padding: '9.5px 12px',
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
    fontFamily: 'Hanjin Group Sans, sans-serif',
    fontStyle: 'normal',
    lineHeight: '150%',
    boxShadow: 'none',
    '&:hover': {
      background: '#FFFFFF',
      filter: 'brightness(0.95)',
    },
    // pressed (누를때)
    '&:active': { backgroundColor: '#051766 !important', color: '#FFFFFF !important' },
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
