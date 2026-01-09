import React from 'react';
import { styled } from '@mui/material/styles';
import checkedSvg from '@/assets/images/checked.svg';
import checkSvg from '@/assets/images/check.svg';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

export interface EtsCheckButtonProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  checkedLabel?: string;
  uncheckedLabel?: string;
  readOnly?: boolean;
}

const StyledCheckButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isChecked' && prop !== 'isReadOnly',
})<{
  isChecked?: boolean;
  isReadOnly?: boolean;
}>(({ theme, isChecked, isReadOnly }) => ({
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
  lineHeight: '150%',
  '&:hover, &:focus-visible': isReadOnly
    ? { boxShadow: 'none' }
    : {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
      },

  ...(isChecked
    ? {
        borderColor: theme.palette.primary.main,
        color: 'var(--color-text-label, #000)',
        fontWeight: 700,
        '& .check-icon': {
          filter: 'brightness(0) saturate(100%)',
        },
      }
    : {
        color: 'var(--color-text-body-secondary, #5E5E5E)',
        fontWeight: 400,
        '& .check-icon': {},
      }),

  ...(isReadOnly && {
    cursor: 'not-allowed',
    opacity: 1,
  }),
}));

export const EtsCheckButton = React.forwardRef<HTMLButtonElement, EtsCheckButtonProps>(
  (
    { checked = false, onChange, label, checkedLabel, uncheckedLabel, readOnly = false, ...props },
    ref
  ) => {
    const handleClick = () => {
      if (readOnly || !onChange) return;
      onChange(!checked);
    };

    const resolvedLabel =
      label ?? (checked ? (checkedLabel ?? '승인') : (uncheckedLabel ?? '대기'));

    return (
      <StyledCheckButton
        ref={ref}
        isChecked={checked}
        isReadOnly={readOnly}
        onClick={handleClick}
        disabled={readOnly}
        aria-disabled={readOnly}
        type="button"
        {...props}
      >
        <img src={checked ? checkedSvg : checkSvg} alt="check" className="check-icon" />
        <Box sx={{ marginRight: '5px' }}>{resolvedLabel}</Box>
      </StyledCheckButton>
    );
  }
);

EtsCheckButton.displayName = 'EtsCheckButton';

export default EtsCheckButton;
