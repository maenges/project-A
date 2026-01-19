import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  DialogProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { alpha, useTheme } from '@mui/material/styles';

export interface EtsModalProps extends Omit<DialogProps, 'open'> {
  open: boolean;
  onClose?: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
}

interface ModalHeaderProps {
  children?: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
}

interface ModalBodyProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

interface ModalFooterProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const EtsModal: React.FC<EtsModalProps> & {
  Header: React.FC<ModalHeaderProps>;
  Body: React.FC<ModalBodyProps>;
  Footer: React.FC<ModalFooterProps>;
} = ({
  children,
  open,
  onClose,
  size = 'sm',
  showCloseButton = true,
  disableBackdropClick = false,
  ...dialogProps
}) => {
  const handleClose = (_event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    onClose?.();
  };

  const isStandardSize = ['xs', 'sm', 'md', 'lg', 'xl'].includes(size as string);

  const getCustomWidth = () => {
    if (typeof size === 'number') {
      return `${size}px`;
    }
    return size;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={isStandardSize ? (size as 'xs' | 'sm' | 'md' | 'lg' | 'xl') : false}
      fullWidth={isStandardSize}
      sx={!isStandardSize ? { '& .MuiDialog-paper': { width: getCustomWidth() } } : {}}
      {...dialogProps}
    >
      {children}
    </Dialog>
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ children, onClose, showCloseButton = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <DialogTitle
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: children ? 2 : 0,
        pt: 2,
        px: 2,
      }}
    >
      {children && <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>{children}</Typography>}
      {showCloseButton && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            ml: 'auto',
            padding: 0,
            width: 28,
            height: 28,
            borderRadius: 2,
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.08),
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 22 }} />
        </IconButton>
      )}
    </DialogTitle>
  );
};

const ModalBody: React.FC<ModalBodyProps> = ({ children, style }) => {
  return (
    <DialogContent
      sx={{
        pt: 0,
        pb: 3,
        px: 4,
        ...style,
      }}
    >
      {children}
    </DialogContent>
  );
};

const ModalFooter: React.FC<ModalFooterProps> = ({ children, style }) => {
  return (
    <DialogActions
      sx={{
        justifyContent: 'flex-end',
        pt: 0,
        px: 4,
        pb: 3,
        ...style,
      }}
    >
      {children}
    </DialogActions>
  );
};

EtsModal.Header = ModalHeader;
EtsModal.Body = ModalBody;
EtsModal.Footer = ModalFooter;

export default EtsModal;
