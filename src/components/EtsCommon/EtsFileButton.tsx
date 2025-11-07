import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';
import uploadSvg from '@images/upload.svg';
import deleteSvg from '@images/delete.svg';

export interface EtsFileButtonProps extends IconButtonProps {
  hasFile?: boolean;
  readOnly?: boolean;
}

export const EtsFileButton = React.forwardRef<HTMLButtonElement, EtsFileButtonProps>(
  ({ hasFile = false, readOnly = false, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (readOnly) return;
      onClick?.(e);
    };

    return (
      <IconButton
        ref={ref}
        size="small"
        onClick={handleClick}
        disabled={readOnly}
        aria-label={hasFile ? 'delete file' : 'upload file'}
        {...props}
      >
        {hasFile ? (
          <img src={deleteSvg} alt="delete" style={{ width: '22px', height: '22px' }} />
        ) : (
          <img src={uploadSvg} alt="upload" style={{ width: '22px', height: '22px' }} />
        )}
      </IconButton>
    );
  }
);

EtsFileButton.displayName = 'EtsFileButton';

export default EtsFileButton;
