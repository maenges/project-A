import { Controller, Control } from 'react-hook-form';
import { searchForm } from '@/assets/style';
import EtsSelect from '@/components/EtsCommon/EtsSelect';

export interface EtsSelectComponentProps {
  control: Control<any>;
  name: string;
  label?: string;
  rules?: any;
  options?: any;
  sx?: any;
  onChange?: (event?: any, field?: any) => void;
  [key: string]: any;
}

const EtsSelectComponent = ({
  control,
  name,
  label = '',
  options,
  sx = { width: 177 },
  onChange,
  ...props
}: EtsSelectComponentProps) => (
  <searchForm.SelectField>
    <searchForm.SelectLabel>
      <searchForm.Label>{label}</searchForm.Label>
    </searchForm.SelectLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <EtsSelect
          {...field}
          value={field.value}
          options={options}
          onChange={(event) => {
            if (onChange) {
              onChange(event, field);
            } else {
              field.onChange(event.target.value);
            }
          }}
          {...sx}
          {...props}
        />
      )}
    />
  </searchForm.SelectField>
);

export default EtsSelectComponent;
