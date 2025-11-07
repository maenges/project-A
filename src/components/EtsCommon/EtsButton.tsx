import React from 'react';
import { Button } from '@mui/material';

export interface EtsButtonProps {
  children: React.ReactNode;
  variant?: 'outlined' | 'contained';
  onClick?: () => void;
  type: 'outlined' | 'contained' | 'blue' | 'grey';
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
  type,
  sx,
  disabled,
  variant,
  className,
}: EtsButtonProps) => {
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
    color: 'var(--color-text-label, ${(props) => props.theme.colors.text.label})',
    textAlign: 'center !important',
    fontFamily: '${(props) => props.theme.fonts.family.primary} !important',
    fontStyle: 'normal !important',
    lineHeight: '150% !important',

    // pressed (누를때)
    '&:active': { backgroundColor: '#051766 !important', color: '#FFFFFF !important' },
    ...sx,
  };

  let style;
  if (type === 'grey') {
    style = {
      ...baseStyle,
      border: '1px solid #A4A4A4',
      background: 'transparent',
      color: '#252525',

      '&:hover': { background: '#e3e6f0' },
      '&:focus': { outline: 'none' },
    };
  } else if (type === 'blue') {
    style = {
      ...baseStyle,
      border: '1px solid #051766',
      background: '#FFFFFF',
      color: '#1a237e',
      padding: '8px 12px',
      '&:hover': { background: '#e3e6f0' },
      '&:focus': { outline: 'none' },
    };
  } else if (type === 'contained') {
    style = {
      minWidth: 100,
      borderRadius: 8,
      fontWeight: 700,
      color: '#051766',
      backgroundColor: '#57BBEB',
      border: 'none',
      '&:hover': { background: '#29b6f6' },
      '&:focus': { outline: 'none' },
    };
  } else if (type === 'outlined') {
    style = {
      minWidth: 100,
      borderRadius: 8,
      fontWeight: 700,
      border: '1px solid #051766',
      background: '#fff',
      color: '#051766',
      '&:hover': { background: '#e3e6f0' },
      '&:focus': { outline: 'none' },
    };
  }

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
