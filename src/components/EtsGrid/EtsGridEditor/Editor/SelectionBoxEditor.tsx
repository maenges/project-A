import { ICellEditorParams } from 'ag-grid-community';
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import EtsCheckBox from '../../../EtsCommon/EtsCheckBox';

const Layout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
});

export default function SelectionBoxEditor(props: ICellEditorParams) {
  const node = props.node;
  const api = props.api;
  const selectable = node?.selectable !== false;
  const isSelected = !!node?.isSelected?.();

  // 에디터 진입 시 토글(체크박스 클릭으로 진입하는 경우 즉시 반영)
  useEffect(() => {
    if (!selectable) return;
    node.setSelected(!isSelected);
    api?.refreshCells?.({ rowNodes: [node], force: true });
    // 에디터를 즉시 종료해도 되지만, 기존 패턴을 따라 자동 종료하지 않음
  }, []);

  return (
    <Layout>
      <EtsCheckBox checked={isSelected} readOnly={!selectable} width={20} height={20} />
    </Layout>
  );
}
