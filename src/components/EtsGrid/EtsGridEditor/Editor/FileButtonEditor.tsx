import { ICellEditorParams } from 'ag-grid-community';
import { styled } from '@mui/material/styles';
import { EtsFileButton, EtsFileButtonProps } from '../../../EtsCommon/EtsFileButton';
import { forwardRef, useImperativeHandle, useEffect } from 'react';

const FileButtonEditorLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
});

export interface EtsFileButtonEditorProps {
  fileButtonProps?: Omit<EtsFileButtonProps, 'hasFile' | 'onClick'>;
  uploadProps?: { accept?: string };
  onUpload?: (file: File) => void;
  onDelete?: () => void;
  hasFile?: (rowData: any) => boolean;
}

const FileButtonEditor = forwardRef((props: ICellEditorParams & EtsFileButtonEditorProps, ref) => {
  const hasFile = props.hasFile ? props.hasFile(props.data) : Boolean(props.value);

  useImperativeHandle(ref, () => ({
    getValue: () => props.value,
  }));

  useEffect(() => {
    const handleUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      if (props.uploadProps?.accept) {
        input.accept = props.uploadProps.accept;
      }
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file && props.onUpload) {
          props.onUpload(file);
        } else {
          props.stopEditing(true);
        }
      };
      input.addEventListener('cancel', () => props.stopEditing(true));
      input.click();
    };

    const handleDelete = () => {
      if (props.onDelete) {
        props.onDelete();
      }
    };

    if (hasFile) {
      handleDelete();
    } else {
      handleUpload();
    }
  }, []);

  return (
    <FileButtonEditorLayout>
      <EtsFileButton hasFile={hasFile} readOnly {...props.fileButtonProps} />
    </FileButtonEditorLayout>
  );
});

FileButtonEditor.displayName = 'FileButtonEditor';

export default FileButtonEditor;
