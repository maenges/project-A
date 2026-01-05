import { ColDef, ValueParserParams } from 'ag-grid-community';
import { EtsEditor, EtsRenderer } from '../index';
import type { ICellEditorParams } from 'ag-grid-community';
import type { EtsSelectOption } from '../../../EtsCommon/EtsSelect';
import type { EtsInputProps } from '../../../EtsCommon/EtsInput';
import type { EtsDatePickerProps } from '../../../EtsCommon/EtsDatePicker';
import type {
  EtsAutoCompleteOption,
  EtsAutoCompleteProps,
} from '../../../EtsCommon/EtsAutoComplete';
import type { EtsCheckBoxProps } from '../../../EtsCommon/EtsCheckBox';
import { EtsCheckButton, EtsCheckButtonProps } from '../../../EtsCommon/EtsCheckButton';
import { EtsCheckButton2 } from '../../../EtsCommon/EtsCheckButton2';

import { EtsFileButtonProps } from '../../../EtsCommon/EtsFileButton';
import dayjs from 'dayjs';

type Arg<T = void> = T extends void ? Partial<ColDef> : Partial<ColDef> & T;

const EmptySelectionHeader = () => null;

export const EtsColumnPreset = {
  /**
   * @description 텍스트 컬럼 프리셋
   * @param params.context.inputProps EtsInput 속성
   */
  TextPreset: (
    params?: Arg<{
      context?: {
        inputProps?: Omit<EtsInputProps, 'value' | 'onChange'>;
        formatType?: 'number' | 'text';
        decimalPlaces?: number;
        required?: boolean;
      };
    }>
  ): ColDef => {
    return {
      cellRenderer: (rendererParams: any) => {
        let isEditable = false;
        if (typeof rendererParams.colDef.editable === 'function') {
          isEditable = rendererParams.colDef.editable(rendererParams);
        } else {
          isEditable = !!rendererParams.colDef.editable;
        }

        // 숫자 포맷팅 함수 추가
        const formatNumber = (value: any) => {
          if (
            params?.context?.formatType === 'number' ||
            (!isNaN(Number(value)) && value !== null && value !== '')
          ) {
            const num = Number(value);
            const decimalPlaces = params?.context?.decimalPlaces;

            // decimalPlaces가 지정된 경우 (기존 로직 유지)
            if (typeof decimalPlaces === 'number') {
              return num.toLocaleString(undefined, {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              });
            }

            // decimalPlaces가 없는 경우 기본 동작
            if (Number.isInteger(num)) {
              return num.toLocaleString();
            }

            // 소수점이 있는 경우 - 최대 3자리까지 표시
            return num.toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            });
          }
          return value;
        };
        return isEditable
          ? EtsRenderer.TextRenderer({
              ...rendererParams,
              inputProps: params?.context?.inputProps,
              type: params?.context?.type,
            })
          : rendererParams.value !== undefined && rendererParams.value !== null
            ? params?.context?.formatType === 'number'
              ? formatNumber(rendererParams.value)
              : rendererParams.value
            : params?.context?.formatType === 'number'
              ? formatNumber(0)
              : '';
      },

      cellEditor: EtsEditor.TextEditor,
      cellEditorPopup: false,
      cellEditorParams: (cellEditorParams: ICellEditorParams) => ({
        ...cellEditorParams,
        inputProps: params?.context?.inputProps,
        type: params?.context?.formatType,
        decimalPlaces: params?.context?.decimalPlaces,
      }),
      ...params,
    };
  },

  /**
   * @description 날짜 컬럼 프리셋
   * @param params.context.dateFormat 날짜 포맷 ex) 'YYYY-MM-DD'
   * @param params.context.datePickerProps EtsDatePicker 속성
   */
  DatePreset: (
    params?: Arg<{
      context?: {
        dateFormat?: string;
        datePickerProps?: Omit<EtsDatePickerProps, 'value' | 'onChange'>;
        minDate?: string;
        maxDate?: string;
      };
    }>
  ): ColDef => {
    return {
      cellRenderer: (rendererParams: any) =>
        params?.editable
          ? EtsRenderer.DateRenderer({
              ...rendererParams,
              format: params?.context?.dateFormat ?? 'YYYY-MM-DD',
              datePickerProps: params?.context?.datePickerProps,
            })
          : rendererParams.value || '',
      cellEditor: EtsEditor.DateEditor,
      cellEditorPopup: false,
      cellEditorParams: (cellEditorParams: ICellEditorParams) => {
        const datePickerProps: Omit<EtsDatePickerProps, 'value' | 'onChange'> = {
          format: params?.context?.dateFormat ?? 'YYYY-MM-DD',
          ...params?.context?.datePickerProps,
        };

        // min/max 값이 존재할 때만 옵션 추가
        if (params?.context?.maxDate) {
          datePickerProps.maxDate = dayjs(params.context.maxDate);
        }
        if (params?.context?.minDate) {
          datePickerProps.minDate = dayjs(params.context.minDate);
        }

        return {
          ...cellEditorParams,
          format: params?.context?.dateFormat ?? 'YYYY-MM-DD',
          datePickerProps,
        };
      },
      valueFormatter: (valueFormatterParams: any) => {
        if (!valueFormatterParams.value) return '';
        return dayjs(valueFormatterParams.value).format(
          params?.context?.dateFormat ?? 'YYYY-MM-DD'
        );
      },
      valueParser: (valueParserParams: ValueParserParams) => {
        if (!valueParserParams.newValue) return valueParserParams.oldValue;
        return dayjs(valueParserParams.newValue).format(
          params?.context?.dateFormat ?? 'YYYY-MM-DD'
        );
      },
      ...params,
    };
  },

  /**
   * @description Select 컬럼 프리셋
   * @param params.context.options Select에 들어갈 옵션 리스트
   * @param params.context.selectProps EtsSelect 속성
   */
  SelectPreset: (
    params?: Arg<{
      context: {
        options: EtsSelectOption[];
        selectProps?: any;
      };
    }>
  ): ColDef => {
    return {
      editable: params?.editable ?? false,
      cellRenderer: (rendererParams: any) => {
        let isEditable = false;
        if (typeof rendererParams.colDef.editable === 'function') {
          isEditable = rendererParams.colDef.editable(rendererParams);
        } else {
          isEditable = !!rendererParams.colDef.editable;
        }

        const resultValue =
          params?.context.options?.find(
            (opt: EtsSelectOption) => opt.value === String(rendererParams.value)
          )?.label || rendererParams.value;

        return isEditable
          ? EtsRenderer.SelectRenderer({
              ...rendererParams,
              options: params?.context.options,
              isEditable: params?.editable ?? false,
              selectProps: params?.context.selectProps,
            })
          : resultValue || '';
      },
      cellEditor: EtsEditor.SelectEditor,
      cellEditorPopup: false,
      cellEditorParams: (cellEditorParams: ICellEditorParams) => ({
        ...cellEditorParams,
        options: params?.context.options ?? [],
        selectProps: params?.context.selectProps,
      }),
      valueFormatter: (valueFormatterParams: { value: string | string[] }) => {
        if (!valueFormatterParams.value) return '';
        if (Array.isArray(valueFormatterParams.value)) {
          return valueFormatterParams.value.join(', ');
        }
        // 옵션에서 라벨 찾기
        const option = params?.context.options?.find(
          (opt: EtsSelectOption) => opt.value === valueFormatterParams.value
        );
        return option?.label || valueFormatterParams.value;
      },
      valueParser: (valueParserParams: ValueParserParams) => {
        if (params?.context.selectProps?.multiple) {
          return typeof valueParserParams.newValue === 'string'
            ? valueParserParams.newValue.split(',')
            : valueParserParams.newValue;
        }
        return valueParserParams.newValue;
      },
      ...params,
    };
  },

  /**
   * @description Autocomplete 컬럼 프리셋
   * @param params.context.options Autocomplete에 들어갈 옵션 리스트
   * @param params.context.controlType 컨트롤 타입
   * @param params.context.inputProps EtsInput 속성
   */
  AutocompletePreset: (
    params?: Arg<{
      context: {
        options: EtsAutoCompleteOption[];
        controlType?: string;
        autoCompleteProps?: Omit<EtsAutoCompleteProps, 'value' | 'onChange' | 'options'>;
      };
    }>
  ): ColDef => {
    return {
      cellRenderer: (rendererParams: any) => {
        // 옵션에서 라벨찾기
        const resultValue =
          params?.context.options?.find(
            (opt: EtsAutoCompleteOption) => opt.value === String(rendererParams.value)
          )?.label || rendererParams.value;

        return params?.editable
          ? EtsRenderer.AutocompleteRenderer({
              ...rendererParams,
              options: params?.context.options,
              isEditable: params?.editable ?? false,
              autoCompleteProps: params?.context.autoCompleteProps,
            })
          : resultValue || '';
      },
      cellEditor: EtsEditor.AutocompleteEditor,
      cellEditorPopup: false,
      cellEditorParams: (cellEditorParams: ICellEditorParams) => ({
        ...cellEditorParams,
        options: params?.context.options ?? [],
        controlType: params?.context.controlType,
        autoCompleteProps: params?.context.autoCompleteProps,
      }),
      valueFormatter: (valueFormatterParams: { value: string | number }) => {
        if (!valueFormatterParams.value) return '';
        // 옵션에서 라벨 찾기
        const option = params?.context.options?.find(
          (opt: EtsAutoCompleteOption) => opt.value === String(valueFormatterParams.value)
        );
        return option?.label || valueFormatterParams.value;
      },
      editable: params?.editable ?? false,
      ...params,
    };
  },

  /**
   * @description 체크박스 컬럼 프리셋
   * @param params.context.checkBoxProps EtsCheckBox 속성
   */
  CheckBoxPreset: (
    params?: Arg<{
      context?: {
        checkBoxProps?: Omit<EtsCheckBoxProps, 'checked' | 'onChange'>;
      };
    }>
  ): ColDef => {
    return {
      cellRenderer: (rendererParams: any) => {
        let isEditable = false;
        if (typeof rendererParams.colDef.editable === 'function') {
          isEditable = rendererParams.colDef.editable(rendererParams);
        } else {
          isEditable = !!rendererParams.colDef.editable;
        }

        const defaultCheckBoxProps = {
          width: '24px',
          height: '24px',
          ...params?.context?.checkBoxProps,
        };

        return isEditable
          ? EtsRenderer.CheckBoxRenderer({
              ...rendererParams,
              checkBoxProps: defaultCheckBoxProps,
            })
          : EtsRenderer.CheckBoxRenderer({
              ...rendererParams,
              checkBoxProps: { ...defaultCheckBoxProps, readOnly: true },
            });
      },
      cellEditor: EtsEditor.CheckBoxEditor,
      cellEditorPopup: false,
      suppressKeyboardEvent: (params) => {
        // 체크박스는 키보드 이벤트로 편집 모드 진입 방지
        return params.event.key === 'Enter' || params.event.key === ' ';
      },
      cellEditorParams: (cellEditorParams: ICellEditorParams) => ({
        ...cellEditorParams,
        checkBoxProps: {
          width: '24px',
          height: '24px',
          ...params?.context?.checkBoxProps,
        },
      }),
      valueParser: (params: ValueParserParams) => {
        return Boolean(params.newValue);
      },

      editable: params?.editable ?? false,
      // maxWidth: params?.maxWidth ?? 200,
      // width: params?.width ?? 80,
      ...params,
    };
  },

  /**
   * @description grid용 ID 컬럼 프리셋
   */
  IdPreset: (params?: Arg): ColDef => {
    return {
      valueGetter: (valueGetterParams) => {
        const gridRowIndex = valueGetterParams.node?.rowIndex ?? 0;
        return gridRowIndex + 1;
      },
      editable: params?.editable ?? false,
      headerName: params?.headerName ?? 'No',
      maxWidth: params?.maxWidth ?? 60,
      width: params?.width ?? 60,
      ...params,
    };
  },

  IdWithNewLabelPreset: (params?: Arg): ColDef => {
    return {
      cellRenderer: (rendererParams: any) => {
        // isNew 플래그가 true일 때만 "new" 라벨을 표시
        const isNew = rendererParams.data && rendererParams.data.isNew;
        if (isNew) {
          // "new" 라벨이 있을 때의 JSX
          return (
            <>
              {rendererParams.value}
              <span style={{ marginBottom: '7px', marginLeft: '2px' }} className="label-grid">
                new
              </span>
            </>
          );
        }
        // isNew가 아닐 경우, 값만 반환
        return rendererParams.value;
      },
      ...params,
    };
  },

  /**
   * @description 체크 버튼 컬럼 프리셋 v1 switch
   * @param params.context.checkButtonProps EtsCheckButton 속성
   */
  CheckButtonPreset: (
    params?: Arg<{
      context?: {
        checkButtonProps?: Omit<EtsCheckButtonProps, 'checked' | 'onChange'>;
      };
    }>
  ): ColDef => {
    return {
      cellRenderer: (rendererParams: any) => {
        let isEditable = false;
        if (typeof rendererParams.colDef.editable === 'function') {
          isEditable = rendererParams.colDef.editable(rendererParams);
        } else {
          isEditable = !!rendererParams.colDef.editable;
        }

        const handleChange = (newValue: boolean) => {
          if (!isEditable) return;
          rendererParams.setValue(newValue);
        };

        return (
          <EtsCheckButton
            checked={Boolean(rendererParams.value)}
            onChange={handleChange}
            readOnly={!isEditable}
            {...params?.context?.checkButtonProps}
          />
        );
      },
      cellEditor: EtsEditor.CheckButtonEditor,
      cellEditorPopup: false,
      cellEditorParams: (cellEditorParams: ICellEditorParams) => ({
        ...cellEditorParams,
        checkButtonProps: params?.context?.checkButtonProps,
      }),
      editable: params?.editable ?? false,
      ...params,
    };
  },

  /**
   * @description 체크 버튼 컬럼 프리셋 v2 open popup
   * @param params.context.checkButtonProps EtsCheckButton 속성
   */
  CheckButtonPreset2: (
    params?: Arg<{
      context?: {
        label?: string;
        onClick?: (rendererParams: any) => void;
        disabled?: (rendererParams: any) => boolean;
      };
    }>
  ): ColDef => {
    return {
      cellRenderer: (rendererParams: any) => {
        const isDisabled = params?.context?.disabled?.(rendererParams) ?? false;
        return (
          <EtsCheckButton2
            label={params?.context?.label}
            disabled={isDisabled}
            onClick={() => params?.context?.onClick?.(rendererParams)}
          />
        );
      },
      editable: false,
      ...params,
    };
  },

  /**
   * @description 파일 버튼 컬럼 프리셋
   * @param params.context.onUpload 파일 업로드 핸들러
   * @param params.context.onDelete 파일 삭제 핸들러
   * @param params.context.uploadProps 파일 업로드 속성
   */
  FileButtonPreset: (
    params?: Arg<{
      context?: {
        fileButtonProps?: Omit<EtsFileButtonProps, 'onClick'>;
        uploadProps?: { accept?: string };
        hasFile?: (rowData: any) => boolean;
        onFileUpload?: (params: ICellEditorParams, file: File) => void;
        onFileDelete?: (params: ICellEditorParams) => void;
      };
    }>
  ): ColDef => {
    return {
      cellRenderer: EtsRenderer.FileButtonRenderer,
      cellRendererParams: {
        fileButtonProps: params?.context?.fileButtonProps,
        hasFile: params?.context?.hasFile,
      },
      cellEditor: EtsEditor.FileButtonEditor,
      cellEditorPopup: false,
      cellEditorParams: (p: ICellEditorParams) => ({
        uploadProps: params?.context?.uploadProps,
        hasFile: params?.context?.hasFile,
        onUpload: (file: File) => {
          if (params?.context?.onFileUpload) {
            params.context.onFileUpload(p, file);
          }
          p.stopEditing();
        },
        onDelete: () => {
          if (params?.context?.onFileDelete) {
            params.context.onFileDelete(p);
          }
          p.stopEditing();
        },
      }),
      editable: params?.editable ?? false,
      ...params,
    };
  },

  SelectionBoxPreset: (params?: Arg): ColDef => {
    const { headerCheckboxSelection, headerClass, cellClass, ...rest } = (params ??
      {}) as Partial<ColDef> & {
      headerClass?: any;
      cellClass?: any;
    };

    const useHeaderSelectAll = headerCheckboxSelection ?? false;

    const mergedHeaderClass = [
      'ets-selection-header',
      useHeaderSelectAll ? '' : 'ets-selection-header--no-selectall',
      typeof headerClass === 'string' ? headerClass : '',
    ]
      .filter(Boolean)
      .join(' ');

    const mergedCellClass = ['ets-selection-cell', typeof cellClass === 'string' ? cellClass : '']
      .filter(Boolean)
      .join(' ');

    return {
      headerName: params?.headerName ?? '',
      width: 60,
      maxWidth: 60,
      // checkboxSelection: false, // 커스텀 렌더러 사용
      checkboxSelection: true, // 커스텀 렌더러 사용
      showDisabledCheckboxes: true, // 행 selectable=false 시 표시 유지 의도면 유지
      editable: false,
      pinned: 'left',
      suppressMovable: false,
      lockPosition: 'left',
      ...rest,
      headerCheckboxSelection: useHeaderSelectAll,
      // headerCheckboxSelection이 false여도 헤더에 checkbox DOM이 남는 케이스가 있어
      // (CSS로도 제거 가능하도록 class를 부여하고) header 자체도 비워준다.
      ...(useHeaderSelectAll ? {} : { headerComponent: EmptySelectionHeader }),
      headerClass: mergedHeaderClass,
      cellClass: mergedCellClass,
    };
  },

  FileLinkPreset: (
    params?: Arg<{
      context?: {
        urlField?: string;
        isGridEditable?: boolean;
      };
    }>
  ): ColDef => {
    return {
      cellRenderer: (rendererParams: any) => {
        const isGridInEditMode = params?.context?.isGridEditable ?? false;
        // 표시될 텍스트
        const displayText = rendererParams.value;
        // URL로 사용할 데이터의 키
        // const urlField = params?.context?.urlField || 'siteUrl';
        // const url = rendererParams.data?.[urlField];
        // const url =
        //   'http://localhost:3000/s3/mrv/4054a349-04e9-45c8-b42d-98cdbd8d7abe_AOC.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGgaDmFwLW5vcnRoZWFzdC0yIkYwRAIgO2o2bQ7NbcdLAzbDVdEqeCPd0fWJJKJ3qLOPpQfRdr0CIDoFlEqTzJZOUlSK1%2BsFT8VTMmfmxnGGsJzEg8zoJ9FvKpIFCCEQAxoMNjc4MTIxODY4MzkzIgwNI7cHlyXoQ4cxi4Yq7wTQaEDXnErHE%2FojlM9GYTdQCfI%2FExEE2pNrmqbsbbqFRRN2UkTbqSwUWrhoeeTYZNM0NO%2BlpwBjqveDD8nnv3B4RMpNY8PC5sjufKogKmPQKG07WJMOCpbCqU8nV7t1iaTZ4eX8GcgC49gOFZjVmwkz%2BBOKi1m1vANDBHex0xuOwZgLGBqim6JZk64QaGffBVEJULh%2FyEHlClOwCojARS7Vb61o3CCyV4nj6X9ge2dMCP3Pj%2FrOrtl8XSpLYuXGqz3jEeHYhVD5NWRTv9uoqsK0oqdPbtODYQlnUBDfGADNuleDaS6Sxw%2Fj98IbhrA14iLJcEhxWl%2F68yo4i5BehwbsEKjOo%2BxQ3HAI9r%2FGYtgyRjcppvMQMKQ6S1wohe5OgiYapEnqmtz%2Fs9jkZ%2Fsab9IOc1BumI1sxf0jWMxsJQGaUGmOEJcaLJGyp2w5eIqCvi2lKemhoEJ3KgOtMj%2BHOFdoF3NAc7sdIBaeB%2FRJYSaQJcUjvLnMqNE3Imu0cMzbAQm8a5%2BDFxNTGB2%2Fo8yA2rbcon%2FdoUZlzbbbIkkf%2Ba76CJgGBJ%2Fo%2BPafCiEEX%2BhaGphg2i1RVCUWq%2Blqy92%2BUitV%2BnDMpbBG%2FEzAVqevagsTvWyi1Ysn5SSS%2BlaUisVQXJqQbJhEOf3boOxOS46oiK4p%2Bi1h4UG3rn5lX2kgDD3gSz2Fjrl8KTvH1GNxAdocZEo8RiH2PF%2BCce8OUpSbKBInKx6J3IjwVCFuEMDySExi7xibej69yjcBSpQfz0ZGnRU4lY3xZYguvrzWm%2Fw3%2F2R4BWqD%2BXoPcDxZhGnIiVvVxByLAxrOCwvWtwv4Ng6mjTCIueDHBjqcAQe%2B%2BTE2DqoiCKGkJhuuYZ89hsWhK%2FJ8NsgnlextKlOfCUQfEbi%2BM7RMh26TM4LyXVFVlmCNv%2FELxIfP3YVh54Kell9SqO7kZw1%2FVkQicntirjegEWYj1svvUmBHwUpPdkadkjMxmoHVhsiIPZgoF4aZC2mOlB1m3asBNuZO27fsAbQNnixLAMo%2B%2BPz0A9f5QFJMjNbCHiiSHyeIrA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251021T235151Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAZ3YZWRRURH2VBGFG%2F20251021%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Expires=300&X-Amz-Signature=47fab7c4b2663aa434c6a126a408bff7dd19225c6c0810b9c7cc7cc5bd8ffded';
        if (isGridInEditMode) {
          return <span>{displayText}</span>;
        }

        // 클릭 시 파일을 fetch하여 다운로드하는 비동기 함수
        // const handleDownload = async (e: React.MouseEvent) => {
        //   e.preventDefault();
        //   const response = await fetch(url);
        //   if (!response.ok) {
        //     throw new Error(`Network response was not ok: ${response.statusText}`);
        //   }
        //   const blob = await response.blob();
        //   const downloadUrl = window.URL.createObjectURL(blob);
        //   const link = document.createElement('a');
        //   link.href = downloadUrl;
        //   // 다운로드될 파일 이름 지정 (없으면 'download'로 기본 설정)
        //   link.setAttribute('download', displayText || 'download');
        //   document.body.appendChild(link);
        //   link.click();
        //   document.body.removeChild(link);
        //   window.URL.revokeObjectURL(downloadUrl);
        // };

        return (
          <a style={{ color: '#0047bb', textDecoration: 'underline', cursor: 'pointer' }}>
            {displayText}
          </a>
        );
      },
      editable: false,
      ...params,
    };
  },
};
