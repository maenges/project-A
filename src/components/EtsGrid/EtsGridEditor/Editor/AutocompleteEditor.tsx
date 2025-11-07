import React from 'react';
import { ICellEditorParams } from 'ag-grid-community';
import EtsAutoComplete from '../../../EtsCommon/EtsAutoComplete';
import type {
  EtsAutoCompleteProps,
  EtsAutoCompleteOption,
} from '../../../EtsCommon/EtsAutoComplete';
import { styled } from '@mui/material/styles';

const AutocompleteLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  padding: '2px',
});

export interface EtsAutocompleteEditorProps {
  options: EtsAutoCompleteOption[];
  autoCompleteProps?: Omit<EtsAutoCompleteProps, 'value' | 'onChange' | 'options'>;
  onValueChange?: (value: any) => void;
  stopEditing?: () => void;
}

// 호환성을 위한 타입 export
export type { EtsAutoCompleteOption as EtsAutocompleteOption };

export default function AutocompleteEditor(props: ICellEditorParams & EtsAutocompleteEditorProps) {
  const { options, autoCompleteProps, onValueChange, stopEditing } = props;

  const handleChange = (_event: React.ChangeEvent<{}>, value: string | null) => {
    const tempValue = value + ' ';
    (onValueChange || props.onValueChange)?.(tempValue);
    (stopEditing || props.stopEditing)?.();
  };

  const handleBlur = () => {
    (stopEditing || props.stopEditing)?.();
  };

  return (
    <AutocompleteLayout>
      <EtsAutoComplete
        options={options}
        value={String(props.value || '')}
        onChange={handleChange}
        onBlur={handleBlur}
        width="100%"
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '32px !important',
            minHeight: '32px',
            maxHeight: '32px',
          },
          '& .MuiOutlinedInput-input': {
            padding: '6px 8px',
          },
        }}
        {...autoCompleteProps}
        ref={undefined}
      />
    </AutocompleteLayout>
  );
}
