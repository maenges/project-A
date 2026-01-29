import React, { useMemo } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import EtsModal from '@/components/EtsCommon/EtsModal';
import { useNotifyStore } from '@/store/notifyStore';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NotifyProviderProps {
  children: React.ReactNode;
  providerId?: string;
}

const NotifyProvider: React.FC<NotifyProviderProps> = ({ children, providerId }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { stack } = useNotifyStore();
  const item = useMemo(() => stack[0], [stack]);

  const handleConfirm = () => {
    item?.close(true);
  };

  const handleCancel = () => {
    item?.close(false);
  };

  return (
    <>
      {children}

      <ToastContainer
        containerId={providerId || 'notify-root'}
        position="bottom-center"
        className="ets-notify-toast"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
        theme={theme.palette.mode}
        transition={Slide}
        toastClassName="ets-toast-item"
      />

      {item && (
        <EtsModal
          open={true}
          onClose={handleCancel}
          disableScrollLock
          size={item.size === 'LG' ? 'md' : item.size === 'MD' ? 'sm' : 'xs'}
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: 'background.paper',
              backgroundImage: isDark
                ? `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(
                    theme.palette.background.paper,
                    1
                  )} 70%)`
                : `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(
                    theme.palette.background.paper,
                    1
                  )} 75%)`,
              color: 'text.primary',
              boxShadow: theme.shadows[6],
              border: isDark
                ? `1px solid ${alpha(theme.palette.primary.main, 0.25)}`
                : `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            },
          }}
        >
          <EtsModal.Header onClose={handleCancel}>{item.title}</EtsModal.Header>
          <EtsModal.Body>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={80}>
              <Typography
                variant="subtitle1"
                align="center"
                sx={{
                  whiteSpace: 'pre-wrap',
                  color: 'text.primary',
                }}
              >
                {item.message}
              </Typography>
            </Box>
          </EtsModal.Body>
          <EtsModal.Footer>
            {item.type === 'confirm' ? (
              <>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    minWidth: 100,
                    borderRadius: 8,
                    fontWeight: 700,
                    borderColor: isDark
                      ? alpha(theme.palette.common.white, 0.22)
                      : alpha(theme.palette.primary.main, 0.45),
                    color: isDark ? theme.palette.text.primary : theme.palette.primary.dark,
                    '&:hover': {
                      borderColor: isDark
                        ? alpha(theme.palette.common.white, 0.32)
                        : theme.palette.primary.main,
                      backgroundColor: isDark
                        ? alpha(theme.palette.common.white, 0.06)
                        : alpha(theme.palette.primary.main, 0.06),
                    },
                  }}
                >
                  취소
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirm}
                  sx={{
                    minWidth: 100,
                    borderRadius: 8,
                    fontWeight: 700,
                    backgroundColor: isDark
                      ? theme.palette.primary.dark
                      : theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      filter: isDark ? 'brightness(0.92)' : 'none',
                    },
                  }}
                >
                  확인
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={handleConfirm}
                sx={{
                  minWidth: 100,
                  borderRadius: 8,
                  fontWeight: 700,
                  backgroundColor: isDark ? theme.palette.primary.dark : theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    filter: isDark ? 'brightness(0.92)' : 'none',
                  },
                }}
              >
                확인
              </Button>
            )}
          </EtsModal.Footer>
        </EtsModal>
      )}
    </>
  );
};

export default NotifyProvider;
