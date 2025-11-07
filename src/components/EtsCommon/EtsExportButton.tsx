import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

export interface EtsExportButtonOption {
  value: string;
  label: string;
  onClick: () => void;
}

export interface EtsExportButtonProps {
  children?: React.ReactNode;
  options: EtsExportButtonOption[];
  disabled?: boolean;
  sx?: object;
}

// Styled Components
const ExportButtonContainer = styled(Box)`
  position: relative;
  display: inline-block;
`;

interface StyledButtonProps {
  $isPressed: boolean;
  $disabled: boolean;
}

const StyledButton = styled(Box)<StyledButtonProps>`
  display: flex;
  min-width: 56px;
  min-height: 36px;
  height: 36px;
  padding: var(--spacing-8, 8px) var(--spacing-12, 12px);
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: var(--radius-full, 9999px);
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  transition: all 0.2s ease;

  ${({ $isPressed, $disabled }) => {
    if ($disabled) {
      return `
        border: 1px solid var(--color-border-base-gray, #A4A4A4);
        background: var(--color-background-base-white, #FFF);
        color: var(--color-text-base, #252525);
        opacity: 0.5;
      `;
    }
    if ($isPressed) {
      return `
        border: 1px solid var(--color-background-primary-darkblue, #051766);
        background: var(--color-background-primary-darkblue, #051766);
        color: white;
      `;
    }
    return `
      border: 1px solid var(--color-border-base-gray, #A4A4A4);
      background: var(--color-background-base-white, #FFF);
      color: var(--color-text-base, #252525);
      &:hover {
        border: 1px solid var(--color-background-primary-darkblue, #051766);
      }
    `;
  }}
`;

const DropdownMenu = styled(Box)`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  display: flex;
  width: 95px;
  padding: var(--spacing-8, 8px) 0;
  flex-direction: column;
  align-items: flex-start;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--color-border-base-gray, #a4a4a4);
  background: var(--color-background-base-white, #fff);
  box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.04);
  z-index: 1000;
`;

const MenuOption = styled(Box)`
  display: flex;
  min-height: 44px;
  padding: var(--spacing-8, 8px) var(--spacing-12, 12px);
  align-items: center;
  align-self: stretch;
  background: var(--color-background-base-white, #fff);
  cursor: pointer;
  transition: background-color 0.2s ease;

  /* Typography 스타일을 MenuOption에서 직접 제어 */
  .export-button-menu-text {
    color: var(--color-text-base, #252525);
    font-family: 'Hanjin Group Sans';
    font-size: var(--font-size-label-md, 14px);
    font-style: normal;
    font-weight: var(--font-weight-regular, 400);
    line-height: 130%; /* 18.2px */
    transition: font-weight 0.2s ease;
  }

  &:hover {
    background: var(--color-background-base-lightblue10, #eef8fd);

    .export-button-menu-text {
      color: var(--color-text-base, #252525);
      font-family: 'Hanjin Group Sans';
      font-size: var(--font-size-label-md, 14px);
      font-style: normal;
      font-weight: var(--font-weight-bold, 700);
      line-height: 130%; /* 18.2px */
    }
  }
`;

const EtsExportButton: React.FC<EtsExportButtonProps> = ({
  children = 'Export',
  options,
  disabled = false,
  sx,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: EtsExportButtonOption) => {
    option.onClick();
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <ExportButtonContainer ref={containerRef} sx={sx}>
      <StyledButton $isPressed={isOpen} $disabled={disabled} onClick={handleButtonClick}>
        <Typography className="export-button-text">{children}</Typography>
      </StyledButton>

      {isOpen && !disabled && (
        <DropdownMenu>
          {options.map((option) => (
            <MenuOption key={option.value} onClick={() => handleOptionClick(option)}>
              <Typography className="export-button-menu-text">{option.label}</Typography>
            </MenuOption>
          ))}
        </DropdownMenu>
      )}
    </ExportButtonContainer>
  );
};

export default EtsExportButton;
