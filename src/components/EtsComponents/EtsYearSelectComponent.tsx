import { Controller, Control } from 'react-hook-form';
import { searchForm } from '@/assets/style';
import EtsYearSelect from '@/components/EtsCommon/EtsYearSelect';

export interface EtsYearSelectComponentProps {
  control: Control<any>;
  name: string;
  label?: string;
  minYear?: number;
  maxYear?: number;
  sx?: any;
  list?: any;
  onChange?: (event?: any, field?: any) => void;
  desc?: boolean;
  [key: string]: any;
}

const EtsYearSelectComponent = ({
  control,
  name,
  label = 'Year',
  minYear,
  maxYear,
  desc = false,
  rules,
  list,
  sx = { width: 177 },
  onChange,
  ...props
}: EtsYearSelectComponentProps) => {
  const yearSelectProps: {
    list?: any;
    minYear?: number;
    maxYear?: number;
    desc?: boolean;
  } = {};

  if (list && list.length > 0) {
    // list가 있으면, list prop만 사용합니다.
    yearSelectProps.list = list;
  } else {
    // list가 없으면, minYear와 maxYear를 사용합니다.
    yearSelectProps.minYear = minYear;
    yearSelectProps.maxYear = maxYear;
    yearSelectProps.desc = desc;
  }
  return (
    <searchForm.SelectField>
      <searchForm.SelectLabel>
        <searchForm.Label>{label}</searchForm.Label>
      </searchForm.SelectLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <EtsYearSelect
            {...field}
            {...yearSelectProps}
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
};

export default EtsYearSelectComponent;
