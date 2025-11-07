import React from 'react';
import { Box } from '@mui/material';

interface ButtonPanelProps {
  buttonComponent: React.ReactNode;
}

const ButtonPanel: React.FC<ButtonPanelProps> = ({ buttonComponent }) => {
  return <Box>{buttonComponent}</Box>;
};

export default ButtonPanel;
