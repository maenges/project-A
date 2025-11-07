import React, { useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';

export interface EtsFileUploadProps {
  onChange: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  sx?: object;
}

const EtsFileUpload: React.FC<EtsFileUploadProps> = ({
  onChange,
  accept,
  multiple = false,
  label = '파일 선택',
  sx = {},
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [fileNames, setFileNames] = React.useState<string[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (files) {
      setFileNames(Array.from(files).map((f) => f.name));
    } else {
      setFileNames([]);
    }
    onChange(files);
  };

  return (
    <Box
      sx={{
        border: dragActive ? '2px solid #1976d2' : '2px dashed #bdbdbd',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        background: dragActive ? '#e3f2fd' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.2s',
        ...sx,
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        variant="contained"
        sx={{ mb: 1 }}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        {label}
      </Button>
      <Typography variant="body2" color="textSecondary">
        {multiple ? '여러 파일을 선택하거나 드래그하세요.' : '파일을 선택하거나 드래그하세요.'}
      </Typography>
      {fileNames.length > 0 && (
        <Box mt={2}>
          {fileNames.map((name, idx) => (
            <Typography key={idx} variant="body2">
              {name}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EtsFileUpload;
