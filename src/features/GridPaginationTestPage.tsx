import { EtsColumnPreset, EtsGrid } from '@/components/EtsGrid';
import { useNotify } from '@/hooks/useNotify';
import { Service } from '@/models/common/Service';
import { callApi, Method } from '@/utils';
import { Box, Stack } from '@mui/system';
import { ColDef, IDatasource } from 'ag-grid-community';
import { useMemo } from 'react';
import { styled } from 'styled-components';

// 스타일 컴포넌트
const BaseContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;
`;

// 타입 정의
export default function GridPaginationTestPage() {
  const { toast } = useNotify();

  const columnDefs: ColDef[] = [
    EtsColumnPreset.TextPreset({
      field: 'id',
      headerName: 'Country',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'airport',
      headerName: 'Airport',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'iata_port',
      headerName: 'IATA Code',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'icao_port',
      headerName: 'ICAO Code',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'ets_lat',
      headerName: 'Latitude',
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'ets_lon',
      headerName: 'Longitude',
      flex: 1,
    }),
  ];

  // 무한 스크롤을 위한 datasource 구현
  const datasource: IDatasource = useMemo(
    () => ({
      rowCount: undefined, // 총 row 수를 모르므로 undefined
      getRows: async (params) => {
        console.log('Requesting rows from', params.startRow, 'to', params.endRow);

        const limit = params.endRow - params.startRow;
        const offset = params.startRow;

        const queryParams = {
          //   region: 2,
          //   country: '',
          //   airport: '',
          year: 2025,
          actyp: '',
          limit,
          offset,
        };

        try {
          const res = await callApi({
            service: Service.POSTMAN,
            url: '/api/v1/aircraft',
            method: Method.GET,
            params: {
              queryParams,
            },
          });

          if (res.successOrNot === 'Y' && Array.isArray(res.data)) {
            // 데이터가 limit보다 적으면 마지막 페이지
            const lastRow = res.data.length < limit ? params.startRow + res.data.length : -1;

            // 성공 콜백 호출
            params.successCallback(res.data, lastRow);

            if (params.startRow === 0) {
              toast.info('데이터 로딩을 시작합니다.');
            }
          } else {
            // 실패 시
            params.failCallback();
            toast.error('조회에 실패하였습니다.');
          }
        } catch (err) {
          // 에러 시
          params.failCallback();
          toast.error('API 호출을 실패하였습니다.');
        }
      },
    }),
    [toast]
  );
  return (
    <div>
      <BaseContainer>
        <Stack sx={{ height: 600, width: '100%' }}>
          <EtsGrid
            rowModelType="infinite"
            datasource={datasource}
            columnDefs={columnDefs}
            cacheBlockSize={50}
            cacheOverflowSize={2}
            maxConcurrentDatasourceRequests={1}
            infiniteInitialRowCount={100}
            maxBlocksInCache={10}
            defaultColDef={{
              sortable: false, // 무한 스크롤에서는 서버 사이드 정렬 필요
              filter: false, // 무한 스크롤에서는 서버 사이드 필터 필요
              resizable: true,
            }}
          />
        </Stack>
      </BaseContainer>
    </div>
  );
}
