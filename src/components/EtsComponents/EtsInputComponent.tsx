import { Controller, Control } from 'react-hook-form';
import { searchForm } from '@/assets/style';
import EtsInput from '@/components/EtsCommon/EtsInput';

export interface EtsInputComponentProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  sx?: any;
  onlyNumber?: boolean;
  maxLength?: number;
  required?: boolean;
  width?: number;
  [key: string]: any;
}

const EtsInputComponent = ({
  control,
  name,
  label = '',
  placeholder = '',
  sx,
  onlyNumber = false,
  maxLength,
  required = false,
  width,
  ...props
}: EtsInputComponentProps) => (
  <searchForm.SelectField>
    <searchForm.SelectLabel>
      <searchForm.Label>{label}</searchForm.Label>
    </searchForm.SelectLabel>
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? '필수 입력 항목입니다.' : false,
      }}
      render={({ field, fieldState: { error } }) => (
        <EtsInput
          placeholder={placeholder}
          {...field}
          value={field.value ?? ''}
          onChange={(e) => {
            let value = e.target.value;
            if (onlyNumber) value = value.replace(/[^0-9]/g, '');
            if (maxLength) value = value.slice(0, maxLength);
            field.onChange(value);
          }}
          error={!!error}
          helperText={error?.message}
          width={width}
          sx={sx}
          {...props}
        />
      )}
    />
  </searchForm.SelectField>
);

export default EtsInputComponent;
