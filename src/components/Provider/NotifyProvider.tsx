import React, { useMemo } from 'react';
import { Button, Typography, Box } from '@mui/material';
import EtsModal from '@/components/EtsCommon/EtsModal';
import { useNotifyStore } from '@/store/notifyStore';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NotifyProviderProps {
  children: React.ReactNode;
  providerId?: string;
}

const NotifyProvider: React.FC<NotifyProviderProps> = ({ children, providerId }) => {
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
        theme="light"
        transition={Slide}
        toastClassName="ets-toast-item ets-toast-body"
        // bodyClassName="ets-toast-body"
      />

      {item && (
        <EtsModal
          open={true}
          onClose={handleCancel}
          size={item.size === 'LG' ? 'md' : item.size === 'MD' ? 'sm' : 'xs'}
        >
          <EtsModal.Header onClose={handleCancel}>{item.title}</EtsModal.Header>
          <EtsModal.Body>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={80}>
              <Typography
                variant="subtitle1"
                align="center"
                style={{
                  whiteSpace: 'pre-wrap',
                  color: '#252525',
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
                    border: '1px solid #051766',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirm}
                  sx={{
                    minWidth: 100,
                    borderRadius: 8,
                    fontWeight: 700,
                    border: '1px solid #051766',
                    backgroundColor: '#051766',
                  }}
                >
                  Proceed
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
                  border: '1px solid #051766',
                  backgroundColor: '#051766',
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
