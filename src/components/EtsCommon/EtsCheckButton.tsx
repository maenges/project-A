import React from 'react';
import { styled } from '@mui/material/styles';
import checkedSvg from '@/assets/images/checked.svg';
import checkSvg from '@/assets/images/check.svg';
import { Box } from '@mui/material';

export interface EtsCheckButtonProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  readOnly?: boolean;
}

const StyledCheckButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isChecked' && prop !== 'isReadOnly',
})<{
  isChecked?: boolean;
  isReadOnly?: boolean;
}>(({ isChecked, isReadOnly }) => ({
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
  fontFamily: 'var(--font-family-hanjingroup-sans, "Hanjin Group Sans")',
  whiteSpace: 'nowrap',
  outline: 'none',

  ...(isChecked
    ? {
        border: '2px solid var(--color-border-tertiary, #D9D9D9)',
        background: 'var(--color-fill-interaction-pressed-ghost, #E6E7EF)',
        color: 'var(--color-text-label, #051766)',
        fontSize: '12px',
        fontWeight: 700,
        lineHeight: '150%',
        '& .check-icon': {
          filter:
            'brightness(0) saturate(100%) invert(11%) sepia(52%) saturate(4893%) hue-rotate(225deg) brightness(88%) contrast(102%)',
        },
      }
    : {
        border: '2px solid var(--color-border-tertiary, #D9D9D9)',
        background: 'var(--color-fill-interaction-form, #FFF)',
        color: 'var(--color-text-body-secondary, #5E5E5E)',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '150%',
        '& .check-icon': {},
        '&:hover, &:focus-visible': {
          boxShadow: '0 0 0 1px #051766',
        },
      }),

  ...(isReadOnly && {
    background: 'var(--color-fill-interaction-disabled, #D9D9D9)',
    cursor: 'not-allowed',
    color: 'var(--color-text-body-secondary, #5E5E5E)',
    '&:hover, &:focus-visible': {
      boxShadow: 'none',
    },
    '& .check-icon': {
      filter: 'none',
    },
  }),
}));

export const EtsCheckButton = React.forwardRef<HTMLButtonElement, EtsCheckButtonProps>(
  ({ checked = false, onChange, label, readOnly = false, ...props }, ref) => {
    const handleClick = () => {
      if (readOnly || !onChange) return;
      onChange(!checked);
    };

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
        <Box sx={{ marginRight: '5px' }}>{label || (checked ? 'Checked' : 'Check')}</Box>
      </StyledCheckButton>
    );
  }
);

EtsCheckButton.displayName = 'EtsCheckButton';

export default EtsCheckButton;
