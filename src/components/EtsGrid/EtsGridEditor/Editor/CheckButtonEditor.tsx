import { ICellEditorParams } from 'ag-grid-community';
import { useEffect } from 'react';
import { EtsCheckButton, EtsCheckButtonProps } from '../../../EtsCommon/EtsCheckButton';

export interface EtsCheckButtonEditorProps {
  checkButtonProps?: Omit<EtsCheckButtonProps, 'checked' | 'onChange'>;
  value?: any;
  onValueChange?: (value: any) => void;
  stopEditing?: () => void;
}
CheckButtonEditor;
export default function CheckButtonEditor(props: ICellEditorParams & EtsCheckButtonEditorProps) {
  const { checkButtonProps, onValueChange } = props;
  const isChecked = Boolean(props.value);

  useEffect(() => {
    (onValueChange || props.onValueChange)?.(!isChecked);
  }, []);

  const handleChange = (checked: boolean) => {
    (onValueChange || props.onValueChange)?.(checked);
  };

  return <EtsCheckButton checked={isChecked} onChange={handleChange} {...checkButtonProps} />;
}
