import { Controller, Control } from 'react-hook-form';
import { searchForm } from '@/assets/style';
import EtsAutoComplete from '@/components/EtsCommon/EtsAutoComplete';

export interface EtsAutoCompleteComponentProps {
  control: Control<any>;
  name: string;
  label?: string;
  disabled?: boolean;
  rules?: any;
  options?: any;
  sx?: any;
  onChange?: (event: any, value: any) => void;
  [key: string]: any;
}

const EtsAutoCompleteComponent = ({
  control,
  name,
  label = '',
  disabled = false,
  rules = { required: '필수 입력값입니다.' },
  options,
  sx = { width: 177 },
  onChange,
  ...props
}: EtsAutoCompleteComponentProps) => (
  <searchForm.SelectField>
    <searchForm.SelectLabel>
      <searchForm.Label>{label}</searchForm.Label>
    </searchForm.SelectLabel>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <EtsAutoComplete
          {...field}
          value={field.value}
          onChange={(event, value) => {
            field.onChange(value ?? '');
            if (onChange) {
              onChange(event, value);
            }
          }}
          options={options}
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : ''}
          {...sx}
          {...props}
        />
      )}
    />
  </searchForm.SelectField>
);

export default EtsAutoCompleteComponent;
