import { Controller, Control } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { searchForm } from '@/assets/style';
import EtsDatePicker from '@/components/EtsCommon/EtsDatePicker';

export interface EtsSingleDatePickerComponentProps {
  control: Control<any>;
  name: string;
  label?: string;
  format?: string;
  width?: string | number;
  views?: ('year' | 'month' | 'day')[];
  minDate?: Dayjs;
  maxDate?: Dayjs;
  required?: boolean;
  disabled?: boolean;
  onValueChange?: (date: Dayjs | null) => void;
}

const EtsSingleDatePickerComponent = ({
  control,
  name,
  label = 'Date',
  format = 'YYYY.MM.DD',
  width = '177px',
  views = ['year', 'month', 'day'],
  minDate,
  maxDate,
  required = true,
  disabled = false,
  onValueChange,
}: EtsSingleDatePickerComponentProps) => {
  return (
    <searchForm.DateField>
      <searchForm.FieldLabel>
        <searchForm.Label>{label}</searchForm.Label>
      </searchForm.FieldLabel>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? '필수 입력값입니다.' : false,
          validate: {
            isValidDate: (value) => {
              if (!required && !value) return true;
              if (!value) return true; // required가 처리

              // Format에 따라 validation 로직 조정
              const actualFormat = format.replace(/\./g, '-');
              const expectedLength = actualFormat.length;

              if (value.length !== expectedLength) {
                return '유효한 날짜를 입력하세요.';
              }

              // dayjs로 유효한 날짜인지 확인
              const date = dayjs(value, actualFormat, true);
              if (!date.isValid()) {
                return '유효한 날짜를 입력하세요.';
              }

              // 날짜 범위 체크
              if (minDate && date.isBefore(minDate, 'day')) {
                return '유효한 날짜를 입력하세요.';
              }
              if (maxDate && date.isAfter(maxDate, 'day')) {
                return '유효한 날짜를 입력하세요.';
              }

              return true;
            },
          },
        }}
        render={({ field, fieldState }) => (
          <EtsDatePicker
            {...field}
            value={field.value ? dayjs(field.value) : null}
            onChange={(newValue) => {
              if (!newValue) {
                field.onChange('');
                onValueChange?.(null);
                return;
              }
              field.onChange(newValue.format(format.replace(/\./g, '-')));
              onValueChange?.(newValue);
            }}
            format={format}
            views={views}
            width={width}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            error={!!fieldState.error}
            helperText={fieldState.error?.message ?? ''}
          />
        )}
      />
    </searchForm.DateField>
  );
};

export default EtsSingleDatePickerComponent;
