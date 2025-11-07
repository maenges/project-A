import { Stack } from '@mui/material';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {
  EtsAutoComplete,
  EtsCheckBox,
  EtsDatePicker,
  EtsInput,
  EtsSelect,
  EtsYearSelect,
} from '@/components/EtsCommon';

export default function TestBobPage() {
  const [selectValue1, setSelectValue1] = useState<number | string>('');
  const [selectValue2, setSelectValue2] = useState<string>('');
  const [selectValue3, setSelectValue3] = useState<string>('');
  const [selectValue4, setSelectValue4] = useState<string>('short');
  const [selectValue5, setSelectValue5] = useState<number | string>(2);
  const [yearSelectValue1, setYearSelectValue1] = useState<number | null>(null);
  const [yearSelectValue2, setYearSelectValue2] = useState<number | null>(null);
  const [yearSelectValue3, setYearSelectValue3] = useState<number | null>(2023);
  const [yearSelectValue4, setYearSelectValue4] = useState<number | null>(2024);
  const [dateValue1, setDateValue1] = useState<Dayjs | null>(null);
  const [dateValue2, setDateValue2] = useState<Dayjs | null>(dayjs('2024-01-01'));
  const [dateValue3] = useState<Dayjs | null>(dayjs());
  const [autoCompleteValue1, setAutoCompleteValue1] = useState<string>('');
  const [autoCompleteValue2, setAutoCompleteValue2] = useState<string>('');
  const [autoCompleteValue3, setAutoCompleteValue3] = useState<string>('');
  const [autoCompleteValue4, setAutoCompleteValue4] = useState<string>('apple');
  const [autoCompleteValue5, setAutoCompleteValue5] = useState<string>('banana');
  const [checkBoxValue1, setCheckBoxValue1] = useState<boolean>(false);
  const [checkBoxValue2, setCheckBoxValue2] = useState<boolean>(true);
  const [checkBoxValue3, setCheckBoxValue3] = useState<boolean>(false);
  const [checkBoxValue4, setCheckBoxValue4] = useState<boolean>(true);

  const autoCompleteOptions = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' },
    { label: 'Fig', value: 'fig' },
    { label: 'Grape', value: 'grape' },
    { label: 'Honeydew', value: 'honeydew' },
    { label: 'Kiwi', value: 'kiwi' },
    { label: 'Lemon', value: 'lemon' },
    { label: 'LONG TEXT TEST TEXT TEST', value: 'longtexttesttexttest' },
  ];
  return (
    <Stack direction="column" gap={5}>
      <Stack direction="row" gap={5}>
        <Stack>
          <h1>EtsInput</h1>
          <Stack>
            <p>Default</p>
            <EtsInput placeholder="검색어를 입력해주세요." />
            <p>Error</p>
            <EtsInput placeholder="검색어를 입력해주세요." error helperText="Incorrect entry." />
            <p>Disabled</p>
            <EtsInput
              placeholder="검색어를 입력해주세요."
              disabled
              value="검색어를 입력해주세요..."
            />
            <p>Read Only</p>
            <EtsInput
              placeholder="검색어를 입력해주세요."
              readOnly={true}
              value="검색어를 입력해주세요..."
            />
          </Stack>
        </Stack>
        <Stack>
          <h1>EtsSelect</h1>
          <Stack>
            <p>Default</p>
            <EtsSelect
              value={selectValue1}
              onChange={(e) => setSelectValue1(e.target.value as number)}
              options={[
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '2123123123123123123123', value: 1231232 },
                { label: '3', value: 3, disabled: true },
              ]}
            />
            <EtsSelect
              value={selectValue2}
              onChange={(e) => setSelectValue2(e.target.value as string)}
              placeholder="선택해주세요"
              options={[
                { label: '짧은 텍스트', value: 'short' },
                {
                  label:
                    '매우 긴 텍스트입니다 오버플로우가 발생할 만큼 길어야 합니다 아주아주 길게 만들어보겠습니다',
                  value: 'long',
                },
                { label: '일반 텍스트', value: 'normal' },
              ]}
            />
            <p>Error</p>
            <EtsSelect
              value={selectValue3}
              onChange={(e) => setSelectValue3(e.target.value as string)}
              error
              helperText="Incorrect entry."
            />
            <p>Disabled</p>
            <EtsSelect
              value={selectValue4}
              onChange={(e) => setSelectValue4(e.target.value as string)}
              disabled
              options={[
                { label: '짧은 텍스트', value: 'short' },
                { label: '일반 텍스트', value: 'normal' },
              ]}
            />
            <p>Read Only</p>
            <EtsSelect
              value={selectValue5}
              onChange={(e) => setSelectValue5(e.target.value as number)}
              // width={150}
              readOnly
              options={[
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '2123123123123123123123', value: 1231232 },
                { label: '3', value: 3, disabled: true },
              ]}
            />
          </Stack>
        </Stack>
        <Stack>
          <h1>EtsYearSelect</h1>
          <Stack>
            <p>Default</p>
            <EtsYearSelect
              value={yearSelectValue1}
              onChange={(e) => setYearSelectValue1(e.target.value as number)}
            />
            <p>Error</p>
            <EtsYearSelect
              placeholder="검색어를 입력해주세요."
              error
              helperText="Incorrect entry."
              value={yearSelectValue2}
              onChange={(e) => setYearSelectValue2(e.target.value as number)}
            />
            <p>Disabled</p>
            <EtsYearSelect
              placeholder="검색어를 입력해주세요."
              disabled
              value={yearSelectValue3}
              onChange={(e) => setYearSelectValue3(e.target.value as number)}
            />
            <p>Read Only</p>
            <EtsYearSelect
              placeholder="검색어를 입력해주세요."
              value={yearSelectValue4}
              onChange={(e) => setYearSelectValue4(e.target.value as number)}
              readOnly={true}
            />
          </Stack>
        </Stack>
        <Stack>
          <h1>EtsAutoComplete</h1>
          <Stack>
            <p>Default</p>
            <EtsAutoComplete
              value={autoCompleteValue1}
              onChange={(_, value) => setAutoCompleteValue1(value || '')}
              options={autoCompleteOptions}
              placeholder="검색해서 선택해주세요"
            />
            <p>Placeholder</p>
            <EtsAutoComplete
              value={autoCompleteValue2}
              onChange={(_, value) => setAutoCompleteValue2(value || '')}
              options={autoCompleteOptions}
              placeholder="과일을 선택하세요"
            />
            <p>Error</p>
            <EtsAutoComplete
              value={autoCompleteValue3}
              onChange={(_, value) => setAutoCompleteValue3(value || '')}
              options={autoCompleteOptions}
              error
              helperText="올바른 과일을 선택해주세요"
              placeholder="과일 선택"
            />
            <p>Disabled</p>
            <EtsAutoComplete
              value={autoCompleteValue4}
              onChange={(_, value) => setAutoCompleteValue4(value || '')}
              options={autoCompleteOptions}
              disabled
            />
            <p>Read Only</p>
            <EtsAutoComplete
              value={autoCompleteValue5}
              onChange={(_, value) => setAutoCompleteValue5(value || '')}
              options={autoCompleteOptions}
              readOnly
            />
          </Stack>
        </Stack>
        <Stack>
          <h1>EtsDatePicker</h1>
          <Stack>
            <p>Default</p>
            <EtsDatePicker
              // placeholder="YYYY-MM-DD 형식으로 직접 입력 또는 달력 선택"
              width="300px"
              value={dateValue1}
              onChange={(newValue) => {
                setDateValue1(newValue);
                console.log('날짜 변경됨:', newValue?.format('YYYY-MM-DD'));
              }}
            />
            <p>Format YYYY.MM.DD (값 있는 상태에서 타이핑 테스트)</p>
            <EtsDatePicker
              value={dateValue2}
              onChange={(newValue) => {
                setDateValue2(newValue);
                console.log('날짜 변경됨:', newValue?.format('YYYY.MM.DD'));
              }}
              format="YYYY.MM.DD"
              width="200px"
              placeholder="2024.01.15 형식으로 입력"
              maxDate={dayjs('2025-09-15')}
            />
            <p>Error</p>
            <EtsDatePicker
              placeholder="날짜를 선택하세요"
              error
              helperText="올바른 날짜를 입력해주세요"
              width="200px"
            />
            <p>Disabled</p>
            <EtsDatePicker placeholder="날짜를 선택하세요" disabled width="200px" />
            <p>Read Only</p>
            <EtsDatePicker value={dateValue3} readOnly width="200px" />
          </Stack>
        </Stack>
        <Stack>
          <h1>EtsCheckBox</h1>
          <Stack gap={2}>
            <p>Default (unchecked)</p>
            <EtsCheckBox
              checked={checkBoxValue1}
              onChange={(checked) => setCheckBoxValue1(checked)}
            />
            <p>Default (checked)</p>
            <EtsCheckBox
              checked={checkBoxValue2}
              onChange={(checked) => setCheckBoxValue2(checked)}
            />
            <p>Disabled (unchecked)</p>
            <EtsCheckBox checked={false} disabled={true} />
            <p>Disabled (checked)</p>
            <EtsCheckBox checked={true} disabled={true} />
            <p>ReadOnly (unchecked)</p>
            <EtsCheckBox checked={false} readOnly={true} />
            <p>ReadOnly (checked)</p>
            <EtsCheckBox checked={true} readOnly={true} />
            <p>Error (unchecked)</p>
            <EtsCheckBox
              checked={checkBoxValue3}
              onChange={(checked) => setCheckBoxValue3(checked)}
              error={true}
            />
            <p>Error (checked)</p>
            <EtsCheckBox
              checked={checkBoxValue4}
              onChange={(checked) => setCheckBoxValue4(checked)}
              error={true}
            />
            <p>Custom Size (24x24)</p>
            <EtsCheckBox
              checked={checkBoxValue1}
              onChange={(checked) => setCheckBoxValue1(checked)}
              width="24px"
              height="24px"
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" gap={5}>
        <Stack>
          <h1>KE AGGRID</h1>
          <Stack>
            <p>Default</p>
            <EtsInput placeholder="검색어를 입력해주세요." />
            <p>Error</p>
            <EtsInput placeholder="검색어를 입력해주세요." error helperText="Incorrect entry." />
            <p>Disabled</p>
            <EtsInput
              placeholder="검색어를 입력해주세요."
              disabled
              value="검색어를 입력해주세요..."
            />
            <p>Read Only</p>
            <EtsInput
              placeholder="검색어를 입력해주세요."
              readOnly={true}
              value="검색어를 입력해주세요..."
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
