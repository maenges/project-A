import { ICellEditorParams } from 'ag-grid-community';
import EtsCheckBox from '../../../EtsCommon/EtsCheckBox';
import type { EtsCheckBoxProps } from '../../../EtsCommon/EtsCheckBox';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';

const CheckBoxLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  padding: '2px',
});

export interface EtsCheckBoxEditorProps {
  value?: any;
  onValueChange?: (value: any) => void;
  stopEditing?: () => void;
  checkBoxProps?: Omit<EtsCheckBoxProps, 'checked' | 'onChange'>;
}

export default function CheckBoxEditor(props: ICellEditorParams & EtsCheckBoxEditorProps) {
  const { checkBoxProps, onValueChange } = props;
  const isChecked = Boolean(props.value);

  // 처음 에디팅 모드 ON 됐을 시 값 변경
  useEffect(() => {
    (onValueChange || props.onValueChange)?.(!isChecked);
  }, []);

  const handleChange = (checked: boolean) => {
    (onValueChange || props.onValueChange)?.(checked);
    // 편집모드 유지 - 자동으로 종료하지 않음
  };

  return (
    <CheckBoxLayout>
      <EtsCheckBox checked={isChecked} onChange={handleChange} {...checkBoxProps} />
    </CheckBoxLayout>
  );
}
