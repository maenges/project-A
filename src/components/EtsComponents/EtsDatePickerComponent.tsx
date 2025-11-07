import { Controller, Control } from 'react-hook-form';
// import { useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { searchForm } from '@/assets/style';
import EtsDatePicker from '@/components/EtsCommon/EtsDatePicker';

export interface EtsDatePickerComponentProps {
  control: Control<any>;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setStartDate: (date: Dayjs | null) => void;
  setEndDate: (date: Dayjs | null) => void;
  startName?: string;
  endName?: string;
  label?: string;
  type?: string;
  format?: string;
  views?: ('year' | 'month' | 'day')[];
}

const EtsDatePickerComponent = ({
  control,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  startName = 'startDate',
  endName = 'endDate',
  label = 'Period',
  type = 'default',
  format = 'YYYY.MM.DD',
  views = ['year', 'month', 'day'],
}: EtsDatePickerComponentProps) => {
  // useEffect(() => {
  //   if (endDate) {
  //     console.log('실제 변경된 종료일:', endDate.format('YYYYMM'));
  //   }
  // }, [endDate]);
  return (
    <searchForm.DateRangeField>
      <searchForm.FieldLabel>
        <searchForm.Label>{label}</searchForm.Label>
      </searchForm.FieldLabel>
      <searchForm.DatePickerWrapper>
        <searchForm.DatePickerContainer>
          {type === 'default' && (
            <>
              <Controller
                name={startName}
                control={control}
                rules={{
                  required: '필수 입력값입니다.',
                  validate: {
                    isValidDate: (value) => {
                      if (!value) return true; // required가 처리
                      if (value.length !== 8 || value.startsWith('0')) {
                        return '유효한 날짜를 입력하세요.';
                      }

                      const date = dayjs(value, 'YYYYMMDD');
                      const minDate = dayjs().subtract(1, 'year').startOf('day');
                      const maxDate = dayjs().add(1, 'year').endOf('day');

                      if (date.isBefore(minDate) || date.isAfter(maxDate)) {
                        return '유효한 날짜를 입력하세요.';
                      }

                      return true;
                    },
                  },
                }}
                render={({ field, fieldState }) => (
                  <EtsDatePicker
                    {...field}
                    value={startDate}
                    onChange={(value) => {
                      if (!value) {
                        setStartDate(null);
                        field.onChange('');
                        return;
                      }
                      // 항상 새로운 값으로 startDate를 먼저 설정합니다.
                      setStartDate(value);
                      field.onChange(value.format('YYYYMMDD'));

                      // 새로운 시작일이 종료일보다 크면, 종료일을 새로운 시작일로 설정합니다.
                      if (endDate && value.isAfter(endDate)) {
                        setEndDate(value);
                      }
                    }}
                    format={format}
                    views={views}
                    width={226}
                    minDate={dayjs().subtract(1, 'year')}
                    maxDate={dayjs().add(1, 'year')}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? ''}
                  />
                )}
              />
              <searchForm.DateSeparator>~</searchForm.DateSeparator>
              <Controller
                name={endName}
                control={control}
                rules={{
                  required: '필수 입력값입니다.',
                  validate: {
                    isValidDate: (value) => {
                      if (!value) return true; // required가 처리
                      if (value.length !== 8 || value.startsWith('0')) {
                        return '유효한 날짜를 입력하세요.';
                      }

                      const date = dayjs(value, 'YYYYMMDD');
                      const maxDate = dayjs().add(1, 'year').endOf('day');
                      if (date.isAfter(maxDate)) {
                        return '유효한 날짜를 입력하세요.';
                      }

                      return true;
                    },
                  },
                }}
                render={({ field, fieldState }) => (
                  <EtsDatePicker
                    {...field}
                    value={endDate}
                    onChange={(value) => {
                      if (!value) {
                        setEndDate(null);
                        field.onChange('');
                        return;
                      }
                      // endDate가 startDate보다 이전이면, endDate를 startDate로 강제 설정
                      if (
                        startDate &&
                        value.isBefore(startDate) &&
                        String(value.year()).length === 4
                      ) {
                        const newEndDate = dayjs(startDate);
                        setEndDate(newEndDate);
                        field.onChange(newEndDate.format('YYYYMMDD'));
                      } else {
                        setEndDate(value);
                        field.onChange(value.format('YYYYMMDD'));
                      }
                    }}
                    format={format}
                    views={views}
                    width={226}
                    minDate={startDate ?? undefined}
                    maxDate={dayjs().add(1, 'year')}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? ''}
                  />
                )}
              />
            </>
          )}
          {type === 'currentYear' && (
            <>
              <Controller
                name={startName}
                control={control}
                rules={{
                  required: '필수 입력값입니다.',
                  validate: {
                    isValidDate: (value) => {
                      if (!value) return true; // required가 처리
                      if (value.length !== 6 || value.startsWith('0')) {
                        return '유효한 날짜를 입력하세요.';
                      }

                      return true;
                    },
                  },
                }}
                render={({ field, fieldState }) => (
                  <EtsDatePicker
                    {...field}
                    value={startDate}
                    onChange={(value) => {
                      if (!value) {
                        setStartDate(null);
                        field.onChange('');
                        return;
                      }
                      // 항상 새로운 값으로 startDate를 먼저 설정합니다.
                      setStartDate(value);
                      field.onChange(value.format('YYYYMM'));

                      // 새로운 시작일이 종료일보다 크면, 종료일을 새로운 시작일로 설정합니다.
                      if (endDate && value.isAfter(endDate)) {
                        setEndDate(value);
                      }

                      // startDate의 년도가 endDate의 년도와 다르면, endDate의 년도를 startDate의 년도로 변경, 4자리 이상 입력되어야 변경
                      if (
                        endDate &&
                        value.year() !== endDate.year() &&
                        String(value.year()).length === 4
                      ) {
                        setEndDate(value);
                      }
                    }}
                    format={format}
                    views={views}
                    width={226}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? ''}
                  />
                )}
              />
              <searchForm.DateSeparator>~</searchForm.DateSeparator>
              <Controller
                name={endName}
                control={control}
                rules={{
                  required: '필수 입력값입니다.',
                  validate: {
                    isValidDate: (value) => {
                      if (!value) return true; // required가 처리
                      if (value.length !== 6 || value.startsWith('0')) {
                        return '유효한 날짜를 입력하세요.';
                      }

                      return true;
                    },
                  },
                }}
                render={({ field, fieldState }) => (
                  <EtsDatePicker
                    {...field}
                    value={endDate}
                    onChange={(value) => {
                      if (!value) {
                        setEndDate(null);
                        field.onChange('');
                        return;
                      }
                      if (
                        startDate &&
                        value.isBefore(startDate) &&
                        String(value.year()).length === 4
                      ) {
                        // dayjs 로 해야 월/일 수정시 문제없음
                        const newEndDate = dayjs(startDate);
                        setEndDate(newEndDate);
                        field.onChange(newEndDate.format('YYYYMM'));
                      } else {
                        setEndDate(value);
                        field.onChange(value.format('YYYYMM'));
                      }
                    }}
                    format={format}
                    views={views}
                    width={226}
                    minDate={startDate ?? undefined}
                    maxDate={startDate ? dayjs(`${startDate.year()}-12`) : undefined}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? ''}
                  />
                )}
              />
            </>
          )}
        </searchForm.DatePickerContainer>
      </searchForm.DatePickerWrapper>
    </searchForm.DateRangeField>
  );
};

export default EtsDatePickerComponent;
