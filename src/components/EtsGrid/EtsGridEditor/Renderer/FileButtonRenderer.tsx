import { ICellRendererParams } from 'ag-grid-community';
import { styled } from '@mui/material/styles';
import { EtsFileButton, EtsFileButtonProps } from '../../../EtsCommon/EtsFileButton';

const FileButtonRendererLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
});

export interface EtsFileButtonRendererProps {
  fileButtonProps?: Omit<EtsFileButtonProps, 'hasFile' | 'onClick'>;
  hasFile?: (rowData: any) => boolean;
}

const FileButtonRenderer = (props: ICellRendererParams & EtsFileButtonRendererProps) => {
  const hasFile = props.hasFile ? props.hasFile(props.data) : Boolean(props.value);

  const handleClick = () => {
    // Renderer는 편집을 시작하는 역할만 합니다.
    props.api.startEditingCell({
      rowIndex: props.node.rowIndex ?? 0,
      colKey: props.colDef?.field ?? '',
    });
  };

  return (
    <FileButtonRendererLayout>
      <EtsFileButton hasFile={hasFile} onClick={handleClick} {...props.fileButtonProps} />
    </FileButtonRendererLayout>
  );
};

export default FileButtonRenderer;
