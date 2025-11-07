import { ICellRendererParams } from 'ag-grid-community';
import type { EtsCheckBoxProps } from '../../../EtsCommon/EtsCheckBox';
import EtsCheckBox from '../../../EtsCommon/EtsCheckBox';
import { styled } from '@mui/material/styles';

const CheckBoxLayout = styled('div')<{ isEditable: boolean }>(({ isEditable }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  minHeight: '32px !important',
  maxHeight: '32px !important',
  pointerEvents: isEditable ? 'auto' : 'none',
}));

export interface EtsCheckBoxRendererProps extends ICellRendererParams {
  checkBoxProps?: Omit<EtsCheckBoxProps, 'checked' | 'onChange'>;
}

export default function CheckBoxRenderer(props: EtsCheckBoxRendererProps) {
  const isChecked = Boolean(props.value);

  // editable 상태 확인
  let isEditable = false;
  if (props.colDef) {
    if (typeof props.colDef.editable === 'function') {
      isEditable = props.colDef.editable(props as any);
    } else {
      isEditable = !!props.colDef.editable;
    }
  }

  // disabled나 readonly 조건 확인
  const checkBoxProps = props.checkBoxProps || {};
  const isDisabled = checkBoxProps.disabled;
  const isReadOnly = checkBoxProps.readOnly;

  const handleChange = (checked: boolean) => {
    if (isEditable && !isDisabled && !isReadOnly && props.setValue) {
      // ag-grid의 setValue를 통해 값 직접 변경
      props.setValue(checked);
    }
  };

  return (
    <CheckBoxLayout isEditable={isEditable && !isDisabled && !isReadOnly}>
      <EtsCheckBox
        checked={isChecked}
        // disabled={!isEditable || isDisabled}
        readOnly={!isEditable || isDisabled}
        onChange={isEditable && !isDisabled && !isReadOnly ? handleChange : undefined}
        {...checkBoxProps}
      />
    </CheckBoxLayout>
  );
}
