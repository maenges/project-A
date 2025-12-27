import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

export interface EtsCheckButton2Props {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const StyledCheckButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  height: '32px',
  minWidth: '68px',
  maxWidth: '200px',
  padding: 'var(--size-8, 8px) 10px',
  gap: '2px',
  borderRadius: 'var(--radius-button-sm, 20px)',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  fontFamily: 'var(--font-family-hanjingroup-sans, "Sans")',
  whiteSpace: 'nowrap',
  outline: 'none',
  border:
    theme.palette.mode === 'dark'
      ? '2px solid var(--color-border-tertiary, #FFF)'
      : `2px solid ${alpha(theme.palette.primary.main, 0.35)}`,
  background: 'var(--color-fill-interaction-form, #FFF)',
  fontSize: '12px',
  fontWeight: 700,
  lineHeight: '150%',
  '&:hover, &:focus-visible': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
  '&:disabled': {
    cursor: 'not-allowed',
    background: '#D9D9D9',
    color: '#5E5E5E',
    boxShadow: 'none',
    borderColor: theme.palette.divider,
  },
}));

export const EtsCheckButton2: React.FC<EtsCheckButton2Props> = ({
  label,
  onClick,
  disabled,
  ...props
}) => {
  return (
    <StyledCheckButton
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type="button"
      {...props}
    >
      <Box>{label || 'Checked'}</Box>
    </StyledCheckButton>
  );
};

export default EtsCheckButton2;
