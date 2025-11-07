import React from 'react';
import { EtsColumnPreset, EtsGridRef } from '@/components/EtsGrid';
import PageTemplate from '@/components/Teamplate/PageTemplate';
import dayjs, { Dayjs } from 'dayjs';
import { useRef, useState } from 'react';
import { useActivate } from 'react-activation';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { ColDef } from 'ag-grid-community';
import { EtsButton, useGridTooltip } from '@/components/EtsCommon';
import { searchForm } from '@/assets/style';
import {
  EtsInputComponent,
  EtsSelectComponent,
  EtsSingleDatePickerComponent,
} from '@/components/EtsComponents';
import { EVENT } from '@/models/common/CommonSelectCodes';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@/utils';
import { useNotify } from '@/hooks/useNotify';

// 타입 정의
type FormValues = {
  date: string;
  type: string;
  name: string;
};

interface EventLogData {
  id: string;
  eventType: string;
  eventName: string;
  kafkaPartition: number;
  kafkaOffset: number;
  messageKey: string;
  messageValue: string;
  errorCode: string;
  errorMessage: string;
  createdAt: string;
  createdBy: string;
  rowNum?: number;
}

const EventLogManagementPage = () => {
  const [rowData, setRowData] = useState<EventLogData[]>([]);
  const [depDate, setDepDate] = useState<Dayjs | null>(dayjs());
  const [totalCount, setTotalCount] = useState(0);

  const gridRef = useRef<EtsGridRef<EventLogData>>(null);

  const { toast } = useNotify();

  const { showTooltip, hideTooltip, TooltipComponent } = useGridTooltip();

  const EventTypeData = EVENT;

  // useForm
  const { control, handleSubmit, setFocus, watch } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      date: depDate?.format('YYYY-MM-DD') || '',
      type: EVENT[0].value,
      name: '',
    },
  });

  // KeepAlive 페이지 활성화 시 상태 초기화
  useActivate(() => {
    // 데이터가 있으면 재조회 실행
    if (rowData.length > 0) {
      handleSubmit(onSubmit)();
    }
  });

  // onSubmit - 데이터 직접 fetch 및 rowData 설정
  const onSubmit: SubmitHandler<FormValues> = async () => {
    const queryParams = {
      createDate: watch('date'),
      eventType: watch('type') === 'all' ? '' : watch('type'),
      eventName: watch('name'),
    };

    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/admin/event-log',
      method: Method.GET,
      params: {
        queryParams,
      },
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        return;
      }
      // 행 번호를 추가한 데이터 설정
      const dataWithRowNum = res.data.map((item: EventLogData, index: number) => ({
        ...item,
        rowNum: index + 1,
      }));
      setRowData(dataWithRowNum);

      // Total count
      const totalCount = res.ItemCount ?? 0;
      setTotalCount(totalCount);
    });
  };

  /**
   * @description 폼 유효성 검사 실패 시 첫 번째 에러 필드로 포커스를 이동시키는 함수 (setFocus 사용)
   */
  const onInvalid = (errors: FieldErrors<FormValues>) => {
    const errorKeys = Object.keys(errors) as Array<keyof FormValues>;
    const firstErrorField = errorKeys[0];

    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  };

  // 툴팁 렌더러 함수
  const createTooltipRenderer = () => (params: any) => {
    const value = params.value || '';

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (value) {
        // 값이 있으면 툴팁 표시
        showTooltip({ content: value }, e.clientX, e.clientY);
      }
    };

    const handleMouseLeave = () => {
      hideTooltip();
    };

    return (
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title="" // 기본 브라우저 툴팁 제거
      >
        {value}
      </div>
    );
  };

  const columnDefs: ColDef[] = [
    EtsColumnPreset.TextPreset({
      field: 'rowNum',
      headerName: 'No',
      cellDataType: 'number',
      width: 100,
    }),
    {
      field: 'createdAt',
      headerName: 'Date',
      cellDataType: 'text',
      width: 130,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY-MM-DD');
      },
    },
    EtsColumnPreset.TextPreset({
      field: 'eventType',
      headerName: 'Event Type',
      cellDataType: 'text',
      width: 100,
    }),
    EtsColumnPreset.TextPreset({
      field: 'eventName',
      headerName: 'Event Name',
      cellDataType: 'text',
      width: 250,
    }),
    EtsColumnPreset.TextPreset({
      field: 'errorCode',
      headerName: 'Error Code',
      cellDataType: 'text',
      width: 130,
    }),
    {
      ...EtsColumnPreset.TextPreset({
        field: 'errorMessage',
        headerName: 'Error Message',
        cellDataType: 'text',
        flex: 1,
      }),
      cellRenderer: createTooltipRenderer(),
    },
    {
      ...EtsColumnPreset.TextPreset({
        field: 'messageValue',
        headerName: 'Content',
        cellDataType: 'text',
        flex: 1,
      }),
      cellRenderer: createTooltipRenderer(),
    },
    {
      field: 'createdAt',
      headerName: 'Create At',
      cellDataType: 'text',
      width: 180,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        return dayjs(params.value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  const searchComponent = (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <searchForm.Container>
        {/* first */}
        <searchForm.Row>
          <EtsSingleDatePickerComponent
            control={control}
            name="date"
            label="Dep Date"
            onValueChange={setDepDate}
          />
          <EtsSelectComponent control={control} name="type" label="Type" options={EventTypeData} />
          <EtsInputComponent
            control={control}
            name="name"
            label="Name"
            placeholder="검색어를 입력해주세요."
          />
        </searchForm.Row>
      </searchForm.Container>
      {/* Search */}
      <searchForm.ButtonContainer>
        <searchForm.Row sx={{ justifyContent: 'flex-end' }}>
          <EtsButton
            type="blue"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Search
          </EtsButton>
        </searchForm.Row>
      </searchForm.ButtonContainer>
    </form>
  );

  return (
    <>
      <PageTemplate
        title="Event Log Management"
        searchComponent={searchComponent}
        columnDefs={columnDefs}
        rowData={rowData}
        totalCount={totalCount}
        gridRef={gridRef}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
      />
      <TooltipComponent />
    </>
  );
};

export default EventLogManagementPage;
