import { ICellRendererParams } from 'ag-grid-community';
import { styled } from '@mui/material/styles';
import EtsCheckBox from '../../../EtsCommon/EtsCheckBox';

const CheckBoxLayout = styled('div')<{ selectable: boolean }>(({ selectable }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  minHeight: '32px !important',
  maxHeight: '32px !important',
  pointerEvents: selectable ? 'auto' : 'none',
}));

export default function SelectionBoxRenderer(props: ICellRendererParams) {
  const node = props.node;
  const api = props.api;

  const isSelected = !!node?.isSelected?.();
  const selectable = node?.selectable !== false; // ag-Grid는 기본 true

  const handleChange = (checked: boolean) => {
    if (!selectable) return;
    // ag-Grid의 선택 상태를 업데이트
    // keepPreviousSelection은 grid 옵션에 따라 동작, 여기서는 기본 동작 사용
    node.setSelected(checked);
    // 선택 변경 시 리렌더 보장
    api?.refreshCells?.({ rowNodes: [node], force: true });
  };

  return (
    <CheckBoxLayout selectable={selectable}>
      <EtsCheckBox
        checked={isSelected}
        readOnly={!selectable}
        width={20}
        height={20}
        onChange={handleChange}
      />
    </CheckBoxLayout>
  );
}
